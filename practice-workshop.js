/* Inline 50-question workshop. Every item is generated deterministically from a session's unit and skills.
   Answers only live in memory; no cookies, tracking, remote submission or server storage. */
window.EBDAA_PRACTICE=(function(){
let items=[],cursor=0,chosen=null,graded=false,correct=0,reviewed={},session="",hintShown=false,checkpoint=false,grade=1,unit=0,lesson=0,cachedStage="",finished=false,responses={},hintFlags={};
const previousOrders=new Map();
function shuffleQuestions(all,key){
 const shuffled=all.slice();
 // Fisher-Yates: shuffle once when the attempt begins, never during the attempt.
 for(let i=shuffled.length-1;i>0;i--){
  const j=Math.floor(Math.random()*(i+1));
  [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];
 }
 const last=previousOrders.get(key);
 // Guarantee consecutive attempts in this tab never use the exact same order.
 if(last&&shuffled.length>1&&shuffled.every((q,i)=>q.id===last[i])){
  [shuffled[0],shuffled[1]]=[shuffled[1],shuffled[0]];
 }
 previousOrders.set(key,shuffled.map(q=>q.id));
 return shuffled;
}
function currentQuestion(){return items[cursor]||null}
function questionOrder(){return items.map(q=>q.id)}

const e=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function reset(){if(window.EBDA_MISTAKES)window.EBDA_MISTAKES.clear();items=[];session="";cursor=0;chosen=null;graded=false;correct=0;reviewed={};responses={};hintFlags={};cachedStage="";checkpoint=false;finished=false}
function ensure(g,u,i){if(session!==[g,u,i].join("-")||!items.length)begin(g,u,i)}
function isFinished(){return finished}
function panel(g,u,i){
 ensure(g,u,i);
 return '<div class="guided-question" aria-label="Lesson questions"><div class="eyebrow">GUIDED PRACTICE · 50 QUESTIONS</div><div id="ebdaa-practice-stage" aria-live="polite">'+cachedStage+'</div></div>';
}
function begin(g,u,i){if(window.EBDA_MISTAKES)window.EBDA_MISTAKES.clear();const key=[g,u,i].join("-");items=shuffleQuestions(window.EBDAA_QUESTION_FACTORY.all(g,u,i),key);cursor=0;chosen=null;graded=false;correct=0;reviewed={};responses={};hintFlags={};session=key;grade=g;unit=u;lesson=i;window.EBDA_MASTERY.begin(g,u,i);hintShown=false;checkpoint=false;finished=false;draw()}
function answer(v){if(graded)return;chosen=v;responses[cursor]=Array.isArray(v)?v.slice():v;if(items[cursor]?.mode==="number"){const b=document.getElementById("ebdaa-check");if(b)b.disabled=String(v).trim()==="";return}draw()}
function chooseOrder(v){if(graded)return;if(!Array.isArray(chosen))chosen=[];if(!chosen.includes(v))chosen.push(v);responses[cursor]=chosen.slice();draw()}
function clearOrder(){if(graded)return;chosen=[];responses[cursor]=[];draw()}
function showHint(){hintShown=true;hintFlags[cursor]=true;draw()}
function check(){const q=items[cursor];if(graded||chosen===null||!q||(q.mode==="number"&&String(chosen).trim()==="")||(q.mode==="order"&&(!Array.isArray(chosen)||chosen.length!==4)))return;graded=true;const ok=q.mode==="number"?Number.isFinite(Number(chosen))&&Math.abs(Number(chosen)-Number(q.answer))<=0.005:q.mode==="order"?Array.isArray(chosen)&&chosen.join("|")===q.answer:String(chosen)===String(q.answer);
if(!Object.hasOwn(reviewed,cursor)){reviewed[cursor]=ok;window.EBDA_MASTERY.record(grade,unit,lesson,q,ok,hintShown);if(ok)correct++}draw()}
function next(){if(!graded||finished)return;if(cursor===49){finish();return}continueCheckpoint()}
function continueCheckpoint(){checkpoint=false;if(cursor+1<items.length){cursor++;chosen=Object.hasOwn(responses,cursor)?(Array.isArray(responses[cursor])?responses[cursor].slice():responses[cursor]):null;graded=Object.hasOwn(reviewed,cursor);hintShown=!!hintFlags[cursor];draw()}}
function drawCheckpoint(){const completed=cursor+1,round=completed/10;const inStage=Array.from({length:10},(_,i)=>reviewed[completed-10+i]===true).filter(Boolean).length;const suggested=window.EBDA_MASTERY.weakest(grade,unit,lesson);cachedStage='<div class="feedback" role="status"><div class="eyebrow">CHECKPOINT '+round+' / 5</div><h3>Great — one learning sprint completed</h3><p>First-attempt correct answers in this sprint: <b>'+inStage+'/10</b>. Incorrect answers are opportunities to revisit the experiment and try a similar task.</p><p>Questions completed: <b>'+completed+'/50</b>. Review Skill '+suggested.id+' if it needs more practice. The question order stays fixed for this attempt. No score is stored after you leave the page.</p><div class="actions"><button class="btn light" onclick="EBDAA_PRACTICE.beginFromCheckpoint()">Review this sprint</button><button class="btn teal" onclick="EBDAA_PRACTICE.continueCheckpoint()">Continue to sprint '+(round+1)+' →</button></div></div>'+window.EBDA_MASTERY.map(grade,unit,lesson);const node=document.getElementById("ebdaa-practice-stage");if(node)node.innerHTML=cachedStage}
function beginFromCheckpoint(){checkpoint=false;cursor=Math.max(0,cursor-9);chosen=Object.hasOwn(responses,cursor)?(Array.isArray(responses[cursor])?responses[cursor].slice():responses[cursor]):null;graded=Object.hasOwn(reviewed,cursor);hintShown=!!hintFlags[cursor];draw()}
function prev(){if(cursor>0){cursor--;chosen=Object.hasOwn(responses,cursor)?(Array.isArray(responses[cursor])?responses[cursor].slice():responses[cursor]):null;graded=Object.hasOwn(reviewed,cursor);hintShown=!!hintFlags[cursor];draw()}}
function finish(){finished=true;cachedStage='<div class="feedback"><h3>Practice summary</h3><p>Attempted: '+Object.keys(reviewed).length+'/50 · First-attempt correct: '+correct+'/'+Object.keys(reviewed).length+'.</p><p>These are formative estimates, not accredited competency results.</p></div>'+window.EBDA_MASTERY.map(grade,unit,lesson)+'<div class="actions"><button class="btn light" onclick="EBDAA_PRACTICE.restart()">Try a new attempt</button></div>';const node=document.getElementById("ebdaa-practice-stage");if(node)node.innerHTML=cachedStage;if(typeof render==="function")render()}
function restart(){if(!session)return;const [g,u,i]=session.split("-").map(Number);begin(g,u,i)}
function draw(){if(!items.length)return;const q=items[cursor];const progress=Math.round(100*Object.keys(reviewed).length/50);let controls="";
if(q.mode==="order"){
 controls='<p class="muted">Tap each step in the order you would perform it.</p><div class="visual-row">'+q.options.map(v=>'<button class="choice" style="width:auto;min-width:180px" '+(Array.isArray(chosen)&&chosen.includes(v)?'disabled':'')+' onclick="EBDAA_PRACTICE.chooseOrder('+e(JSON.stringify(v))+')">'+e(v)+'</button>').join("")+'</div><p><b>Your sequence:</b> '+(Array.isArray(chosen)&&chosen.length?chosen.map(e).join(' → '):'Select steps above')+'</p><button class="btn light" onclick="EBDAA_PRACTICE.clearOrder()">Reset sequence</button>';
}else if(q.mode==="number"){controls='<label for="ebdaa-answer">Your calculated answer</label><input id="ebdaa-answer" type="number" step="any" inputmode="decimal" value="'+(chosen===null?"":e(chosen))+'" oninput="EBDAA_PRACTICE.answer(this.value)" style="display:block;max-width:240px;width:100%;border:2px solid #dbded8;padding:12px;border-radius:10px;background:white">'}
else {const options=q.mode==="truefalse"?[{label:"True",value:true},{label:"False",value:false}]:q.options.map(v=>({label:String(v),value:v}));controls='<div class="choices">'+options.map((o,i)=>'<button class="choice '+(chosen!==null&&String(chosen)===String(o.value)?'chosen ':'')+(graded&&String(o.value)===String(q.answer)?'correct':'')+'" '+(graded?'disabled':'')+' onclick="EBDAA_PRACTICE.answer('+(typeof o.value==="boolean"?o.value:e(JSON.stringify(String(o.value))))+')">'+e(o.label)+'</button>').join("")+'</div>'}
const hint=hintShown?'<div class="hint"><b>Thinking hint:</b> '+(q.mode==="order"?'Identify the prerequisite step before each operation.':'Write down the relevant operation, then test it on a simpler input before using the displayed values.')+'</div>':'';
const verdict=graded?(reviewed[cursor]?'<div class="feedback"><b>✓ Correct!</b><p>'+e(q.explanation)+'</p></div>':'<div class="feedback error"><b>Not quite yet</b><p>Open the step-by-step review below and solve a similar problem.</p></div>'):'';
const milestone=cursor>0&&cursor%10===0?
 '<details class="practice-milestone"><summary>✓ '+cursor+' questions completed · Review your skills (optional)</summary>'+
 window.EBDA_MASTERY.map(grade,unit,lesson)+'</details>':'';
const mistake=graded&&reviewed[cursor]===false?'<div id="mistake-review">'+window.EBDA_MISTAKES.html(grade,unit,lesson,q)+'</div>':'';
const action=graded?'<button class="btn teal" onclick="EBDAA_PRACTICE.next()">'+(cursor===49?'Show summary':'Next question →')+'</button>':'<button id="ebdaa-check" class="btn teal" onclick="EBDAA_PRACTICE.check()" '+((chosen===null||(q.mode==="order"&&chosen.length!==4))?'disabled':'')+'>Check answer</button>';
cachedStage='<div class="practice-flow">'+milestone+'<div class="topmeta"><span class="pill">QUESTION '+(cursor+1)+' / 50</span><span class="pill">Answered: '+Object.keys(reviewed).length+' / 50</span></div>'+
'<div class="meter" role="progressbar" aria-label="Answered questions" aria-valuemin="0" aria-valuemax="50" aria-valuenow="'+Object.keys(reviewed).length+'"><i style="width:'+progress+'%"></i></div>'+
'<h3 class="practice-question">'+e(q.question)+'</h3>'+controls+hint+verdict+mistake+
(!graded&&!hintShown?'<div class="actions"><button class="btn light" onclick="EBDAA_PRACTICE.showHint()">💡 Need a hint?</button></div>':'')+
'<div class="stepfooter"><button class="btn light" onclick="EBDAA_PRACTICE.prev()" '+(cursor===0?'disabled':'')+'>← Previous</button>'+action+'</div>'+
'<details class="practice-source"><summary>About this practice question</summary><p class="source">'+e(q.sourceStatus)+'</p></details></div>';const node=document.getElementById("ebdaa-practice-stage");if(node)node.innerHTML=cachedStage;
}
return {panel,reset,ensure,isFinished,begin,currentQuestion,questionOrder,answer,chooseOrder,clearOrder,showHint,check,next,continueCheckpoint,beginFromCheckpoint,prev,finish,restart,all:(g,u,i)=>window.EBDAA_QUESTION_FACTORY.all(g,u,i)};
})();