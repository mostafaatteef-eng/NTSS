'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
function engine(source){
 const window={};
 for(const f of ['math-curriculum.js','unified-practice.js'])new Function('window',fs.readFileSync(f,'utf8'))(window);
 new Function('window',source)(window);
 return {api:window.EBDAA_MATH_PRACTICE,units:window.EBDAA_MATH_UNITS};
}
const current=engine(fs.readFileSync('math-practice.js','utf8'));
const target=[[2,1,1],[2,1,6],[3,2,1]];
const close=(a,b)=>assert.ok(Math.abs(a-b)<=.000501,`${a} differs from oracle ${b}`);
function frac(s){return s.split('/').map(Number).reduce((a,b)=>a/b)}
test('Each pilot has 50 deterministic distinct items, valid keys and unique IDs',()=>{
 for(const loc of target){
  const items=current.api.build(...loc);
  assert.equal(items.length,50);assert.equal(new Set(items.map(q=>q.id)).size,50);
  assert.equal(new Set(items.map(q=>q.question)).size,50);
  assert.deepEqual(items,current.api.build(...loc));
  for(const q of items){assert.ok(q.explanation);assert.ok(!/undefined|NaN/.test(JSON.stringify(q)));if(q.mode==='choice'){assert.equal(new Set(q.options).size,q.options.length);assert.ok(q.answer>=0&&q.answer<q.options.length)}else assert.ok(Number.isFinite(q.answer))}
 }
});
test('Trig equation keys and every distractor match an independent unit-circle scan',()=>{
 const items=current.api.build(2,1,1),truthKeys=[];
 for(const q of items){
  const [,fn,rhs]=q.question.match(/(sin|cos) θ = (-?\d+(?:\/\d+)?)/),v=frac(rhs);
  const valid=x=>Math.abs(Math[fn](x*Math.PI/180)-v)<1e-9;
  const roots=Array.from({length:360},(_,i)=>i).filter(valid);
  assert.ok(roots.length>0);
  if(q.question.includes('Which angle')){const correct=q.options.map(x=>valid(parseFloat(x)));assert.equal(correct.filter(Boolean).length,1);assert.equal(correct[q.answer],true)}
  else if(q.question.includes('smallest'))assert.equal(q.answer,Math.min(...roots));
  else if(q.question.includes('largest'))assert.equal(q.answer,Math.max(...roots));
  else if(q.question.includes('How many'))assert.equal(q.answer,roots.length);
  else{const candidate=Number(q.question.match(/Is θ = (\d+)°/)[1]);assert.equal(q.options[q.answer],valid(candidate)?'Yes':'No');truthKeys.push(q.answer)}
 }
 assert.equal(truthKeys.filter(x=>x===0).length,5);assert.equal(truthKeys.filter(x=>x===1).length,5);
});
test('All double-angle answers match trig evaluation, with consistent signed input pairs',()=>{
 const funcs=new Set();
 for(const q of current.api.build(2,1,6)){
  const [,s,c,fn]=q.question.match(/sin θ = (-?\d+\/\d+) and cos θ = (-?\d+\/\d+), find (sin|cos|tan)/);
  const sin=frac(s),cos=frac(c),angle=Math.atan2(sin,cos);funcs.add(fn);
  assert.ok(Math.abs(sin*sin+cos*cos-1)<1e-12);
  assert.ok(Math.abs(Math.cos(2*angle))>1e-8);close(q.answer,Math[fn](2*angle));
 }
 assert.deepEqual([...funcs].sort(),['cos','sin','tan']);
});
test('All integral answers match independent numerical quadrature, radians and bounds explicit',()=>{
 for(const q of current.api.build(3,2,1)){
  const [,bound,a,fn]=q.question.match(/from 0 to (π(?:\/\d+)?) of (\d+) (sin|cos)\(x\)/);
  const upper=Math.PI/(Number(bound.split('/')[1])||1),coefficient=Number(a),N=1000,h=upper/N;
  let sum=0;for(let i=0;i<=N;i++)sum+=(i===0||i===N?1:i%2===0?2:4)*coefficient*Math[fn](i*h);
  close(q.answer,sum*h/3);assert.match(q.question,/radians/);
 }
});
test('Pilot remains narrowly scoped: other 73 math banks are byte-equivalent to base091',()=>{
 const baseline=JSON.parse(fs.readFileSync('test-fixtures/math-diversity-baseline.json','utf8'));let unchanged=0;
 assert.equal(baseline.sourceCommit,'091f0ed673da292b1f4382e2b2266c7b08cacbd1');
 for(const [g,units] of Object.entries(current.units))for(const [u,unit] of units.entries())for(let i=0;i<unit.sessions.length;i++){
  const key=[g,u,i].join(':');
  if(target.some(loc=>loc.join(':')===key)){assert.equal(baseline.beforeDistinct[key],3);continue}
  const hash=crypto.createHash('sha256').update(JSON.stringify(current.api.build(Number(g),u,i))).digest('hex');
  assert.equal(hash,baseline.unchanged[key],key);unchanged++;
 }
 assert.equal(unchanged,73);
});
