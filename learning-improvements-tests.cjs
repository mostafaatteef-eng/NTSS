'use strict';
/* NTSS automated formative-learning regression tests. No external packages. */
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const read=name=>fs.readFileSync(name,'utf8');
function moduleFrom(file,stubs={}){
 const window={EBDA_APP_RENDER(){},...stubs};
 vm.runInNewContext(read(file),{window,document:{getElementById(){return null},querySelector(){return null}}},{filename:file});
 return window;
}
test('Every modified lesson engine parses and records first attempts',()=>{
 const engines=['practice-workshop.js','math-practice.js','english-practice.js','arabic-practice.js','german-practice.js','physics-practice.js','business-english-practice.js','economics-practice.js','civics-practice.js','social-studies-practice.js'];
 for(const path of engines){assert.doesNotThrow(()=>new vm.Script(read(path)),path);assert.match(read(path),/NTSS_LEARNING\?\.record/)}
 for(const path of ['learning-support.js','learning-concepts.js','app-main.js'])assert.doesNotThrow(()=>new vm.Script(read(path)),path);
});
test('First attempt evidence and weak-skill feedback remain local',()=>{
 const learning=moduleFrom('learning-support.js').NTSS_LEARNING;
 for(let i=0;i<5;i++)learning.record('mathPractice',i,i===0,{question:'Math problem '+i,explanation:'Explain the relevant math rule',focus:'Linear equations'});
 learning.record('mathPractice',0,false,{question:'Duplicate',focus:'Linear equations'});
 assert.equal(learning.report('mathPractice').attempted,5);
 assert.equal(learning.report('mathPractice').correct,1);
 assert.ok(learning.report('mathPractice').weak.length);
 assert.match(learning.adaptiveAdvice('mathPractice',5),/Suggested review/);
 assert.match(learning.review('mathPractice',3),/Explain the relevant math rule/);
 learning.reset('mathPractice');
 assert.equal(learning.report('mathPractice').attempted,0);
 const source=read('learning-support.js')+read('learning-concepts.js');
 assert.doesNotMatch(source,/\b(?:localStorage|sessionStorage|indexedDB|XMLHttpRequest)\b/);
});
test('Concept visualizations calculate correct physics, math, economics and language examples',()=>{
 const viz=moduleFrom('learning-concepts.js').NTSS_CONCEPTS;
 const expectations=[
 ['physicsPractice',"Ohm's Law",'ohm'],
 ['physicsPractice','Motion and Its Types','motion'],
 ['mathPractice','Linear Functions','linear'],
 ['mathPractice','Statistics and Mean','mean'],
 ['economicsPractice','الطلب','demand'],
 ['learn','Data Analysis and Statistics','data'],
 ['arabicPractice','الجملة الاسمية','arabic-nominal'],
 ['arabicPractice','كان وأخواتها','arabic-kan'],
 ['arabicPractice','إن وأخواتها','arabic-inna'],
 ['englishPractice','Past Perfect in Context','english-past']
 ];
 for(const [mode,title,kind] of expectations){assert.equal(viz.type(mode,title),kind,title);assert.ok(viz.visualization(kind,3).visual.length>50)}
 assert.match(viz.visualization('ohm',4).result,/2\.0 A/);
 assert.match(viz.visualization('mean',3).result,/8\.6/);
 assert.match(viz.visualization('arabic-kan',3).result,/اسم كان مرفوع/);
 assert.equal(viz.type('physicsPractice','Completely unrelated lesson'),null);
 assert.match(read('learning-concepts.js'),/ntss-viz-display/);
});
test('Adaptive AI sprint reprioritizes only the next ten unanswered items',()=>{
 const questions=Array.from({length:50},(_,i)=>({id:'q'+i,question:'Question '+i,options:['A','B','C','D'],answer:'A',focus:i%10+1,explanation:'Reasoning',mode:'choice',sourceStatus:'Formative'}));
 let ordered=0;
 const stubs={
 EBDAA_QUESTION_FACTORY:{all(){return questions.slice()}},
 EBDA_MASTERY:{begin(){},record(){},map(){return''},weakest(){return{id:1}},prioritizeUpcoming(g,u,i,arr){ordered++;return arr.slice().sort((a,b)=>b.focus-a.focus)}},
 EBDAA_GAME:{render(){return'<div></div>'},resetLesson(){}},
 NTSS_APPLIED:{reset(){},render(){return''}},
 EBDAA_CONTEXT_GAMES:{reset(){},ai(){return''},report(){return''}},
 EBDA_MISTAKES:{clear(){},html(){return''}},
 EBDAA_DATA:{sessions:[{unit:1,title:'Programming practice'}]},
 NTSS_LEARNING:{reset(){},record(){},decorate(){}}
 };
 const practice=moduleFrom('practice-workshop.js',stubs).EBDAA_PRACTICE;
 practice.begin(1,0,0);
 const before=practice.questionOrder();
 for(let i=0;i<10;i++){
  const q=practice.currentQuestion();
  practice.answer(q.answer);practice.check();practice.next();
 }
 const after=practice.questionOrder();
 assert.equal(practice.progress().position,11);
 assert.equal(practice.progress().answered,10);
 assert.equal(ordered,1,'Exactly one adaptive reorder at a ten-question boundary');
 assert.equal(JSON.stringify(after.slice(0,10)),JSON.stringify(before.slice(0,10)));
 assert.equal(JSON.stringify(after.slice(20)),JSON.stringify(before.slice(20)));
 assert.deepEqual(after.slice(10,20).map(id=>Number(id.slice(1))%10),[9,8,7,6,5,4,3,2,1,0]);
 assert.equal(new Set(after).size,50);
});
test('Production HTML loads new learning modules before app entrypoint',()=>{
 const html=read('index.html');
 const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(x=>x[1]);
 const indexOf=name=>scripts.findIndex(v=>v.startsWith(name));
 for(const name of ['learning-support.js','learning-concepts.js'])assert.ok(indexOf(name)>0&&indexOf(name)<indexOf('app-main.js'),name);
 assert.match(html,/learning-ux\.css/);
 assert.match(read('app-main.js'),/NTSS_LEARNING\?\.decorate\(app,mode\)/);
});
