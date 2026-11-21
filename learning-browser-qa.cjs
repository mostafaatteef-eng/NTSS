'use strict';
/* Cross-device learning experience QA.
 * Runs in real Chromium against the checked-out site (not a live student session).
 * All synthetic student data is thrown away; test is not an accessibility audit.
 */
const engines=require('playwright');
const engineName=process.env.NTSS_BROWSER||'chromium';
const browserType=engines[engineName];
if(!['chromium','webkit'].includes(engineName)||!browserType)throw Error('Unsupported test browser');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ROOT=process.env.NTSS_TEST_URL||'https://127.0.0.1:8765/';
const viewports=[
 {name:'phone-compact',width:360,height:780},
 {name:'phone-large',width:430,height:932},
 {name:'tablet',width:820,height:1180},
 {name:'laptop',width:1366,height:768}
];
const cases=[
 {name:'mathematics',grade:1,subject:'mathematics',unit:'mathChooseUnit',lesson:'mathOpen'},
 {name:'english',grade:2,subject:'advanced-english',unit:'englishChooseUnit',lesson:'englishOpen'},
 {name:'physics',grade:2,subject:'physics-stem',unit:'physicsChooseUnit',lesson:'physicsOpen'},
 {name:'economics',grade:3,subject:'economics',unit:'economicsChooseUnit',lesson:'economicsOpen'},
 {name:'arabic',grade:1,subject:'arabic-language',unit:'arabicChooseUnit',lesson:'arabicOpen'}
];
const artifactDir='qa-artifacts';
fs.mkdirSync(artifactDir,{recursive:true});
const results=[];
const failures=[];
let activePage=null,activeDevice='startup',activeCase='startup';
process.on('unhandledRejection',e=>{console.error('Unhandled QA rejection:',e)})
function check(condition,msg){assert.ok(condition,msg)}
(async()=>{
 const browser=await browserType.launch(engineName==='chromium'?{headless:true,args:['--no-sandbox']}:{headless:true});
 try{
  for(const device of viewports){
   const context=await browser.newContext({viewport:{width:device.width,height:device.height},deviceScaleFactor:1,ignoreHTTPSErrors:true});
   const page=await context.newPage();
   activePage=page;activeDevice=device.name;
   const exceptions=[],violations=[];
   page.on('pageerror',e=>exceptions.push(e.message));
   page.on('console',e=>{if(/Content Security Policy|violates.*directive|Refused to/i.test(e.text()))violations.push(e.text())});
   await page.goto(ROOT,{waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForFunction(()=>typeof window.EBDA_APP_RENDER==='function',{timeout:25000});
   check(await page.locator('#app').count()===1,'Missing app element');
   for(const testCase of cases){
    activeCase=testCase.name;
    const routingError=await page.evaluate(({grade,subject,unit,lesson})=>{
      chooseGrade(grade);
      chooseSubject(subject);
      if(typeof window[unit]!=='function'||typeof window[lesson]!=='function')return 'missing navigation handler '+unit+' '+lesson;
      window[unit](0);
      window[lesson](0);
      return null;
    },testCase);
    check(!routingError,device.name+' '+testCase.name+': '+routingError);
    // New privacy/name requirement: wait for the on-demand module, enter a synthetic name,
    // then check the actual lesson rather than assuming immediate question rendering.
    await page.locator('.ebda-name-gate').waitFor({timeout:20000});
    check((await page.locator('.ebda-name-gate__lesson').innerText()).trim().length>0,
      device.name+' '+testCase.name+' name gate missing lesson title');
    await page.locator('#ebda-lesson-student-name').fill('QA Student');
    await page.getByRole('button',{name:/Start lesson|ابدأ الدرس/i}).click();
    await page.locator('.practice-question').first().waitFor({timeout:20000});
    const result=await page.evaluate(()=>({
       lesson:document.querySelector('.practice-focus__lesson')?.textContent||'',
       counter:document.querySelector('.practice-focus__counter')?.textContent||'',
       progress:!!document.querySelector('.practice-focus__track'),
       question:!!document.querySelector('.practice-question'),
       tools:document.querySelectorAll('.ntss-learning-tools').length,
       expanded:document.querySelector('.ntss-learning-tools')?.open||false,
       duplicate:document.querySelectorAll('.ntss-learning-tools .ntss-learning-tools').length
    }));
    check(!result.error,device.name+' '+testCase.name+': '+result.error);
    check(result.lesson.length>0,device.name+' '+testCase.name+' lesson title not rendered');
    check(result.question,device.name+' '+testCase.name+' question missing');
    check(result.progress,device.name+' '+testCase.name+' progress not rendered');
    check(result.counter.length>0,device.name+' '+testCase.name+' question counter missing');
    check(!result.expanded,device.name+' '+testCase.name+' optional tools opened unexpectedly');
    check(!result.duplicate,device.name+' '+testCase.name+' nested tools panels');
    const width=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));
    check(width.scrollWidth<=width.clientWidth+8,device.name+' '+testCase.name+' horizontal overflow '+JSON.stringify(width));
    results.push({device:device.name,subject:testCase.name,lesson:result.lesson,counter:result.counter,tools:result.tools,viewport:width});
   }
   activeCase='math-answer-flow';
   // Exercise the real grading/Next buttons in the mathematics UI.
   await page.evaluate(()=>{chooseGrade(1);chooseSubject('mathematics');mathChooseUnit(0);mathOpen(0)});
   if(await page.locator('#math-answer').count()){
     await page.locator('#math-answer').fill('1');
   }else{
     await page.evaluate(()=>window.EBDAA_MATH_PRACTICE.respond(0));
   }
   await page.locator('#math-check').click();
   const checkButtonText=await page.locator('#math-check').innerText();
   check(/Next question|Show result/i.test(checkButtonText),device.name+' answer verification did not advance to feedback');
   await page.locator('#math-check').click();
   check(/Question 2/i.test(await page.locator('.practice-focus__counter').innerText()),device.name+' next question did not appear after clicking');
   // Check that the learning tools disclosure can receive keyboard focus.
   const disclosure=page.locator('.ntss-learning-tools > summary').first();
   if(await disclosure.count()){
     await disclosure.focus();
     check(await disclosure.evaluate(el=>document.activeElement===el),device.name+' learning tools summary cannot receive keyboard focus');
   }
   // Correctly apply score-only practice feedback without depending on a real student.
   activeCase='smart-mistake-review';
   const review=await page.evaluate(()=>{
    const n=window.NTSS_LEARNING;
    n.reset('mathPractice');
    for(let i=0;i<5;i++)n.record('mathPractice',i,i===0,{question:'Practice example '+i,explanation:'Review this mathematical rule',focus:'Algebra'});
    const advice=n.adaptiveAdvice('mathPractice',5);
    const reviewHtml=n.review('mathPractice',3);
    const report=n.report('mathPractice');
    n.reset('mathPractice');
    return {advice:advice.includes('Suggested review'),review:reviewHtml.includes('Review this mathematical rule'),attempted:report.attempted,correct:report.correct,cleared:n.report('mathPractice').attempted===0};
   });
   check(review.advice&&review.review&&review.attempted===5&&review.correct===1&&review.cleared,device.name+' smart review evidence');
   activeCase='interactive-concept-models';
   const concept=await page.evaluate(()=>{
    const c=window.NTSS_CONCEPTS;
    return {ohm:c.visualization('ohm',4).result,sql:c.visualization('sql',3).result,knn:c.visualization('knn',4).result};
   });
   check(concept.ohm.includes('2.0 A')&&concept.sql.includes('no matching project')&&concept.knn.includes('Majority vote'),device.name+' computed visualizer');
   check(exceptions.length===0,device.name+' JavaScript errors: '+exceptions.join(' | '));
   check(violations.length===0,device.name+' CSP errors: '+violations.join(' | '));
   activeCase='offline-reload';
   // Verify a previously visited site shell can reopen without a network connection.
   await page.evaluate(async()=>{
     if(!('serviceWorker' in navigator))throw Error('No service worker support');
     await Promise.race([
       navigator.serviceWorker.ready,
       new Promise((_,reject)=>setTimeout(()=>reject(new Error('Service worker did not become ready in 10 seconds')),10000))
     ]);
     if(!navigator.serviceWorker.controller){await new Promise(resolve=>{navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true});setTimeout(resolve,3500)})}
   });
   await page.waitForFunction(()=>document.documentElement.dataset.offlineReady==="true",{timeout:30000});
   await context.setOffline(true);
   await page.reload({waitUntil:'domcontentloaded',timeout:15000});
   await page.waitForFunction(()=>typeof window.EBDA_APP_RENDER==='function',{timeout:10000});
   check((await page.locator('#app').innerText()).length>10,device.name+' offline app shell missing');
   await context.setOffline(false);
   await page.screenshot({path:artifactDir+'/'+engineName+'-'+device.name+'-last-subject.png',fullPage:true});
   await context.close();activePage=null;
  }
  fs.writeFileSync(artifactDir+'/'+engineName+'-qa-results.json',JSON.stringify({browser:engineName,checkedAt:new Date().toISOString(),results},null,2));
  console.log('PASS '+engineName+' learning cross-device QA: '+results.length+' subject-device checks, '+viewports.length+' viewport sizes');
 }finally{await browser.close()}
})().catch(async err=>{
 console.error('QA FAILED',engineName,activeDevice,activeCase,err);
 const failure={browser:engineName,device:activeDevice,case:activeCase,message:String(err?.stack||err),completed:results};
 try{
  fs.writeFileSync(artifactDir+'/'+engineName+'-failure.json',JSON.stringify(failure,null,2));
  if(activePage&&!activePage.isClosed())await activePage.screenshot({path:artifactDir+'/'+engineName+'-'+activeDevice+'-'+activeCase+'-failure.png',fullPage:true,timeout:5000});
 }catch(e){console.error('Could not capture failure screenshot:',e.message)}
 process.exitCode=1;
});
