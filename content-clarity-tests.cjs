'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const win={};for(const f of ['social-studies-curriculum.js','business-english-curriculum.js','unified-practice.js','social-studies-practice.js','business-english-practice.js'])new Function('window',fs.readFileSync(f,'utf8'))(win);
const baseline=JSON.parse(fs.readFileSync('test-fixtures/content-clarity-baseline.json','utf8'));
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const targets=['be:1:0:2','social:2:0:2'];
function banks(){const all={};for(const[subject,units,api]of [['be',win.EBDAA_BUSINESS_ENGLISH_UNITS,win.EBDAA_BUSINESS_PRACTICE],['social',win.EBDAA_SOCIAL_STUDIES_UNITS,win.EBDAA_SOCIAL_STUDIES_PRACTICE]])for(const[g,us]of Object.entries(units))for(const[u,unit]of us.entries())for(const[i,lesson]of unit.sessions.entries()){if(lesson.kind==='project')continue;all[[subject,g,u,i].join(':')]=api.build(Number(g),u,i);}return all;}
test('Clarity edit preserves all87 relevant banks, 50 items each, order and answer-key structure',()=>{
 assert.equal(baseline.sourceCommit,'091f0ed673da292b1f4382e2b2266c7b08cacbd1');const now=banks();assert.deepEqual(Object.keys(now),Object.keys(baseline.banks));assert.equal(Object.keys(now).length,87);
 for(const[key,items]of Object.entries(now)){assert.equal(items.length,50,key);assert.equal(hash(items.map(q=>({mode:q.mode,answer:q.answer}))),baseline.banks[key].keyHash,key);for(const q of items){assert.ok(q.question);if(q.options){assert.equal(new Set(q.options).size,q.options.length,key);assert.ok(q.answer>=0&&q.answer<q.options.length,key)}}}
});
test('Exactly two banks change; other85 are byte-equivalent to frozen091 output',()=>{
 const changed=[];for(const[key,items]of Object.entries(banks()))if(hash(items)!==baseline.banks[key].hash)changed.push(key);assert.deepEqual(changed.sort(),targets.slice().sort());
});
test('Business English keeps read as the correct past-tense term, with written time and pronunciation cues',()=>{
 const list=win.EBDAA_BUSINESS_PRACTICE.build(1,0,2),read=list.filter(q=>q.term==='read');assert.ok(read.length>0);
 for(const q of read){assert.match(q.definition,/past-tense/);assert.match(q.definition,/\/red\//);assert.match(q.definition,/Yesterday, I ___ a book/);const expected=q.question.startsWith('Which meaning')?q.definition:'read';assert.equal(q.options[q.answer],expected);}
 assert.equal(win.EBDAA_BUSINESS_ENGLISH_UNITS[1][0].sessions[2].focus,'Simple past and recounting events');
});
test('Social student question19 is an unambiguous heat/rain mismatch, not a flipped key',()=>{
 const list=win.EBDAA_SOCIAL_STUDIES_PRACTICE.build(2,0,2),q=list[18];assert.equal(q.question,'صح أم خطأ؟');assert.equal(q.clue,'الحرارة : قطرات ماء سائل تسقط من السحب');assert.equal(q.options[q.answer],'خطأ');assert.equal(q.answer,1);
 for(const n of [13,43]){assert.equal(list[n].clue,'الأمطار : قطرات ماء سائل تسقط من السحب');assert.equal(list[n].options[list[n].answer],'صواب');}
});
