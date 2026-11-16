'use strict';
/* Live browser smoke test. Run on GitHub Actions via browser-security.yml.
 * Verifies the UI and smoke-checks worker execution, not a penetration test. */
const { chromium }=require('playwright');
const assert=require('node:assert/strict');
const ROOT=process.env.NTSS_TEST_URL||'http://127.0.0.1:8765/';
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const errors=[],violations=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('console',msg=>{if(msg.type()==='error'&&!/cdn\.jsdelivr\.net|net::ERR_|Failed to load resource/i.test(msg.text()))errors.push('console: '+msg.text())});
 page.on('console',msg=>{if(/Content Security Policy|violates.*directive|Refused to/i.test(msg.text()))violations.push(msg.text())});
 await page.goto(ROOT,{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>typeof window.EBDA_APP_RENDER==='function',{timeout:25000});
 assert.ok(await page.locator('#app').count(),'Application root missing');
 for(const g of [1,2,3]){
  await page.evaluate(g=>chooseGrade(g),g);
  await page.waitForTimeout(120);
  assert.ok(await page.locator('#app').innerText(),'Grade page is empty '+g);
 }
 await page.evaluate(()=>{chooseGrade(3);chooseSubject('economics')});
 assert.match(await page.locator('#app').innerText(),/الاقتصاد|اقتصاد/);
 await page.evaluate(()=>economicsChooseUnit(0));
 assert.match(await page.locator('#app').innerText(),/الدرس|اقتصاد/);
 await page.evaluate(()=>economicsOpen(0));
 assert.match(await page.locator('#app').innerText(),/السؤال|اقتصاد/);
 // Test that full names remain local, and certificates are not offered below eligibility.
 const certificate=await page.evaluate(()=>{
  const opts={subject:'economics',grade:3,unit:0,index:0,lesson:'Supply and Demand',correct:45,total:50};
  const denial=window.EBDA_COMPLETION.render({...opts,correct:30});
  window.EBDA_COMPLETION.setName('economics:3:0:0','Student Example');
  window.EBDA_COMPLETION.open('economics:3:0:0');
  const html=window.EBDA_COMPLETION.render(opts);
  return {denial:denial.includes('ebda-certificate-sheet'),printed:html.includes('ebda-certificate-sheet'),student:html.includes('Student Example'),logo:html.includes('NTSS – National Technical Science Schools')};
 });
 assert.equal(certificate.denial,false);
 assert.equal(certificate.printed,true);
 assert.equal(certificate.student,true);
 assert.equal(certificate.logo,true);
 // Verify page works at phone width without horizontal overflow.
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>chooseGrade(1));
 await page.waitForTimeout(120);
 const mobile=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));
 assert.ok(mobile.scrollWidth<=mobile.clientWidth+8,'Excessive mobile horizontal overflow: '+JSON.stringify(mobile));
 assert.deepEqual(errors,[],'Browser console/runtime errors');
 assert.deepEqual(violations,[],'Content Security Policy violations');
 console.log(JSON.stringify({ok:true,grades:3,certificate,viewport:mobile,errors,violations}));
 await browser.close();
})().catch(err=>{console.error(err);process.exitCode=1});
