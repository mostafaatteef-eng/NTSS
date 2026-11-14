/* Three-stage source-topic-aligned case missions. No accounts or persistent progress.
   Questions reuse the independent unit case banks; case narratives are original. */
window.EBDAA_STORIES=(function(){
let states={};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const storyNames={
"1-0":"The Faulty Factory Script","1-1":"Quality Lab: Probability Lock","1-2":"The Misleading Dashboard","1-3":"Vision Inspection Failure","1-4":"The Clustered Evidence","1-5":"Factory Dispatch Rescue",
"2-0":"Night Shift Automation Failure","2-1":"Relational Data Investigation","2-2":"Factory Data SQL Incident","2-3":"Yield Drop Investigation","2-4":"The Corrupted Dataset","2-5":"Model Evaluation Rescue",
"3-0":"Statistical Evidence Review","3-1":"Annotation Conflict Files","3-2":"AI System Alert","3-3":"The Missing Data Lineage","3-4":"Privacy and Fairness Incident","3-5":"Sustainable Farming Data Challenge"};
function startKey(g,u){return g+"-"+u}
function state(g,u){const k=startKey(g,u);return states[k]||(states[k]={step:0,selection:null,verified:false,completed:false,errors:0,showHint:false,feedback:""})}
function panel(g,u,i){
const m=window.EBDAA_MISSIONS.find(x=>x.g===g&&x.u===u);if(!m)return "";
const s=state(g,u),title=storyNames[startKey(g,u)]||m.title;
const top='<section class="interactive" style="background:linear-gradient(135deg,#f0faf7,#fff8df);border:2px solid #1ca29a"><div class="eyebrow">UNIT CASEFILE · CONTINUOUS INDUSTRIAL MISSION</div><h3>🗂️ '+esc(title)+'</h3><p>'+esc(m.description)+' Connect evidence across three stages. Open the next stage only after resolving the current one.</p>';
if(s.completed)return top+'<div class="feedback"><h3>Case closed — evidence reviewed</h3><p>The three decisions are complete. Continue to the interactive session laboratory and its practical assessment.</p><button class="btn light" onclick="EBDAA_STORIES.restart('+g+','+u+')">Replay this case</button></div></section>';
const q=m.steps[s.step];
const answers=q[1].map((opt,j)=>'<button class="choice '+(s.selection===j?'chosen':'')+'" '+(s.verified?'disabled':'')+' onclick="EBDAA_STORIES.choose('+g+','+u+','+j+')">'+String.fromCharCode(65+j)+'. '+esc(opt)+'</button>').join("");
return top+'<div class="topmeta"><span class="pill">CLUE '+(s.step+1)+' / 3</span><span class="pill">Try · Inspect · Explain</span></div><div class="stepbar">'+m.steps.map((_,j)=>'<span class="'+(j<=s.step?'on':'')+'"></span>').join("")+'</div><h3>'+esc(q[0])+'</h3><div class="choices">'+answers+'</div>'+
(s.feedback?'<div class="feedback '+(s.verified?'':'error')+'"><b>'+(s.verified?'Evidence verified':'Investigate the evidence')+'</b><p>'+esc(s.feedback)+'</p></div>':'')+(s.showHint&&!s.verified?'<div class="hint">Compare the available choices with the scenario and the purpose of the technique. Which option produces evidence you can verify in the laboratory?</div>':'')+
'<div class="actions">'+(s.verified?'<button class="btn teal" onclick="EBDAA_STORIES.advance('+g+','+u+')">'+(s.step===2?'Complete case':'Unlock next clue →')+'</button>':'<button class="btn teal" '+(s.selection===null?'disabled':'')+' onclick="EBDAA_STORIES.verify('+g+','+u+')">Check evidence</button>')+'</div>'+
'<div class="actions">'+(!s.verified?'<button class="btn light" onclick="EBDAA_STORIES.hint('+g+','+u+')">💡 Investigation hint</button>':'')+'</div><p class="muted">Wrong choices can be retried; no penalties, accounts or saved scores. This is formative practice, not an official assessment.</p></section>';
}
function choose(g,u,j){const s=state(g,u);if(s.verified)return;s.selection=j;render()}
function verify(g,u){const s=state(g,u),m=window.EBDAA_MISSIONS.find(x=>x.g===g&&x.u===u);if(s.selection===null||!m)return;if(s.selection===m.steps[s.step][2]){s.verified=true;s.feedback=m.steps[s.step][3]}else{s.errors++;s.selection=null;s.feedback="That decision does not resolve the evidence. Review the scenario, use the hint, and try a different approach."}render()}
function hint(g,u){const s=state(g,u);s.showHint=true;render()}
function advance(g,u){const s=state(g,u);if(!s.verified)return;if(s.step===2)s.completed=true;else{s.step++;s.selection=null;s.verified=false;s.showHint=false;s.feedback=""}render()}
function restart(g,u){states[startKey(g,u)]={step:0,selection:null,verified:false,completed:false,errors:0,showHint:false,feedback:""};render()}
return {panel,choose,verify,advance,hint,restart,storyNames};
})();