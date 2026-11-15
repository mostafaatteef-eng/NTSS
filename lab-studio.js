/* Experimental browser learning labs. Source-mapped unit indicators, no learner storage. */
window.EBDAA_STUDIO=(function(){
let currentKey="",v=4,ans=null,graded=false,out="",numericChecked=false,numericInput="",editPython="",editSQL="",activeWorker=null,activeSection=0;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=x=>Number(x).toFixed(3);
const unit=(g,u)=>window.EBDAA_GRADES.grades[g-1].subjects[0].units[u];
const profile=(g,u)=>window.EBDAA_PERFORMANCE[g+"-"+(u+1)];
function reset(){if(activeWorker)activeWorker.terminate();activeWorker=null;currentKey="";v=4;ans=null;graded=false;out="";numericChecked=false;numericInput="";activeSection=0;}
function value(x){v=Number(x);numericChecked=false;numericInput="";const route=currentKey.split("-").map(Number);if(route.length===3&&route[0]>=2)window.EBDA_RUBRIC.markManipulation(route[0],route[1],route[2]);render();}
function pick(i){if(!graded){ans=i;render()}}
function check(){if(graded||ans===null)return;graded=true;render()}function isChecked(){return graded}function checkNumeric(g,u,i){const el=document.getElementById("numeric-input");numericInput=el?el.value:"";numericChecked=true;const q=window.EBDAA_NUMERIC(g,u,i,v);const valid=numericInput!==""&&Math.abs(Number(numericInput)-q.answer)<=q.tolerance;window.EBDA_RUBRIC.recordEvidence(g,u,i,valid);render()}
function select(g,u,i){const key=g+"-"+u+"-"+i;if(currentKey!==key){reset();currentKey=key;v=(i%5)+3;editPython=pythonSample(i);editSQL=sqlSample(i)}}
function pythonSample(i){const samples=[
'readings = [3, 5, 8, 13]\nprint("mean:", sum(readings) / len(readings))',
'rows = ["101,Cairo,4", "102,Giza,6"]\nfor row in rows:\n    print(row.split(","))',
'import re\ntext = "sensor-101: ERROR; sensor-202: OK"\nprint(re.findall(r"sensor-\\d+", text))',
'def clean(values):\n    return sorted(set(x for x in values if x >= 0))\nprint(clean([3, -1, 3, 7, 5]))',
'def factorial(n):\n    return 1 if n <= 1 else n*factorial(n-1)\nprint(factorial(5))',
'try:\n    print(10/0)\nexcept ZeroDivisionError:\n    print("Handled error")'];return samples[i%6]}
function sqlSample(i){return [
'SELECT m.name, SUM(i.defects) AS total_defects FROM machines m JOIN inspections i ON i.machine_id=m.id GROUP BY m.id, m.name ORDER BY total_defects DESC;',
'SELECT m.name, o.name AS operator FROM machines m LEFT JOIN operators o ON o.machine_id=m.id ORDER BY m.name;',
'SELECT m.line, COUNT(i.id) AS inspections FROM machines m LEFT JOIN inspections i ON i.machine_id=m.id GROUP BY m.id, m.line;',
'SELECT region, ROUND(AVG(qty),2) AS average_qty FROM production GROUP BY region;',
'SELECT m.name, SUM(i.defects) AS defects FROM machines m INNER JOIN inspections i ON i.machine_id=m.id GROUP BY m.id, m.name;',
'SELECT COUNT(*) AS machine_count FROM machines;'
][i%6]}
function slider(max=12){return '<label for="studio-slider">Adjust experimental input: <b>'+v+'</b></label><input id="studio-slider" class="range" type="range" min="1" max="'+max+'" value="'+v+'" oninput="EBDAA_STUDIO.value(this.value)">'}
function calculated(d){
 const f=d.family;const specialty=window.EBDAA_SPECIAL?window.EBDAA_SPECIAL(d.year,d.u,d.i,v):null;if(specialty)return specialty;let display="",explain="";
 if(f==="statistics"){const vals=[3,5,7,8,10,13,v];const mean=vals.reduce((a,b)=>a+b)/7;const variance=vals.reduce((a,b)=>a+(b-mean)**2,0)/6;const t=(mean-8)/(Math.sqrt(variance)/Math.sqrt(7));display="Mean: "+fmt(mean)+" · SD: "+fmt(Math.sqrt(variance))+" · one-sample t: "+fmt(t);explain="t=(sample mean − 8)/(sample SD/√7). This is a calculated test statistic, not a significance conclusion."}
 else if(f==="ml"||f==="agriculture"){const pts=[{x:1,y:2,c:0},{x:2,y:2,c:0},{x:4,y:4,c:0},{x:6,y:6,c:1},{x:8,y:8,c:1},{x:9,y:7,c:1}];const nearest=pts.map(p=>({...p,dist:Math.hypot(p.x-v,p.y-5)})).sort((a,b)=>a.dist-b.dist).slice(0,3);const high=nearest.filter(p=>p.c===1).length>=2;display="KNN, k=3, query ("+v+",5) → class "+(high?"High":"Low")+"; neighbors: "+nearest.map(p=>"("+p.x+","+p.y+") d="+fmt(p.dist)).join(" / ");explain="Uses calculated Euclidean distances and majority voting on synthetic labeled observations."}
 else if(f==="preprocess"){const raw=[null,3,4,4,7,10,v,-3],good=raw.filter(x=>x!==null&&x>=0),unique=[...new Set(good)];display="Clean candidates: ["+unique.join(", ")+"]; missing: 1; invalid negatives: 1; duplicates: "+(good.length-unique.length);explain="A demonstration of filtering and duplicate detection; missing values and invalid rows require documented treatment, not guessed replacements."}
 else if(f==="annotation"){const a=["defect","clear","defect","clear","defect","clear"],b=["defect","clear",v%2?"clear":"defect","clear","defect","clear"];const agreements=a.filter((x,i)=>x===b[i]).length;display="Two-annotator raw agreement: "+agreements+"/6 = "+fmt(agreements/6*100)+"%";explain="Agreement measures consistency but not chance-corrected agreement (Cohen's kappa)."}
 else if(f==="monitor"){const latencies=[110,130,145,180,210,v*45];display="Average latency: "+fmt(latencies.reduce((a,b)=>a+b)/6)+" ms; >200ms alerts: "+latencies.filter(x=>x>200).length;explain="Real calculation on synthetic telemetry; trace/log review is required for root-cause diagnosis."}
 else if(f==="pipeline"){const records=[{id:1,r:"E",q:4},{id:2,r:"East",q:v},{id:2,r:"EAST",q:v},{id:3,r:"W",q:6}],seen=new Set();const cleaned=records.filter(r=>{if(seen.has(r.id))return false;seen.add(r.id);return true});display="Raw rows: 4; unique IDs: "+cleaned.length+"; East Qty: "+cleaned.filter(x=>x.r==="E"||x.r==="East").reduce((a,b)=>a+b.q,0);explain="Demonstrates record deduplication and aggregation. Actual ETL should log decisions and reconcile conflicts."}
 else if(f==="fairness"){display="Group A: 8/10 approvals (80%); group B: "+v+"/10 ("+(v*10)+"%); disparity: "+Math.abs(80-v*10)+" percentage points";explain="Approval-rate difference is only a screening indicator, not a complete fairness conclusion."}
 return '<div class="interactive"><div class="eyebrow">LIVE CALCULATION · SYNTHETIC DATA</div><h3>Experiment with this concept</h3><p>Change the input and observe the recalculated result.</p>'+slider(10)+'<div class="feedback"><b>Computed result</b><p>'+esc(display)+'</p></div><p class="muted">'+esc(explain)+'</p></div>';
}
function program(d){
const python=d.family==="python",language=python?"Python":"SQL",code=python?editPython:editSQL;
return '<section class="lab-workspace" aria-label="'+language+' interactive laboratory"><div class="lab-workspace__header"><div><div class="eyebrow">EBDA INTERACTIVE LABORATORY</div><h3 class="lab-workspace__title">'+language+' Code Studio</h3></div><span class="lab-workspace__badge">Browser WebAssembly</span></div><div class="lab-workspace__body"><p class="lab-workspace__hint">'+(python?"Edit and run Python in a time-limited Pyodide worker.":"Run read-only SQLite SELECT/WITH queries against a disposable synthetic factory dataset.")+' First execution requires internet access.</p><label class="lab-workspace__editor-label" for="studio-editor">Code editor · '+language+'</label><textarea id="studio-editor" class="lab-workspace__editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-describedby="studio-shortcut" oninput="EBDAA_STUDIO.saveEditor(this.value)" onkeydown="EBDAA_STUDIO.editorKey(event)">'+esc(code)+'</textarea><p class="lab-workspace__hint" id="studio-shortcut">Shortcut: Ctrl+Enter (Windows/Linux) or ⌘+Enter (Mac) to run. Output appears below.</p><div class="lab-workspace__toolbar"><button type="button" class="btn teal" onclick="EBDAA_STUDIO.'+(python?'runPython':'runSQL')+'()">▶ Run '+language+'</button><button type="button" class="btn light" onclick="EBDAA_STUDIO.resetEditor()">↺ Restore example</button></div><label class="lab-workspace__editor-label" for="studio-output">Execution output</label><pre id="studio-output" class="lab-workspace__output" role="status" aria-live="polite" tabindex="0">'+esc(out||"Run the exercise to view its output.")+'</pre></div></section>'}
function saveEditor(value){const family=profile(...currentKey.split("-").slice(0,2).map(Number)).engine;if(family==="python")editPython=String(value);else if(family==="sql")editSQL=String(value)}
function resetEditor(){const [g,u,i]=currentKey.split("-").map(Number);if(!Number.isFinite(i))return;const python=profile(g,u).engine==="python";if(python)editPython=pythonSample(i);else editSQL=sqlSample(i);out="";const input=document.getElementById("studio-editor"),output=document.getElementById("studio-output");if(input){input.value=python?editPython:editSQL;input.focus()}if(output)output.textContent="Example restored. Run to see results."}
function editorKey(event){if(event.key==="Enter"&&(event.ctrlKey||event.metaKey)){event.preventDefault();const [g,u]=currentKey.split("-").map(Number);if(profile(g,u).engine==="python")runPython();else runSQL()}}
function setSection(n){
 activeSection=Math.max(0,Math.min(4,Number(n)||0));
 const status=document.getElementById("lab-stage-status");
 if(status)status.textContent="Stage "+(activeSection+1)+" of 5";
 const meter=document.getElementById("lab-stage-meter");
 if(meter)meter.style.width=(20*(activeSection+1))+"%";
}
function goToSection(n){
 setSection(n);
 const nodes=[...document.querySelectorAll(".lab-journey > details.lab-module")];
 if(!nodes.length){if(typeof render==="function")render();return}
 nodes.forEach((node,i)=>{node.open=i===activeSection});
 const target=nodes[activeSection];
 if(target){target.scrollIntoView({behavior:"auto",block:"start"});const heading=target.querySelector("summary");if(heading)heading.focus({preventScroll:true})}
}

function moduleView(g,u,i,n,title,subtitle,content){
 const labels=["Experiment","Understand","Practice","Reflect"];
 const forward=n<4?'<div class="lab-module__footer"><button class="btn teal" type="button" onclick="EBDAA_STUDIO.goToSection('+(n+1)+')">Continue to '+labels[n]+' →</button></div>':'';
 return '<details class="lab-module" name="ebda-lab-'+g+'-'+u+'-'+i+'" '+(activeSection===n?'open':'')+
 ' ontoggle="if(this.open)EBDAA_STUDIO.setSection('+n+')">'+
 '<summary><span class="lab-module__num">'+String(n+1).padStart(2,"0")+'</span>'+
 '<span class="lab-module__copy"><span class="lab-module__title">'+esc(title)+'</span>'+
 '<span class="lab-module__desc">'+esc(subtitle)+'</span></span></summary>'+
 '<div class="lab-module__body">'+content+forward+'</div></details>';
}
function session(g,u,i,n=0){
 const p=profile(g,u),name=unit(g,u).sessions[i];select(g,u,i);
 const d={family:p.engine,year:g,u,i},mission=window.EBDAA_MISSIONS.find(m=>m.g===g&&m.u===u);
 const q=mission.steps[i%mission.steps.length],guide=window.EBDAA_SESSION_GUIDES[g+"-"+(u+1)+"-"+(i+1)];

 const calc=window.EBDAA_NUMERIC(g,u,i,v),right=numericInput!==""&&Math.abs(Number(numericInput)-calc.answer)<=calc.tolerance;
 const evidence='<section class="interactive"><div class="eyebrow">EVIDENCE CHECK · CALCULATE YOUR ANSWER</div><h3>'+esc(calc.question)+'</h3>'+
 '<label class="lab-workspace__editor-label" for="numeric-input">Your result</label><input id="numeric-input" inputmode="decimal" type="number" step="any" value="'+esc(numericInput)+'" placeholder="Enter calculated result" style="padding:13px;border:1px solid #aeb9b5;border-radius:11px;max-width:260px;width:100%">'+
 '<div class="actions"><button class="btn teal" onclick="EBDAA_STUDIO.checkNumeric('+g+','+u+','+i+')">Check calculated answer</button></div>'+
 (numericChecked?'<div class="feedback '+(right?'':'error')+'"><b>'+(right?'Calculation correct':'Recheck the calculation')+'</b><p>'+esc(calc.explanation)+'</p></div>':'')+'</section>';
 const check='<section class="interactive"><div class="eyebrow">EMBEDDED FORMATIVE CHALLENGE</div><h3>'+esc(q[0])+'</h3>'+
 '<div class="choices">'+q[1].map((a,j)=>'<button class="choice '+(ans===j?'chosen ':'')+(graded&&j===q[2]?'correct':'')+'" '+(graded?'disabled':'')+' onclick="EBDAA_STUDIO.pick('+j+')">'+esc(a)+'</button>').join("")+'</div>'+
 (graded?'<div class="feedback '+(ans===q[2]?'':'error')+'"><b>'+(ans===q[2]?'Correct':'Review the reasoning')+'</b><p>'+esc(q[3])+'</p></div>':'<div class="actions"><button class="btn teal" '+(ans===null?'disabled':'')+' onclick="EBDAA_STUDIO.check()">Check answer</button></div>')+'</section>';
 const outcomes='<details class="interactive"><summary><b>Learning Outcomes · Performance Indicators (unit level)</b></summary><p class="muted">'+esc(p.source)+'</p>'+
 '<b>Learning outcomes:</b><ul>'+p.outcomes.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>'+
 '<b>Performance indicators:</b><ul>'+p.kpis.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>'+
 '<p class="muted">This is a proposed session alignment to unit indicators, not a certified official assessment.</p></details>';
 const discover=window.EBDA_THEORY.advanced(g,u,i,guide,p,name);
 const extraCode=window.EBDA_CODE_TESTS.panel(g,u,i);
 const experiment=(p.engine==="python"||p.engine==="sql"?program(d):calculated(d))+
 '<details class="lab-support"><summary>Check the result with a calculation</summary><div class="lab-support__body">'+evidence+'</div></details>'+
 (extraCode?'<details class="lab-support"><summary>Try a code challenge with automated tests</summary><div class="lab-support__body">'+extraCode+'</div></details>':'');
 const understand=window.EBDA_PUZZLES.panel(g,u,i)+
 '<details class="lab-support puzzle-expand"><summary>👁 Explore the visual explanation</summary><div class="lab-support__body">'+window.EBDA_VISUALIZER.panel(g,u,i)+'</div></details>'+
 '<details class="lab-support puzzle-expand"><summary>🧪 Try the data playground</summary><div class="lab-support__body">'+window.EBDA_PLAYGROUND.panel(g,u,i)+'</div></details>'+
 '<details class="lab-support puzzle-expand"><summary>🔎 Unlock the factory mystery</summary><div class="lab-support__body">'+
 window.EBDAA_STORIES.panel(g,u,i)+window.EBDAA_CASE.panel(g,u,i)+'</div></details>';
 const review=window.EBDA_RUBRIC.panel(g,u,i)+outcomes+
 '<div class="actions"><button class="btn light" onclick="EBDAA_STUDIO.exportEvidence('+g+','+u+','+i+')">↓ Save my lab evidence (.txt)</button></div>';
 const practice=window.EBDAA_PRACTICE.panel(g,u,i)+
 '<details class="lab-support"><summary>Optional factory mission and skills review</summary><div class="lab-support__body">'+
 window.EBDAA_STORIES.panel(g,u,i)+window.EBDAA_CASE.panel(g,u,i)+review+'</div></details>';
 const names=["Discover","Experiment","Understand","Check","Practice"];
 const bodies=[discover,experiment,understand,check,practice];
 const selected=Math.max(0,Math.min(4,Number(n)||0));
 return '<div class="eyebrow">YEAR '+g+' · UNIT '+(u+1)+' · SESSION '+(i+1)+'</div>'+
 (selected===0?'':'<h2 class="advanced-lesson-title">'+esc(name)+'</h2>')+
 '<p class="advanced-lesson-intro">'+esc([
 "Start with one clear idea. Predict what you will observe.",
 "Try the experiment. Run code or change values and compare the results.",
 "Solve three quick puzzles, then explore the visual explanation.",
 "Check your understanding with one short question.",
 "Apply what you learned in 50 guided questions, with help when needed."
 ][selected])+'</p>'+
 '<div class="advanced-stage-content" data-stage="'+selected+'">'+bodies[selected]+'</div>'+
 '<p class="source">Academic source: '+esc(p.source)+' · Supplementary activities; full official rubric requires academic review.</p>';

}
async function runSQL(){const input=document.getElementById("studio-editor"),output=document.getElementById("studio-output");if(!input||!output)return;editSQL=input.value;const code=editSQL.trim();if(!/^(SELECT|WITH)\b/i.test(code)||/\b(INSERT|DELETE|UPDATE|DROP|ALTER|ATTACH|DETACH|PRAGMA|CREATE|REPLACE)\b/i.test(code)){setOutput("Read-only SELECT/WITH statements only.");return}setOutput("Loading SQLite runtime...");try{if(!window.initSqlJs){await new Promise((ok,fail)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/sql-wasm.js";s.onload=ok;s.onerror=()=>fail(Error("SQLite CDN unavailable"));document.head.appendChild(s)})}const SQL=await window.initSqlJs({locateFile:f=>"https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/"+f});const db=new SQL.Database();db.run("PRAGMA foreign_keys=ON; CREATE TABLE production(id INTEGER PRIMARY KEY,region TEXT, product TEXT,qty INTEGER); INSERT INTO production VALUES (1,'Cairo','Panel',5),(2,'Giza','Panel',8),(3,'Cairo','Glass',3),(4,'Alexandria','Glass',10),(5,'Giza','Panel',4); CREATE TABLE machines(id INTEGER PRIMARY KEY,name TEXT NOT NULL,line TEXT); INSERT INTO machines VALUES (1,'Laser-C','Cutting'),(2,'Press-A','Forming'),(3,'Vision-B','Inspection'); CREATE TABLE inspections(id INTEGER PRIMARY KEY,machine_id INTEGER REFERENCES machines(id),defects INTEGER NOT NULL CHECK(defects>=0)); INSERT INTO inspections VALUES (101,1,2),(102,1,5),(103,2,1),(104,3,0),(105,2,2); CREATE TABLE operators(id INTEGER PRIMARY KEY,name TEXT,machine_id INTEGER REFERENCES machines(id)); INSERT INTO operators VALUES (201,'Salma',1),(202,'Omar',2),(203,'Nada',3);");const res=db.exec(code);const route=currentKey.split("-").map(Number);if(route.length===3)window.EBDA_RUBRIC.observe(route[0],route[1],route[2],{success:true,hasEvidence:res.length>0&&res.some(x=>x.values.length>0),output:JSON.stringify(res).slice(0,1000)});if(route.length===3&&window.EBDAA_CASE)window.EBDAA_CASE.observe(route[0],route[1],route[2],res);setOutput(res.length?res.map(r=>r.columns.join(" | ")+"\n"+r.values.map(v=>v.join(" | ")).join("\n")).join("\n"):"No rows found.");db.close()}catch(e){setOutput("SQL error: "+String(e.message||e))}}
function exportEvidence(g,u,i){
const p=profile(g,u),name=unit(g,u).sessions[i];
const editor=document.getElementById("studio-editor");
const entered=document.getElementById("numeric-input");
const pythonOrSql=(p.engine==="python"||p.engine==="sql");
const record=[
"EBDA Learning · Practical Study Evidence",
"Year: "+g,"Unit: "+(u+1),"Session: "+(i+1),
"Topic: "+name,"Teacher-guide source: "+p.source,
"Proposed learning outcome(s): "+p.outcomes.join(" | "),
"Unit indicators: "+p.kpis.join(" | "),
"Lab engine: "+p.engine,
"Adjustable example value: "+v,
"Code/query (student-edited where applicable):",
pythonOrSql?(editor?editor.value:(p.engine==="python"?editPython:editSQL)):"Browser-based illustrative calculation; see screen for its calculated outcome.",
"Last numerical evidence answer entered: "+(entered?entered.value:numericInput||"Not entered"),
"Practical rubric automatic points: "+window.EBDA_RUBRIC.score(g,u,i).earned+" / 65",
"Teacher review points: 35 reserved (not automatically awarded)",
"Student interpretation (pending review): "+window.EBDA_RUBRIC.get(g,u,i).interpretation,
"Visual playground changed this visit: "+window.EBDA_PLAYGROUND.changed(g,u,i),
"Learning note: This is an unverified student practice artifact, not an accredited product-checklist submission.",
"Student name and personal identifiers: not collected"
].join("\n");
const blob=new Blob([record],{type:"text/plain;charset=utf-8"});
const href=URL.createObjectURL(blob);const a=document.createElement("a");
a.href=href;a.download="EBDA-year"+g+"-unit"+(u+1)+"-session"+(i+1)+"-evidence.txt";
document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),5000);
}
function setOutput(message){out=String(message);const node=document.getElementById("studio-output");if(node)node.textContent=out}
function runPython(override){const input=document.getElementById("studio-editor"),output=document.getElementById("studio-output");if(!input||!output)return;editPython=input.value;const submittedCode=typeof override==="string"?override:editPython;if(activeWorker)activeWorker.terminate();setOutput("Loading Python runtime...");const workerCode='importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js");(async()=>{try{const py=await loadPyodide({stdout:s=>postMessage({type:"print",text:s}),stderr:s=>postMessage({type:"print",text:s})});postMessage({type:"ready"});onmessage=async e=>{try{await py.runPythonAsync(e.data);postMessage({type:"done"})}catch(err){postMessage({type:"error",text:String(err)})}}}catch(e){postMessage({type:"error",text:String(e)})}})();';const url=URL.createObjectURL(new Blob([workerCode],{type:"text/javascript"}));const w=new Worker(url);activeWorker=w;let lines=[];let timeout=setTimeout(()=>{if(activeWorker===w){w.terminate();URL.revokeObjectURL(url);activeWorker=null;setOutput("Python runtime load exceeded 45 seconds. Check network connectivity.")}},45000);w.onmessage=e=>{const m=e.data;if(m.type==="ready"){URL.revokeObjectURL(url);clearTimeout(timeout);timeout=setTimeout(()=>{if(activeWorker===w){w.terminate();activeWorker=null;setOutput(lines.join("\n")+"\nExecution stopped after 12 seconds (possible infinite loop).")}},12000);setOutput("Executing...");w.postMessage(submittedCode)}else if(m.type==="print"){lines.push(m.text);setOutput(lines.join("\n"))}else if(m.type==="done"||m.type==="error"){if(m.type==="error")lines.push(m.text);setOutput(lines.join("\n")||"(no printed output)");if(m.type==="done"){const route=currentKey.split("-").map(Number);if(typeof override==="string"&&route.length===3&&window.EBDA_CODE_TESTS)window.EBDA_CODE_TESTS.reportPython(route[0],route[1],route[2],lines);if(route.length===3)window.EBDA_RUBRIC.observe(route[0],route[1],route[2],{success:true,hasEvidence:lines.length>0,output:lines.join("\n")});}clearTimeout(timeout);w.terminate();activeWorker=null}};w.onerror=()=>{setOutput("Unable to load Python worker. Check internet access.");clearTimeout(timeout);URL.revokeObjectURL(url);w.terminate();activeWorker=null}}
return {reset,session,setSection,goToSection,value,pick,check,isChecked,checkNumeric,runSQL,runPython,exportEvidence,saveEditor,resetEditor,editorKey};
})();