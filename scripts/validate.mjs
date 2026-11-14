import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const paths=["index.html","curriculum-data.js","grade-catalog.js","experiments.js","challenge.js","advanced-labs.js","microgames.js","missions-data.js","performance-map.js","session-guides.js","lab-specialists.js","numeric-challenges.js","question-factory.js","mastery-engine.js","mistake-review.js","practice-workshop.js","case-labs.js","scenario-labs.js","practical-rubrics.js","visual-playground.js","code-challenges.js","concept-visualizer.js","theory-studio.js","lab-studio.js"];
for(const name of paths)assert.ok(fs.existsSync(name),name+" must exist");
const html=fs.readFileSync("index.html","utf8");
const scripts=paths.slice(1).map(x=>fs.readFileSync(x,"utf8"));
const inline=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline,"inline app script missing");
for(const src of [...scripts,inline])new vm.Script(src);
const content={innerHTML:""};const practiceStage={innerHTML:""};const dataPlayground={innerHTML:""};const rubricProgress={innerHTML:""};
const buttons=["home","browse","missions","about"].map(x=>({dataset:{nav:x},addEventListener(){},classList:{toggle(){}}}));
const context={window:{},document:{querySelector:()=>content,querySelectorAll:()=>buttons,getElementById:(id)=>id==="ebdaa-practice-stage"?practiceStage:id==="data-playground"?dataPlayground:id==="rubric-progress"?rubricProgress:null},scrollTo(){}};
vm.createContext(context);
for(const src of scripts)vm.runInContext(src,context);
vm.runInContext(inline,context);
assert.ok(html.includes("<title>EBDA Learning"));
assert.ok(html.includes("EBDA NATIONAL TECHNICAL SCIENCE SCHOOLS"));
assert.ok(!html.includes("EBDAA NATIONAL TECHNICAL SCIENCE SCHOOLS"),"Outdated public spelling");
assert.ok(html.includes('id="lesson-search"'));
assert.ok(html.includes('class="skip-link"'));
assert.ok(html.includes("prefers-reduced-motion"));
assert.ok(/href="ebda-ui\.css(?:\?[^"]*)?"/.test(html),"Minimal design CSS not linked");
assert.ok(fs.existsSync("ebda-ui.css"),"Design stylesheet absent");
assert.ok(fs.readFileSync("ebda-ui.css","utf8").includes(".lab-module"),"Accessible lab stages missing styles");
assert.ok(!content.innerHTML.includes("FOUR WAYS TO LEARN"));
assert.ok(!content.innerHTML.includes("Explore. Experiment. Improve."));
assert.ok(!html.includes('class="feature-tile"'));
assert.ok(!html.includes(".feature-highlights"));
assert.ok(content.innerHTML.includes('id="lesson-search"'));
assert.ok(content.innerHTML.includes("Choose your academic year"));
vm.runInContext("setLessonSearch('Python')",context);
assert.ok(vm.runInContext("searchCards()",context).includes("search-result"),"Cross-grade search returned no lessons");
vm.runInContext("searchOpen(2,0,0)",context);
assert.ok(content.innerHTML.includes("lab-journey"),"Search did not route to practical learning");
assert.ok(content.innerHTML.includes("lab-stage-status"),"Current stage indicator missing");
assert.ok(content.innerHTML.includes("Continue to Experiment"),"Direct next-stage button missing");
assert.ok(content.innerHTML.includes("theory-spark"),"Focused Discover prompt absent");
assert.ok(!content.innerHTML.includes("theory-path"),"Old full three-card pathway remains");
assert.ok(!content.innerHTML.includes("PRACTICAL BRIEF"),"Removed practical brief reappeared");
assert.equal((content.innerHTML.match(/class="lab-module"/g)||[]).length,5,"Lab must have five progressively disclosed stages");
assert.equal((content.innerHTML.match(/class="lab-module"[^>]* open/g)||[]).length,1,"Only one lab stage should start open");
const data=context.window.EBDAA_DATA;
assert.equal(data.names.length,6);
const grades=context.window.EBDAA_GRADES.grades;
assert.deepEqual(Array.from(grades.map(g=>g.id)),[1,2,3]);
assert.equal(grades[0].subjects.length,1);
assert.equal(grades[1].subjects[0].units.length,6);
assert.equal(grades[1].subjects[0].units.reduce((n,u)=>n+u.sessions.length,0),41);
assert.equal(grades[2].subjects.length,1);
assert.equal(grades[2].subjects[0].units.length,6);
assert.equal(grades[2].subjects[0].units.reduce((n,u)=>n+u.sessions.length,0),36);
vm.runInContext("chooseGrade(2);chooseSubject();chooseGradeUnit(0)",context);
assert.ok(content.innerHTML.includes("HANDs-ON LAB")||content.innerHTML.includes("HANDS-ON LAB"));
vm.runInContext("chooseGrade(3)",context);
assert.ok(content.innerHTML.includes("Applied Machine Learning and Analytics"));
vm.runInContext("chooseSubject();chooseGradeUnit(5)",context);
assert.ok(content.innerHTML.includes("Agriculture and Environmental Monitoring"));
assert.ok(content.innerHTML.includes("HANDS-ON LAB"));
vm.runInContext("chooseGrade(1);chooseSubject()",context);
assert.ok(content.innerHTML.includes("Introduction to Programming"));
assert.equal(data.sessions.length,39);
assert.equal(new Set(data.sessions.map(s=>s.id)).size,39);
assert.equal(new Set(data.sessions.map(s=>s.question)).size,39);
assert.equal(context.window.EBDAA_LAB_CONFIG.length,39);
for(const s of data.sessions){
  assert.ok(s.title && s.topic && s.explanation,"Missing content for "+s.id);
  assert.equal(s.options.length,4);
  assert.ok(Number.isInteger(s.answer)&&s.answer>=0&&s.answer<4);
  assert.ok(s.options.every(x=>typeof x==="string"&&x.trim()));
  context.openUnit(s.unit);
  context.choose(s.id);
  context.chooseAnswer(s.answer);
  context.verify();
  assert.ok(content.innerHTML.includes("feedback"),"Diagnostic feedback: "+s.id);
  context.next();
  context.setLab(4);
  assert.ok(content.innerHTML.includes('type="range"'),"Experiment: "+s.id);
  context.next();
  context.next();
  const q=vm.runInContext("currentChallenge()",context);
  assert.equal(q.options.length,4);
  context.chooseAnswer(q.answer);
  context.verify();
  assert.ok(content.innerHTML.includes("feedback"),"Application feedback: "+s.id);
  assert.ok(!content.innerHTML.includes("GUIDED PRACTICE"),"Year 1 question sequence should follow the existing lesson stages");
  context.next();
  assert.ok(content.innerHTML.includes("GUIDED PRACTICE"),"Year 1 fifth learning stage missing");
  assert.ok(content.innerHTML.includes("QUESTION 1 / 50"),"Year 1 first question not displayed immediately");
  context.back();
  assert.ok(content.innerHTML.includes("feedback"),"Stage review lost earlier checked answer");
  context.next();
  assert.ok(content.innerHTML.includes("GUIDED PRACTICE"),"Returning from reviewed stage should not require a new answer");
  assert.ok(!content.innerHTML.includes("Begin 50-question workshop"),"Standalone workshop remains");

}
const academic=context.window.EBDAA_PERFORMANCE;
assert.equal(Object.keys(academic).length,12);
assert.equal(Object.keys(context.window.EBDAA_SESSION_GUIDES).length,77);
let completedLabs=0;
for(const year of [2,3]){
 for(let unit=0;unit<6;unit++){
  vm.runInContext("chooseGrade("+year+");chooseSubject();chooseGradeUnit("+unit+")",context);
  const sessions=grades[year-1].subjects[0].units[unit].sessions;
  for(let i=0;i<sessions.length;i++){
   vm.runInContext("openAdvancedSession("+i+")",context);
   assert.ok(content.innerHTML.includes("EMBEDDED FORMATIVE CHALLENGE"),year+"-"+unit+"-"+i);
   assert.ok(content.innerHTML.includes("EVIDENCE CHECK"),"Missing numerical assessment");
   const numeric=context.window.EBDAA_NUMERIC(year,unit,i,(i%5)+3);
   assert.ok(Number.isFinite(numeric.answer));
   assert.ok(content.innerHTML.includes("Performance Indicators"),year+"-"+unit+"-"+i);
   assert.ok(content.innerHTML.includes("lab-journey"),"Learning journey missing");
   assert.ok(content.innerHTML.includes("theory-spark"),"Missing student prediction prompt");
   assert.ok(content.innerHTML.includes("theory-more"),"Optional guidance missing");
   assert.ok(!content.innerHTML.includes("theory-path"),"Duplicate path remains visible");
   assert.ok(!content.innerHTML.includes("PRACTICAL BRIEF"),"Removed practical brief reappeared");
   assert.ok(!content.innerHTML.includes("Your learning mission"),"Removed heading reappeared");
   assert.ok(!content.innerHTML.includes("task-progress"),"Removed checklist meter reappeared");
   assert.ok(content.innerHTML.includes("Save my lab evidence"),"Missing local evidence export");
   assert.ok(content.innerHTML.includes("VISUAL DATA PLAYGROUND"),"Missing visual playground");
   assert.ok(content.innerHTML.includes("INTERACTIVE CONCEPT VISUALIZER"),"Missing computed visualizer");
   if(context.window.EBDA_CODE_TESTS.task(year,unit,i))assert.ok(content.innerHTML.includes("EXECUTABLE CODE CHALLENGE"),"Missing executable code test panel");
   assert.ok(content.innerHTML.includes("PRACTICAL RUBRIC"),"Missing practical rubric");
   assert.ok(content.innerHTML.includes("GUIDED PRACTICE"),"No integrated question sequence");
   assert.ok(content.innerHTML.includes("QUESTION 1 / 50"),"First advanced lab question should be immediately visible");
   assert.ok(!content.innerHTML.includes("Begin 50-question workshop"),"No standalone workshop should remain");
   const family=academic[year+"-"+(unit+1)].engine;
   assert.ok(content.innerHTML.includes(family==="python"||family==="sql"?"studio-editor":"studio-slider"),"Missing lab for "+year+"-"+unit+"-"+i);
   const m=context.window.EBDAA_MISSIONS.find(x=>x.g===year&&x.u===unit);
   const correct=m.steps[i%m.steps.length][2];
   vm.runInContext("window.EBDAA_STUDIO.pick("+correct+");window.EBDAA_STUDIO.check()",context);
   assert.ok(content.innerHTML.includes("Correct"),"No immediate feedback");
   completedLabs++;
  }
 }
}
assert.equal(completedLabs,77);
assert.ok(!html.includes('data-nav="missions"'),"Challenge must be integrated, not a standalone menu");
assert.ok(!html.includes("Practice workshop: 50 adaptive-numbered exercises"),"Old separate question card text remains");
// Test real browser-local adaptation, computed data operations and rubric separation.
const mastery=context.window.EBDA_MASTERY;
mastery.begin(2,0,0);
const qForMastery=context.window.EBDAA_QUESTION_FACTORY.all(2,0,0);
mastery.record(2,0,0,qForMastery[0],false,true);
mastery.record(2,0,0,qForMastery[1],true,false);
assert.equal(mastery.snapshot(2,0,0).seen,2);
assert.equal(mastery.prioritizeUpcoming(2,0,0,[qForMastery[1],qForMastery[0]])[0].focus,qForMastery[0].focus);
const playground=context.window.EBDA_PLAYGROUND;
assert.equal(playground.snapshot(2,3,0).length,6);
assert.ok(playground.snapshot(2,3,0).some(x=>x.sensor===null));
assert.ok(html.includes(".lab-workspace__editor"),"Shared code-editor design tokens missing");
vm.runInContext("window.EBDA_PLAYGROUND.panel(2,3,1);window.EBDA_PLAYGROUND.change('site','Damietta')",context);
assert.equal(playground.verify(),true,"Missing data mission");
vm.runInContext("window.EBDA_PLAYGROUND.change('challenge','clean');window.EBDA_PLAYGROUND.change('site','All');window.EBDA_PLAYGROUND.change('op','impute')",context);
assert.equal(playground.verify(),true,"Imputation mission");
vm.runInContext("window.EBDA_PLAYGROUND.change('challenge','high');window.EBDA_PLAYGROUND.change('op','filter');window.EBDA_PLAYGROUND.change('threshold',20)",context);
assert.equal(playground.verify(),true,"Sensor threshold mission");
vm.runInContext("chooseGrade(2);chooseSubject();chooseGradeUnit(0);openAdvancedSession(0)",context);
assert.ok(content.innerHTML.includes("lab-workspace__editor"),"Code editor not rendered");
vm.runInContext("window.EBDA_PLAYGROUND.panel(2,3,0);window.EBDA_PLAYGROUND.change('op','impute')",context);
assert.ok(playground.snapshot(2,3,0).every(x=>x.sensor!==null));
vm.runInContext("window.EBDA_PLAYGROUND.change('op','normalize')",context);
assert.ok(playground.snapshot(2,3,0).every(x=>x.sensor===null||(x.sensor>=0&&x.sensor<=1)));
const rubric=context.window.EBDA_RUBRIC;
assert.equal(rubric.score(2,0,0).earned,0);
rubric.recordEvidence(2,0,0,true);
assert.equal(rubric.score(2,0,0).earned,35);
rubric.observe(2,0,0,{success:true,hasEvidence:true,output:"mean: 7.25"});
assert.equal(rubric.score(2,0,0).earned,65);
assert.equal(rubric.score(2,0,0).automatedPossible,65);
assert.equal(rubric.score(2,0,0).checks.filter(c=>c.mode!=="automatic"&&c.passed).length,0);
assert.equal(context.window.EBDA_MASTERY.names(2,0)[0],"Order of operations");
assert.ok(context.window.EBDA_PLAYGROUND.panel(2,3,0).includes("Download CSV"));

