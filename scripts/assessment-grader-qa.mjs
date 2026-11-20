import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const src=readFileSync("assessment-enhancements.js","utf8");
let reply,request;
class MockWorker{
 constructor(path){this.path=path}
 postMessage(input){request=input;this.onmessage({data:reply})}
 terminate(){}
}
const window={};
new Function("window","Worker","setTimeout","clearTimeout",src)(window,MockWorker,()=>1,()=>{});
const run=(q,code)=>new Promise(resolve=>window.NTSS_ASSESSMENT.run(q,code,resolve));
const python={engine:"python",codeTask:{tests:[["average([70,80,90])",80],["average([2,4,6])",4],["average([10,20])",15]]}};
reply={ok:true,output:"NTSS_TEST:PASS\nNTSS_TEST:PASS\nNTSS_TEST:PASS",testCases:[{pass:false},{pass:false},{pass:false}]};
assert.equal((await run(python,"print('NTSS_TEST:PASS')")).passed,false,"Student stdout must not be accepted as evidence");
assert.deepEqual(request.tests,python.codeTask.tests);
assert.equal(request.assessment,true);
reply={ok:true,output:"",testCases:[{pass:true},{pass:true},{pass:true}]};
assert.equal((await run(python,"def average(values): return sum(values)/len(values)")).passed,true);
reply={ok:true,output:"",testCases:[{pass:true},{pass:false},{pass:true}]};
assert.equal((await run(python,"def average(values): return 80")).passed,false);
const sql={engine:"sql",codeTask:{expected:[["Mona"]],second:[["Ali"]]}};
reply={ok:true,assessmentCases:[[["Mona"]],[["Ali"]]]};
assert.equal((await run(sql,"SELECT name FROM students")).passed,true);
assert.equal(request.assessment,true);
reply={ok:true,assessmentCases:[[["Mona"]],[["Nour"]]]};
assert.equal((await run(sql,"SELECT name FROM students")).passed,false);
reply={ok:false,output:"Failed to load Pyodide: network error"};
assert.equal((await run(python,"def average(values): pass")).runtimeError,true,"Runtime faults must not count against the student");
reply={ok:false,output:"SyntaxError: invalid syntax"};
assert.equal((await run(python,"def average(values)")).runtimeError,false,"Invalid student code should be graded");
console.log("Assessment grader checks passed: independent Python tests, two SQL fixtures, spoof resistance and infrastructure errors.");
