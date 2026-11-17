/* Inline 50-question workshop. Every item is generated deterministically from a session's unit and skills.
   Answers only live in memory; no cookies, tracking, remote submission or server storage. */
window.EBDAA_PRACTICE=(function(){
let items=[],cursor=0,chosen=null,graded=false,correct=0,reviewed={},session="",hintShown=false,checkpoint=false,grade=1,unit=0,lesson=0,cachedStage="",finished=false,responses={},hintFlags={};
const previousOrders=new Map();let adaptedStages=new Set();
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
function progress(){return {position:finished?50:cursor+1,answered:Object.keys(reviewed).length,total:items.length||50,finished}}
function syncFocusStatus(){const p=progress(),counter=document.getElementById("focus-counter"),fill=document.getElementById("focus-progress-fill"),track=document.getElementById("focus-progress-track");if(counter)counter.textContent=p.finished?"Completed · 50 / 50":"Question "+p.position+" / "+p.total;if(fill)fill.style.width=Math.round(100*p.answered/p.total)+"%";if(track)track.setAttribute("aria-valuenow",String(p.answered))}
function gameChooseIndex(j){const q=currentQuestion();if(!q||graded||q.mode==="order"||q.mode==="number"||q.mode==="truefalse")return;const v=q.options[Number(j)];if(v!==undefined)answer(v)}
function chooseOption(index){const q=currentQuestion();if(!q||graded||finished)return;const j=Number(index);if(!Number.isInteger(j)||j<0)return;if(q.mode==="order"){if(j<q.options.length)chooseOrder(q.options[j])}else if(q.mode==="truefalse"){if(j<2)answer(j===0)}else if(q.mode!=="number"&&j<q.options.length){answer(q.options[j])}}
function submitOrNext(){if(finished)return;if(graded)next();else check()}
function scrollToQuestion(){const header=document.querySelector?.(".practice-focus__header");if(header?.scrollIntoView)header.scrollIntoView({behavior:"auto",block:"start"})}
function completionView(){
 const title=grade===1?(window.EBDAA_DATA.sessions.filter(x=>x.unit===unit+1)[lesson]?.title||"AI lesson"):(window.EBDAA_GRADES.grades[grade-1].subjects[0].units[unit]?.sessions[lesson]||"AI & Data Analysis");
 return window.EBDA_COMPLETION.render({subject:"ai",grade,unit,index:lesson,lesson:title,correct,total:50,retry:"EBDAA_PRACTICE.restart()"});
}
function panel(g,u,i){
 ensure(g,u,i);
 if(finished)return completionView();
 return '<div class="guided-question" aria-label="Lesson questions"><div class="eyebrow">GUIDED PRACTICE · 50 QUESTIONS</div><div id="ebdaa-practice-stage" aria-live="polite">'+cachedStage+'</div></div>';
}
function begin(g,u,i){adaptedStages=new Set();window.NTSS_LEARNING?.reset(g===1?"learn":"advancedLab");window.NTSS_APPLIED.reset("ai",[g,u,i].join("-"));window.EBDAA_CONTEXT_GAMES.reset('ai',[g,u,i].join('-'));window.EBDAA_GAME.resetLesson("ai",[g,u,i].join("-"));if(window.EBDA_MISTAKES)window.EBDA_MISTAKES.clear();const key=[g,u,i].join("-");items=shuffleQuestions(window.EBDAA_QUESTION_FACTORY.all(g,u,i),key);cursor=0;chosen=null;graded=false;correct=0;reviewed={};responses={};hintFlags={};session=key;grade=g;unit=u;lesson=i;window.EBDA_MASTERY.begin(g,u,i);hintShown=false;checkpoint=false;finished=false;draw()}
function answer(v){if(graded)return;chosen=v;responses[cursor]=Array.isArray(v)?v.slice():v;if(items[cursor]?.mode==="number"){const b=document.getElementById("ebdaa-check");if(b)b.disabled=String(v).trim()==="";return}draw()}
function chooseOrder(v){if(graded)return;if(!Array.isArray(chosen))chosen=[];if(!chosen.includes(v))chosen.push(v);responses[cursor]=chosen.slice();draw()}
function clearOrder(){if(graded)return;chosen=[];responses[cursor]=[];draw()}
function showHint(){hintShown=true;hintFlags[cursor]=true;draw()}
function check(){const q=items[cursor];if(graded||chosen===null||!q||(q.mode==="number"&&String(chosen).trim()==="")||(q.mode==="order"&&(!Array.isArray(chosen)||chosen.length!==4)))return;graded=true;const ok=q.mode==="number"?Number.isFinite(Number(chosen))&&Math.abs(Number(chosen)-Number(q.answer))<=0.005:q.mode==="order"?Array.isArray(chosen)&&chosen.join("|")===q.answer:String(chosen)===String(q.answer);
if(!Object.hasOwn(reviewed,cursor)){reviewed[cursor]=ok;window.EBDA_MASTERY.record(grade,unit,lesson,q,ok,hintShown);if(ok)correct++}window.NTSS_LEARNING?.record(grade===1?"learn":"advancedLab",cursor,ok,q);draw()}
function next(){if(!graded||finished)return;if(cursor===49){finish();scrollToQuestion();return}continueCheckpoint();scrollToQuestion()}
function continueCheckpoint(){checkpoint=false;if(cursor+1<items.length){const next=cursor+1;if(next%10===0&&!adaptedStages.has(next)){const remaining=items.slice(next,Math.min(next+10,items.length));const ordered=window.EBDA_MASTERY.prioritizeUpcoming(grade,unit,lesson,remaining);items.splice(next,remaining.length,...ordered);adaptedStages.add(next)}cursor++;chosen=Object.hasOwn(responses,cursor)?(Array.isArray(responses[cursor])?responses[cursor].slice():responses[cursor]):null;graded=Object.hasOwn(reviewed,cursor);hintShown=!!hintFlags[cursor];draw()}}
function drawCheckpoint(){const completed=cursor+1,round=completed/10;const inStage=Array.from({length:10},(_,i)=>reviewed[completed-10+i]===true).filter(Boolean).length;const suggested=window.EBDA_MASTERY.weakest(grade,unit,lesson);cachedStage='<div class="feedback" role="status"><div class="eyebrow">CHECKPOINT '+round+' / 5</div><h3>Great — one learning sprint completed</h3><p>First-attempt correct answers in this sprint: <b>'+inStage+'/10</b>. Incorrect answers are opportunities to revisit the experiment and try a similar task.</p><p>Questions completed: <b>'+completed+'/50</b>. Review Skill '+suggested.id+' if it needs more practice. The question order stays fixed for this attempt. No score is stored after you leave the page.</p><div class="actions"><button class="btn light" onclick="EBDAA_PRACTICE.beginFromCheckpoint()">Review this sprint</button><button class="btn teal" onclick="EBDAA_PRACTICE.continueCheckpoint()">Continue to sprint '+(round+1)+' →</button></div></div>'+window.EBDA_MASTERY.map(grade,unit,lesson);const node=document.getElementById("ebdaa-practice-stage");if(node)node.innerHTML=cachedStage}
function beginFromCheckpoint(){checkpoint=false;cursor=Math.max(0,cursor-9);chosen=Object.hasOwn(responses,cursor)?(Array.isArray(responses[cursor])?responses[cursor].slice():responses[cursor]):null;graded=Object.hasOwn(reviewed,cursor);hintShown=!!hintFlags[cursor];draw()}
function prev(){if(cursor>0){cursor--;chosen=Object.hasOwn(responses,cursor)?(Array.isArray(responses[cursor])?responses[cursor].slice():responses[cursor]):null;graded=Object.hasOwn(reviewed,cursor);hintShown=!!hintFlags[cursor];draw();scrollToQuestion()}}
function finish(){finished=true;cachedStage=completionView();const node=document.getElementById("ebdaa-practice-stage");if(node)node.innerHTML=cachedStage;window.EBDA_APP_RENDER?.()}
function restart(){if(!session)return;const [g,u,i]=session.split("-").map(Number);begin(g,u,i);scrollToQuestion()}
function draw(){if(!items.length)return;const q=items[cursor];const progress=Math.round(100*Object.keys(reviewed).length/50);let controls="";
if(q.mode==="order"){
 controls='<p class="muted">Tap each step in the order you would perform it.</p><div class="visual-row">'+q.options.map(v=>'<button class="choice" style="width:auto;min-width:180px" '+(graded||(Array.isArray(chosen)&&chosen.includes(v))?'disabled':'')+' onclick="EBDAA_PRACTICE.chooseOrder('+e(JSON.stringify(v))+')">'+e(v)+'</button>').join("")+'</div><p><b>Your sequence:</b> '+(Array.isArray(chosen)&&chosen.length?chosen.map(e).join(' → '):'Select steps above')+'</p>'+(graded?'':'<button class="btn light" onclick="EBDAA_PRACTICE.clearOrder()">Reset sequence</button>');
}else if(q.mode==="number"){controls='<label for="ebdaa-answer">Your calculated answer</label><input id="ebdaa-answer" type="number" step="any" inputmode="decimal" value="'+(chosen===null?"":e(chosen))+'" '+(graded?'disabled':'')+' oninput="EBDAA_PRACTICE.answer(this.value)" style="display:block;max-width:240px;width:100%;border:2px solid #dbded8;padding:12px;border-radius:10px;background:white">'}
else if(q.mode==="truefalse"){const options=[{label:"True",value:true},{label:"False",value:false}];controls='<div class="game-label">⚡ True or False</div><div class="game-binary">'+options.map(o=>'<button class="choice" '+(graded?'disabled':'')+' onclick="EBDAA_PRACTICE.answer('+o.value+')">'+o.label+'</button>').join("")+'</div>'}
else {const answerIndex=q.options.findIndex(x=>String(x)===String(q.answer));controls=answerIndex<0?'<p class="feedback error">Question format is unavailable.</p>':window.EBDAA_GAME.render({options:q.options,answer:answerIndex,mode:q.mode},cursor,q.options.findIndex(x=>String(x)===String(chosen)),graded,"ai",[grade,unit,lesson].join("-"),"EBDAA_PRACTICE.gameChooseIndex")}
const lessonTitle=grade===1?(window.EBDAA_DATA.sessions.filter(x=>x.unit===unit+1)[lesson]?.title||"AI foundations"):(window.EBDAA_GRADES.grades[grade-1].subjects[0].units[unit]?.sessions[lesson]||"Data analysis");
controls+=window.NTSS_APPLIED.render("ai",session,cursor,lessonTitle)+window.EBDAA_CONTEXT_GAMES.ai("ai",session,cursor,Math.floor(cursor/10)%2?"sql":"python",lessonTitle)+window.EBDAA_CONTEXT_GAMES.report("ai",session,false);
const hint=hintShown?'<div class="hint"><b>Thinking hint:</b> '+(q.mode==="order"?'Identify the prerequisite step before each operation.':'Write down the relevant operation, then test it on a simpler input before using the displayed values.')+'</div>':'';
const verdict=graded?(reviewed[cursor]?'<div class="feedback"><b>✓ Correct!</b><p>'+e(q.explanation)+'</p></div>':'<div class="feedback error"><b>Not quite yet</b><p>Open the step-by-step review below and solve a similar problem.</p></div>'):'';
const milestone=cursor>0&&cursor%10===0?
 '<details class="practice-milestone"><summary>✓ '+cursor+' questions completed · Review your skills (optional)</summary>'+
 window.EBDA_MASTERY.map(grade,unit,lesson)+'</details>':'';
const mistake=graded&&reviewed[cursor]===false?'<details class="focus-mistake"><summary>Review this mistake</summary><div id="mistake-review">'+window.EBDA_MISTAKES.html(grade,unit,lesson,q)+'</div></details>':'';
const action=graded?'<button class="btn teal" onclick="EBDAA_PRACTICE.next()">'+(cursor===49?'Show summary':'Next question →')+'</button>':'<button id="ebdaa-check" class="btn teal" onclick="EBDAA_PRACTICE.check()" '+((chosen===null||(q.mode==="order"&&chosen.length!==4))?'disabled':'')+'>Check answer</button>';
const completed=Object.keys(reviewed).length,streak=(()=>{let n=0;for(let k=cursor;k>=0;k--){if(reviewed[k]===true)n++;else break}return n})();const xp=correct*10+Math.min(streak,5)*5;
cachedStage='<div class="practice-flow"><div class="game-stats"><span>⭐ '+xp+' XP</span><span>🔥 '+streak+' streak</span><span>🎯 Sprint '+(Math.floor(cursor/10)+1)+'/5</span></div>'+milestone+'<div class="topmeta"><span class="pill">QUESTION '+(cursor+1)+' / 50</span><span class="pill">Answered: '+Object.keys(reviewed).length+' / 50</span></div>'+
'<div class="meter" role="progressbar" aria-label="Answered questions" aria-valuemin="0" aria-valuemax="50" aria-valuenow="'+Object.keys(reviewed).length+'"><i style="width:'+progress+'%"></i></div>'+
'<h3 class="practice-question">'+e(q.question)+'</h3>'+controls+hint+verdict+mistake+
(!graded&&!hintShown?'<div class="actions"><button class="btn light" onclick="EBDAA_PRACTICE.showHint()">💡 Need a hint?</button></div>':'')+
'<div class="stepfooter"><button class="btn light" onclick="EBDAA_PRACTICE.prev()" '+(cursor===0?'disabled':'')+'>← Previous</button>'+action+'</div>'+
'<details class="practice-source"><summary>About this practice question</summary><p class="source">'+e(q.sourceStatus)+'</p></details></div>';const node=document.getElementById("ebdaa-practice-stage");if(node)node.innerHTML=cachedStage;syncFocusStatus();window.NTSS_LEARNING?.decorate(document.getElementById("app"),grade===1?"learn":"advancedLab");
}
return {panel,reset,ensure,isFinished,progress,gameChooseIndex,chooseOption,submitOrNext,begin,currentQuestion,questionOrder,answer,chooseOrder,clearOrder,showHint,check,next,continueCheckpoint,beginFromCheckpoint,prev,finish,restart,all:(g,u,i)=>window.EBDAA_QUESTION_FACTORY.all(g,u,i)};
})();