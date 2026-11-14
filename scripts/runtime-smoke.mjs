/* Real browser runtime acceptance. Requires chromium and internet access to runtime CDNs. */
import {chromium} from "playwright";
import {createServer} from "node:http";
import {createReadStream,existsSync,statSync} from "node:fs";
import path from "node:path";
const root=process.cwd();
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8"};
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
const page=await browser.newPage({viewport:{width:1360,height:900}});
page.setDefaultTimeout(30000);
const errors=[];page.on("pageerror",e=>errors.push(e.message));
const enter=async(g,u,i)=>{
 await page.goto(host,{waitUntil:"load"});
 await page.getByRole("button",{name:/View subjects/i}).nth(g-1).click();
 await page.getByRole("button",{name:/Explore subject/i}).click();
 await page.getByRole("button",{name:/View session index/i}).nth(u).click();
 await page.getByRole("button",{name:/HANDS-ON LAB/i}).nth(i).click();
 await page.waitForSelector("#studio-editor");
};
try{
 // Start the case with proof-gating: guessing an answer before executing SQL must fail.
 await enter(2,1,0);
 await page.locator("#case-answer").fill("3");
 await page.getByRole("button",{name:/Verify evidence & unlock/i}).click();
 if(!await page.getByText(/Execute a relevant SQL query first/i).count())throw Error("Case did not block unverified guess");
 await page.locator("#studio-editor").fill("SELECT COUNT(*) AS machine_count FROM machines;");
 await page.getByRole("button",{name:/Execute SQL|Run SQL/i}).click();
 await page.waitForFunction(()=>document.querySelector("#studio-output")?.textContent?.includes("machine_count")&&document.querySelector("#studio-output")?.textContent?.includes("3"),null,{timeout:90000});
 await page.locator("#case-answer").fill("3");
 await page.getByRole("button",{name:/Verify evidence & unlock/i}).click();
 if(!await page.getByRole("button",{name:/Next clue/i}).count())throw Error("Valid SQL evidence did not unlock first clue");
 await page.getByRole("button",{name:/Next clue/i}).click();
 // A genuine relational JOIN must drive the second clue.
 const query="SELECT m.name, SUM(i.defects) AS total_defects FROM machines m JOIN inspections i ON i.machine_id=m.id GROUP BY m.id,m.name ORDER BY total_defects DESC;";
 await page.locator("#studio-editor").fill(query);
 await page.getByRole("button",{name:/Execute SQL|Run SQL/i}).click();
 await page.waitForFunction(()=>document.querySelector("#studio-output")?.textContent?.includes("Laser-C | 7"),null,{timeout:90000});
 const sqlOutput=await page.locator("#studio-output").textContent();
 if(!sqlOutput.includes("Press-A | 3"))throw Error("SQL JOIN result inaccurate");
 await page.locator("#case-answer").fill("Laser-C");
 await page.getByRole("button",{name:/Verify evidence & unlock/i}).click();
 if(!await page.getByRole("button",{name:/Next clue/i}).count())throw Error("JOIN evidence did not unlock second clue");
 // Confirm read-only policy rejects statements that would mutate the database.
 await page.locator("#studio-editor").fill("DROP TABLE machines;");
 await page.getByRole("button",{name:/Execute SQL|Run SQL/i}).click();
 await page.waitForFunction(()=>document.querySelector("#studio-output")?.textContent?.includes("Read-only"),null,{timeout:4000});
 // Execute Python WASM interpreter in dedicated web worker.
 await enter(2,0,0);
 await page.locator("#studio-editor").fill('readings = [3,5,8,13]\nprint("mean:",sum(readings)/len(readings))');
 await page.getByRole("button",{name:/Run Python/i}).click();
 await page.waitForFunction(()=>document.querySelector("#studio-output")?.textContent?.includes("mean: 7.25"),null,{timeout:90000});
 const pythonOutput=await page.locator("#studio-output").textContent();
 if(!pythonOutput.includes("mean: 7.25"))throw Error("Pyodide output invalid");
 if(errors.length)throw Error("Browser errors: "+errors.join("; "));
 console.log("RUNTIME PASS: real SQLite WASM/JOIN, read-only SQL policy, and Python/Pyodide worker execution.");
}catch(err){console.error("RUNTIME FAIL:",err.stack||err);process.exitCode=1}
finally{await browser.close();await new Promise(ok=>server.close(ok))}
