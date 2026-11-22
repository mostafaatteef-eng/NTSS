import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),artifacts='qa-artifacts/certificate-name';fs.mkdirSync(artifacts,{recursive:true});
const server=createServer((req,res)=>{const name=new URL(req.url,'http://localhost').pathname;const f=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){res.writeHead(404);res.end();return}res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html':'application/octet-stream');fs.createReadStream(f).pipe(res)});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));const url='http://127.0.0.1:'+server.address().port+'/';const browser=await chromium.launch({args:['--no-sandbox']});let cases=0;const errors=[];
const engines={ai:'EBDAA_PRACTICE','data-analysis':'EBDAA_DATA_ANALYSIS_PRACTICE',mathematics:'EBDAA_MATH_PRACTICE','advanced-english':'EBDAA_ENGLISH_PRACTICE','physics-stem':'EBDAA_PHYSICS_PRACTICE','german-language':'EBDAA_GERMAN_PRACTICE','arabic-language':'EBDAA_ARABIC_PRACTICE','business-english':'EBDAA_BUSINESS_PRACTICE','social-studies':'EBDAA_SOCIAL_STUDIES_PRACTICE',civics:'EBDAA_CIVICS_PRACTICE',economics:'EBDAA_ECONOMICS_PRACTICE'};
try{
 for(const width of [390,1440])for(const lang of ['ar','en']){
  const p=await browser.newPage({viewport:{width,height:1000},serviceWorkers:'block'});p.on('pageerror',e=>errors.push(e.message));await p.goto(url);
  await p.evaluate(async lang=>{if(EBDA_I18N.current()!==lang)EBDA_I18N.toggle();await NTSS_LAZY.ensureAllCurricula();await NTSS_LAZY.ensureStudio();await Promise.all(Object.keys(NTSS_LAZY.subjectFiles).map(x=>NTSS_LAZY.ensureSubject(x)))},lang);
  const lessons=await p.evaluate(()=>allSearchLessons());const groups=new Set();
  for(const l of lessons){const group=l.subject+':'+l.grade;if(groups.has(group))continue;groups.add(group);assert.ok(engines[l.subject],group);
   await p.evaluate(l=>{nav('home');searchOpen(l.grade,l.unit,l.session,l.subject)},l);
   await p.locator('#ebda-lesson-student-name').fill('طالب الاختبار');await p.locator('.ebda-name-gate form button').click();
   if(l.subject==='ai')await p.locator('.lesson-jump').click();
   await p.evaluate(({engine,ai})=>{const e=window[engine];for(let n=0;n<50;n++){e.continueStage?.();const q=ai?e.currentQuestion():e.currentQuestion();e.answer(ai&&q.mode==='order'?q.answer.split('|'):ai&&q.mode==='live-code'?'pass':q.answer);e.check();e.next()}},{engine:engines[l.subject],ai:l.subject==='ai'});
   assert.equal(await p.locator('#ebda-certificate-sheet').count(),1,'Certificate '+group);
   assert.equal(await p.locator('.ebda-certificate-student').innerText(),'طالب الاختبار');
   assert.equal(await p.locator('#ebda-student-name').count(),0,'No final rename field');
   assert.equal(await p.getByRole('button',{name:/^(Edit name|تعديل الاسم)$/}).count(),0,'No rename action');
   assert.equal(await p.evaluate(()=>typeof EBDA_COMPLETION.edit),'undefined');
   await p.locator('.practice-language-bar button').click();
   assert.equal(await p.locator('.ebda-certificate-student').innerText(),'طالب الاختبار');
   await p.locator('.practice-language-bar button').click();
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'No overflow '+group);
   if(l.subject==='mathematics'&&l.grade===1){await p.screenshot({path:artifacts+'/after-'+lang+'-'+width+'.png',fullPage:true})}
   cases++;
  }
  await p.close();
 }

 // Real reload, alternate typed name, original identity restore, and legacy migration.
 for(const subject of ['ai','mathematics','data-analysis'])for(const legacy of [false,true]){
  const p=await browser.newPage({viewport:{width:390,height:1000},serviceWorkers:'block'});p.on('pageerror',e=>errors.push(e.message));await p.goto(url);
  const prepare=async()=>{await p.evaluate(async()=>{await NTSS_LAZY.ensureAllCurricula();await NTSS_LAZY.ensureStudio();await Promise.all(Object.keys(NTSS_LAZY.subjectFiles).map(x=>NTSS_LAZY.ensureSubject(x)))})};
  await prepare();const l=await p.evaluate(subject=>allSearchLessons().find(l=>l.subject===subject&&l.grade===1),subject);
  const enter=async name=>{await p.evaluate(l=>{nav('home');searchOpen(l.grade,l.unit,l.session,l.subject)},l);await p.locator('#ebda-lesson-student-name').fill(name);await p.locator('.ebda-name-gate form button').click();if(subject==='ai')await p.locator('.lesson-jump').click()};
  await enter('Original Student');
  await p.evaluate(({engine,ai,legacy})=>{const e=window[engine],q=e.currentQuestion();e.answer(ai&&q.mode==='order'?q.answer.split('|'):ai&&q.mode==='live-code'?'pass':q.answer);e.check();e.saveCheckpoint();if(legacy){const key=Object.keys(localStorage).find(k=>k.startsWith('ntss-private-practice-checkpoint-v4')&&JSON.parse(localStorage[k]).identity?.name==='Original Student');const old=JSON.parse(localStorage[key]);delete old.identity;localStorage[key]=JSON.stringify(old)}},{engine:engines[subject],ai:subject==='ai',legacy});
  await p.reload();if(legacy)await p.evaluate(()=>{for(const key of Object.keys(localStorage).filter(k=>k.startsWith('ntss-private-practice-checkpoint-v4'))){const v=JSON.parse(localStorage[key]);delete v.identity;localStorage[key]=JSON.stringify(v)}});await prepare();await enter('Another Student');await p.locator('.ntss-restore').click();
  const notice=await p.locator('.ebda-attempt-identity').first().innerText();assert.ok(notice.includes(legacy?'محاولة محفوظة قديمة':'Original Student'),subject+' legacy='+legacy+' '+notice);
  const answered=await p.evaluate(engine=>window[engine].progress().answered,engines[subject]);assert.equal(answered,1,'Progress preserved');
  await p.evaluate(({engine,ai})=>{const e=window[engine];for(let n=0;n<50;n++){e.continueStage?.();const q=e.currentQuestion();e.answer(ai&&q.mode==='order'?q.answer.split('|'):ai&&q.mode==='live-code'?'pass':q.answer);e.check();e.next();if(e.progress().finished)break}},{engine:engines[subject],ai:subject==='ai'});
  assert.equal(await p.locator('#ebda-certificate-sheet').count(),legacy?0:1,'Resume certificate rule '+subject);
  if(!legacy)assert.equal(await p.locator('.ebda-certificate-student').innerText(),'Original Student');
  if(subject==='mathematics')await p.screenshot({path:artifacts+'/'+(legacy?'legacy-learning-only':'restored-original-name')+'.png',fullPage:true});
  assert.equal(await p.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('ntss-private-practice-checkpoint-v4')).length),0,'Completion clears stored name and progress');
  await p.close();
 }

 const project=await browser.newPage({viewport:{width:390,height:1000},serviceWorkers:'block'});await project.goto(url);
 await project.evaluate(async()=>{await NTSS_LAZY.ensureAllCurricula();await NTSS_LAZY.ensureSubject('businessPractice');const l=allSearchLessons().find(l=>l.subject==='business-english'&&EBDAA_BUSINESS_ENGLISH_UNITS[l.grade][l.unit].sessions[l.session].kind==='project');nav('home');searchOpen(l.grade,l.unit,l.session,l.subject)});
 await project.locator('#ebda-lesson-student-name').fill('Project Student');await project.locator('.ebda-name-gate form button').click();await project.locator('#business-project-notes').fill('A synthetic workplace presentation outline with introduction, evidence and a conclusion.');await project.getByRole('button',{name:/إتمام إعداد المشروع|Complete project preparation/}).click();
 assert.equal(await project.locator('.ebda-certificate-student').innerText(),'Project Student');assert.ok((await project.locator('.ebda-certificate-heading').innerText()).includes('Participation'));assert.equal(await project.locator('#ebda-student-name').count(),0);
 await project.evaluate(()=>{window.print=()=>window.__printed=true});await project.getByRole('button',{name:/حفظ PDF|Save as PDF/}).click();assert.equal(await project.evaluate(()=>window.__printed),true);await project.close();
 const edge=await browser.newPage({serviceWorkers:'block'});await edge.goto(url);
 const edgeResult=await edge.evaluate(()=>{
  const c=EBDA_COMPLETION,k='ai:1:0:0',e=EBDAA_PRACTICE;
  c.setName(k,'Expiry Student');e.begin(1,0,0);e.saveCheckpoint();
  const key='ntss-private-practice-checkpoint-v4',v=JSON.parse(localStorage.getItem(key));
  const identity=v.identity.name;v.savedAt=Date.now()-8*24*60*60*1000;localStorage.setItem(key,JSON.stringify(v));
  const expired=!e.hasCheckpoint()&&localStorage.getItem(key)===null;
  const old=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('Storage blocked')};
  const denied=e.saveCheckpoint()===false;Storage.prototype.setItem=old;
  return {identity,expired,denied,unchanged:c.getName(k)};
 });
 assert.deepEqual(edgeResult,{identity:'Expiry Student',expired:true,denied:true,unchanged:'Expiry Student'});await edge.close();
 assert.deepEqual(errors,[]);console.log(JSON.stringify({ok:true,completionCases:cases,errors,artifacts}));
}finally{await browser.close();await new Promise(ok=>server.close(ok))}