// Required: exactly 50 non-duplicate, deterministically keyed practice items per lesson.
let practiceCount=0,lessonCount=0,formatCounts={};
for(const grade of [1,2,3]){
 for(let unit=0;unit<6;unit++){
  const arr=grade===1?data.sessions.filter(s=>s.unit===unit+1):grades[grade-1].subjects[0].units[unit].sessions;
  for(let session=0;session<arr.length;session++){
   const bank=context.window.EBDAA_QUESTION_FACTORY.all(grade,unit,session);
   assert.equal(bank.length,50,"Bank size "+grade+"/"+unit+"/"+session);
   assert.equal(new Set(bank.map(q=>q.question)).size,50,"Duplicate prompts "+grade+"/"+unit+"/"+session);
   for(const question of bank){
    assert.ok(question.explanation.length>10);
    formatCounts[question.mode]=(formatCounts[question.mode]||0)+1;
    assert.ok(["choice","number","truefalse","order"].includes(question.mode));
    if(question.mode==="choice"){
      assert.equal(question.options.length,4);
      assert.ok(question.options.includes(String(question.answer)));
    }
    if(question.mode==="order"){
      assert.equal(question.options.length,4);
      assert.equal(question.answer.split("|").length,4);
    }
    if(question.mode==="number")assert.ok(Number.isFinite(Number(question.answer)));
    if(question.mode==="truefalse")assert.equal(typeof question.answer,"boolean");
   }
   lessonCount++;practiceCount+=bank.length;
  }
 }
}
assert.equal(lessonCount,116);
assert.equal(practiceCount,5800);
assert.equal(formatCounts.order,580);
assert.equal(formatCounts.truefalse,1160);

