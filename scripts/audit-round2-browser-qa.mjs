/* Real-button regression for the repaired challenge path and strict CSP. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),artifacts=process.env.NTSS_ROUND2_ARTIFACTS||'qa-artifacts/audit-round2';fs.mkdirSync(artifacts,{recursive:true});
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.wasm':'application/wasm','.woff2':'font/woff2','.png':'image/png'};
const server=createServer((req,res)=>{const name=new URL(req.url,'http://localhost').pathname;const f=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end();return}res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res)});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));const url='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--ignore-certificate-errors']});
const errors=[],violations=[];
try{
 const p=await browser.newPage({viewport:{width:1280,height:1100},serviceWorkers:'block'});
 p.on('pageerror',e=>errors.push(e.message));
 p.on('console',msg=>{if(/Content Security Policy|violates.*directive|Refused to/i.test(msg.text()))violations.push(msg.text())});
 await p.goto(url,{waitUntil:'load'});
 // Static-shell language control, then all navigation buttons to the original broken path.
 await p.locator('#lang-toggle').click();assert.equal(await p.evaluate(()=>EBDA_I18N.current()),'en');
 async function enter(unit){
  await p.locator('.logo').click();
  await p.locator('[data-ntss-action="chooseGrade"]').nth(1).click();
  await p.locator('[data-ntss-action="chooseSubject"]').first().click();
  await p.locator('[data-ntss-action="chooseGradeUnit"]').nth(unit).click();
  await p.locator('[data-ntss-action="openAdvancedSession"]').first().click();
  await p.locator('#ebda-lesson-student-name').fill('Round Two QA');
  await p.locator('.ebda-name-gate form button').click();
  await p.locator('.stepfooter .stage-next button').click();
  await p.getByText('Try a code challenge with automated tests',{exact:true}).click();
 }
 await enter(1);
 const factory='SELECT name FROM machines;';
 await p.locator('#studio-editor').fill(factory);
 assert.equal(await p.locator('#ebda-challenge-editor').inputValue(),'');
 await p.getByRole('button',{name:'▶ Run test cases',exact:true}).click();
 assert.match(await p.locator('#ebda-code-results').innerText(),/Write your challenge solution/);
 await p.getByText('View starter solution',{exact:true}).click();
 await p.getByRole('button',{name:'Load starter into challenge editor',exact:true}).click();
 await p.getByRole('button',{name:'▶ Run test cases',exact:true}).click();
 await p.waitForFunction(()=>document.getElementById('ebda-code-results')?.textContent.includes('2/2 SQL test cases passed'),{timeout:45000});
 assert.equal(await p.locator('#studio-editor').inputValue(),factory);
 const integrity=await p.evaluate(()=>[...document.scripts].find(s=>s.src.includes('/sql.js@1.13.0/dist/sql-wasm.js'))?.integrity);
 assert.match(integrity,/^sha384-[A-Za-z0-9+/]{64}$/);
 await p.getByText('View starter solution',{exact:true}).click();
 await p.locator('#ebda-code-results').scrollIntoViewIfNeeded();await p.screenshot({path:artifacts+'/sql-desktop.png'});
 await p.locator('#ebda-challenge-editor').fill('SELECT 42;');
 await p.locator('.stepfooter > button').click();await p.locator('.stepfooter .stage-next button').click();
 await p.getByText('Try a code challenge with automated tests',{exact:true}).click();
 assert.equal(await p.locator('#ebda-challenge-editor').inputValue(),'SELECT 42;');assert.equal(await p.locator('#studio-editor').inputValue(),factory);
 await p.getByText('View starter solution',{exact:true}).click();p.once('dialog',d=>d.dismiss());
 await p.getByRole('button',{name:'Load starter into challenge editor',exact:true}).click();assert.equal(await p.locator('#ebda-challenge-editor').inputValue(),'SELECT 42;');
 p.once('dialog',d=>d.accept());await p.getByRole('button',{name:'Load starter into challenge editor',exact:true}).click();
 assert.match(await p.locator('#ebda-challenge-editor').inputValue(),/COUNT\(\*\)/);
 await enter(0);
 const pythonDraft='print("my independent lab draft")';await p.locator('#studio-editor').fill(pythonDraft);
 await p.getByText('View starter solution',{exact:true}).click();await p.getByRole('button',{name:'Load starter into challenge editor',exact:true}).click();
 await p.getByRole('button',{name:'▶ Run test cases',exact:true}).click();
 await p.waitForFunction(()=>document.getElementById('ebda-code-results')?.textContent.includes('3 / 3 Python test cases passed'),{timeout:65000});
 assert.equal(await p.locator('#studio-editor').inputValue(),pythonDraft);
 await p.getByText('View starter solution',{exact:true}).click();
 await p.locator('#ebda-code-results').scrollIntoViewIfNeeded();await p.screenshot({path:artifacts+'/python-desktop.png'});
 await p.setViewportSize({width:390,height:844});await p.locator('#ebda-code-results').scrollIntoViewIfNeeded();await p.screenshot({path:artifacts+'/python-mobile.png'});
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'No mobile overflow');
 assert.equal(await p.locator('[onclick],[oninput],[onchange],[ontoggle],[onkeydown],[onsubmit]').count(),0);
 // Complete a real mathematics attempt, then exercise the migrated print control.
 await p.evaluate(async()=>{chooseGrade(1);await chooseSubject('mathematics');mathChooseUnit(0);mathOpen(0)});
 await p.locator('#ebda-lesson-student-name').fill('Round Two Print QA');await p.locator('.ebda-name-gate form button').click();
 await p.evaluate(()=>{const e=EBDAA_MATH_PRACTICE;for(let n=0;n<50;n++){e.continueStage?.();e.answer(e.currentQuestion().answer);e.check();e.next()}});
 assert.equal(await p.locator('#ebda-certificate-sheet').count(),1);
 await p.evaluate(()=>{window.__printCalls=0;window.print=()=>{window.__printCalls++}});
 await p.locator('[data-ntss-action="EBDA_COMPLETION.print"]').click();assert.equal(await p.evaluate(()=>window.__printCalls),1,'Real print button dispatch');
 await p.setViewportSize({width:1280,height:1000});await p.pdf({path:artifacts+'/certificate-print.pdf',printBackground:true,preferCSSPageSize:true});
 await p.emulateMedia({media:'print'});await p.screenshot({path:artifacts+'/certificate-print.png',fullPage:true});await p.emulateMedia({media:'screen'});
 assert.deepEqual(errors,[]);assert.deepEqual(violations,[]);
 console.log(JSON.stringify({ok:true,sql:'2/2',python:'3/3',preservedLabAndChallengeDrafts:true,overwriteConfirmation:true,printControl:true,strictCsp:true,errors,violations,artifacts}));
 await p.close();
}finally{await browser.close();await new Promise(ok=>server.close(ok))}
