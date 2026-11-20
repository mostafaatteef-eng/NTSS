import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const read=name=>readFileSync(name,"utf8");
for(const file of ["assessment-enhancements.js","question-factory.js","practice-workshop.js","mistake-review.js","python-lab-worker.js","sql-lab-worker.js","app-main.js"]){
 assert.doesNotThrow(()=>new vm.Script(read(file),{filename:file}),file+" syntax");
}
const win={
 EBDAA_PERFORMANCE:{"2-1":{engine:"sql"},"3-1":{engine:"python"}},
 EBDAA_DATA:{names:["Programming","Math","Charts","AI","ML","Algorithms"],sessions:Array.from({length:6},(_,u)=>({unit:u+1,title:"Unit "+u}))},
 EBDAA_GRADES:{grades:[{subjects:[{units:[]}]},{subjects:[{units:[{title:"SQL",sessions:["Database queries"]}]}]},{subjects:[{units:[{title:"Python",sessions:["Functions"]}]}]}]}
};
new Function("window",read("assessment-enhancements.js"))(win);
new Function("window",read("question-factory.js"))(win);
for(const [g,u,i] of [[1,0,0],[1,2,0],[2,0,0],[3,0,0]]){
 const bank=win.EBDAA_QUESTION_FACTORY.all(g,u,i);
 assert.equal(bank.length,50);
 assert.equal(new Set(bank.map(q=>q.id)).size,50);
 const count=mode=>bank.filter(q=>q.mode===mode).length;
 assert.equal(count("live-code"),5);assert.equal(count("visual-data"),10);assert.equal(count("order"),5);
 assert.ok(bank.filter(q=>q.mode==="visual-data").every(q=>q.options.includes(q.answer)));
 assert.ok(bank.filter(q=>q.mode==="live-code").every(q=>q.engine==="sql"?q.codeTask.second:q.codeTask.tests.length>=3));
 const layouts=new Set(bank.map((q,j)=>win.NTSS_ASSESSMENT.questionView(q,j).match(/ntss-question-layout--([a-z]+)/)?.[1]));
 assert.equal(layouts.size,6);
 assert.ok(bank.filter(q=>q.mode==="visual-data").every(q=>!win.NTSS_ASSESSMENT.visual(q).includes("Above "+q.visual.threshold+"?")));
}
assert.ok(read("practice-workshop.js").includes("saveCheckpoint()}"),"Automatic progress save");
assert.ok(read("practice-workshop.js").includes("codeDrafts"),"Draft resume");
assert.ok(read("mistake-review.js").includes('x.question!==q.question'),"Different recovery prompt");
assert.ok(read("index.html").includes("assessment-enhancements.js"),"Assessment loaded");
console.log("Assessment QA passed: syntax, four curriculum samples, 50-question contract, six layouts, multi-case coding, recovery and resume.");
