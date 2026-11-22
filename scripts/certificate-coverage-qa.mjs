import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const read=file=>readFileSync(file,"utf8");
const main=read("app-main.js");
const subjects=[
 ["ai","AI & Data Analysis",null,"practice-workshop.js"],
 ["da","Data Analysis","dataAnalysisOpen","data-analysis-practice.js"],
 ["math","Mathematics","mathOpen","math-practice.js"],
 ["en","Advanced English","englishOpen","english-practice.js"],
 ["physics","Physics STEM","physicsOpen","physics-practice.js"],
 ["de","German","germanOpen","german-practice.js"],
 ["ar","Arabic Language","arabicOpen","arabic-practice.js"],
 ["be","Business English","businessOpen","business-english-practice.js"],
 ["social","Social Studies","socialOpen","social-studies-practice.js"],
 ["civics","National Education","civicsOpen","civics-practice.js"],
 ["economics","Economics","economicsOpen","economics-practice.js"]
];
assert.match(main,/function namedLessonGate\(/);
assert.match(main,/function submitNamedLesson\(/);
assert.match(main,/getName\(namedLessonKey\(namedLessonContext\)\)/);
assert.match(main,/function startNamedPractice\(/,"AI name gate must remain present");
assert.match(main,/getName\(studentKey\)/,"AI questions require name");
for(const [subject,label,fn,file] of subjects){
 const practice=read(file);
 if(fn){
  const opener=new RegExp("function "+fn+"\\(i\\)\\{[\\s\\S]{0,"+(subject==="da"?1200:260)+"}?registerNamedLesson\\(\\\""+subject+"\\\"");
  assert.match(main,opener,subject+" name entry must be registered");
 }
 if(/EBDA_PRACTICE_FRAMEWORK\.create\(/.test(practice)){assert.match(read("unified-practice.js"),/EBDA_COMPLETION\.render\(/,"unified framework lesson completion")}
 else assert.match(practice,/EBDA_COMPLETION\.(render|participation)\(/,subject+" lesson completion");
 assert.doesNotThrow(()=>new vm.Script(practice,{filename:file}));
}
const business=read("business-english-practice.js");
assert.match(business,/EBDA_COMPLETION\.participation\(/);
assert.match(business,/completeProject/);
const window={NTSS_ORIGINAL_LOGO:""};
new Function("window",read("lesson-completion.js"))(window);
const completion=window.EBDA_COMPLETION;
for(const [subject,label] of subjects){
 const key=[subject,1,0,0].join(":");
 completion.setName(key,"QA Student");
 completion.open(key);
 assert.equal(completion.setName(key,"Different Student"),false,"Starting name is immutable");
 assert.equal(completion.getName(key),"QA Student");
 const base={subject,grade:1,unit:0,index:0,lesson:"Lesson title",total:50};
 const pass=completion.render({...base,correct:35});
 const fail=completion.render({...base,correct:34});
 assert.ok(pass.includes("QA Student"),subject+" personalized certificate");
 assert.ok(pass.includes('id="ebda-certificate-sheet"'),subject+" certificate at 70 percent");
 assert.ok(!fail.includes('id="ebda-certificate-sheet"'),subject+" must not award a certificate below threshold");
}
const participation=completion.participation({subject:"be",grade:1,unit:0,index:0,lesson:"Workplace Project"});
assert.ok(participation.includes("Certificate of Participation")&&participation.includes("QA Student"));
assert.ok(participation.includes("Not graded"),"Project must never claim an assessed score");
console.log("Certificate coverage passed: student-name gate for all subjects, eleven subject completion pathways, project participation and 70% eligibility.");

assert.equal(typeof completion.edit,"undefined");
for(const arabic of [true,false]){
 const result=completion.render({subject:"math",grade:1,unit:0,index:0,lesson:"Test",correct:50,arabic});
 assert.ok(!result.includes('id="ebda-student-name"')&&!result.includes('EBDA_COMPLETION.edit('));
}
const escapedKey="math:2:0:0";
completion.setName(escapedKey,'<img src=x onerror=alert(1)>');
completion.open(escapedKey);
const escaped=completion.render({subject:"math",grade:2,unit:0,index:0,lesson:"Test",correct:50});
assert.ok(escaped.includes('&lt;img')&&!escaped.includes('<img src=x'));
completion.restoreIdentity(escapedKey,null);completion.open(escapedKey);
assert.ok(!completion.render({subject:"math",grade:2,unit:0,index:0,lesson:"Test",correct:50}).includes('id="ebda-certificate-sheet"'));
assert.equal(completion.checkpointIdentity(escapedKey),null,"Legacy learning-only status survives another save");
completion.freshAttempt(escapedKey);completion.open(escapedKey);
assert.ok(completion.render({subject:"math",grade:2,unit:0,index:0,lesson:"Test",correct:50}).includes('id="ebda-certificate-sheet"'));
