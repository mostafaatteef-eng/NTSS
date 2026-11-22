/* Inline 50-question workshop. Every item is generated deterministically from a session's unit and skills.
   Answers and the starting name can be saved in this browser for up to seven days. No remote submission or server storage. */
window.EBDAA_PRACTICE=(function(){
let items=[],cursor=0,chosen=null,graded=false,correct=0,reviewed={},session="",hintShown=false,checkpoint=false,grade=1,unit=0,lesson=0,cachedStage="",finished=false,responses={},hintFlags={};
let codeDrafts={},codeRunning=false,codeMessage="",runToken=0,visualProbe=null,saveDelay=null;
const previousOrders=new Map();let adaptedStages=new Set();
const CHECKPOINT_KEY="ntss-private-practice-checkpoint-v4",CHECKPOINT_TTL=7*24*60*60*1000;
function saved(){try{const raw=localStorage.getItem(CHECKPOINT_KEY);if(!raw)return null;const v=JSON.parse(raw);if(v?.version!==1||Date.now()-v.savedAt>CHECKPOINT_TTL||Date.now()<v.savedAt||!Array.isArray(v.order)||v.order.length!==50){localStorage.removeItem(CHECKPOINT_KEY);return null}return v}catch(_){return null}}
function saveCheckpoint(){
 if(!session||!items.length)return false;
 try{
  const v={version:1,savedAt:Date.now(),identity:window.EBDA_COMPLETION?.checkpointIdentity(["ai",grade,unit,lesson].join(":"))||null,session,order:items.map(q=>q.id),cursor,chosen,graded,correct,reviewed,responses,hintFlags,hintShown,finished,codeDrafts};
  localStorage.setItem(CHECKPOINT_KEY,JSON.stringify(v));
  const node=document.getElementById("ntss-checkpoint-status");if(node)node.textContent="Name and progress saved only on this device for up to 7 days. Clear saved practice on shared devices.";
  return true;
 }catch(_){const node=document.getElementById("ntss-checkpoint-status");if(node)node.textContent="Could not save. Your browser may block storage.";return false}
}
function clearCheckpoint(){if(saveDelay)clearTimeout(saveDelay);saveDelay=null;try{localStorage.removeItem(CHECKPOINT_KEY)}catch(_){}const node=document.getElementById("ntss-checkpoint-status");if(node)node.textContent="Saved session cleared."}
function resumeCheckpoint(){
 const v=saved();if(!v||!/^[123]-\d+-\d+$/.test(v.session))return false;
 const [g,u,i]=v.session.split("-").map(Number);
 const bank=window.EBDAA_QUESTION_FACTORY.all(g,u,i),byId=new Map(bank.map(q=>[q.id,q]));
 if(bank.length!==50||new Set(v.order).size!==50||v.order.some(id=>!byId.has(id))||!Number.isInteger(v.cursor)||v.cursor<0||v.cursor>=50)return false;
 begin(g,u,i);window.EBDA_COMPLETION?.restoreIdentity(["ai",g,u,i].join(":"),v.identity);items=v.order.map(id=>byId.get(id));cursor=v.cursor;
 reviewed=Object.fromEntries(Object.entries(v.reviewed||{}).filter(([k,value])=>/^\d{1,2}$/.test(k)&&Number(k)<50&&typeof value==="boolean"));
 responses=Object.fromEntries(Object.entries(v.responses||{}).filter(([k])=>/^\d{1,2}$/.test(k)&&Number(k)<50));
 codeDrafts=Object.fromEntries(Object.entries(v.codeDrafts||{}).filter(([k,v])=>typeof k==="string"&&/^\d{1,2}$/.test(k)&&typeof v==="string").map(([k,v])=>[k,v.slice(0,3000)]));
 hintFlags=v.hintFlags&&typeof v.hintFlags==="object"?v.hintFlags:{};
 correct=Object.values(reviewed).filter(Boolean).length;
 // Rebuild formative evidence after restoring a saved attempt; never re-grade.
 for(const [key,ok] of Object.entries(reviewed)){
  const j=Number(key),q=items[j];if(!q)continue;
  window.EBDA_MASTERY.record(g,u,i,q,ok,!!hintFlags[j]);
  window.NTSS_LEARNING?.record(g===1?"learn":"advancedLab",j,ok,q);
 }
 chosen=Object.hasOwn(responses,cursor)?responses[cursor]:null;
 graded=Object.hasOwn(reviewed,cursor);hintShown=!!hintFlags[cursor];
 finished=!!v.finished&&Object.keys(reviewed).length===50;
 adaptedStages=new Set([10,20,30,40].filter(x=>x<=cursor));
 draw();window.EBDA_APP_RENDER?.();return true;
}

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
function reset(){if(saveDelay)clearTimeout(saveDelay);saveDelay=null;if(window.EBDA_MISTAKES)window.EBDA_MISTAKES.clear();items=[];session="";cursor=0;chosen=null;graded=false;correct=0;reviewed={};responses={};hintFlags={};cachedStage="";checkpoint=false;finished=false;codeDrafts={};runToken++;codeRunning=false;codeMessage="";visualProbe=null}
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
 return window.EBDA_COMPLETION.render({subject:"ai",grade,unit,index:lesson,lesson:title,correct,total:50,retry:()=>EBDAA_PRACTICE.restart(),back:()=>exitPractice(),answers:Object.fromEntries(Object.entries(reviewed).map(([k,v])=>[k,{checked:true,correct:v}])),arabic:window.EBDA_I18N?window.EBDA_I18N.current()==="ar":false});
}
function panel(g,u,i){
 ensure(g,u,i);
 if(finished)return completionView();
 // Bindings belong to mounted elements, not cached HTML. Rebuild the current
 // state when the outer shell renders (language change, lab return, name gate).
 if(checkpoint)drawCheckpoint();else draw();
 return '<div class="guided-question" aria-label="Lesson questions"><div class="eyebrow">GUIDED PRACTICE · 50 QUESTIONS</div><div id="ebdaa-practice-stage" aria-live="polite">'+cachedStage+'</div></div>';
}
function begin(g,u,i){window.EBDA_COMPLETION?.freshAttempt(["ai",g,u,i].join(":"));if(saveDelay)clearTimeout(saveDelay);saveDelay=null;runToken++;codeRunning=false;codeMessage="";codeDrafts={};visualProbe=null;adaptedStages=new Set();window.NTSS_LEARNING?.reset(g===1?"learn":"advancedLab");window.NTSS_APPLIED.reset("ai",[g,u,i].join("-"));window.EBDAA_CONTEXT_GAMES.reset('ai',[g,u,i].join('-'));window.EBDAA_GAME.resetLesson("ai",[g,u,i].join("-"));if(window.EBDA_MISTAKES)window.EBDA_MISTAKES.clear();const key=[g,u,i].join("-");items=shuffleQuestions(window.EBDAA_QUESTION_FACTORY.all(g,u,i),key);cursor=0;chosen=null;graded=false;correct=0;reviewed={};responses={};hintFlags={};session=key;grade=g;unit=u;lesson=i;window.EBDA_MASTERY.begin(g,u,i);hintShown=false;checkpoint=false;finished=false;draw()}
function answer(v){if(graded)return;chosen=v;responses[cursor]=Array.isArray(v)?v.slice():v;if(items[cursor]?.mode==="number"){const b=document.getElementById("ebdaa-check");if(b)b.disabled=String(v).trim()==="";if(saveDelay)clearTimeout(saveDelay);saveDelay=setTimeout(()=>{saveDelay=null;saveCheckpoint()},450);return}draw();saveCheckpoint()}
function chooseOrder(v){if(graded)return;if(!Array.isArray(chosen))chosen=[];if(!chosen.includes(v))chosen.push(v);responses[cursor]=chosen.slice();draw();saveCheckpoint()}
function clearOrder(){if(graded)return;chosen=[];responses[cursor]=[];draw();saveCheckpoint()}
function showHint(){hintShown=true;hintFlags[cursor]=true;draw();saveCheckpoint()}
function check(){const q=items[cursor];if(graded||chosen===null||!q||(q.mode==="number"&&String(chosen).trim()==="")||(q.mode==="order"&&(!Array.isArray(chosen)||chosen.length!==4)))return;graded=true;const ok=q.mode==="number"?Number.isFinite(Number(chosen))&&Math.abs(Number(chosen)-Number(q.answer))<=0.005:q.mode==="order"?Array.isArray(chosen)&&chosen.join("|")===q.answer:q.mode==="live-code"?chosen==="pass":String(chosen)===String(q.answer);
if(!Object.hasOwn(reviewed,cursor)){reviewed[cursor]=ok;window.EBDA_MASTERY.record(grade,unit,lesson,q,ok,hintShown);if(ok)correct++}window.NTSS_LEARNING?.record(grade===1?"learn":"advancedLab",cursor,ok,q);draw();saveCheckpoint()}
function next(){if(!graded||finished)return;runToken++;codeRunning=false;codeMessage="";visualProbe=null;if(cursor===49){finish();scrollToQuestion();return}continueCheckpoint();scrollToQuestion()}
function continueCheckpoint(){runToken++;codeRunning=false;codeMessage="";visualProbe=null;checkpoint=false;if(cursor+1<items.length){const next=cursor+1;if(next%10===0&&!adaptedStages.has(next)){const remaining=items.slice(next,Math.min(next+10,items.length));const ordered=window.EBDA_MASTERY.prioritizeUpcoming(grade,unit,lesson,remaining);items.splice(next,remaining.length,...ordered);adaptedStages.add(next)}cursor++;chosen=Object.hasOwn(responses,cursor)?(Array.isArray(responses[cursor])?responses[cursor].slice():responses[cursor]):null;graded=Object.hasOwn(reviewed,cursor);hintShown=!!hintFlags[cursor];draw();saveCheckpoint()}}
function drawCheckpoint(){const completed=cursor+1,round=completed/10;const inStage=Array.from({length:10},(_,i)=>reviewed[completed-10+i]===true).filter(Boolean).length;const suggested=window.EBDA_MASTERY.weakest(grade,unit,lesson);cachedStage=("<div class=\"feedback\" role=\"status\"><div class=\"eyebrow\">CHECKPOINT "+(round)+" / 5</div><h3>Great — one learning sprint completed</h3><p>First-attempt correct answers in this sprint: <b>"+(inStage)+"/10</b>. Incorrect answers are opportunities to revisit the experiment and try a similar task.</p><p>Questions completed: <b>"+(completed)+"/50</b>. Review Skill "+(suggested.id)+" if it needs more practice. The question order stays fixed for this attempt. No score is stored after you leave the page.</p><div class=\"actions\"><button class=\"btn light\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_PRACTICE.beginFromCheckpoint()},"EBDAA_PRACTICE.beginFromCheckpoint")+">Review this sprint</button><button class=\"btn teal\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_PRACTICE.continueCheckpoint()},"EBDAA_PRACTICE.continueCheckpoint")+">Continue to sprint "+(round+1)+" →</button></div></div>"+(window.EBDA_MASTERY.map(grade,unit,lesson)));const node=document.getElementById("ebdaa-practice-stage");if(node)node.innerHTML=cachedStage}
function beginFromCheckpoint(){checkpoint=false;cursor=Math.max(0,cursor-9);chosen=Object.hasOwn(responses,cursor)?(Array.isArray(responses[cursor])?responses[cursor].slice():responses[cursor]):null;graded=Object.hasOwn(reviewed,cursor);hintShown=!!hintFlags[cursor];draw()}
function prev(){if(cursor>0){runToken++;codeRunning=false;codeMessage="";visualProbe=null;cursor--;chosen=Object.hasOwn(responses,cursor)?(Array.isArray(responses[cursor])?responses[cursor].slice():responses[cursor]):null;graded=Object.hasOwn(reviewed,cursor);hintShown=!!hintFlags[cursor];draw();saveCheckpoint();scrollToQuestion()}}
function finish(){window.EBDA_PROGRESS?.mark("ai",grade,unit,lesson,Math.round(100*correct/50));finished=true;clearCheckpoint();cachedStage=completionView();const node=document.getElementById("ebdaa-practice-stage");if(node)node.innerHTML=cachedStage;window.EBDA_APP_RENDER?.()}
function restart(){if(!session)return;const [g,u,i]=session.split("-").map(Number);window.EBDA_COMPLETION?.forget(["ai",g,u,i].join(":"));begin(g,u,i);window.EBDA_APP_RENDER?.();scrollToQuestion()}

function codeInput(value){if(graded||codeRunning)return;codeDrafts[cursor]=String(value).slice(0,3000);if(saveDelay)clearTimeout(saveDelay);saveDelay=setTimeout(()=>{saveDelay=null;saveCheckpoint()},450)}
function probe(value){
 const q=currentQuestion();if(!q?.visual)return;
 const n=Number(value);if(!Number.isFinite(n))return;
 visualProbe=n;
 const chart=document.querySelector(".ntss-data-card");
 if(!chart)return;
 const output=chart.querySelector(".ntss-probe-label output");
 if(output)output.textContent=String(n);
 chart.querySelectorAll(".ntss-chart-bar").forEach((bar,index)=>{
  bar.classList.toggle("is-high",q.visual.readings[index]>n);
 });
}
function runCode(){
 const q=currentQuestion();if(graded||codeRunning||q?.mode!=="live-code")return;
 const source=String(document.getElementById("ntss-code-editor")?.value??codeDrafts[cursor]??q.codeTask.starter);
 codeDrafts[cursor]=source;
 codeRunning=true;codeMessage="Running local code tests…";draw();
 const t=++runToken,at=cursor;
 window.NTSS_ASSESSMENT.run(q,source,result=>{
  if(t!==runToken||at!==cursor)return;
  codeRunning=false;codeMessage=result.message||"";
  if(result.runtimeError){draw();return}
  chosen=result.passed?"pass":"fail";responses[cursor]=chosen;
  check();
 });
}
function draw(){if(!items.length)return;const q=items[cursor];const progress=Math.round(100*Object.keys(reviewed).length/50);let controls="";
if(q.mode==="live-code"){
 controls=graded?'<pre class="context-code" style="white-space:pre-wrap">'+e(codeDrafts[cursor]||q.codeTask.starter)+'</pre><p class="muted">'+e(codeMessage)+'</p>':window.NTSS_ASSESSMENT.codePanel(q,codeDrafts[cursor]??q.codeTask.starter,codeRunning,codeMessage);
}else if(q.mode==="order"){
 controls='<p class="muted">Tap each step in the order you would perform it.</p><div class="visual-row">'+q.options.map(v=>("<button class=\"choice\" style=\"width:auto;min-width:180px\" "+(graded||(Array.isArray(chosen)&&chosen.includes(v))?'disabled':'')+" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_PRACTICE.chooseOrder((v))},"EBDAA_PRACTICE.chooseOrder")+">"+(e(v))+"</button>")).join("")+'</div><p><b>Your sequence:</b> '+(Array.isArray(chosen)&&chosen.length?chosen.map(e).join(' → '):'Select steps above')+'</p>'+(graded?'':("<button class=\"btn light\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_PRACTICE.clearOrder()},"EBDAA_PRACTICE.clearOrder")+">Reset sequence</button>"));
}else if(q.mode==="number"){controls=("<label for=\"ebdaa-answer\">Your calculated answer</label><input id=\"ebdaa-answer\" type=\"number\" step=\"any\" inputmode=\"decimal\" value=\""+(chosen===null?"":e(chosen))+"\" "+(graded?'disabled':'')+" "+window.NTSS_EVENTS.bind("input",function(event){EBDAA_PRACTICE.answer(this.value)},"EBDAA_PRACTICE.answer")+" style=\"display:block;max-width:240px;width:100%;border:2px solid #dbded8;padding:12px;border-radius:10px;background:white\">")}
else if(q.mode==="truefalse"){const options=[{label:"True",value:true},{label:"False",value:false}];controls='<div class="game-label">⚡ True or False</div><div class="game-binary">'+options.map(o=>("<button class=\"choice\" "+(graded?'disabled':'')+" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_PRACTICE.answer((o.value))},"EBDAA_PRACTICE.answer")+">"+(o.label)+"</button>")).join("")+'</div>'}
else {const answerIndex=q.options.findIndex(x=>String(x)===String(q.answer));controls=answerIndex<0?'<p class="feedback error">Question format is unavailable.</p>':window.EBDAA_GAME.render({options:q.options,answer:answerIndex,mode:q.mode},cursor,q.options.findIndex(x=>String(x)===String(chosen)),graded,"ai",[grade,unit,lesson].join("-"),"EBDAA_PRACTICE.gameChooseIndex")}
const lessonTitle=grade===1?(window.EBDAA_DATA.sessions.filter(x=>x.unit===unit+1)[lesson]?.title||"AI foundations"):(window.EBDAA_GRADES.grades[grade-1].subjects[0].units[unit]?.sessions[lesson]||"Data analysis");
// Embedded code challenge belongs to the question card, not a separate screen.
const questionActivity=q.visual?window.NTSS_ASSESSMENT.visual(q,visualProbe):q.code?'<pre class="context-code" style="white-space:pre-wrap;overflow-x:auto" aria-label="Python code to debug">'+e(q.code)+'</pre>':''; // Coding is part of the scored question.
const hint=hintShown?'<div class="hint"><b>Thinking hint:</b> '+(q.mode==="order"?'Follow the logical or SQL clause sequence.':'Write down the relevant operation, then test it on a simpler input before using the displayed values.')+'</div>':'';
const verdict=graded?(reviewed[cursor]?'<div class="feedback" role="status"><b>✓ Correct — well done.</b><p>'+e(q.explanation)+'</p></div>':'<div class="feedback error" role="status"><b>Not quite — here is why.</b><p>'+e(q.explanation)+'</p><p>Review the reasoning, then try a new question testing the same concept.</p></div>'):'';
const milestone='';
const mistake=graded&&reviewed[cursor]===false?'<details class="focus-mistake"><summary>Review this mistake</summary><div id="mistake-review">'+window.EBDA_MISTAKES.html(grade,unit,lesson,q)+'</div></details>':'';
const action=q.mode==="live-code"&&!graded?'':graded?("<button class=\"btn teal\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_PRACTICE.next()},"EBDAA_PRACTICE.next")+">"+(cursor===49?'Show summary':'Next question →')+"</button>"):("<button id=\"ebdaa-check\" class=\"btn teal\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_PRACTICE.check()},"EBDAA_PRACTICE.check")+" "+((chosen===null||(q.mode==="order"&&chosen.length!==4))?'disabled':'')+">Check answer</button>");
const completed=Object.keys(reviewed).length,streak=(()=>{let n=0;for(let k=cursor;k>=0;k--){if(reviewed[k]===true)n++;else break}return n})();const xp=correct*10+Math.min(streak,5)*5;
cachedStage=("<div class=\"practice-flow\">"+(milestone)+"<div class=\"topmeta\"><span class=\"pill\">QUESTION "+(cursor+1)+" / 50</span><span class=\"pill\">Answered: "+(Object.keys(reviewed).length)+" / 50</span><span class=\"pill practice-hud__xp\" aria-label=\"Experience points\">⭐ "+(xp)+" XP</span><span class=\"pill practice-hud__streak\" aria-label=\"Current streak\">🔥 "+(streak)+" in a row</span></div>"+(window.NTSS_ASSESSMENT.questionView(q,cursor))+(questionActivity)+(controls)+(hint)+(verdict)+(mistake)+(!graded&&!hintShown?("<div class=\"actions\"><button class=\"btn light\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_PRACTICE.showHint()},"EBDAA_PRACTICE.showHint")+">💡 Need a hint?</button></div>"):'')+"<div class=\"stepfooter\"><button class=\"btn light\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_PRACTICE.prev()},"EBDAA_PRACTICE.prev")+" "+(cursor===0?'disabled':'')+">← Previous</button>"+(action)+"</div>"+(cursor===0&&saved()?.session===session&&Object.keys(reviewed).length===0?("<button class=\"ntss-restore\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_PRACTICE.resumeCheckpoint()},"EBDAA_PRACTICE.resumeCheckpoint")+">Continue saved practice on this device</button>"):'')+"</div>");const node=document.getElementById("ebdaa-practice-stage");if(node)node.innerHTML=cachedStage;syncFocusStatus();window.NTSS_UI?.localize(document.getElementById("app"));window.NTSS_LEARNING?.decorate(document.getElementById("app"),grade===1?"learn":"advancedLab");
}
window.addEventListener?.("pagehide",()=>{if(saveDelay)clearTimeout(saveDelay);saveDelay=null;if(session&&!finished&&(Object.keys(reviewed).length>0||Object.keys(codeDrafts).length>0))saveCheckpoint()});
return {panel,reset,ensure,isFinished,progress,gameChooseIndex,chooseOption,submitOrNext,begin,currentQuestion,questionOrder,answer,chooseOrder,clearOrder,showHint,check,next,continueCheckpoint,beginFromCheckpoint,prev,finish,restart,saveCheckpoint,clearCheckpoint,resumeCheckpoint,codeInput,runCode,probe,hasCheckpoint:()=>!!saved(),all:(g,u,i)=>window.EBDAA_QUESTION_FACTORY.all(g,u,i)};
})();