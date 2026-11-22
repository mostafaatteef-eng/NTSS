import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const read=path=>readFileSync(path,"utf8");
const win={};
for(const file of ["data-analysis-curriculum.js","unified-practice.js","data-analysis-practice.js","lesson-completion.js"]){
 const source=read(file);
 assert.doesNotThrow(()=>new vm.Script(source,{filename:file}));
 new Function("window",source)(win);
}
const numbers=[1,2,3,4,5,6];
for(const grade of [1,2,3]){
 const units=win.EBDAA_DATA_ANALYSIS_UNITS[grade];
 assert.equal(units.length,1,"Exactly one source collection unit");
 assert.deepEqual(units[0].sessions.map(x=>x.number),grade===3?[1,2,3,4,5]:numbers,"Grade-specific source lesson order");
 for(let index=0;index<(grade===3?5:6);index++){
  const lesson=units[0].sessions[index];
  assert.ok(lesson.title&&lesson.source&&lesson.slides,"Source metadata must be present");
  const bank=win.EBDAA_DATA_ANALYSIS_PRACTICE.build(grade,0,index);
  assert.equal(bank.length,50);
  assert.equal(bank.filter(q=>q.mode==="choice").length,40);
  assert.equal(bank.filter(q=>q.mode==="number").length,10);
  assert.equal(new Set(bank.map(q=>q.question)).size,50,"Questions should have unique presentation text");
  bank.forEach((q,k)=>{
   assert.ok(q.explanation&&q.sourceStatus,"Question needs explanation and source status");
   if(q.mode==="choice"){
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options).size,4,"No duplicate options");
    assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
    assert.equal(typeof q.options[q.answer],"string");
   }else assert.ok(Number.isFinite(q.answer),"Numerical answers must be finite");
  });
  const subjectKey=["da",grade,0,index].join(":");
  win.EBDA_COMPLETION.setName(subjectKey,"QA Student");
  win.EBDA_COMPLETION.open(subjectKey);
  const pass=win.EBDA_COMPLETION.render({subject:"da",grade,unit:0,index,lesson:lesson.title,correct:35,total:50});
  const fail=win.EBDA_COMPLETION.render({subject:"da",grade,unit:0,index,lesson:lesson.title,correct:34,total:50});
  assert.ok(pass.includes("QA Student")&&pass.includes("Data Analysis")&&pass.includes('id="ebda-certificate-sheet"'));
  assert.ok(!fail.includes('id="ebda-certificate-sheet"'));
 }
}
const index=read("app-main.js");
const lazy=read("lazy-features.js");
assert.ok(index.includes('registerNamedLesson("da"')&&index.includes('dataAnalysisPractice'));
assert.ok(lazy.includes('"data-analysis"')&&lazy.includes("data-analysis-curriculum.js"));
assert.ok(lazy.includes("data-analysis-practice.js"));
console.log("Data Analysis QA PASSED: 17 source-grounded lesson instances, 850 interactive questions, name gates and certificates.");

// Exercise the actual shared engine, not bank shape alone.
await import('./data-analysis-progression-qa.mjs');
