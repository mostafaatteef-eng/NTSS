'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const original=JSON.parse(fs.readFileSync('test-fixtures/physics-guide-baseline.json')).originalPhysics;
global.document={getElementById:()=>null,querySelector:()=>null};global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
function engine(source){const w={};for(const f of ['physics-curriculum.js','unified-practice.js'])new Function('window',fs.readFileSync(f,'utf8'))(w);new Function('window',source)(w);return w;}
const old=engine(original),now=engine(fs.readFileSync('physics-practice.js','utf8')),targets=[[1,0,0],[1,0,2],[1,3,3],[1,3,4],[1,3,5]],key=x=>x.join(':'),targetKeys=new Set(targets.map(key));
test('Exactly five guide-grounded physics banks change, all other58banks are identical',()=>{let n=0;for(const[g,units]of Object.entries(now.EBDAA_PHYSICS_UNITS))for(const[u,unit]of units.entries())for(let i=0;i<unit.sessions.length;i++){const loc=[+g,u,i],a=now.EBDAA_PHYSICS_PRACTICE.build(...loc),b=old.EBDAA_PHYSICS_PRACTICE.build(...loc);if(targetKeys.has(key(loc))){assert.notDeepEqual(a,b);assert.equal(a.length,50);assert.equal(new Set(a.map(q=>q.question)).size,50);assert.equal(a.filter(q=>q.mode==='number').length,40);assert.equal(a.filter(q=>q.mode==='choice').length,10);assert.equal(new Set(a.map(q=>q.family)).size,5);for(const q of a){assert.ok(q.guideAligned);assert.ok(q.source);assert.ok(q.explanation);assert.ok(!b.some(x=>x.id===q.id));if(q.options)assert.equal(new Set(q.options).size,q.options.length);}}else{assert.deepEqual(a,b,key(loc));n++;}}assert.equal(n,58);});
const num=s=>Number(s),rad=d=>d*Math.PI/180,deg=r=>r*180/Math.PI;
function expected(q){const s=q.question,m=pattern=>{const v=s.match(pattern);assert.ok(v,s);return v.slice(1).map(Number)};switch(q.family){
 case'cm-to-m':return m(/length of ([\d.]+) cm/)[0]/100;
 case'kg-to-g':return m(/mass of ([\d.]+) kg/)[0]*1000;
 case'minutes-to-seconds':return m(/lasts ([\d.]+) minutes/)[0]*60;
 case'same-unit-length':{const[a,b]=m(/lengths are ([\d.]+) m and ([\d.]+) cm/);return a+b/100;}
 case'caliper-reading':{const[a,b,c]=m(/reading is ([\d.]+) mm\. Vernier division ([\d.]+) aligns; the stated least count is ([\d.]+) mm/);return a+b*c;}
 case'micrometer-reading':{const[a,b,c]=m(/reading is ([\d.]+) mm and its thimble reads ([\d.]+) divisions\. Each division is ([\d.]+) mm/);return a+b*c;}
 case'zero-correction':{const[a,b]=m(/shows ([\d.]+) mm with a signed zero error of ([+\-\d.]+) mm/);return a-b;}
 case'stopwatch-reading':{const[a,b]=m(/displays ([\d.]+) minutes ([\d.]+) seconds/);return a*60+b;}
 case'vacuum-wavelength':return 3e8/(m(/frequency ([\d.]+) THz/)[0]*1e12)*1e9;
 case'vacuum-frequency':return 3e8/(m(/wavelength ([\d.]+) nm/)[0]*1e-9)/1e12;
 case'vacuum-speed':return 3;
 case'medium-wavelength':return 2e8/(m(/frequency ([\d.]+) THz/)[0]*1e12)*1e9;
 case'absolute-index':return 3/m(/is ([\d.]+) × 10\^8/)[0];
 case'medium-speed':return 3/m(/index ([\d.]+)\./)[0];
 case'reflection-angle':return m(/at ([\d.]+)° to the normal/)[0];
 case'snell-angle':return deg(Math.asin(Math.sin(rad(m(/incidence ([\d.]+)°/)[0]))/1.5));
 case'critical-angle':return deg(Math.asin(1/m(/from n1 = ([\d.]+) to n2/)[0]));
 case'critical-index':return 1/Math.sin(rad(m(/angle is ([\d.]+)°/)[0]));
 case'critical-sine':return 1/m(/from n1 = ([\d.]+) to n2/)[0];
 case'tir-threshold':{const[c,i]=m(/critical angle ([\d.]+)°\. Its incidence is ([\d.]+)°/);return i>c?1:0;}
 case'quantity-unit':return q.options.indexOf(s.includes('length')?'metre':s.includes('mass')?'kilogram':'second');
 case'instrument-choice':return q.options.indexOf(s.includes('thin metal')?'Micrometer':'Measuring tape');
 case'boundary-frequency':return q.options.indexOf('Frequency');
 case'bending-direction':return q.options.indexOf(s.includes('n1 = 1 into n2 = 1.5')?'Toward the normal':'Away from the normal');
 case'tir-boundary':return q.options.findIndex(x=>s.includes('exactly')?x.startsWith('Critical boundary:'):x.startsWith('No TIR:'));
 default:assert.fail(q.family);
}}
test('All250answers independently recomputed from displayed question text, including inverse sine and strict critical boundary',()=>{for(const loc of targets)for(const q of now.EBDAA_PHYSICS_PRACTICE.build(...loc)){const x=expected(q);assert.ok(Number.isFinite(x));assert.ok(Math.abs(q.answer-x)<=0.00050001,q.question);if(q.mode==='choice')assert.ok(q.answer>=0&&q.answer<q.options.length);}});
test('Real shared grader accepts every correct and rejects every incorrect answer',()=>{for(const loc of targets){const p=now.EBDAA_PHYSICS_PRACTICE;for(let n=0;n<50;n++)for(const correct of [true,false]){p.start(...loc);p.continueStage();for(let j=0;j<n;j++){p.answer(p.currentQuestion().answer);p.check();p.next();p.continueStage();}const q=p.currentQuestion();p.answer(correct?q.answer:q.mode==='choice'?(q.answer+1)%q.options.length:q.answer+10);p.check();assert.equal(p._state().answers[n].correct,correct,key(loc)+'/'+n);}}});
test('Source-grounded questions have explicit units/source and preserve existing optional learning panels',()=>{const s=fs.readFileSync('physics-practice.js','utf8');assert.match(s,/afterControls:.*EBDAA_CONTEXT_GAMES\.physics/);assert.match(s,/EBDAA_PHYSICS_VISUAL\.render/);assert.match(s,/beforeControls:q=>q\.guideAligned\?/);});

