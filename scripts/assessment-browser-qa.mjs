import assert from "node:assert/strict";
import {chromium} from "playwright";
import {createServer} from "node:http";
import {createReadStream,existsSync,statSync} from "node:fs";
import path from "node:path";

const root=process.cwd(),mime={".html":"text/html",".js":"text/javascript",".css":"text/css"};
const server=createServer((req,res)=>{
 const name=new URL(req.url,"http://localhost").pathname;
 const file=path.resolve(root,"."+(name==="/"?"/index.html":name));
 if(!file.startsWith(root+path.sep)||!existsSync(file)||!statSync(file).isFile()){res.writeHead(404);res.end();return}
 res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});
 createReadStream(file).pipe(res);
});
await new Promise(done=>server.listen(0,"127.0.0.1",done));
let browser;
try{
 browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const url="http://127.0.0.1:"+server.address().port+"/";
 for(const width of [360,430,768,1366]){
  const page=await browser.newPage({viewport:{width,height:850},serviceWorkers:"block"});
  const errors=[];page.on("pageerror",err=>errors.push(err.message));
  await page.goto(url,{waitUntil:"load"});
  await page.waitForFunction(()=>!!window.NTSS_ASSESSMENT&&!!window.EBDAA_QUESTION_FACTORY);
  await page.evaluate(()=>{
   const qs=window.EBDAA_QUESTION_FACTORY.all(2,0,0);
   const visual=qs.find(q=>q.mode==="visual-data"),coding=qs.find(q=>q.mode==="live-code");
   document.querySelector("#app").innerHTML=
    '<main style="width:100%;max-width:850px;margin:auto;padding:12px">'+
    window.NTSS_ASSESSMENT.questionView(visual,2)+window.NTSS_ASSESSMENT.visual(visual)+
    window.NTSS_ASSESSMENT.codePanel(coding,coding.codeTask.starter,false,"")+'</main>';
  });
  assert.ok(await page.locator(".ntss-question-layout").count(),"Question layout");
  assert.ok(await page.locator(".ntss-data-card").count(),"Visual card");
  assert.ok(await page.locator("#ntss-code-editor").count(),"Code editor");
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
  assert.equal(overflow,false,"Horizontal overflow at viewport "+width);
  assert.deepEqual(errors,[],"JS errors at viewport "+width);
  await page.close();
 }
 console.log("Assessment browser QA passed at 360, 430, 768, 1366 px.");
}finally{await browser?.close();await new Promise(done=>server.close(done))}
