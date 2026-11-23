import {execFileSync} from "node:child_process";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

// Keep release control mandatory in the production verify job too.
execFileSync(process.execPath,["--test","release-control-tests.cjs"],{stdio:"inherit"});

const paths=["index.html","ui-events.js","curriculum-data.js","grade-catalog.js","experiments.js","challenge.js","advanced-labs.js","microgames.js","missions-data.js","performance-map.js","session-guides.js","lab-specialists.js","numeric-challenges.js","question-factory.js","assessment-enhancements.js","mastery-engine.js","mistake-review.js","practice-workshop.js","ntss-original-logo.js","lesson-completion.js","coding-labs.js","question-bank-audit.js","case-labs.js","scenario-labs.js","practical-rubrics.js","visual-playground.js","code-challenges.js","concept-visualizer.js","lesson-puzzles.js","theory-studio.js","lab-studio.js","learning-support.js","learning-concepts.js","applied-missions.js","context-mini-games.js","gamified-questions.js","learning-journey.js","quest-path.js","i18n.js","progress-map.js","lazy-features.js","practice-ui.js","app-main.js"];
for(const name of paths)assert.ok(fs.existsSync(name),name+" must exist");
const html=fs.readFileSync("index.html","utf8");
const scripts=paths.slice(1).map(x=>fs.readFileSync(x,"utf8"));
for(const src of scripts)new vm.Script(src);
const content={innerHTML:"",querySelectorAll:()=>[],insertAdjacentHTML(_position,html){this.innerHTML=html+this.innerHTML}};const practiceStage={innerHTML:""};const dataPlayground={innerHTML:""};const rubricProgress={innerHTML:""};
const buttons=["home","browse","missions","about"].map(x=>({dataset:{nav:x},addEventListener(){},classList:{toggle(){}},getAttribute:()=>"",textContent:""}));
const context={window:{},queueMicrotask(){},setTimeout,clearTimeout,setImmediate,localStorage:(()=>{const m=new Map([["ebda-lang","en"]]);return{getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>{m.set(k,String(v))},removeItem:k=>{m.delete(k)}}})(),document:{documentElement:{lang:"",dir:"",setAttribute(){}},activeElement:null,body:{classList:{toggle(){}}},createElement:()=>({src:"",async:false,onload:null,onerror:null,remove(){}}),head:{appendChild(el){try{vm.runInContext(fs.readFileSync(el.src.split("?")[0],"utf8"),context);el.onload&&el.onload()}catch(e){el.onerror&&el.onerror(e)}return el}},querySelector:(q)=>q==="#app"?content:null,querySelectorAll:()=>buttons,getElementById:(id)=>id==="ebdaa-practice-stage"?practiceStage:id==="data-playground"?dataPlayground:id==="rubric-progress"?rubricProgress:id==="app"?content:null},scrollTo(){}};
vm.createContext(context);
for(const src of scripts)vm.runInContext(src,context);
const i18nSrc=fs.readFileSync("i18n.js","utf8"),appSrc=fs.readFileSync("app-main.js","utf8");
assert.ok(html.includes("<title>EBDA Learning"));
assert.ok(i18nSrc.includes("EBDA NATIONAL TECHNICAL SCIENCE SCHOOLS"),"English school eyebrow missing from i18n strings");
assert.ok(!html.includes("EBDAA NATIONAL TECHNICAL SCIENCE SCHOOLS"),"Outdated public spelling");
assert.ok(content.innerHTML.includes('id="lesson-search"'),"Lesson search template missing from app script");
assert.ok(html.includes('class="skip-link"'));
assert.ok(html.includes("prefers-reduced-motion"));
assert.ok(/href="ebda-ui\.css(?:\?[^"]*)?"/.test(html),"Minimal design CSS not linked");
assert.ok(fs.existsSync("ebda-ui.css"),"Design stylesheet absent");
assert.ok(fs.readFileSync("ebda-ui.css","utf8").includes(".lesson-layout"),"Shared lesson layout styles missing");
assert.ok(fs.readFileSync("ebda-ui.css","utf8").includes(".practice-focus .stepfooter"),"Responsive focus action bar missing");
assert.ok(!content.innerHTML.includes("FOUR WAYS TO LEARN"));
assert.ok(!content.innerHTML.includes("Explore. Experiment. Improve."));
assert.ok(!html.includes('class="feature-tile"'));
assert.ok(!html.includes(".feature-highlights"));
assert.ok(content.innerHTML.includes('id="lesson-search"'));
assert.ok(content.innerHTML.includes("Choose your academic year"));
await vm.runInContext("ensureSearchIndex()",context);
vm.runInContext("setLessonSearch('Python')",context);
assert.ok(vm.runInContext("searchCards()",context).includes("search-result"),"Cross-grade search returned no lessons");
vm.runInContext("window.EBDA_COMPLETION.setName('ai:2:0:0','Test Student')",context);
vm.runInContext("searchOpen(2,0,0)",context);
for(let i=0;i<12;i++)await new Promise(r=>setImmediate(r));
assert.ok(content.innerHTML.includes('class="lesson-layout"'),"Search must open Year 1-style learning layout");
assert.ok(content.innerHTML.includes('class="lesson-steps"'),"Five learning stages missing");
assert.ok(content.innerHTML.includes("Continue →"),"Direct next-stage action missing");
assert.ok(content.innerHTML.includes("theory-spark"),"Focused Discover prompt absent");
assert.ok(!content.innerHTML.includes("lab-module"),"Old accordion layout must not remain");
assert.ok(!content.innerHTML.includes("PRACTICAL BRIEF"),"Removed practical brief reappeared");
const data=context.window.EBDAA_DATA;
assert.equal(data.names.length,6);
const grades=context.window.EBDAA_GRADES.grades;
assert.deepEqual(Array.from(grades.map(g=>g.id)),[1,2,3]);
assert.equal(grades[0].subjects.length,9);
assert.ok(grades[0].subjects.some(s=>s.id==='data-analysis'),'Grade 1 includes the existing Data Analysis subject');
assert.equal(grades[1].subjects[0].units.length,6);
assert.equal(grades[1].subjects[0].units.reduce((n,u)=>n+u.sessions.length,0),41);
assert.equal(grades[2].subjects.length,10);
assert.ok(grades[2].subjects.some(s=>s.id==='data-analysis'),'Grade 3 includes the existing Data Analysis subject');
assert.equal(grades[2].subjects[0].units.length,6);
assert.equal(grades[2].subjects[0].units.reduce((n,u)=>n+u.sessions.length,0),36);
vm.runInContext("chooseGrade(2);chooseSubject();chooseGradeUnit(0)",context);
assert.ok(content.innerHTML.includes("HANDs-ON LAB")||content.innerHTML.includes("HANDS-ON LAB"));
vm.runInContext("chooseGrade(3)",context);
await vm.runInContext("chooseSubject('ai-data-engineering')",context);
for(let i=0;i<12;i++)await new Promise(r=>setImmediate(r));
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
vm.runInContext("window.EBDA_COMPLETION.setName('ai:1:0:0','Test Student')",context);
context.openUnit(1);
for(let i=0;i<12;i++)await new Promise(r=>setImmediate(r));
assert.ok(content.innerHTML.includes("Go directly to 50 practice questions"),"Quick practice shortcut missing");
context.jumpToPractice();
assert.ok(content.innerHTML.includes("QUESTION 1 / 50"),"Direct practice link did not open question one");
assert.ok(content.innerHTML.includes('class="practice-focus"'),"Question-only Focus Practice view missing");
assert.ok(content.innerHTML.includes("Back to lesson"),"Exit control missing in Focus Practice");
assert.ok(!content.innerHTML.includes('class="lesson-layout"'),"Focus Practice must hide the lesson sidebar");
assert.ok(!content.innerHTML.includes('class="lesson-steps"'),"Focus Practice must hide learning stages");
context.exitPractice();
assert.ok(!content.innerHTML.includes('class="practice-focus"'),"Exit focus should restore the lesson");
for(const s of data.sessions){
  assert.ok(s.title && s.topic && s.explanation,"Missing content for "+s.id);
  assert.equal(s.options.length,4);
  assert.ok(Number.isInteger(s.answer)&&s.answer>=0&&s.answer<4);
  assert.ok(s.options.every(x=>typeof x==="string"&&x.trim()));
  context.openUnit(s.unit);
  context.choose(s.id);
  vm.runInContext("window.EBDA_COMPLETION.setName('ai:1:"+(s.unit-1)+":"+data.sessions.filter(x=>x.unit===s.unit).findIndex(x=>x.id===s.id)+"','Test Student')",context);
  context.chooseAnswer(s.answer);
  context.verify();
  assert.ok(content.innerHTML.includes("feedback"),"Diagnostic feedback: "+s.id);
  context.next();
  context.setLab(4);
  assert.ok(content.innerHTML.includes('type="range"'),"Experiment: "+s.id);
  context.next();
  assert.ok(content.innerHTML.includes("ebda-puzzle"),"Year 1 mini-game missing: "+s.id);
  assert.ok(content.innerHTML.includes("Unlock a factory mystery"),"Year 1 mission route missing: "+s.id);
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
// Review actual puzzle answers and full game flows for all three grades.
const puzzleEngine=context.window.EBDA_PUZZLES;
let puzzleLessons=0,gameRounds=0;
for(const year of [1,2,3]){
 for(let unit=0;unit<6;unit++){
  const sessions=year===1?data.sessions.filter(s=>s.unit===unit+1):grades[year-1].subjects[0].units[unit].sessions;
  for(let i=0;i<sessions.length;i++){
   assert.ok(puzzleEngine.panel(year,unit,i).includes("puzzle-choice"),"Puzzles must be visible");
   for(let r=0;r<3;r++){
    const problem=puzzleEngine.task(year,unit,i,r);
    assert.equal(new Set(problem.options).size,problem.options.length,"Duplicate puzzle options");
    assert.ok(problem.answerIndex>=0 && problem.answerIndex<problem.options.length);
    puzzleEngine.choose(year,unit,i,(problem.answerIndex+1)%problem.options.length);
    assert.equal(puzzleEngine.progress(year,unit,i).solved,r,"Wrong choice must not unlock puzzle");
    puzzleEngine.hint(year,unit,i);
    assert.ok(puzzleEngine.panel(year,unit,i).includes("puzzle-tip"),"Hint missing");
    puzzleEngine.choose(year,unit,i,problem.answerIndex);
    assert.equal(puzzleEngine.progress(year,unit,i).solved,r+1,"Correct answer not registered");
    puzzleEngine.next(year,unit,i);
    gameRounds++;
   }
   assert.ok(puzzleEngine.progress(year,unit,i).done,"Mini-game does not complete");
   puzzleEngine.restart(year,unit,i);
   assert.equal(puzzleEngine.progress(year,unit,i).solved,0,"Replay must reset progress");
   puzzleLessons++;
  }
 }
}
assert.equal(puzzleLessons,116);
assert.equal(gameRounds,348);
const missingKeyPuzzle=puzzleEngine.task(2,1,0,2);
assert.equal(missingKeyPuzzle.options[missingKeyPuzzle.answerIndex],"No match — excluded","INNER JOIN must exclude unmatched rows");
const loopPuzzle=puzzleEngine.task(2,0,0,0);
assert.equal(loopPuzzle.options[loopPuzzle.answerIndex],"6","Python trace arithmetic must be correct");
const academic=context.window.EBDAA_PERFORMANCE;
assert.equal(Object.keys(academic).length,12);
assert.equal(Object.keys(context.window.EBDAA_SESSION_GUIDES).length,77);
let completedLabs=0;
for(const year of [2,3]){
 for(let unit=0;unit<6;unit++){
  vm.runInContext("chooseGrade("+year+");chooseSubject();chooseGradeUnit("+unit+")",context);
  const sessions=grades[year-1].subjects[0].units[unit].sessions;
  for(let i=0;i<sessions.length;i++){
   vm.runInContext("window.EBDA_COMPLETION.setName('ai:"+year+":"+unit+":"+i+"','Test Student')",context);
   vm.runInContext("openAdvancedSession("+i+")",context);
   const tag=year+"-"+unit+"-"+i;
   assert.ok(content.innerHTML.includes("theory-spark"),"Missing Discover theory: "+tag);
   assert.ok(!content.innerHTML.includes("lab-module"),"Old accordion returned: "+tag);
   assert.ok(!content.innerHTML.includes("PRACTICAL BRIEF"),"Removed checklist returned: "+tag);
   assert.ok(content.innerHTML.includes("Go directly to 50 practice questions"),"Direct practice shortcut missing: "+tag);
   vm.runInContext("goAdvancedStep(1)",context);
   const family=academic[year+"-"+(unit+1)].engine;
   assert.ok(content.innerHTML.includes(family==="python"||family==="sql"?"studio-editor":"studio-slider"),"Experiment missing: "+tag);
   const numeric=context.window.EBDAA_NUMERIC(year,unit,i,(i%5)+3);
   assert.ok(Number.isFinite(numeric.answer));
   assert.ok(content.innerHTML.includes("EVIDENCE CHECK"),"Numeric evidence missing: "+tag);
   if(context.window.EBDA_CODE_TESTS.task(year,unit,i))assert.ok(content.innerHTML.includes("EXECUTABLE CODE CHALLENGE"),"Code challenge missing: "+tag);
   vm.runInContext("goAdvancedStep(2)",context);
   assert.ok(content.innerHTML.includes("ebda-puzzle"),"Playable puzzle missing: "+tag);
   assert.ok(content.innerHTML.includes("PLAY & LEARN"),"Game entry is not visible: "+tag);
   assert.ok(content.innerHTML.includes("Unlock the factory mystery"),"Factory puzzle route is missing: "+tag);
   assert.ok(content.innerHTML.includes("INTERACTIVE CONCEPT VISUALIZER"),"Visualization missing: "+tag);
   assert.ok(content.innerHTML.includes("VISUAL DATA PLAYGROUND"),"Data playground missing: "+tag);
   vm.runInContext("goAdvancedStep(3)",context);
   assert.ok(content.innerHTML.includes("EMBEDDED FORMATIVE CHALLENGE"),"Concept check missing: "+tag);
   const mission=context.window.EBDAA_MISSIONS.find(x=>x.g===year&&x.u===unit);
   const correct=mission.steps[i%mission.steps.length][2];
   vm.runInContext("window.EBDAA_STUDIO.pick("+correct+");window.EBDAA_STUDIO.check()",context);
   assert.ok(content.innerHTML.includes("Correct"),"Concept feedback missing: "+tag);
   vm.runInContext("goAdvancedStep(4)",context);
   assert.ok(content.innerHTML.includes('class="practice-focus"'),"Focus Practice missing: "+tag);
   assert.ok(content.innerHTML.includes("GUIDED PRACTICE"),"Question panel missing: "+tag);
   assert.ok(content.innerHTML.includes("QUESTION 1 / 50"),"Question 1 missing: "+tag);
   assert.ok(content.innerHTML.includes('id="focus-counter"'),"Focus question counter missing: "+tag);
   assert.ok(!content.innerHTML.includes('class="lesson-steps"'),"Distractions should be hidden: "+tag);
   assert.ok(!content.innerHTML.includes("PRACTICAL RUBRIC"),"Rubric should not compete with the question: "+tag);
   assert.ok(!content.innerHTML.includes("UNIT CASEFILE"),"Industrial mission should be hidden during focus: "+tag);
   assert.ok(!content.innerHTML.includes("Save my lab evidence"),"Export tools should be hidden during focus: "+tag);
   assert.ok(!content.innerHTML.includes("Begin 50-question workshop"),"Standalone workshop returned: "+tag);
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
vm.runInContext("chooseGrade(2);chooseSubject();chooseGradeUnit(0);openAdvancedSession(0);goAdvancedStep(1)",context);
assert.ok(content.innerHTML.includes("lab-workspace__editor"),"Code editor not rendered in Experiment");
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
    assert.ok(["choice","number","truefalse","order","live-code","visual-data"].includes(question.mode));
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
    if(question.mode==="live-code")assert.ok(question.codeTask&&question.codeTask.starter,"Live-code task missing");
    if(question.mode==="visual-data"){assert.equal(question.options.length,4);assert.ok(question.options.includes(String(question.answer)));assert.ok(question.visual&&question.visual.readings.length===4);}
   }
   lessonCount++;practiceCount+=bank.length;
  }
 }
}
assert.equal(lessonCount,116);
assert.equal(practiceCount,5800);
assert.equal(formatCounts.order,580);
assert.equal(formatCounts.choice,2320);
assert.equal(formatCounts.number,1160);
assert.equal(formatCounts["visual-data"],1160);
assert.equal(formatCounts["live-code"],580);

