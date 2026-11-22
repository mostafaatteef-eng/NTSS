import assert from 'node:assert/strict';import{chromium}from'playwright';import{createServer}from'node:http';import fs from'node:fs';import path from'node:path';
const root=process.cwd(),mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.wasm':'application/wasm','.woff2':'font/woff2'};
const server=createServer((req,res)=>{const f=path.resolve(root,'.'+(new URL(req.url,'http://localhost').pathname==='/'?'/index.html':new URL(req.url,'http://localhost').pathname));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end();return}res.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res)});await new Promise(ok=>server.listen(0,'127.0.0.1',ok));const url='http://127.0.0.1:'+server.address().port+'/';const b=await chromium.launch({headless:true,args:['--no-sandbox']});const artifacts=process.env.NTSS_UI_ARTIFACTS||'qa-artifacts/practice-repair';fs.mkdirSync(artifacts,{recursive:true});let cases=0,da=0;const errors=[];
try{
for(const width of[390,1440])for(const lang of['ar','en']){
 const p=await b.newPage({viewport:{width,height:900},serviceWorkers:'block'});p.on('pageerror',e=>errors.push(e.message));await p.goto(url,{waitUntil:'load'});await p.evaluate(async lang=>{if(EBDA_I18N.current()!==lang)EBDA_I18N.toggle();await NTSS_LAZY.ensureAllCurricula();await NTSS_LAZY.ensureStudio();await Promise.all(Object.keys(NTSS_LAZY.subjectFiles).map(x=>NTSS_LAZY.ensureSubject(x)))},lang);
 const lessons=await p.evaluate(()=>allSearchLessons());const groups=new Set();
 for(const l of lessons){const key=l.subject+':'+l.grade;if(groups.has(key))continue;groups.add(key);
  await p.evaluate(l=>{nav('home');searchOpen(l.grade,l.unit,l.session,l.subject)},l);await p.locator('#ebda-lesson-student-name').fill('Repair QA Student');await p.locator('.ebda-name-gate form button').click();
  if(l.subject==='ai')await p.locator('.lesson-jump').click();
  assert.equal(await p.locator('.practice-language-bar button').count(),1,'Language access in every focused path');
  assert.ok(await p.getByRole('button',{name:lang==='ar'?'العودة للدروس':'Back to lessons',exact:true}).count(),'Shared return label '+key);
  const before=await p.locator('.practice-focus__lesson').innerText();await p.locator('.practice-language-bar button').click();assert.equal(await p.locator('.practice-focus__lesson').innerText(),before,'Question/title preserved across UI switch');await p.locator('.practice-language-bar button').click();
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'No overflow '+key+' '+lang+' '+width);
  if(l.grade===1&&['ai','mathematics','german-language','arabic-language'].includes(l.subject))await p.screenshot({path:artifacts+'/'+lang+'-'+width+'-'+l.subject+'.png',fullPage:true});
  cases++;
 }
 if(width===390&&lang==='ar')for(const l of lessons.filter(x=>x.subject==='data-analysis')){
  await p.evaluate(l=>{nav('home');searchOpen(l.grade,l.unit,l.session,l.subject)},l); // Name may already be available for representative lesson.
  if(await p.locator('#ebda-lesson-student-name').count()){await p.locator('#ebda-lesson-student-name').fill('Repair QA Student');await p.locator('.ebda-name-gate form button').click()}
  for(let n=0;n<50;n++){
   if(await p.locator('.ntss-stage-gate').count())await p.locator('.ntss-stage-gate button').click();
   await p.evaluate(()=>{const e=EBDAA_DATA_ANALYSIS_PRACTICE;e.answer(e.currentQuestion().answer)});await p.locator('#da-check').click();
   if(n===16){await p.evaluate(()=>EBDAA_DATA_ANALYSIS_PRACTICE.saveCheckpoint());const state=await p.evaluate(()=>EBDAA_DATA_ANALYSIS_PRACTICE.progress());await p.locator('.practice-language-bar button').click();assert.deepEqual(await p.evaluate(()=>EBDAA_DATA_ANALYSIS_PRACTICE.progress()),state);await p.locator('.practice-language-bar button').click()}
   await p.locator('#da-check').click();
   if(n===10&&l.grade===1&&l.session===0)await p.screenshot({path:artifacts+'/data-analysis-past10.png',fullPage:true});
  }
  assert.equal(await p.locator('#ebda-certificate-sheet').count(),1,'Data Analysis named certificate '+l.grade+' '+l.session);if(l.grade===1&&l.session===0)await p.screenshot({path:artifacts+'/data-analysis-completed.png',fullPage:true});da++;
 }
 await p.close();
}
assert.deepEqual(errors,[]);console.log(JSON.stringify({ok:true,subjectYearLanguageViewportCases:cases,dataAnalysisFullCompletions:da,errors,artifacts}));
}finally{await b.close();await new Promise(ok=>server.close(ok))}
