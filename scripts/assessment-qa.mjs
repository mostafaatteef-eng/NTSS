import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const read=name=>readFileSync(name,"utf8");
for(const file of ["assessment-enhancements.js","question-factory.js","practice-workshop.js","mistake-review.js","python-lab-worker.js","sql-lab-worker.js","app-main.js"]){
 assert.doesNotThrow(()=>new vm.Script(read(file),{filename:file}),file+" syntax");
}
const win={};
for(const file of ["grade-catalog.js","curriculum-data.js","performance-map.js","assessment-enhancements.js","question-factory.js"]){
 new Function("window",read(file))(win);
}
let lessons=0;
for(const g of win.EBDAA_GRADES.grades){
 const units=g.id===1?win.EBDAA_DATA.names.map((title,u)=>({title,sessions:win.EBDAA_DATA.sessions.filter(s=>s.unit===u+1)})):g.subjects[0].units;
 for(let u=0;u<units.length;u++)for(let i=0;i<units[u].sessions.length;i++){
  lessons++;
  const bank=win.EBDAA_QUESTION_FACTORY.all(g.id,u,i);
  assert.equal(bank.length,50,"50 questions at "+[g.id,u,i]);
  assert.equal(new Set(bank.map(q=>q.id)).size,50,"Unique IDs at "+[g.id,u,i]);
  const count=mode=>bank.filter(q=>q.mode===mode).length;
  assert.equal(count("live-code"),5);assert.equal(count("visual-data"),10);assert.equal(count("order"),5);
  for(const q of bank){
   if(q.mode==="visual-data"){
    assert.ok(q.options.includes(q.answer),"Correct visual answer");
    assert.equal(new Set(q.options).size,4,"Distinct visual distractors");
    assert.ok(!win.NTSS_ASSESSMENT.visual(q).includes("Above "+q.visual.threshold+"?"),"No answer table leak");
   }
   if(q.mode==="live-code")assert.ok(q.engine==="sql"?q.codeTask.second:q.codeTask.tests.length>=3);
  }
  const layouts=new Set(bank.map((q,j)=>win.NTSS_ASSESSMENT.questionView(q,j).match(/ntss-question-layout--([a-z]+)/)?.[1]));
  assert.equal(layouts.size,6);
 }
}
assert.equal(lessons,116);
assert.ok(read("practice-workshop.js").includes("saveCheckpoint()}"),"Automatic progress save");
assert.ok(read("practice-workshop.js").includes("codeDrafts"),"Draft resume");
assert.ok(read("mistake-review.js").includes('x.question!==q.question'),"Different recovery prompt");
assert.ok(read("index.html").includes("assessment-enhancements.js"),"Assessment loaded");
// Full assessment state-machine regression: saved draft, scored progress, all 50 questions and a named certificate.
{
 const memory=new Map(),local={
  getItem:key=>memory.get(key)||null,
  setItem:(key,value)=>memory.set(key,value),
  removeItem:key=>memory.delete(key)
 };
 const visualOutput={textContent:""};
 const barFlags=Array(4).fill(false);
 const mockBars=barFlags.map((_,index)=>({classList:{toggle(name,value){if(name==="is-high")barFlags[index]=value}}}));
 const mockChart={
  querySelector(selector){return selector===".ntss-probe-label output"?visualOutput:null},
  querySelectorAll(selector){return selector===".ntss-chart-bar"?mockBars:[]}
 };
 const mockDocument={
  getElementById:()=>null,
  querySelector(selector){return selector===".ntss-data-card"?mockChart:null}
 };
 const site={
  EBDA_APP_RENDER(){},NTSS_ORIGINAL_LOGO:"",
  EBDAA_GAME:{resetLesson(){},render(){return ""}},
  NTSS_LEARNING:{reset(){},record(){},decorate(){}},
  NTSS_APPLIED:{reset(){}},EBDAA_CONTEXT_GAMES:{reset(){}},
  addEventListener(){}
 };
 for(const path of ["grade-catalog.js","curriculum-data.js","performance-map.js","assessment-enhancements.js","question-factory.js","mastery-engine.js","mistake-review.js","lesson-completion.js","practice-workshop.js"]){
  new Function("window","document","localStorage","setTimeout","clearTimeout",read(path))(site,mockDocument,local,fn=>{if(typeof fn==="function")fn();return 1},()=>{});
 }
 const practice=site.EBDAA_PRACTICE;
 site.EBDA_COMPLETION.setName("ai:1:0:0","QA Student");
 practice.begin(1,0,0);
 const first=practice.currentQuestion();
 const firstAnswer=first.mode==="order"?first.answer.split("|"):first.mode==="live-code"?"pass":first.answer;
 practice.answer(firstAnswer);
 assert.equal(practice.hasCheckpoint(),true,"Ungraded answer must be saved");
 practice.reset();
 assert.equal(practice.resumeCheckpoint(),true,"Resume ungraded question");
 assert.equal(practice.progress().answered,0);
 site.EBDA_COMPLETION.setName("ai:1:0:0","QA Student");
 site.EBDA_COMPLETION.open("ai:1:0:0");
 for(let n=0;n<50;n++){
  const item=practice.currentQuestion();
  const answer=item.mode==="order"?item.answer.split("|"):item.mode==="live-code"?"pass":item.answer;
  practice.answer(answer);
  practice.check();
  assert.equal(practice.progress().answered,n+1,"Question progress at "+n);
  practice.next();
 }
 assert.equal(practice.isFinished(),true);
 assert.equal(practice.hasCheckpoint(),false,"Completed assessment clears saved draft");
 const certificate=site.EBDA_COMPLETION.render({subject:"ai",grade:1,unit:0,index:0,lesson:"QA Lesson",correct:50,total:50});
 assert.ok(certificate.includes("QA Student")&&certificate.includes('id="ebda-certificate-sheet"'));
 // Regression: native slider DOM must stay mounted while its bar state updates.
 practice.begin(1,0,0);
 let displayed=null;
 for(let step=0;step<50;step++){
  const current=practice.currentQuestion();
  if(current.mode==="visual-data"&&current.display==="bars"){displayed=current;break}
  practice.answer(current.mode==="order"?current.answer.split("|"):current.mode==="live-code"?"pass":current.answer);
  practice.check();
  practice.next();
 }
 assert.ok(displayed,"A bar-chart question must exist in the question bank");
 const originalBars=mockChart.querySelectorAll(".ntss-chart-bar");
 practice.probe(17);
 assert.equal(visualOutput.textContent,"17");
 assert.deepEqual(barFlags,displayed.visual.readings.map(v=>v>17));
 assert.equal(mockChart.querySelectorAll(".ntss-chart-bar"),originalBars,"Chart DOM is not rebuilt");

}
console.log("Assessment QA passed: syntax, all 116 lessons, 50-question contract, six layouts, multi-case coding, recovery and resume.");