// Evidence-driven educational story checks.
assert.equal(Object.keys(context.window.EBDAA_STORIES.storyNames).length,18);
assert.equal(context.window.EBDAA_CASE.clues.length,4);
assert.equal(context.window.EBDAA_CASE.tables.machines.length,3);
assert.equal(context.window.EBDAA_CASE.tables.inspections.reduce((n,r)=>n+(r.machine_id===1?r.defects:0),0),7);
vm.runInContext("chooseGrade(2);chooseSubject();chooseGradeUnit(1);openAdvancedSession(0);goAdvancedStep(2)",context);
assert.ok(content.innerHTML.includes("INDUSTRIAL SQL MYSTERY"));
assert.ok(content.innerHTML.includes("UNIT CASEFILE"));
vm.runInContext("window.EBDA_COMPLETION.setName('ai:2:1:0','Test Student');jumpAdvancedPractice()",context);
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
assert.ok(practiceStage.innerHTML.includes("Correct — well done"),"Graded response feedback disappeared on review");
practice.begin(2,0,0);
const attemptOne=Array.from(practice.questionOrder());
assert.equal(attemptOne.length,50);
assert.equal(new Set(attemptOne).size,50);
assert.deepEqual(Array.from(attemptOne).sort(),Array.from(originalBank,q=>q.id).sort());
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
assert.ok(!practiceStage.innerHTML.includes("practice-milestone"),"Ten-question checkpoint barrier returned");
const afterSprint=Array.from(practice.questionOrder());
assert.equal(practice.currentQuestion().id,afterSprint[10]);
assert.deepEqual(afterSprint.slice(0,10),attemptOne.slice(0,10),"Answered questions must not be reordered");
assert.deepEqual(Array.from(afterSprint).sort(),Array.from(attemptOne).sort(),"Adaptive sprint reprioritization must keep the same 50 questions");
practice.begin(2,0,0);
const attemptTwo=Array.from(practice.questionOrder());
assert.equal(attemptTwo.length,50);
assert.deepEqual(Array.from(attemptTwo).sort(),Array.from(attemptOne).sort());
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
