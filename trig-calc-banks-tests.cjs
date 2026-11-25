'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const b=JSON.parse(fs.readFileSync('test-fixtures/trig-calc-banks-baseline.json')),read=f=>fs.readFileSync(f,'utf8'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
global.document={getElementById:()=>null,querySelector:()=>null};const storage=new Map();global.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
function engine(src){const w={};for(const f of ['math-curriculum.js','unified-practice.js'])new Function('window',read(f))(w);new Function('window',src)(w);return w;}
const old=engine(b.originalMath),now=engine(read('math-practice.js'));
const targets=[[2,1,2],[2,2,2],[2,2,3],[2,2,4],[3,2,2]];
const prefixes={'2:1:2':'sinelaw-v1-2-1-2-','2:2:2':'productrule-v1-2-2-2-','2:2:3':'quotientrule-v1-2-2-3-','2:2:4':'chainrule-v1-2-2-4-','3:2:2':'byparts-v1-3-2-2-'};
const key=loc=>loc.join(':');
test('Trig/calc coverage changes exactly five banks; all71other math banks identical',()=>{let unchanged=0;for(const[g,units]of Object.entries(now.EBDAA_MATH_UNITS))for(const[u,unit]of units.entries())for(let i=0;i<unit.sessions.length;i++){const a=now.EBDAA_MATH_PRACTICE.build(+g,u,i),z=old.EBDAA_MATH_PRACTICE.build(+g,u,i),k=[+g,u,i].join(':');if(prefixes[k]){assert.equal(a.length,50,k);assert.equal(new Set(a.map(q=>q.id)).size,50,k);assert.ok(a.every(q=>q.id.startsWith(prefixes[k])),k);assert.ok(a.every(q=>!z.some(v=>v.id===q.id)),k);assert.equal(a.filter(q=>q.mode==='number').length,40,k);assert.equal(new Set(a.map(q=>q.question)).size,42,k);}else{assert.deepEqual(a,z,k);unchanged++;}}assert.equal(unchanged,71);});
const r3=x=>Number(x.toFixed(3));
const oracles={
 '2:1:2':[
  [/angle A = 30° and angle B = 45°\. Side a = (\d+)/,m=>r3(+m[1]*Math.SQRT2)],
  [/angle A = 45° and angle B = 60°\. Side a = (\d+)/,m=>r3(+m[1]*Math.sin(Math.PI/3)/Math.SQRT1_2)],
  [/sides a = (\d+) and b = (\d+) enclose angle C = 60°/,m=>{const a=+m[1],c=+m[2];return r3(Math.sqrt(a*a+c*c-a*c))}],
  [/sides a = (\d+) and b = (\d+) enclose angle C = 120°/,m=>{const a=+m[1],c=+m[2];return r3(Math.sqrt(a*a+c*c+a*c))}]],
 '2:2:2':[
  [/^For f\(x\)=\(x²\+(\d+)\)\((\d+)x\+1\), calculate f'\(1\)\.$/,m=>+m[1]*+m[2]+3*+m[2]+2],
  [/^For f\(x\)=(\d+)x³\((\d+)x−(\d+)\), calculate f'\(1\)\.$/,m=>4*+m[1]*+m[2]-3*+m[1]*+m[3]],
  [/^For f\(x\)=\((\d+)x\+(\d+)\)\(x²\+(\d+)\), calculate f'\(0\)\.$/,m=>+m[1]*+m[3]],
  [/^For f\(x\)=x²\((\d+)x\+(\d+)\), calculate f'\(1\)\.$/,m=>3*+m[1]+2*+m[2]]],
 '2:2:3':[
  [/^For f\(x\)=\(x²\+(\d+)\)\/x², calculate f'\(1\)\.$/,m=>-2*+m[1]],
  [/^For f\(x\)=\((\d+)x\)\/\(x\+(\d+)\), calculate f'\(0\)\. Round to 3 decimal places\.$/,m=>r3(+m[1]/+m[2])],
  [/^For f\(x\)=\((\d+)x²\)\/\(x\+(\d+)\), calculate f'\((\d+)\)\. Round to 3 decimal places\.$/,m=>{assert.equal(+m[2],+m[3]);return r3(3*+m[1]/4)}],
  [/^For f\(x\)=\(x\+(\d+)\)\/x², calculate f'\(1\)\.$/,m=>-(2*+m[1]+1)]],
 '2:2:4':[
  [/^For f\(x\)=\((\d+)x\+(\d+)\)², calculate f'\(1\)\.$/,m=>2*+m[1]*(+m[1]+ +m[2])],
  [/^For f\(x\)=\((\d+)x\+(\d+)\)³, calculate f'\(0\)\.$/,m=>3*+m[1]*+m[2]*+m[2]],
  [/^For f\(x\)=\(x²\+(\d+)\)³, calculate f'\(1\)\.$/,m=>{const a=1+ +m[1];return 6*a*a}],
  [/^For f\(x\)=\((\d+)x²\+(\d+)\)², calculate f'\(1\)\.$/,m=>4*+m[1]*(+m[1]+ +m[2])]],
 '3:2:2':[
  [/from 0 to π of (\d+)·x·sin\(x\)/,m=>r3(+m[1]*Math.PI)],
  [/from 0 to π\/2 of (\d+)·x·cos\(x\)/,m=>r3(+m[1]*(Math.PI/2-1))],
  [/from 0 to 1 of (\d+)·x·e\^x dx/,m=>+m[1]],
  [/from 0 to 1 of (\d+)·x²·e\^x/,m=>r3(+m[1]*(Math.E-2))]]
};
test('All200 numeric keys match independent recomputation,10 per variant;concept checks unchanged',()=>{
 for(const loc of targets){
  const k=key(loc),a=now.EBDAA_MATH_PRACTICE.build(...loc),z=old.EBDAA_MATH_PRACTICE.build(...loc),counts={};
  for(let i=0;i<50;i++){const q=a[i];
   if(q.mode==='number'){const hit=oracles[k].find(([re])=>re.test(q.question));assert.ok(hit,'numeric item matches a taught pattern: '+q.question);counts[oracles[k].indexOf(hit)]=(counts[oracles[k].indexOf(hit)]||0)+1;assert.equal(q.answer,hit[1](q.question.match(hit[0])),q.question);}
   else{const strip=q=>{const{id,...rest}=q;return rest};assert.deepEqual(strip(q),strip(z[i]),k+' concept check '+i);}}
  assert.deepEqual(counts,{0:10,1:10,2:10,3:10},k);
 }
});
test('Actual grader accepts correct and rejects incorrect values in all250items',()=>{const p=now.EBDAA_MATH_PRACTICE;for(const loc of targets)for(let n=0;n<50;n++)for(const correct of [true,false]){p.start(...loc);p.continueStage();for(let j=0;j<n;j++){p.answer(p.currentQuestion().answer);p.check();p.next();p.continueStage();}const q=p.currentQuestion();p.answer(correct?q.answer:q.mode==='choice'?(q.answer+1)%2:q.answer+1);p.check();assert.equal(p._state().answers[n].correct,correct,key(loc)+'/'+n+'/'+correct);}});
test('Real checkpoint rejects old changed-bank order, accepts new and other-bank saved sessions',()=>{const k='ntss-private-practice-checkpoint-v4-math';function save(api,loc){api.start(...loc);api.continueStage();api.answer(api.currentQuestion().answer);api.check();assert.equal(api.saveCheckpoint(),true);}for(const loc of targets){save(old.EBDAA_MATH_PRACTICE,loc);assert.equal(now.EBDAA_MATH_PRACTICE.resumeCheckpoint(),false,key(loc)+' old order must not resume');save(now.EBDAA_MATH_PRACTICE,loc);assert.equal(now.EBDAA_MATH_PRACTICE.resumeCheckpoint(),true,key(loc));assert.equal(now.EBDAA_MATH_PRACTICE._state().answers[0].correct,true);}save(old.EBDAA_MATH_PRACTICE,[2,1,1]);assert.equal(now.EBDAA_MATH_PRACTICE.resumeCheckpoint(),true);assert.ok(storage.has(k));});
test('Current exact candidate; only loader/math URLs change with unchanged cache namespace',()=>{assert.equal(sha(read('math-practice.js')),b.candidateSha256);assert.equal(read('index.html').replace('<script defer src="grade3-banks.js?v=20261125-g3banks"></script>','').replace('question-factory.js?v=20261125-g3banks','question-factory.js?v=20261122-round2').replace('lazy-features.js?v=20261124-banks1','lazy-features.js?v=20261123-complex2'),b.baseIndex);assert.equal(read('lazy-features.js').replace('math-practice.js?v=20261124-banks1','math-practice.js?v=20261123-complex2'),b.baseLoader);assert.match(read('sw.js'),/ntss-static-20261122-round2/);});
