'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
const parse=p=>assert.doesNotThrow(()=>new vm.Script(read(p)),p);
function load(file,window={},extra={}){
 const context={window,document:{getElementById(){return null},querySelector(){return null}},...extra};
 vm.runInNewContext(read(file),context,{filename:file});
 return window;
}
test('Every newly added learning, teacher and offline module parses',()=>{
 for(const f of ['learning-journey.js','question-bank-audit.js','offline-support.js','sw.js','practice-workshop.js','app-main.js'])parse(f);
});
test('Quick and Mastery checks have distinct five-item formative question banks',()=>{
 const w=load('learning-journey.js',{EBDAA_PERFORMANCE:{'2-2':{engine:'sql'},'3-2':{engine:'annotation'}}});
 const engine=w.NTSS_JOURNEY;
 for(const [family,data] of Object.entries(engine.bank)){
  assert.equal(data.quick.length,5,family);
  assert.equal(data.master.length,5,family);
  for(const type of ['quick','master'])for(const q of data[type]){
   assert.ok(q.q.length>12,family+' short question');
   assert.ok(q.options.length>=3,family+' options');
   assert.ok(q.correct>=0&&q.correct<q.options.length,family+' correct index');
  }
  assert.notEqual(data.quick[0].q,data.master[0].q,family+' transfer question repeated');
 }
 assert.equal(engine.family(2,1),'sql');
 assert.equal(engine.family(3,1),null,'Do not force irrelevant statistics checks into annotation');
 for(let i=0;i<5;i++)engine.choose(1,0,0,'quick',0);
 assert.match(engine.panel(1,0,0),/\/ 5/);
 engine.stage(1,0,0,'master');
 for(let i=0;i<5;i++)engine.choose(1,0,0,'master',0);
 assert.match(engine.panel(1,0,0),/\/ 5/);
 assert.match(engine.panel(3,1,0),/not yet academically reviewed/);
});
test('Cross-subject question audit flags duplicates; no automatic scientific approval',()=>{
 const w={
 EBDAA_QUESTION_FACTORY:{all(){return [
 {question:'What is the value of 4 plus 5?',answer:9,options:['8','9','10'],explanation:'4+5 = 9.'},
 {question:'What is the value of 8 plus 5?',answer:13,options:['12','13','14'],explanation:'8+5 = 13.'}
 ]}},
 EBDAA_MATH_PRACTICE:{build(){return[]}}
 };
 load('question-bank-audit.js',w);
 const review=w.NTSS_BANK_AUDIT.audit('ai',1,0,0);
 assert.equal(review.count,2);
 assert.equal(review.items[0].review.status,'unreviewed');
 assert.ok(review.items[1].issues.includes('Similar question template (#1)'));
 assert.equal(review.items[0].explanation,'4+5 = 9.');
 w.NTSS_BANK_AUDIT.mark('ai',1,0,0,1,'revise','Verify the key with a teacher');
 assert.equal(w.NTSS_BANK_AUDIT.audit('ai',1,0,0).items[1].review.status,'revise');
 assert.match(review.status,/academic accuracy/);
});
test('Opt-in 50-item checkpoint survives refresh, preserves scored order, and clears on request',()=>{
 const storage=new Map(),localStorage={
  getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)
 };
 const dataset=Array.from({length:50},(_,i)=>({id:'q'+i,question:'Calculate value '+i,answer:'A',options:['A','B','C','D'],mode:'choice',focus:i%10+1,explanation:'Reasoning',sourceStatus:'Practice'}));
 const mocks=()=>({
  EBDAA_QUESTION_FACTORY:{all(){return dataset.slice()}},
  EBDA_MASTERY:{begin(){},record(){},map(){return''},weakest(){return{id:1}},prioritizeUpcoming(g,u,i,x){return x.slice().reverse()}},
  EBDAA_GAME:{render(){return''},resetLesson(){}},
  NTSS_APPLIED:{reset(){},render(){return''}},
  NTSS_JOURNEY:{panel(){return'<details></details>'}},
  EBDAA_CONTEXT_GAMES:{reset(){},ai(){return''},report(){return''}},
  EBDA_MISTAKES:{clear(){},html(){return''}},
  EBDAA_DATA:{sessions:[{unit:1,title:'AI programming'}]},
  NTSS_LEARNING:{reset(){},record(){},decorate(){}},
  NTSS_ASSESSMENT:{questionView(q){return '<h3 class="practice-question">'+q.question+'</h3>'},visual(){return ''}},
  EBDA_APP_RENDER(){}
 });
 const a=load('practice-workshop.js',mocks(),{localStorage}).EBDAA_PRACTICE;
 a.begin(1,0,0);
 assert.equal(a.hasCheckpoint(),false,'No automatic persistence without consent');
 for(let k=0;k<12;k++){a.answer(a.currentQuestion().answer);a.check();a.next()}
 const before={progress:a.progress(),order:a.questionOrder()};
 assert.equal(a.saveCheckpoint(),true);
 const b=load('practice-workshop.js',mocks(),{localStorage}).EBDAA_PRACTICE;
 assert.equal(b.resumeCheckpoint(),true);
 assert.equal(b.progress().position,before.progress.position);
 assert.equal(b.progress().answered,before.progress.answered);
 assert.equal(JSON.stringify(b.questionOrder()),JSON.stringify(before.order));
 b.clearCheckpoint();
 assert.equal(b.hasCheckpoint(),false);
});
test('Offline support does not cache foreign CDN code, and teacher preview is labeled honestly',()=>{
 const sw=read('sw.js'),app=read('app-main.js'),page=read('index.html');
 assert.match(sw,/url\.origin\s*!==\s*self\.location\.origin/);
 assert.match(sw,/if\(url\.origin!==self\.location\.origin/,"Service Worker must block off-origin requests");
 assert.doesNotMatch(sw,/cdn\.jsdelivr\.net/);
 assert.match(app,/Public teacher preview/);
 assert.match(app,/not an authenticated teacher account/);
 assert.match(page,/question-bank-audit\.js/);
 assert.match(page,/learning-journey\.js/);
 assert.match(page,/offline-support\.js/);
 assert.match(read('offline-support.js'),/127\.0\.0\.1/);
 assert.match(read('learning-browser-qa.cjs'),/setOffline\(true\)/);
 assert.match(read('learning-browser-qa.cjs'),/failure\.json/);
});
