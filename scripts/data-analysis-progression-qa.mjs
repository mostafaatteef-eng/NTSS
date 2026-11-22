import assert from 'node:assert/strict';
import fs from 'node:fs';
const storage=new Map();
globalThis.document={getElementById:()=>null,querySelector:()=>null};
globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
const win={addEventListener(){},EBDA_APP_RENDER(){}};
for(const f of ['performance-map.js','mastery-engine.js','data-analysis-curriculum.js','unified-practice.js','data-analysis-practice.js'])new Function('window',fs.readFileSync(f,'utf8'))(win);
let cases=0;
for(const g of [1,2,3])for(let i=0;i<win.EBDAA_DATA_ANALYSIS_UNITS[g][0].sessions.length;i++)for(const correct of [true,false]){
 const e=win.EBDAA_DATA_ANALYSIS_PRACTICE;e.start(g,0,i);const seen=[];
 for(let n=0;n<50;n++){
  e.continueStage();const q=e.currentQuestion();seen.push(q.id);
  e.answer(correct?q.answer:q.mode==='choice'?(q.answer+1)%4:Number(q.answer)+1000);e.check();
  if(n===16){e.saveCheckpoint();const before=e._state(),p=e.progress();assert.ok(e.resumeCheckpoint());assert.deepEqual(e.progress(),p);assert.deepEqual(e._state().items.map(q=>q.id),before.items.map(q=>q.id));assert.deepEqual(e._state().answers,before.answers)}
  e.next();assert.equal(e.progress().answered,n+1,`grade${g} lesson${i+1} question${n+1}`);
 }
 assert.equal(e.progress().finished,true);assert.equal(new Set(seen).size,50);
 assert.equal(Object.values(e._state().answers).filter(a=>a.correct).length,correct?50:0);
 const snapshot=win.EBDA_MASTERY.snapshot(g,0,i,'da');assert.equal(snapshot.seen,50);assert.ok(snapshot.skills.some(s=>s.id>10&&s.attempted>0),'Separate concept evidence beyond initial ten');e.clearCheckpoint();cases++;
}
const m=win.EBDA_MASTERY;
m.begin(1,0,0,'bad');m.record(1,0,0,{focus:70,focusLabel:'<unsafe label>'},true,false,'bad');m.record(1,0,0,{focus:79},false,false,'bad');
assert.equal(m.snapshot(1,0,0,'bad').skills.find(x=>x.id===70).correct,1);assert.equal(m.snapshot(1,0,0,'bad').skills.find(x=>x.id===79).correct,0);
for(const focus of [NaN,-1,0,1.5,'bad',Infinity,1001])assert.equal(m.record(1,0,0,{focus},true,false,'bad'),null);
const malformed={focus:'invalid',id:'fixed-slot'},items=[{focus:70,id:'a'},malformed,{focus:79,id:'b'},{focus:70,id:'c'}];const reordered=m.prioritizeUpcoming(1,0,0,items,'bad');assert.equal(reordered[1],malformed);assert.deepEqual(new Set(reordered),new Set(items));assert.ok(m.map(1,0,0,null,'bad').includes('&lt;unsafe label&gt;'));
console.log(JSON.stringify({ok:true,completionCases:cases,lessons:17,answers:cases*50,resumeChecks:cases,metadataGuard:true,distinctSkills:true}));
