'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const base=JSON.parse(fs.readFileSync('test-fixtures/math-release-baseline.json','utf8')),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
test('Math release keeps every other runtime JS byte-identical to deployed PR19',()=>{
 const actual=fs.readdirSync('.').filter(f=>f.endsWith('.js')&&!['math-practice.js','lazy-features.js'].includes(f)).sort();assert.deepEqual(actual,Object.keys(base.unchangedRuntime).sort());
 for(const file of actual)assert.equal(sha(fs.readFileSync(file)),base.unchangedRuntime[file],file);
 assert.equal(sha(fs.readFileSync('math-practice.js')),base.pilotMathSha256,'Teaching changes must remain exactly reviewed pilot89ae198');
});
test('Math release changes only the math practice URL and loader URL, without global cache invalidation',()=>{
 const loader=fs.readFileSync('lazy-features.js','utf8'),from='math-practice.js?v=20261122-math1';assert.equal(loader.split(from).length,2);assert.equal(sha(loader.replace(from,'math-practice.js')),base.baseLoaderSha256);
 const html=fs.readFileSync('index.html','utf8'),version='lazy-features.js?v=20261122-math1';assert.equal(html.split(version).length,2);assert.equal(sha(html.replace(version,'lazy-features.js?v=20261122-clarity1').replace('\n#math-answer[type=number]{direction:ltr;text-align:left}\n','')),base.baseIndexSha256);
});

test('Math numeric values use left-to-right display so negative signs stay leading',()=>{assert.match(fs.readFileSync('index.html','utf8'),/#math-answer\[type=number\]\{direction:ltr;text-align:left\}/);});
