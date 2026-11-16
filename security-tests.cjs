'use strict';
/* NTSS security regression checks — static checks plus mocked worker policy tests.
 * These are not penetration tests or proof of isolation against hostile code. */
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const read=path=>fs.readFileSync(path,'utf8');

test('JavaScript modules and extracted application entrypoint parse',()=>{
  for(const path of ['coding-labs.js','python-lab-worker.js','sql-lab-worker.js','lesson-completion.js','gamified-questions.js','context-mini-games.js','app-main.js']){
    assert.doesNotThrow(()=>new vm.Script(read(path),{filename:path}),path);
  }
  const page=read('index.html');
  assert.match(page,/src="app-main\.js\?v=/);
  assert.doesNotMatch(page,/<script>([\s\S]*?)<\/script>/,'No inline application script expected');
});

test('CSP restricts plugins, framing and forms without breaking current inline UI',()=>{
 const page=read('index.html');
 assert.match(page,/<meta http-equiv="Content-Security-Policy"/);
 for(const directive of ["object-src 'none'","frame-src 'none'","base-uri 'none'","form-action 'none'","worker-src 'self'"])
  assert.ok(page.includes(directive),directive);
 assert.match(page,/coding-labs\.js\?v=20261116-security2/);
});

test('SQL worker accepts only single SELECT over fictional data',async()=>{
 const messages=[],executed=[];
 const self={postMessage(v){messages.push(v)}};
 const mockSQL={Database:class{
  run(query){executed.push(query)}
  exec(query){executed.push(query);return [{columns:['value'],values:[[1]]}]}
  close(){}
 }};
 const context={self,importScripts(){},initSqlJs:async()=>mockSQL};
 vm.runInNewContext(read('sql-lab-worker.js'),context);
 const check=async(code,allowed)=>{
   messages.length=0;executed.length=0;
   await self.onmessage({data:{code}});
   assert.equal(messages.length,1,'Exactly one worker response');
   assert.equal(messages[0].ok,allowed,code.slice(0,50));
   if(!allowed)assert.equal(executed.length,0,'Disallowed SQL must not create a database or execute a query');
 };
 await check('SELECT name FROM students WHERE grade >= 85 ORDER BY grade DESC;',true);
 await check('SELECT city, COUNT(*) FROM students GROUP BY city;',true);
 await check('DELETE FROM students',false);
 await check('UPDATE students SET grade=0',false);
 await check('SELECT * FROM students; DROP TABLE students',false);
 await check('SELECT * FROM students -- comment',false);
 await check('X'.repeat(2001),false);
});

test('Python lab has explicit AST preflight, module restrictions and output caps',()=>{
 const source=read('python-lab-worker.js');
 assert.match(source,/ast\.parse/);
 assert.match(source,/ast\.walk/);
 assert.match(source,/MAX_CODE=3000/);
 assert.match(source,/MAX_OUTPUT=8000/);
 assert.match(source,/pyodide\.runPython\(CHECK\)/);
 assert.match(source,/pyodide\.runPythonAsync\(data\.code\)/);
});

test('Cancellation invalidates pending workers',()=>{
 const source=read('coding-labs.js');
 assert.match(source,/function stop\(\)\{runId\+\+/);
 assert.match(source,/if\(id!==runId\)return/);
 assert.match(source,/kind==="python"\?3000:2000/);
});

test('Certificates are identified as unverified, with no server persistence',()=>{
 const source=read('lesson-completion.js');
 assert.match(source,/not an officially verified school credential/i);
 assert.doesNotMatch(source,/\blocalStorage\.(?:setItem|getItem)\s*\(/);
 assert.doesNotMatch(source,/\bfetch\s*\(/);
});
