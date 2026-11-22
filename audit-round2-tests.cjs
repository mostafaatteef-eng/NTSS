'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function setup(){
 const lab={value:'KEEP MY LAB CODE'},editor={value:'',focus(){}},result={innerHTML:''};
 const nodes={'studio-editor':lab,'ebda-challenge-editor':editor,'ebda-code-results':result};
 let submitted,confirmations=0,allowReplace=false;
 const window={EBDAA_PERFORMANCE:{'2-1':{engine:'python'},'2-2':{engine:'sql'}},EBDAA_STUDIO:{runPython(code){submitted=code}},confirm(){confirmations++;return allowReplace}};
 vm.runInNewContext(fs.readFileSync('code-challenges.js','utf8'),{window,document:{getElementById(id){return nodes[id]}}});
 return {api:window.EBDA_CODE_TESTS,lab,editor,result,get submitted(){return submitted},get confirmations(){return confirmations},allow(){allowReplace=true}};
}
test('Challenge editor is separate, starts blank and preserves scoped drafts safely',()=>{
 const s=setup();let html=s.api.panel(2,1,0);
 assert.match(html,/for="ebda-challenge-editor"/);assert.match(html,/own editor and test data/);
 assert.match(html,/<textarea[^>]*><\/textarea>/);
 s.api.saveDraft(2,1,0,'SELECT "<mine>";');html=s.api.panel(2,1,0);
 assert.match(html,/SELECT &quot;&lt;mine&gt;&quot;;/);
 assert.doesNotMatch(s.api.panel(2,1,1),/&lt;mine&gt;/);
 assert.equal(s.lab.value,'KEEP MY LAB CODE');
});
test('Starter loading is explicit and never silently overwrites a student draft',()=>{
 const s=setup();assert.equal(s.api.loadStarter(2,1,0),true);
 assert.equal(s.editor.value,s.api.task(2,1,0).starter);assert.equal(s.confirmations,0);
 s.editor.value='SELECT my_solution;';assert.equal(s.api.loadStarter(2,1,0),false);
 assert.equal(s.editor.value,'SELECT my_solution;');assert.equal(s.confirmations,1);
 s.allow();assert.equal(s.api.loadStarter(2,1,0),true);
 assert.equal(s.lab.value,'KEEP MY LAB CODE');
});
test('Empty challenge gives guidance, not a surprise SQL runtime error',async()=>{
 const s=setup();assert.equal(await s.api.run(2,1,0),null);
 assert.match(s.result.innerHTML,/Write your challenge solution/);
 assert.doesNotMatch(s.result.innerHTML,/no such table|failed to load/);
});
test('Python challenge submits its own code without changing the factory lab',async()=>{
 const s=setup();s.editor.value='def average(values):\n    return 42';
 await s.api.run(2,0,0);assert.match(s.submitted,/return 42/);
 assert.doesNotMatch(s.submitted,/KEEP MY LAB CODE/);
 assert.equal(s.lab.value,'KEEP MY LAB CODE');
 assert.match(s.api.panel(2,0,0),/return 42/);
});
test('German corrections keep a real cloze with four unique conjugations and correct animal-feed noun',()=>{
 const window={};vm.runInNewContext(fs.readFileSync('german-question-data.js','utf8'),{window});
 const banks=window.EBDAA_GERMAN_BANKS,q=banks[4].grammar[4];
 assert.equal(q[0],'___ du mitkommen?');assert.equal(q[1][0],'Möchtest');assert.equal(new Set(q[1]).size,4);
 assert.equal(banks[6].words[7][0],'Futter');
});
test('Pinned external SQLite script has a SHA-384 integrity check and CORS enabled',()=>{
 const src=fs.readFileSync('code-challenges.js','utf8');
 assert.match(src,/s\.src="https:\/\/cdn\.jsdelivr\.net\/npm\/sql\.js@1\.13\.0\/dist\/sql-wasm\.js";s\.integrity="sha384-[A-Za-z0-9+/]{64}";s\.crossOrigin="anonymous"/);
});