test('Current physics source is exact reviewed candidate; only physics and loader asset URLs change',()=>{
 const b=JSON.parse(fs.readFileSync('test-fixtures/physics-guide-baseline.json'));
 assert.equal(require('node:crypto').createHash('sha256').update(fs.readFileSync('physics-practice.js')).digest('hex'),b.candidateSha256);
 assert.equal(fs.readFileSync('index.html','utf8').replace('lazy-features.js?v=20261124-banks1','lazy-features.js?v=20261123-complex2').replace('lazy-features.js?v=20261123-complex2','lazy-features.js?v=20261123-complex1').replace('lazy-features.js?v=20261123-complex1','lazy-features.js?v=20261123-guide1').replace('lazy-features.js?v=20261123-guide1','lazy-features.js?v=20261123-ratio1'),b.baseIndex);
 assert.equal(fs.readFileSync('lazy-features.js','utf8').replace('math-practice.js?v=20261124-banks1','math-practice.js?v=20261123-complex2').replace('math-practice.js?v=20261123-complex2','math-practice.js?v=20261123-complex1').replace('math-practice.js?v=20261123-complex1','math-practice.js?v=20261123-ratio1').replace('physics-practice.js?v=20261123-guide1','physics-practice.js?v=20261122-physics1'),b.baseLoader);
});
