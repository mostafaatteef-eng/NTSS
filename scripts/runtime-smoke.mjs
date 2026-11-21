/* Real browser runtime acceptance. Requires chromium and internet access to runtime CDNs. */
import {chromium} from "playwright";
import {createServer} from "node:http";
import {createReadStream,existsSync,statSync} from "node:fs";
import path from "node:path";
const root=process.cwd();
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8"};
const server=createServer((req,res)=>{
 const name=new URL(req.url,"http://localhost").pathname;
 const file=path.resolve(root,"."+(name==="/"?"/index.html":name));
 if(!file.startsWith(root+path.sep)||!existsSync(file)||!statSync(file).isFile()){res.writeHead(404);res.end("missing");return}
 res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream"});
 createReadStream(file).pipe(res)
});
await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
const host="http://127.0.0.1:"+server.address().port+"/";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const enContext=await browser.newContext({viewport:{width:1360,height:900}});
await enContext.addInitScript(()=>{try{localStorage.setItem("ebda-lang","en")}catch(_){}}); // Flows assert English copy; Arabic is the default UI.
const page=await enContext.newPage();
page.setDefaultTimeout(30000);
const errors=[];page.on("pageerror",e=>errors.push(e.message));
const stage=async(n,expand)=>{
 await page.evaluate(n=>goAdvancedStep(n),n);
 if(expand==="mystery"){
   const summary=page.locator(".advanced-stage-content details.lab-support > summary").filter({hasText:/factory mystery/i});
   await summary.click();
 }
 if(expand==="code"){
   const summary=page.locator(".advanced-stage-content details.lab-support > summary").filter({hasText:/code challenge with automated tests/i});
   await summary.click();
 }
};
const enter=async(g,u,i)=>{
 await page.goto(host,{waitUntil:"load"});
 await page.getByRole("button",{name:/View subjects/i}).nth(g-1).click();
 await page.getByRole("button",{name:/Explore subject/i}).first().click();
 await page.getByRole("button",{name:/View session index/i}).nth(u).click();
 await page.getByRole("button",{name:/HANDS-ON LAB/i}).nth(i).click();
 await page.waitForSelector(".advanced-stage-content[data-stage=\"0\"]");
};
try{
 // Start the case with proof-gating: guessing an answer before executing SQL must fail.
 await enter(2,1,0);
 await stage(2,"mystery");
 await page.locator("#case-answer").fill("3");
 await page.getByRole("button",{name:/Verify evidence & unlock/i}).click();
 if(!await page.getByText(/Execute a relevant SQL query first/i).count())throw Error("Case did not block unverified guess");
 await stage(1);
 await page.locator("#studio-editor").fill("SELECT COUNT(*) AS machine_count FROM machines;");
 await page.getByRole("button",{name:/Execute SQL|Run SQL/i}).click();
 await page.waitForFunction(()=>document.querySelector("#studio-output")?.textContent?.includes("machine_count")&&document.querySelector("#studio-output")?.textContent?.includes("3"),null,{timeout:90000});
 await stage(2,"mystery");
 await page.locator("#case-answer").fill("3");
 await page.getByRole("button",{name:/Verify evidence & unlock/i}).click();
 if(!await page.getByRole("button",{name:/Next clue/i}).count())throw Error("Valid SQL evidence did not unlock first clue");
 await page.getByRole("button",{name:/Next clue/i}).click();
 // A genuine relational JOIN must drive the second clue.
 await stage(1);
 const query="SELECT m.name, SUM(i.defects) AS total_defects FROM machines m JOIN inspections i ON i.machine_id=m.id GROUP BY m.id,m.name ORDER BY total_defects DESC;";
 await page.locator("#studio-editor").fill(query);
 await page.getByRole("button",{name:/Execute SQL|Run SQL/i}).click();
 await page.waitForFunction(()=>document.querySelector("#studio-output")?.textContent?.includes("Laser-C | 7"),null,{timeout:90000});
 const sqlOutput=await page.locator("#studio-output").textContent();
 if(!sqlOutput.includes("Press-A | 3"))throw Error("SQL JOIN result inaccurate");
 await stage(2,"mystery");
 await page.locator("#case-answer").fill("Laser-C");
 await page.getByRole("button",{name:/Verify evidence & unlock/i}).click();
 if(!await page.getByRole("button",{name:/Next clue/i}).count())throw Error("JOIN evidence did not unlock second clue");
 // Confirm read-only policy rejects statements that would mutate the database.
 await stage(1);
 await page.locator("#studio-editor").fill("DROP TABLE machines;");
 await page.getByRole("button",{name:/Execute SQL|Run SQL/i}).click();
 await page.waitForFunction(()=>document.querySelector("#studio-output")?.textContent?.includes("Read-only"),null,{timeout:4000});
 await stage(2);
 await stage(1);
 if(!await page.locator("#studio-output").textContent().then(t=>t?.includes("Read-only")))throw Error("SQL feedback lost after returning to the code editor");
 // Validate SQL challenge against two independent database fixtures.
 await stage(1,"code");
 await page.locator("#studio-editor").fill("SELECT COUNT(*) AS machine_count FROM machines;");
 await page.getByRole("button",{name:/Run test cases/i}).click();
 await page.waitForFunction(()=>document.querySelector("#ebda-code-results")?.textContent?.includes("2/2 SQL test cases passed"),null,{timeout:90000});
 // Execute Python WASM interpreter in dedicated web worker.
 await enter(2,0,0);
 await stage(1);
 await page.locator("#studio-editor").fill('readings = [3,5,8,13]\nprint("mean:",sum(readings)/len(readings))');
 await page.getByRole("button",{name:/Run Python/i}).click();
 await page.waitForFunction(()=>document.querySelector("#studio-output")?.textContent?.includes("mean: 7.25"),null,{timeout:90000});
 const pythonOutput=await page.locator("#studio-output").textContent();
 if(!pythonOutput.includes("mean: 7.25"))throw Error("Pyodide output invalid");
 // Validate student-defined Python function using three real test inputs.
 await stage(1,"code");
 await page.locator("#studio-editor").fill("def average(values):\n    return sum(values)/len(values)");
 await page.getByRole("button",{name:/Run test cases/i}).click();
 await page.waitForFunction(()=>document.querySelector("#ebda-code-results")?.textContent?.includes("3 / 3 Python test cases passed"),null,{timeout:90000});

 if(errors.length)throw Error("Browser errors: "+errors.join("; "));
 console.log("RUNTIME PASS: SQLite JOIN and multi-dataset SQL grading, read-only policy, Pyodide execution and three Python function test cases.");
}catch(err){console.error("RUNTIME FAIL:",err.stack||err);process.exitCode=1}
finally{await browser.close();await new Promise(ok=>server.close(ok))}
