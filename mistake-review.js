/* EBDA mistakes: progressive explanation + related mini question, no learner data storage. */
window.EBDA_MISTAKES=(function(){
const states=new Map();
const safe=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let activeKey="";
function related(g,u,i,q){
 const bank=window.EBDAA_QUESTION_FACTORY.all(g,u,i);
 return bank.find(x=>x.focus===q.focus&&x.id!==q.id&&x.question!==q.question&&!["order","live-code","visual-data"].includes(x.mode))||bank.find(x=>x.id!==q.id&&x.question!==q.question&&!["order","live-code","visual-data"].includes(x.mode));
}
function state(g,u,i,q){const key=g+"|"+u+"|"+i+"|"+q.id;activeKey=key;if(!states.has(key))states.set(key,{level:0,typed:"",result:null,related:related(g,u,i,q)});return states.get(key)}
function clear(){states.clear();activeKey=""}
function advance(){const s=states.get(activeKey);if(!s)return;s.level=Math.min(3,s.level+1);update()}
function type(value){const s=states.get(activeKey);if(s)s.typed=String(value)}
function check(){const s=states.get(activeKey);if(!s)return;const q=s.related;const raw=String(s.typed).trim();if(!q||!raw)return;
 s.result=q.mode==="number"?Number.isFinite(Number(raw))&&Math.abs(Number(raw)-Number(q.answer))<=0.005:String(raw).toLowerCase()===String(q.answer).toLowerCase();update()}
function html(g,u,i,q){
 const s=state(g,u,i,q),next=s.related;
 const first='<div class="hint"><strong>Step 1 · Find the misconception</strong><p>Identify the quantities, operations or prerequisites in the question. Which part of your approach might be different from the definition?</p></div>';
 const second='<div class="feedback"><strong>Step 2 · Worked reasoning</strong><p>'+safe(q.explanation)+'</p><p><b>Expected answer:</b> '+safe(q.answer)+'</p></div>';
 const third=!next?'<p>No separate matching practice item is available for this skill.</p>':'<div class="interactive" style="background:#f3fbf8"><strong>Step 3 · Transfer your understanding</strong><p>'+safe(next.question)+'</p>'+(next.mode==="number"?'<input id="mistake-input" type="number" step="any" placeholder="Your calculated answer" value="'+safe(s.typed)+'" oninput="EBDA_MISTAKES.type(this.value)" style="max-width:230px;width:100%;padding:11px;border:1px solid #c8d9d2;border-radius:9px">':'<div class="choices">'+(next.mode==="truefalse"?["true","false"]:next.options||[]).map(x=>'<button class="choice" onclick="EBDA_MISTAKES.type('+JSON.stringify(String(x)).replace(/"/g,'&quot;')+')">'+safe(x)+'</button>').join("")+'</div>')+'<button class="btn teal" onclick="EBDA_MISTAKES.check()">Check similar problem</button>'+(s.result!==null?'<p class="feedback '+(s.result?'':'error')+'">'+(s.result?'Correct — you applied the method.':'Not yet. Revisit the worked reasoning.')+'</p>':'')+'</div>';
 return '<section class="interactive" style="background:#fffbec;border:1px solid #e5d6a0"><div class="eyebrow">SMART MISTAKE REVIEW</div><h3>A wrong answer is useful evidence</h3><p>Review in steps, then apply the same skill to new values. This extra question does not change your 50-question order.</p>'+(s.level>=1?first:'')+(s.level>=2?second:'')+(s.level>=3?third:'')+(s.level<3?'<button class="btn light" onclick="EBDA_MISTAKES.advance()">'+["Get a diagnostic hint","Show worked explanation","Try a similar problem"][s.level]+' →</button>':'')+'</section>';
}
function update(){const node=document.getElementById("mistake-review");if(!node||!activeKey)return;const bits=activeKey.split("|"),g=Number(bits[0]),u=Number(bits[1]),i=Number(bits[2]),q=window.EBDAA_QUESTION_FACTORY.all(g,u,i).find(x=>x.id===bits.slice(3).join("|"));if(q)node.innerHTML=html(g,u,i,q)}
return {html,advance,type,check,clear};
})();