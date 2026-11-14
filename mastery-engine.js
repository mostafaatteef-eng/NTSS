/* Local-only adaptive knowledge tracking. Formative estimates, not certified mastery. */
window.EBDA_MASTERY=(function(){
const ledger=new Map();
const SKILL_NAMES={
programming:["Order of operations","Loop iterations","Remainders","List length","Function results","Assignments","Range boundaries","Integer division","While loops","Arithmetic series"],
math:["Mean","Range","Probability","Squares","Derivatives","Vector magnitude","Linear functions","Percentages","Set size","Gradient"],
charts:["Category comparison","Trend difference","Average","Data percentage","Missing observations","Growth","Grouped bars","Validity","Axis span","Unlabeled values"],
ai:["Flag rates","Class thresholds","Below-threshold labels","False positives","Processing rate","Data totals","Recall","Sensor gaps","Latency","Sensor count"],
ml:["Accuracy","Precision","Recall","Nearest neighbors","Centroids","Neuron output","Dataset splits","Actual positives","Feature engineering","Loss difference"],
algorithms:["Stack pop","Queue insertion","Tree nodes","Chain edges","Binary tree size","Sorting","Node traversal","Tree edges","Stack balance","Array indexing"],
sql:["Row counts","SUM aggregation","AVG aggregation","WHERE filtering","JOIN matching","Primary keys","COUNT(*)","COUNT(column)","Transactions","Strict comparison"],
statistics:["Mean","Range","Probability","Squares","Derivatives","Vector magnitude","Linear formulas","Percentages","Sample size","Gradient"],
preprocess:["Duplicate removal","Completeness","Range","Min–max scaling","Class balance","Token cleaning","Feature engineering","Time-series lag","Invalid row filtering","Label encoding"],
annotation:["Agreement rates","Bounding boxes","Correction count","Missing labels","Sampling","Category support","Label errors","Annotation rate","Coordinates","Consensus"],
monitor:["Request volume","Average latency","Threshold events","Error counts","Success rate","Poll frequency","Latency difference","Recovery actions","Rolling windows","Unique logs"],
pipeline:["Deduplication","Source consolidation","Valid share","Batch aggregation","Invalid rows","Loading rate","Schema completeness","File validation","Integration checks","Partition totals"],
fairness:["Group approval","Approval disparity","Sensitive fields","Access permissions","Invalid labels","Metric identifiability","Masking","Error disparities","Review status","Risk closure"],
agriculture:["Accuracy","Precision","Recall","Nearest neighbors","Cluster centroids","Model signal","Data splits","Positive cases","Features","Loss change"]
};
function family(g,u){const type=g===1?["programming","math","charts","ai","ml","algorithms"][u]:window.EBDAA_PERFORMANCE[g+"-"+(u+1)]?.engine||"ai";return type==="python"?"programming":type}
function names(g,u){return SKILL_NAMES[family(g,u)]||SKILL_NAMES.ai}

const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const key=(g,u,i)=>[g,u,i].join("-");
function begin(g,u,i){ledger.set(key(g,u,i),{skills:Array.from({length:10},(_,j)=>({id:j+1,attempted:0,correct:0,hints:0,confidence:0})),seen:0})}
function get(g,u,i){const k=key(g,u,i);if(!ledger.has(k))begin(g,u,i);return ledger.get(k)}
function record(g,u,i,question,correct,usedHint){const st=get(g,u,i);const j=clamp(Number(question.focus||1)-1,0,9),s=st.skills[j];s.attempted++;if(correct)s.correct++;if(usedHint)s.hints++;const evidence=correct?(usedHint?0.65:1):0; s.confidence=clamp(s.confidence*0.65+evidence*0.35,0,1);st.seen++;return s}
function band(s){if(!s.attempted)return "Not assessed";const ratio=s.correct/s.attempted;if(s.attempted>=3&&ratio>=0.8&&s.hints<=s.attempted/2)return "Developing mastery";if(ratio>=0.6)return "Progressing";return "Needs practice"}
function weakest(g,u,i){return get(g,u,i).skills.slice().sort((a,b)=>((a.attempted? a.correct/a.attempted : 0)-(b.attempted?b.correct/b.attempted:0))||(a.attempted-b.attempted))[0]}
function map(g,u,i,skillNames){const st=get(g,u,i),labels=skillNames||names(g,u);return '<section class="interactive" style="background:#f5fbf9"><div class="eyebrow">SKILL MASTERY MAP · THIS VISIT ONLY</div><h3>Your 10 learning skills</h3><p class="muted">Estimates based on formative first attempts, not an official competency certification. Nothing is uploaded or retained after refresh.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:9px">'+st.skills.map((s,j)=>{const rate=s.attempted?Math.round(s.correct/s.attempted*100):0;return '<div style="background:white;padding:13px;border:1px solid #d9e7e0;border-radius:12px"><strong>Skill '+(j+1)+': '+labels[j]+'</strong><div style="height:7px;background:#e7ece9;border-radius:10px;margin:8px 0;overflow:hidden"><span style="display:block;height:100%;background:#1ca29a;width:'+rate+'%"></span></div><small>'+band(s)+' · '+s.correct+'/'+s.attempted+' correct</small></div>'}).join("")+'</div></section>'}
function prioritizeUpcoming(g,u,i,nextItems){const st=get(g,u,i);return nextItems.slice().sort((a,b)=>{const x=st.skills[(a.focus||1)-1],y=st.skills[(b.focus||1)-1];const rx=x.attempted?x.correct/x.attempted:0,ry=y.attempted?y.correct/y.attempted:0;return rx-ry||x.attempted-y.attempted})}
function snapshot(g,u,i){const st=get(g,u,i);return {skills:st.skills.map(s=>({...s,band:band(s)})),seen:st.seen}}
return {begin,get,record,band,weakest,map,prioritizeUpcoming,snapshot,names};
})();