import assert from "node:assert/strict";
import {chromium,firefox,webkit} from "playwright";
import {createServer} from "node:https";
import {execFileSync} from "node:child_process";
import {tmpdir} from "node:os";
import {createReadStream,readFileSync,mkdtempSync,rmSync,existsSync,statSync} from "node:fs";
import path from "node:path";

const root=process.cwd(),mime={".html":"text/html",".js":"text/javascript",".css":"text/css"};
const certDir=mkdtempSync(path.join(tmpdir(),"ebda-qa-tls-"));
const keyFile=path.join(certDir,"key.pem"),certFile=path.join(certDir,"cert.pem");
execFileSync("openssl",["req","-x509","-newkey","rsa:2048","-sha256","-nodes","-days","1","-keyout",keyFile,"-out",certFile,"-subj","/CN=127.0.0.1","-addext","subjectAltName=IP:127.0.0.1,DNS:localhost"],{stdio:"ignore"});
const server=createServer({key:readFileSync(keyFile),cert:readFileSync(certFile)},(req,res)=>{
 const name=new URL(req.url,"https://localhost").pathname;
 const file=path.resolve(root,"."+(name==="/"?"/index.html":name));
 if(!file.startsWith(root+path.sep)||!existsSync(file)||!statSync(file).isFile()){res.writeHead(404);res.end();return}
 res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});
 createReadStream(file).pipe(res);
});
await new Promise(done=>server.listen(0,"127.0.0.1",done));
let browser;
try{
 const engine=process.env.NTSS_BROWSER||"chromium";
 const engines={chromium,firefox,webkit};
 assert.ok(engines[engine],"Supported browser engine");
 browser=await engines[engine].launch(engine==="chromium"?{headless:true,args:["--no-sandbox"]}:{headless:true});
 const url="https://127.0.0.1:"+server.address().port+"/";
 for(const width of [360,430,768,1366]){
  const page=await browser.newPage({viewport:{width,height:850},serviceWorkers:"block",ignoreHTTPSErrors:true});
  const errors=[];page.on("pageerror",err=>errors.push(err.message));
  await page.goto(url,{waitUntil:"load"});
  try{
   await page.waitForFunction(()=>!!window.NTSS_ASSESSMENT&&!!window.EBDAA_QUESTION_FACTORY,{timeout:20000});
  }catch(err){
   const state=await page.evaluate(()=>({
    readyState:document.readyState,
    assessment:!!window.NTSS_ASSESSMENT,
    factory:!!window.EBDAA_QUESTION_FACTORY,
    appText:document.querySelector("#app")?.textContent?.slice(0,200),
    scripts:[...document.scripts].filter(x=>x.src).map(x=>x.src.split("/").at(-1)).slice(-12)
   })).catch(e=>({error:String(e)}));
   throw Error("Startup failure "+engine+" "+width+"px: "+JSON.stringify({state,errors})+"; "+err.message);
  }
  const metrics=await page.evaluate(()=>{
   const nav=performance.getEntriesByType("navigation")[0];
   return {domReadyMs:Math.round(nav?.domContentLoadedEventEnd||0),totalResources:performance.getEntriesByType("resource").length};
  });
  console.log("EBDA "+width+"px startup: DOM ready "+metrics.domReadyMs+"ms; resources "+metrics.totalResources);
  await page.evaluate(()=>{
   const qs=window.EBDAA_QUESTION_FACTORY.all(2,0,0);
   const visual=qs.find(q=>q.mode==="visual-data"),coding=qs.find(q=>q.mode==="live-code");
   document.querySelector("#app").innerHTML=
    '<section class="practice-focus"><div class="practice-focus__content"><main style="width:100%;max-width:850px;margin:auto;box-sizing:border-box;padding:12px">'+
    window.NTSS_ASSESSMENT.questionView(visual,2)+window.NTSS_ASSESSMENT.visual(visual)+
    window.NTSS_ASSESSMENT.codePanel(coding,coding.codeTask.starter,false,"")+'</main></div></section>';
  });
  assert.ok(await page.locator(".ntss-question-layout").count(),"Question layout");
  assert.ok(await page.locator(".ntss-data-card").count(),"Visual card");
  assert.ok(await page.locator("#ntss-code-editor").count(),"Code editor");
  const sizes=await page.evaluate(()=>{
   const btn=document.querySelector(".ntss-code-actions .btn");
   const editor=document.querySelector("#ntss-code-editor");
   const input=editor?.getBoundingClientRect();
   return {
    overflow:document.documentElement.scrollWidth>innerWidth+2,
    buttonHeight:btn?.getBoundingClientRect().height||0,
    editorFont:parseFloat(getComputedStyle(editor).fontSize),
    editorOutside:!!input&&(input.right>innerWidth+2||input.left<0)
   };
  });
  assert.equal(sizes.overflow,false,"Horizontal overflow at viewport "+width);
  assert.ok(sizes.buttonHeight>=44,"Touch button under 44px at "+width);
  assert.ok(sizes.editorFont>=16||width>600,"Mobile editor font too small at "+width);
  assert.equal(sizes.editorOutside,false,"Code editor outside viewport at "+width);
  assert.deepEqual(errors,[],"JS errors at viewport "+width);
  await page.close();
 }
 // Verify optional lab modules are absent at startup but available for Year 2/3.
 const lazyPage=await browser.newPage({viewport:{width:820,height:850},serviceWorkers:"block",ignoreHTTPSErrors:true});
 await lazyPage.goto(url,{waitUntil:"load"});
 const initialLazy=await lazyPage.evaluate(()=>({
  registered:!!window.NTSS_LAZY,
  ready:window.NTSS_LAZY?.isReady(),
  studio:!!window.EBDAA_STUDIO
 }));
 assert.equal(initialLazy.registered,true,"Lazy loader should initialize");
 assert.equal(initialLazy.ready,false,"Optional lab should not run at startup");
 assert.equal(initialLazy.studio,false,"Studio must not block the home page");
 await lazyPage.evaluate(()=>window.NTSS_LAZY.ensureStudio());
 const readyLazy=await lazyPage.evaluate(()=>({
  ready:window.NTSS_LAZY.isReady(),
  studio:!!window.EBDAA_STUDIO,
  cases:!!window.EBDAA_CASE,
  visual:!!window.EBDA_VISUALIZER
 }));
 assert.equal(readyLazy.ready,true,"Optional lab should complete loading");
 assert.equal(readyLazy.studio,true,"Studio should initialize");
 assert.equal(readyLazy.cases,true,"Case labs should initialize");
 assert.equal(readyLazy.visual,true,"Visualizer should initialize");
 await lazyPage.close();

 // Each curriculum must request a student name before rendering its 50-question activity.
 const subjectChecks=[
  ["mathOpen",1],["englishOpen",1],["physicsOpen",1],["businessOpen",1],
  ["germanOpen",1],["arabicOpen",1],["civicsOpen",1],["socialOpen",2],["economicsOpen",3]
 ];
 const subjectPage=await browser.newPage({viewport:{width:430,height:850},serviceWorkers:"block",ignoreHTTPSErrors:true});
 await subjectPage.goto(url,{waitUntil:"load"});
 for(const [open,grade] of subjectChecks){
  await subjectPage.evaluate(([fn,g])=>{window.chooseGrade(g);window[fn](0)},[open,grade]);
  await subjectPage.locator("#ebda-lesson-student-name").waitFor({timeout:20000});
  assert.ok(await subjectPage.locator(".ebda-name-gate").count(),open+" requires name gate");
  await subjectPage.locator("#ebda-lesson-student-name").fill("QA Student");
  await subjectPage.getByRole("button",{name:/Start lesson|ابدأ الدرس/i}).click();
  await subjectPage.locator("#ebda-lesson-student-name").waitFor({state:"detached",timeout:15000});
  assert.ok(await subjectPage.locator(".practice-focus").count(),open+" opens student lesson");
 }
 await subjectPage.close();

 // Verify a first answer survives a real page reload in local browser storage.
 const study=await browser.newPage({viewport:{width:430,height:850},serviceWorkers:"block",ignoreHTTPSErrors:true});
 await study.goto(url,{waitUntil:"load"});
 const before=await study.evaluate(()=>{
  window.EBDAA_PRACTICE.begin(1,0,0);
  const q=window.EBDAA_PRACTICE.currentQuestion();
  const response=q.mode==="live-code"?"pass":q.mode==="order"?q.answer.split("|"):q.answer;
  window.EBDAA_PRACTICE.answer(response);
  window.EBDAA_PRACTICE.check();
  window.EBDAA_PRACTICE.saveCheckpoint();
  return window.EBDAA_PRACTICE.progress().answered;
 });
 assert.equal(before,1,"First response counted");
 await study.reload({waitUntil:"load"});
 const resumed=await study.evaluate(()=>({
  ok:window.EBDAA_PRACTICE.resumeCheckpoint(),
  answered:window.EBDAA_PRACTICE.progress().answered
 }));
 assert.equal(resumed.ok,true,"Resume checkpoint");
 assert.equal(resumed.answered,1,"Saved response remains after reload");
 const certificate=await study.evaluate(()=>{
  const k="ai:1:0:0";
  window.EBDA_COMPLETION.setName(k,"QA Student");
  window.EBDA_COMPLETION.open(k);
  const data={subject:"ai",grade:1,unit:0,index:0,lesson:"Test Lesson",total:50};
  const pass=window.EBDA_COMPLETION.render({...data,correct:40});
  const fail=window.EBDA_COMPLETION.render({...data,correct:30});
  window.EBDAA_PRACTICE.clearCheckpoint();
  return {named:pass.includes("QA Student"),issued:pass.includes('id="ebda-certificate-sheet"'),failedNotIssued:!fail.includes('id="ebda-certificate-sheet"')};
 });
 assert.deepEqual(certificate,{named:true,issued:true,failedNotIssued:true},"Certificate name and eligibility");
 await study.close();
 // Run real Pyodide and SQLite workers in Chromium, not just mocked grading logic.
 if((process.env.NTSS_BROWSER||"chromium")==="chromium"){
 const runtimePage=await browser.newPage({viewport:{width:820,height:900},serviceWorkers:"block",ignoreHTTPSErrors:true});
 await runtimePage.goto(url,{waitUntil:"load"});
 const runtime=await runtimePage.evaluate(async()=>{
  const py=window.EBDAA_QUESTION_FACTORY.all(3,0,0).find(q=>q.mode==="live-code"&&q.engine==="python"&&q.codeTask.tests?.some(([expr])=>expr.startsWith("average(")));
  const sql=window.EBDAA_QUESTION_FACTORY.all(2,2,0).find(q=>q.mode==="live-code"&&q.engine==="sql");
  if(!py||!sql)throw Error("Missing reference coding challenges for browser QA");
  const execute=(q,code)=>new Promise(resolve=>window.NTSS_ASSESSMENT.run(q,code,resolve));
  const python=await execute(py,"def average(values):\n    return sum(values)/len(values)");
  const sqlite=await execute(sql,sql.codeTask.solution);
  return {python,sqlite};
 });
 assert.equal(runtime.python.passed,true,"Pyodide three-case Python test: "+runtime.python.message);
 assert.equal(runtime.sqlite.passed,true,"SQLite two-dataset SQL test: "+runtime.sqlite.message);
 await runtimePage.close();
 }
 console.log("Assessment browser QA passed on "+(process.env.NTSS_BROWSER||"chromium")+": four sizes, checkpoint, and certificate; live workers verified on Chromium.");


}finally{await browser?.close();await new Promise(done=>server.close(done));rmSync(certDir,{recursive:true,force:true})}
