'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('applied-missions.js','utf8');
function setup(){
 const window={EBDA_APP_RENDER(){}};
 vm.runInNewContext(source,{window});
 return window.NTSS_APPLIED;
}
const supported=[
 ['ai','SQL Database Queries'],['physics',"Ohm's Law"],
 ['business','Technical Support and Troubleshooting'],
 ['economics','الطلب'],['social','قناة السويس وأهميتها التجارية'],
 ['civics','المواطنة'],['en','Writing a Business Email'],
 ['de','Vor dem Rockkonzert'],['ar','الجملة الاسمية']
];
test('All nine subject types have topic-relevant real-world challenges',()=>{
 const x=setup();
 for(const [subject,title] of supported){
   const mission=x.select(subject,title,14);
   assert.ok(mission,subject+' '+title);
   assert.equal(mission[1].length,3,subject);
   assert.equal(mission[2],0,subject);
   assert.ok(mission[3].length>20,subject+' explanation');
 }
});
test('Missions only appear at question 15 and 35 and remain collapsed by default',()=>{
 const x=setup();
 for(const [subject,title] of supported){
  assert.equal(x.render(subject,'demo',13,title),'');
  assert.equal(x.render(subject,'demo',15,title),'');
  for(const n of [14,34]){
   const html=x.render(subject,'demo',n,title);
   assert.match(html,/<details class="ntss-applied"/);
   assert.match(html,/<summary class="ntss-applied-trigger">/);
   assert.match(html,/&quot;/,'Inline event arguments must be safely encoded');
   assert.equal((html.match(/class="ntss-applied-option/g)||[]).length,3);
  }
 }
});
test('First-attempt skill score is immutable after retries; reset is lesson-scoped',()=>{
 const x=setup();
 const k='physics:1-0-0:14';
 x.choose(k,2,0);
 assert.equal(x.progress('physics','1-0-0').attempted,1);
 assert.equal(x.progress('physics','1-0-0').correct,0);
 x.retry(k);
 x.choose(k,0,0);
 assert.equal(x.progress('physics','1-0-0').correct,0);
 x.choose('physics:1-0-0:34',0,0);
 assert.equal(x.progress('physics','1-0-0').attempted,2);
 assert.equal(x.progress('physics','1-0-0').correct,1);
 x.reset('physics','1-0-0');
 assert.equal(x.progress('physics','1-0-0').attempted,0);
});
test('Unrelated titles are not assigned fabricated scenarios',()=>{
 const x=setup();
 assert.equal(x.render('physics','demo',14,'Unrelated Topic XQZ'),'');
 assert.equal(x.render('economics','demo',14,'Unrelated Topic XQZ'),'');
});
test('Scenario library neither persists student identity nor transmits data',()=>{
 assert.doesNotMatch(source,/localStorage|sessionStorage|indexedDB|fetch\s*\(|XMLHttpRequest/);
});
