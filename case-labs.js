/* Original EBDAA industrial mystery — conceptually inspired by SQL investigation games, not copied. */
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
const state=key=>states[key]||(states[key]={stage:0,entry:"",feedback:"",revealed:false,done:false});
const key=(g,u,i)=>g+"-"+u+"-"+i;
function panel(g,u,i){
if(g!==2||![1,2].includes(u))return "";
const k=key(g,u,i),s=state(k),step=clues[Math.min(s.stage,3)];
const overview='<div class="visual-row">'+Object.entries(tables).map(([name,rows])=>'<div style="padding:11px 14px;border:1px solid #d4e4df;border-radius:10px;background:white"><b>'+name+'</b><p class="muted">'+rows.length+' sample rows</p></div>').join("")+'</div>';
return '<section class="interactive" style="background:#f0f7f5;border:2px solid #1ca29a"><div class="eyebrow">EBDAA CASE FILE · INDUSTRIAL SQL MYSTERY</div><h3>🔎 The Faulty Production Line</h3><p>A quality report has gaps. Investigate a synthetic factory database using real SQL JOIN queries, then unlock the next clue using the result.</p>'+overview+
(s.done?'<div class="feedback"><b>Case solved</b><p>Laser-C recorded 7 defects. Contact Salma to investigate the maintenance and inspection logs; the data does not establish blame.</p><button class="btn light" onclick="EBDAA_CASE.restart('+g+','+u+','+i+')">Replay investigation</button></div>':
'<div class="topmeta"><span class="pill">CLUE '+(s.stage+1)+' / 4</span><span class="pill">Database detective</span></div><div class="stepbar">'+clues.map((_,j)=>'<span class="'+(j<=s.stage?"on":"")+'"></span>').join("")+'</div><h3>'+esc(step.title)+'</h3><p>'+esc(step.prompt)+'</p><details><summary>Suggested SQL query (open after trying)</summary><pre style="white-space:pre-wrap;font:13px/1.5 monospace;background:#202934;color:#e7f1f1;padding:13px;border-radius:12px">'+esc(step.sql)+'</pre></details><p class="muted">Run or adapt the query in the SQL editor above. Read its returned rows, then enter the value below.</p><label>Evidence from query result</label><input id="case-answer" value="'+esc(s.entry)+'" type="text" autocomplete="off" style="max-width:320px;width:100%;padding:12px;border:1px solid #a7b7af;border-radius:10px" placeholder="Type observed result"><div class="actions"><button class="btn teal" onclick="EBDAA_CASE.check('+g+','+u+','+i+')">Verify evidence & unlock</button></div>'+(s.feedback?'<div class="feedback '+(s.revealed?'':'error')+'">'+esc(s.feedback)+'</div>':'')+
(s.revealed?'<div class="actions"><button class="btn teal" onclick="EBDAA_CASE.next('+g+','+u+','+i+')">Next clue →</button></div>':'')+
'</div>')+'<p class="source">Original simulated case aligned to relational joins and evidence evaluation; not a copy of SQL Murder Mystery.</p></section>';
}
function check(g,u,i){const k=key(g,u,i),s=state(k),el=document.getElementById("case-answer");s.entry=(el?.value||"").trim();const clue=clues[s.stage];s.revealed=s.entry.toLowerCase()===clue.answer.toLowerCase();s.feedback=s.revealed?clue.reason:"Not yet. Check the SELECT result and verify the JOIN keys; try again.";render()}
function next(g,u,i){const s=state(key(g,u,i));if(!s.revealed)return;if(s.stage===3)s.done=true;else s.stage++;s.entry="";s.feedback="";s.revealed=false;render()}
function restart(g,u,i){states[key(g,u,i)]={stage:0,entry:"",feedback:"",revealed:false,done:false};render()}
return {panel,check,next,restart,clues,tables};
})();