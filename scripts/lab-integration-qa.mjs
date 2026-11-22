import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.env.NTSS_LAB_ROOT||process.cwd();
const before=process.env.NTSS_LAB_BEFORE==='1';
const artifacts=process.env.NTSS_LAB_ARTIFACTS||'qa-artifacts/lab-integration';fs.mkdirSync(artifacts,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.wasm':'application/wasm'};
const server=createServer((req,res)=>{const name=new URL(req.url,'http://localhost').pathname;const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('missing');return}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res)});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const url='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--ignore-certificate-errors']});
let count=0;const faults=[];
try{
 for(const lang of ['ar','en'])for(const viewport of [{width:1440,height:1000},{width:820,height:1180},{width:390,height:844},{width:360,height:780}]){
  const ctx=await browser.newContext({viewport,ignoreHTTPSErrors:true});await ctx.addInitScript(lang=>localStorage.setItem('ebda-lang',lang),lang);
  const p=await ctx.newPage();p.on('pageerror',e=>faults.push(e.message));
  const capture=async filename=>{await p.evaluate(()=>scrollTo(0,0));await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:artifacts+'/'+filename,fullPage:true})};
  for(const g of before?[1]:[1,2,3]){
   await p.goto(url,{waitUntil:'load'});
   await p.evaluate(g=>{chooseGrade(g);chooseSubject('ai-data-engineering')},g);
   const suffix=lang+'-'+viewport.width+'-g'+g;
   if(g===1)await capture((before?'before':'after')+'-subject-'+suffix+'.png');
   if(before){await p.getByRole('button',{name:'🐍 Open Python Lab',exact:true}).click();await capture('before-lab-'+suffix+'.png');continue}
   assert.equal(await p.locator('button[data-ntss-action="openCodeLab"]' ).count(),1,'one free practice entry');
   await p.locator('button[data-ntss-action="openCodeLab"]' ).click();
   assert.equal(await p.locator('.coding-lab [aria-pressed="true"]').count(),2);
   assert.equal(await p.locator('.coding-lab__tasks button').count(),6);
   await p.locator('.practice-focus__exit').click();
   assert.equal(await p.evaluate(()=>mode),'subject');
   await p.evaluate(()=>chooseGradeUnit(0));
   if(g>1)await p.evaluate(()=>openAdvancedSession(0));
   await p.waitForSelector('#ebda-lesson-student-name');
   await p.locator('#ebda-lesson-student-name').fill(lang==='ar'?'طالب اختبار':'QA Student');
   await p.locator('.ebda-name-gate form button').click();
   await p.waitForSelector('.lesson-steps');
   // Visit a nondefault stage, preserving checked-answer state and score.
   await p.evaluate(g=>{if(g===1){restoreStage(1);answer=2;checked=true;hint=true}else{goAdvancedStep(1)}render()},g);
   if(await p.locator('#studio-editor').count())await p.locator('#studio-editor').fill('print("retained lesson draft")');
   const studioDraft=await p.locator('#studio-editor').count()?await p.locator('#studio-editor').inputValue():null;
   const state=await p.evaluate(()=>({mode,grade,unit,year2Unit,advancedSession,selectedId,step,advancedStep,answer,checked,hint,score,labValue}));
   await p.locator('.lesson-lab-entry button').click();
   await p.waitForSelector('.integrated-lesson-lab');
   assert.equal(await p.locator('.integrated-lesson-lab .lesson-step').count(),5);
   assert.equal(await p.locator('.integrated-lesson-lab .lesson-step').nth(1).getAttribute('aria-current'),'step');
   assert.equal(await p.locator('#coding-editor').getAttribute('dir'),'ltr');
   assert.equal(await p.locator('.coding-lab').getAttribute('dir'),lang==='ar'?'rtl':'ltr');
   await p.locator('#coding-editor').fill('print(123)');
   await p.locator('.coding-lab__modes button').nth(1).click();
   assert.equal(await p.locator('.coding-lab__tasks button').count(),6);
   await p.locator('.coding-lab__modes button').first().click();
   assert.equal(await p.locator('#coding-editor').inputValue(),'print(123)');
   await p.locator('.coding-lab__language').click();
   assert.equal(await p.locator('#coding-editor').inputValue(),'print(123)');
   await p.locator('.coding-lab__language').click();
   await p.locator('.coding-lab__actions button').nth(1).click();
   if(g===1&&viewport.width===1440&&lang==='en'){
    await p.locator('.coding-lab__actions button').first().click();
    await p.waitForFunction(()=>document.querySelector('.coding-lab__results')?.textContent.includes('Correct output'),null,{timeout:90000});
    await p.locator('.coding-lab__modes button').nth(1).click();
    await p.locator('.coding-lab__actions button').first().click();
    await p.waitForFunction(()=>document.querySelector('.coding-lab__results')?.textContent.includes('Correct output'),null,{timeout:90000});
   }
   if(g===1)await capture('after-lab-'+suffix+'.png');
   const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,'no page overflow '+suffix);
   await p.locator('.integrated-lesson-lab .topmeta button').click();
   const restored=await p.evaluate(()=>({mode,grade,unit,year2Unit,advancedSession,selectedId,step,advancedStep,answer,checked,hint,score,labValue}));assert.deepEqual(restored,state,'exact lesson stage and answers restored');
   if(studioDraft!==null)assert.equal(await p.locator('#studio-editor').inputValue(),studioDraft,'lesson studio draft retained');
   // Practice-stage launch must also render the embedded lab, not the practice view.
   await p.evaluate(g=>{if(g===1){restoreStage(4)}else{advancedStep=4}render()},g);
   await p.evaluate(()=>{const engine=window.EBDAA_PRACTICE,q=engine.currentQuestion();engine.answer(q.mode==='order'?q.answer.split('|'):q.answer);engine.check();engine.next()});
   const progress=await p.evaluate(()=>window.EBDAA_PRACTICE.progress());assert.ok(progress.answered>=1,'nonempty practice state before opening lab');
   await p.locator('.lesson-lab-entry button').click();await p.waitForSelector('.integrated-lesson-lab');
   if(g===1&&viewport.width===390)await capture('after-practice-lab-'+suffix+'.png');
   await p.locator('.integrated-lesson-lab .topmeta button').click();assert.equal(await p.evaluate(g=>g===1?step:advancedStep,g),4);
   assert.deepEqual(await p.evaluate(()=>window.EBDAA_PRACTICE.progress()),progress,'answered questions and practice cursor retained');
   // Leaving via top navigation must stop/clear the lab state.
   await p.locator('.lesson-lab-entry button').click();await p.evaluate(()=>nav('home'));
   assert.equal(await p.evaluate(()=>lessonCodeLabActive),false);
   count++;
  }
  await ctx.close();
 }
 assert.deepEqual(faults,[]);
 console.log(JSON.stringify({ok:true,cases:count,before,errors:faults,artifacts}));
}finally{await browser.close();await new Promise(ok=>server.close(ok))}
