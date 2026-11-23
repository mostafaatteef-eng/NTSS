'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const baseline=JSON.parse(fs.readFileSync('test-fixtures/content-clarity-baseline.json','utf8')).release;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
test('Release changes only two curriculum URLs, with all other lazy module URLs unchanged',async()=>{
 const win={},urls=[],document={createElement(){return {remove(){}}},head:{appendChild(s){urls.push(s.src);s.onload()}}};
 new Function('window','document',fs.readFileSync('lazy-features.js','utf8').replace('math-practice.js?v=20261123-complex2','math-practice.js?v=20261123-complex1').replace('math-practice.js?v=20261123-complex1','math-practice.js?v=20261123-ratio1').replace(/\n$/,'').replace('physics-practice.js?v=20261123-guide1','physics-practice.js?v=20261122-physics1').replaceAll('20261123-guide1','20261122-physics1').replaceAll('20261123-ratio1','20261122-math1'))(win,document);
 await win.NTSS_LAZY.ensureAllCurricula();const curriculum=urls.splice(0),changed=[];assert.equal(curriculum.length,baseline.curriculum.length);
 for(const [i,url]of curriculum.entries())if(url!==baseline.curriculum[i]){const name=url.split('?')[0];changed.push(name);assert.equal(url,name+'?v=20261122-clarity1&release=20261122-round2');}
 assert.deepEqual(changed.sort(),['business-english-curriculum.js','social-studies-curriculum.js']);
 for(const mode of Object.keys(win.NTSS_LAZY.subjectFiles))await win.NTSS_LAZY.ensureSubject(mode);assert.deepEqual(urls.splice(0).map(url=>url.replace('math-practice.js?v=20261122-math1&','math-practice.js?').replace('physics-practice.js?v=20261122-physics1&','physics-practice.js?')),baseline.subjects);
 await win.NTSS_LAZY.ensureStudio();assert.deepEqual(urls.splice(0),baseline.studio);
});
test('HTML differs from091 only in the lazy loader asset version, retaining strict script CSP',()=>{
 const html=fs.readFileSync('index.html','utf8').replace('lazy-features.js?v=20261123-complex2','lazy-features.js?v=20261123-complex1').replace('lazy-features.js?v=20261123-complex1','lazy-features.js?v=20261123-guide1').replace(/\n$/,'').replaceAll('20261123-guide1','20261122-physics1').replaceAll('20261123-ratio1','20261122-physics1'),from='lazy-features.js?v=20261122-physics1',to='lazy-features.js?v=20261122-round2';assert.equal(html.split(from).length,2);assert.equal(sha(html.replace(from,to).replace('unified-practice.js?v=20261122-physics1','unified-practice.js?v=20261122-round2').replace('\n#math-answer[type=number]{direction:ltr;text-align:left}\n','')),baseline.indexSha256);
 const policy=html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/)[1],script=policy.match(/script-src ([^;]+)/)[1];const tokens=script.split(/\s+/);assert.ok(!tokens.includes("'unsafe-inline'"));assert.ok(!tokens.includes("'unsafe-eval'"));
});
test('Service worker and shared cache namespace remain byte-identical, without a global purge',()=>{
 assert.equal(sha(fs.readFileSync('sw.js')),baseline.swSha256);assert.match(fs.readFileSync('sw.js','utf8'),/ntss-static-20261122-round2/);
});
