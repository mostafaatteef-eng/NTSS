/* Locally scored practical assessment framework. Source indicators are unit-level; teacher approval remains external. */
window.EBDA_RUBRIC=(function(){
const memory=new Map();
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const key=(g,u,i)=>g+"-"+u+"-"+i;
function profile(g,u){return window.EBDAA_PERFORMANCE[g+"-"+(u+1)]}
function get(g,u,i){const id=key(g,u,i);if(!memory.has(id))memory.set(id,{run:false,manipulated:false,measurable:false,interpretation:"",verified:false,reason:"",lastOutput:""});return memory.get(id)}
function observe(g,u,i,info){const s=get(g,u,i);s.run=!!info?.success;s.lastOutput=String(info?.output||"").slice(0,1500);s.reason=String(info?.message||"");display(g,u,i)}
function markManipulation(g,u,i){get(g,u,i).manipulated=true;display(g,u,i)}
function recordEvidence(g,u,i,valid){const s=get(g,u,i);s.measurable=!!valid;display(g,u,i)}
function reflect(g,u,i){const el=document.getElementById("rubric-reflection");if(!el)return;const s=get(g,u,i);s.interpretation=el.value.trim().slice(0,1000);display(g,u,i,true)}
function score(g,u,i){const s=get(g,u,i);const p=profile(g,u);const executable=["python","sql"].includes(p.engine);const checks=[
{title:"Execute / manipulate",points:30,passed:executable?s.run:s.manipulated,mode:"automatic"},
{title:"Correct computed evidence",points:35,passed:s.measurable,mode:"automatic"},
{title:"Interpret the result with supporting evidence",points:20,passed:false,mode:"teacher review",prepared:s.interpretation.length>=35},
{title:"Meet the official product checklist and KPI",points:15,passed:false,mode:"teacher approval",prepared:false}
];
return {earned:checks.filter(c=>c.passed).reduce((x,c)=>x+c.points,0),automatedPossible:65,checks}}
function display(g,u,i,preserve){const node=document.getElementById("rubric-progress");if(node)node.innerHTML=resultMarkup(g,u,i);if(!preserve){const t=document.getElementById("rubric-reflection");if(t&&document.activeElement!==t)t.value=get(g,u,i).interpretation}}
function resultMarkup(g,u,i){const r=score(g,u,i);return '<div class="topmeta"><b>Automatically verified: '+r.earned+' / '+r.automatedPossible+' points</b><small>Remaining 35 points require teacher review</small></div><div style="display:grid;gap:8px">'+r.checks.map(c=>'<div style="background:white;border:1px solid #dde8e1;border-radius:10px;padding:12px"><b>'+(c.passed?'✓ ':c.prepared?'◐ ':'○ ')+esc(c.title)+'</b> <small>('+c.points+' pts)</small><p class="muted">'+(c.mode==="automatic"?(c.passed?"Automated condition met":"Needs verifiable activity or result"):(c.prepared?"Reflection drafted; pending teacher assessment":"Cannot be awarded by this automated prototype"))+'</p></div>').join("")+'</div>'}
function panel(g,u,i){const p=profile(g,u);return '<section class="interactive" style="background:#edf8f4;border:1px solid #b2d8cd"><div class="eyebrow">PRACTICAL RUBRIC · EVIDENCE-BASED</div><h3>How your work will be assessed</h3><p>Derived from the '+esc(p.source)+' unit outcomes. Automated checks evaluate available runtime evidence; human judgment is mandatory for interpretation, official indicators, and formal sign-off.</p><div id="rubric-progress">'+resultMarkup(g,u,i)+'</div><details><summary><b>Source-aligned unit performance checklist</b> · teacher review required</summary><p class="muted">Unit-level source indicators: exact session-to-indicator allocation and product acceptance require academic review.</p><ol>'+p.kpis.map(x=>'<li style="margin:8px 0">'+esc(x)+' <small>— pending teacher verification</small></li>').join("")+'</ol></details><label for="rubric-reflection"><b>Explain your result and its limitations (teacher-reviewed)</b></label><textarea id="rubric-reflection" style="width:100%;min-height:92px;border:1px solid #a9c3b8;border-radius:10px;padding:12px" placeholder="What did you find? Which output supports it? What cannot be concluded?">'+esc(get(g,u,i).interpretation)+'</textarea><div class="actions"><button class="btn light" onclick="EBDA_RUBRIC.reflect('+g+','+u+','+i+')">Attach interpretation to this attempt</button></div><p class="source">A completed progress bar is not an official school assessment. 35 points are reserved for teacher decision.</p></section>'}
function reset(g,u,i){memory.delete(key(g,u,i))}
return {panel,score,get,observe,markManipulation,recordEvidence,reflect,reset,resultMarkup};
})();