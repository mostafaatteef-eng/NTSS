import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const read=(name)=>readFileSync(name,"utf8");
const win={};
const curriculum=[
 "curriculum-data.js","grade-catalog.js","performance-map.js",
 "math-curriculum.js","english-curriculum.js","physics-curriculum.js",
 "arabic-curriculum.js","german-curriculum.js","social-studies-curriculum.js",
 "civics-curriculum.js","economics-curriculum.js","business-english-curriculum.js",
 "arabic-source-questions.js","arabic-grammar-items.js",
 "german-question-data.js","german-audio-dialogues.js","english-grammar-extensions.js"
];
const engines=[
 "assessment-enhancements.js","question-factory.js",
 "math-practice.js","english-practice.js","physics-practice.js",
 "arabic-practice.js","german-practice.js","social-studies-practice.js",
 "civics-practice.js","economics-practice.js","business-english-practice.js"
];
for(const file of [...curriculum,...engines]){
 const source=read(file);
 assert.doesNotThrow(()=>new vm.Script(source,{filename:file}),"Syntax: "+file);
 new Function("window",source)(win);
}
const specs=[
 ["math","EBDAA_MATH_UNITS","EBDAA_MATH_PRACTICE"],
 ["en","EBDAA_ENGLISH_UNITS","EBDAA_ENGLISH_PRACTICE"],
 ["physics","EBDAA_PHYSICS_UNITS","EBDAA_PHYSICS_PRACTICE"],
 ["ar","EBDAA_ARABIC_UNITS","EBDAA_ARABIC_PRACTICE"],
 ["de","EBDAA_GERMAN_UNITS","EBDAA_GERMAN_PRACTICE"],
 ["social","EBDAA_SOCIAL_STUDIES_UNITS","EBDAA_SOCIAL_STUDIES_PRACTICE"],
 ["civics","EBDAA_CIVICS_UNITS","EBDAA_CIVICS_PRACTICE"],
 ["economics","EBDAA_ECONOMICS_UNITS","EBDAA_ECONOMICS_PRACTICE"],
 ["be","EBDAA_BUSINESS_ENGLISH_UNITS","EBDAA_BUSINESS_PRACTICE"]
];
const perSubject={},errors=[];let lessonCount=0,projects=0,graded=0;
for(const [subject,catalog,engine] of specs){
 perSubject[subject]=0;
 for(let grade=1;grade<=3;grade++){
  for(const [unitIndex,unit] of (win[catalog]?.[grade]||[]).entries()){
   for(let index=0;index<(unit.sessions||[]).length;index++){
    const context=[subject,grade,unitIndex,index].join(":");
    lessonCount++;perSubject[subject]++;
    if(subject==="be"&&unit.sessions[index]?.kind==="project"){projects++;continue}
    try{
     const questions=win[engine].build(grade,unitIndex,index);
     assert.equal(questions.length,50,"Question count: "+context);
     for(const [number,q]of questions.entries()){
      assert.ok(String(q.question??q.prompt??q.stem??"").trim(),"Question text: "+context+" / "+number);
      assert.ok(q.answer!==undefined&&q.answer!==null,"Answer key: "+context+" / "+number);
      if(Array.isArray(q.options)&&q.options.length>0)assert.ok(q.options.length>=2,"Answer options: "+context+" / "+number);
     }
     graded++;
    }catch(err){errors.push({context,error:String(err)})}
   }
  }
 }
}
const aiCounts=[];
for(const grade of win.EBDAA_GRADES.grades){
 const units=grade.id===1
  ?win.EBDAA_DATA.names.map((title,u)=>({sessions:win.EBDAA_DATA.sessions.filter(s=>s.unit===u+1)}))
  :grade.subjects[0].units;
 for(const [u,unit] of units.entries())for(let i=0;i<unit.sessions.length;i++){
  const context=["ai",grade.id,u,i].join(":");
  lessonCount++;graded++;
  try{
   const questions=win.EBDAA_QUESTION_FACTORY.all(grade.id,u,i);
   assert.equal(questions.length,50,"AI question count: "+context);
   assert.equal(new Set(questions.map(q=>q.id)).size,50,"AI question IDs: "+context);
  }catch(err){errors.push({context,error:String(err)})}
  aiCounts[grade.id]=(aiCounts[grade.id]||0)+1;
 }
}
assert.deepEqual(errors,[],"Broken lesson banks: "+JSON.stringify(errors.slice(0,15)));
assert.equal(lessonCount,586,"Expected indexed lesson/activity total");
assert.equal(projects,8,"Business English projects require teacher review, not automatic grading");
assert.equal(graded,578,"Graded 50-item assessments");
assert.equal(aiCounts[1]+aiCounts[2]+aiCounts[3],116);
console.log(JSON.stringify({result:"PASS",lessons:lessonCount,assessments:graded,ungradedProjects:projects,ai:aiCounts.slice(1),subjects:perSubject}));
