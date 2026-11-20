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
console.log("Assessment QA passed: syntax, all 116 lessons, 50-question contract, six layouts, multi-case coding, recovery and resume.");
