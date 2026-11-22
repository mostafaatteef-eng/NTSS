/* Original EBDA industrial mystery — conceptually inspired by SQL investigation games, not copied. */
window.EBDAA_CASE=(function(){
const tables={
machines:[{id:1,name:"Laser-C",line:"Cutting"},{id:2,name:"Press-A",line:"Forming"},{id:3,name:"Vision-B",line:"Inspection"}],
inspections:[{id:101,machine_id:1,defects:2},{id:102,machine_id:1,defects:5},{id:103,machine_id:2,defects:1},{id:104,machine_id:3,defects:0},{id:105,machine_id:2,defects:2}],
operators:[{id:201,name:"Salma",machine_id:1},{id:202,name:"Omar",machine_id:2},{id:203,name:"Nada",machine_id:3}]
};
const clues=[
{title:"Count the machines",prompt:"A production report is missing. How many machines are listed in the machines table?",answer:"3",hint:"COUNT(*) counts rows in a table.",sql:"SELECT COUNT(*) AS machine_count FROM machines;",reason:"Three different machine IDs exist in the machines table."},
{title:"Discover the defective machine",prompt:"JOIN inspections to machines. Which machine has the highest sum of recorded defects?",answer:"Laser-C",hint:"Join on machines.id = inspections.machine_id, GROUP BY machine and ORDER BY SUM(defects) DESC.",sql:"SELECT m.name, SUM(i.defects) AS total_defects FROM machines m JOIN inspections i ON i.machine_id = m.id GROUP BY m.id, m.name ORDER BY total_defects DESC;",reason:"Laser-C: 2+5 = 7; Press-A: 1+2 = 3; Vision-B: 0."},
{title:"Verify the evidence",prompt:"How many total defects does Laser-C have in the inspection table?",answer:"7",hint:"Filter the joined rows by the machine name and use SUM(defects).",sql:"SELECT SUM(i.defects) AS defects FROM inspections i INNER JOIN machines m ON i.machine_id=m.id WHERE m.name='Laser-C';",reason:"Two related inspection records: 2 and 5 defects, totaling 7."},
{title:"Identify the responsible inspection contact",prompt:"Which operator is assigned to Laser-C in the operators table? This identifies the contact for follow-up, NOT who caused the defects.",answer:"Salma",hint:"Join the operators and machines tables using machine_id.",sql:"SELECT o.name FROM operators o JOIN machines m ON o.machine_id=m.id WHERE m.name='Laser-C';",reason:"Salma is the listed operator. Assignment alone is not evidence of responsibility for defects."}
];
let states={};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const state=key=>states[key]||(states[key]={stage:0,entry:"",feedback:"",revealed:false,done:false,observed:false});
const key=(g,u,i)=>g+"-"+u+"-"+i;
function panel(g,u,i){
if(g!==2||![1,2].includes(u))return "";
const k=key(g,u,i),s=state(k),step=clues[Math.min(s.stage,3)];
const overview='<div class="visual-row">'+Object.entries(tables).map(([name,rows])=>'<div style="padding:11px 14px;border:1px solid #d4e4df;border-radius:10px;background:white"><b>'+name+'</b><p class="muted">'+rows.length+' sample rows</p></div>').join("")+'</div>';
return '<section class="interactive ebda-case" style="background:#f0f7f5;border:2px solid #1ca29a"><div class="eyebrow">EBDA CASE FILE · INDUSTRIAL SQL MYSTERY</div><h3>🔎 The Faulty Production Line</h3><p>A quality report has gaps. Investigate a synthetic factory database using real SQL JOIN queries, then unlock the next clue using the result.</p>'+overview+
(s.done?("<div class=\"feedback\"><b>Case solved</b><p>Laser-C recorded 7 defects. Contact Salma to investigate the maintenance and inspection logs; the data does not establish blame.</p><button class=\"btn light\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_CASE.restart((g),(u),(i))},"EBDAA_CASE.restart")+">Replay investigation</button></div>"):
("<div class=\"topmeta\"><span class=\"pill\">CLUE "+(s.stage+1)+" / 4</span><span class=\"pill\">Database detective</span></div><div class=\"stepbar\">"+(clues.map((_,j)=>'<span class="'+(j<=s.stage?"on":"")+'"></span>').join(""))+"</div><h3>"+(esc(step.title))+"</h3><p>"+(esc(step.prompt))+"</p><details><summary>Suggested SQL query (open after trying)</summary><pre style=\"white-space:pre-wrap;font:13px/1.5 monospace;background:#202934;color:#e7f1f1;padding:13px;border-radius:12px\">"+(esc(step.sql))+"</pre></details><p class=\"muted\">Run a query in the SQL editor above; the result must contain the evidence for this stage, not merely the typed answer.</p><p class=\"muted\">SQL evidence status: <b>"+(s.observed?'Verified result captured ✓':'Waiting for relevant SQL output')+"</b></p><label>Evidence from query result</label><input id=\"case-answer\" value=\""+(esc(s.entry))+"\" type=\"text\" autocomplete=\"off\" style=\"max-width:320px;width:100%;padding:12px;border:1px solid #a7b7af;border-radius:10px\" placeholder=\"Type observed result\"><div class=\"actions\"><button class=\"btn teal\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_CASE.check((g),(u),(i))},"EBDAA_CASE.check")+">Verify evidence & unlock</button></div>"+(s.feedback?'<div class="feedback '+(s.revealed?'':'error')+'">'+esc(s.feedback)+'</div>':'')+(s.revealed?("<div class=\"actions\"><button class=\"btn teal\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_CASE.next((g),(u),(i))},"EBDAA_CASE.next")+">Next clue →</button></div>"):'')+"</div>"))+'<p class="source">Original simulated case aligned to relational joins and evidence evaluation; not a copy of SQL Murder Mystery.</p></section>';
}
function reopen(){const p=document.querySelector(".ebda-case");const d=p&&p.closest("details");if(d)d.open=true}
function observe(g,u,i,results){
if(g!==2||![1,2].includes(u))return;
const s=state(key(g,u,i));if(s.done)return;
const result=results?.[0];if(!result||!Array.isArray(result.columns)||!Array.isArray(result.values))return;
const columns=result.columns.map(x=>String(x).toLowerCase());const row=result.values[0]||[];
const col=name=>columns.indexOf(name),value=name=>col(name)>=0?row[col(name)]:undefined;
let found=false;
if(s.stage===0)found=col("machine_count")>=0&&Number(value("machine_count"))===3;
if(s.stage===1)found=col("name")>=0&&col("total_defects")>=0&&String(value("name"))==="Laser-C"&&Number(value("total_defects"))===7;
if(s.stage===2)found=col("defects")>=0&&Number(value("defects"))===7;
if(s.stage===3)found=col("name")>=0&&String(value("name"))==="Salma";
if(found)s.observed=true;
}
function check(g,u,i){const k=key(g,u,i),s=state(k),el=document.getElementById("case-answer");s.entry=(el?.value||"").trim();const clue=clues[s.stage];s.revealed=s.observed&&s.entry.toLowerCase()===clue.answer.toLowerCase();s.feedback=s.revealed?clue.reason:(!s.observed?"Execute a relevant SQL query first and inspect its results.":"The typed answer does not match the SQL evidence. Try again.");render();reopen()}
function next(g,u,i){const s=state(key(g,u,i));if(!s.revealed)return;if(s.stage===3)s.done=true;else s.stage++;s.entry="";s.feedback="";s.revealed=false;s.observed=false;render();reopen()}
function restart(g,u,i){states[key(g,u,i)]={stage:0,entry:"",feedback:"",revealed:false,done:false,observed:false};render();reopen()}
return {panel,observe,check,next,restart,clues,tables};
})();