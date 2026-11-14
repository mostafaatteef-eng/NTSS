import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const paths=["index.html","curriculum-data.js","grade-catalog.js","experiments.js","challenge.js","advanced-labs.js","microgames.js","missions-data.js","performance-map.js","lab-specialists.js","lab-studio.js"];
for(const name of paths)assert.ok(fs.existsSync(name),name+" must exist");
const html=fs.readFileSync("index.html","utf8");
const scripts=paths.slice(1).map(x=>fs.readFileSync(x,"utf8"));
const inline=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline,"inline app script missing");
for(const src of [...scripts,inline])new vm.Script(src);
const content={innerHTML:""};
const buttons=["home","browse","missions","about"].map(x=>({dataset:{nav:x},addEventListener(){},classList:{toggle(){}}}));
const context={window:{},document:{querySelector:()=>content,querySelectorAll:()=>buttons},scrollTo(){}};
vm.createContext(context);
for(const src of scripts)vm.runInContext(src,context);
vm.runInContext(inline,context);
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
  const q=context.window.EBDAA_CHALLENGE(s);
  assert.equal(q.options.length,4);
  context.chooseAnswer(q.answer);
  context.verify();
  assert.ok(content.innerHTML.includes("feedback"),"Application feedback: "+s.id);
}
const academic=context.window.EBDAA_PERFORMANCE;
assert.equal(Object.keys(academic).length,12);
let completedLabs=0;
for(const year of [2,3]){
 for(let unit=0;unit<6;unit++){
  vm.runInContext("chooseGrade("+year+");chooseSubject();chooseGradeUnit("+unit+")",context);
  const sessions=grades[year-1].subjects[0].units[unit].sessions;
  for(let i=0;i<sessions.length;i++){
   vm.runInContext("openAdvancedSession("+i+")",context);
   assert.ok(content.innerHTML.includes("EMBEDDED FORMATIVE CHALLENGE"),year+"-"+unit+"-"+i);
   assert.ok(content.innerHTML.includes("Performance Indicators"),year+"-"+unit+"-"+i);
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
const missions=context.window.EBDAA_MISSIONS;
assert.equal(missions.length,18);
assert.equal(missions.reduce((n,m)=>n+m.steps.length,0),54);
assert.equal(new Set(missions.map(m=>m.id)).size,18);
for(const m of missions){
  assert.equal(m.steps.length,3);
  assert.ok(m.g>=1&&m.g<=3&&m.u>=0&&m.u<6);
  vm.runInContext("startMission("+JSON.stringify(m.id)+")",context);
  for(const step of m.steps){
    assert.equal(step[1].length,4);
    assert.ok(Number.isInteger(step[2])&&step[2]>=0&&step[2]<4);
    assert.ok(step[3].length>10);
    vm.runInContext("pickMission("+step[2]+");checkMission();nextMission()",context);
  }
  assert.ok(content.innerHTML.includes("Challenge complete!"),m.id+" should complete");
}
vm.runInContext("grade=3;nav('missions')",context);
assert.ok(content.innerHTML.includes("Privacy &amp; Fairness Audit"));
context.nav("about");
assert.ok(content.innerHTML.includes("No student registration"));
assert.ok(!html.includes("localStorage."),"Do not persist student answers");
console.log("PASS: three-grade navigation, 41 Year-2 and 36 Year-3 session listings, 39 Year-1 learning flows, 77 integrated Year-2/3 lab sessions, 18 embedded unit challenge banks, script syntax, no student data.");