// Evidence-driven educational story checks.
assert.equal(Object.keys(context.window.EBDAA_STORIES.storyNames).length,18);
assert.equal(context.window.EBDAA_CASE.clues.length,4);
assert.equal(context.window.EBDAA_CASE.tables.machines.length,3);
assert.equal(context.window.EBDAA_CASE.tables.inspections.reduce((n,r)=>n+(r.machine_id===1?r.defects:0),0),7);
vm.runInContext("chooseGrade(2);chooseSubject();chooseGradeUnit(1);openAdvancedSession(0)",context);
assert.ok(content.innerHTML.includes("INDUSTRIAL SQL MYSTERY"));
assert.ok(content.innerHTML.includes("UNIT CASEFILE"));
assert.ok(content.innerHTML.includes("50 QUESTIONS"));
// Shuffle at the beginning of an attempt and preserve the resulting order throughout.
vm.runInContext("chooseGrade(2);chooseSubject();chooseGradeUnit(0);openAdvancedSession(0)",context);
const practice=context.window.EBDAA_PRACTICE;
const originalBank=context.window.EBDAA_QUESTION_FACTORY.all(2,0,0);
practice.begin(2,0,0);
const firstQuestion=practice.currentQuestion();
practice.next();
assert.equal(practice.currentQuestion().id,firstQuestion.id,"Unanswered question must not be skippable");
if(firstQuestion.mode==="order")for(const step of firstQuestion.answer.split("|"))practice.chooseOrder(step);
else practice.answer(firstQuestion.answer);
practice.showHint();
practice.check();
practice.next();
practice.prev();
assert.ok(practiceStage.innerHTML.includes("QUESTION 1 / 50"),"Review did not restore first question");
assert.ok(practiceStage.innerHTML.includes("Thinking hint"),"Question hint disappeared on review");
assert.ok(practiceStage.innerHTML.includes("Correct!"),"Graded response feedback disappeared on review");
practice.begin(2,0,0);
const attemptOne=Array.from(practice.questionOrder());
assert.equal(attemptOne.length,50);
assert.equal(new Set(attemptOne).size,50);
assert.deepEqual(attemptOne.slice().sort(),originalBank.map(q=>q.id).sort());
for(let i=0;i<10;i++){
 const question=practice.currentQuestion();
 assert.equal(question.id,attemptOne[i],"Question order changed mid-attempt");
 if(question.mode==="order"){
   for(const value of question.answer.split("|"))practice.chooseOrder(value);
 }else practice.answer(question.answer);
 practice.check();
 practice.next();
}
assert.ok(practiceStage.innerHTML.includes("QUESTION 11 / 50"),"Practice must advance directly from Q10 to Q11");
assert.ok(practiceStage.innerHTML.includes("practice-milestone"),"Skill reflection should be optional");
assert.ok(practiceStage.innerHTML.includes("SKILL MASTERY MAP"));
assert.ok(practiceStage.innerHTML.includes("Order of operations"));
assert.equal(practice.currentQuestion().id,attemptOne[10]);
assert.deepEqual(Array.from(practice.questionOrder()),attemptOne,"Question order changed during uninterrupted practice");
practice.begin(2,0,0);
const attemptTwo=Array.from(practice.questionOrder());
assert.equal(attemptTwo.length,50);
assert.deepEqual(attemptTwo.slice().sort(),attemptOne.slice().sort());
assert.notDeepEqual(attemptTwo,attemptOne,"A new attempt repeated the previous question order");
// Validate four added learning mechanisms.
const codeTest=context.window.EBDA_CODE_TESTS;
assert.equal(codeTest.task(2,0,0).tests.length,3);
assert.equal(codeTest.task(2,1,0).cases.length,2);
assert.ok(codeTest.pythonScript(codeTest.task(2,0,0).starter,codeTest.task(2,0,0)).includes("TEST 3"));
const visualizer=context.window.EBDA_VISUALIZER;
assert.equal(visualizer.family(2,1),"join");
assert.equal(visualizer.family(2,0),"loop");
assert.equal(visualizer.family(3,0),"stats");
assert.ok(visualizer.panel(2,1,0).includes("INNER JOIN matches keys"));
assert.ok(context.window.EBDAA_STORIES.panel(2,1,1).includes("UNIT CASEFILE"),"Mission should continue across unit sessions");
const coach=context.window.EBDA_MISTAKES;
assert.ok(coach.html(1,0,0,context.window.EBDAA_QUESTION_FACTORY.all(1,0,0)[0]).includes("SMART MISTAKE REVIEW"));
const missions=context.window.EBDAA_MISSIONS;
assert.equal(missions.length,18);
assert.equal(missions.reduce((n,m)=>n+m.steps.length,0),54);
assert.equal(new Set(missions.map(m=>m.id)).size,18);
for(const m of missions){
 assert.equal(m.steps.length,3);
 assert.ok(m.g>=1&&m.g<=3&&m.u>=0&&m.u<6);
 for(const step of m.steps){
  assert.equal(step[1].length,4);
  assert.ok(Number.isInteger(step[2])&&step[2]>=0&&step[2]<4);
  assert.ok(step[3].length>10);
 }
}
context.nav("about");
assert.ok(content.innerHTML.includes("No student registration"));
assert.ok(!html.includes("localStorage."),"Do not persist student answers");
console.log("PASS: 5800 generated exercises in 116 lesson banks; three-grade navigation, 41 Year-2 and 36 Year-3 session listings, 39 Year-1 learning flows, 77 integrated Year-2/3 lab sessions, 18 embedded unit challenge banks, script syntax, no student data.");
