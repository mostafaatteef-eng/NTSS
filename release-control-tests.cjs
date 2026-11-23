'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const publisher='deploy-pages.yml';
// Freeze the reviewed gate, triggers, job-level permissions and curated artifact.
// Intentional future gate changes require review of this baseline too.
const reviewedGateHash='08fc772650b183adec9634253819d1ed6bd24aed389c898528d72f12c50d7fd6';
const hash=text=>crypto.createHash('sha256').update(text).digest('hex');
function check(workflows){
 assert.ok(!Object.hasOwn(workflows,'static.yml'),'Retired ungated publisher must not return');
 assert.ok(Object.hasOwn(workflows,publisher),'Validated publisher must exist');
 assert.equal(hash(workflows[publisher]),reviewedGateHash,'Reviewed validation/deployment workflow changed');
 for(const [name,text] of Object.entries(workflows)){
  if(name===publisher)continue;
  assert.doesNotMatch(text,/\b(?:pages|id-token)["']?\s*:\s*["']?write\b/i,name+' has deployment-capable permission');
  assert.doesNotMatch(text,/\bpermissions\s*:\s*["']?write-all\b/i,name+' grants all write permissions');
  assert.doesNotMatch(text,/\buses\s*:\s*["']?actions\/(?:deploy-pages|upload-pages-artifact)@/i,name+' adds another Pages publishing path');
 }
}
const dir='.github/workflows';
const current=()=>Object.fromEntries(fs.readdirSync(dir).filter(n=>/\.ya?ml$/i.test(n)).map(n=>[n,fs.readFileSync(dir+'/'+n,'utf8')]));
test('Exactly the reviewed validated route can publish Pages',()=>check(current()));
test('Release control rejects a restored or renamed parallel publisher',()=>{
 const source='on: [push, workflow_dispatch]\npermissions:\n  pages: write\n  id-token: write\njobs:\n  deploy:\n    steps:\n      - uses: actions/deploy-pages@v5\n';
 for(const name of ['static.yml','renamed-publisher.yaml'])assert.throws(()=>check({...current(),[name]:source}));
});
test('Release control rejects a removed gate dependency or runtime assertion step',()=>{
 for(const [from,to] of [['    needs: verify\n',''],['      - name: Real Pyodide and SQLite WebAssembly runtime tests\n        run: node scripts/runtime-smoke.mjs\n','']]){
  const workflows=current();assert.ok(workflows[publisher].includes(from));workflows[publisher]=workflows[publisher].replace(from,to);assert.throws(()=>check(workflows));
 }
});
test('Release control rejects alternate deploy permissions and Pages actions',()=>{
 for(const source of ['permissions: write-all','permissions:\n  "pages": "write"','permissions:\n  id-token: write','steps:\n  - uses: actions/deploy-pages@v5','steps:\n  - uses: actions/upload-pages-artifact@v3'])assert.throws(()=>check({...current(),'alternate.yml':source}));
});
