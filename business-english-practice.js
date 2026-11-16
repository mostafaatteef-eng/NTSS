/* Original supplementary Business English (AI) practice.
 * Curriculum titles and objectives are indexed from supplied books; these questions
 * are freshly generated vocabulary/communication drills, NOT transcriptions of tests.
 * No student data is sent or stored.
 */
window.EBDAA_BUSINESS_PRACTICE=(function(){
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let state={g:1,u:0,i:0,items:[],answers:{},cursor:0,done:false},note="";
function unit(){return window.EBDAA_BUSINESS_ENGLISH_UNITS[state.g][state.u]}
function lesson(){return unit().sessions[state.i]}
function pool(g,u,i){
 const group=window.EBDAA_BUSINESS_ENGLISH_UNITS[g][u].sessions;
 if(group[i].kind==="lesson")return group[i].terms;
 return group.filter(s=>s.kind==="lesson").flatMap(s=>s.terms);
}
function build(g,u,i){
 const terms=pool(g,u,i),items=[],list=terms.length?terms:[["communication","exchanging information"],["teamwork","working together"],["report","written summary"],["project","planned work"],["review","check learning"]];
 for(let n=0;n<50;n++){
  const pair=list[(n*7+Math.floor(n/Math.max(1,list.length)))%list.length],index=list.indexOf(pair),term=pair[0],def=pair[1];
  let alternatives=[];
  for(let shift=1;shift<list.length&&alternatives.length<3;shift++){let p=list[(index+shift)%list.length];if(p[0]!==term&&!alternatives.some(a=>a[0]===p[0]))alternatives.push(p)}
  while(alternatives.length<3)alternatives.push([["unrelated task","unrelated information"],["unrelated location","a different kind of place"],["unrelated date","a calendar reference"]][alternatives.length]);
  let askDefinition=n%3===1;
  const correct=askDefinition?def:term;
  const distract=alternatives.map(v=>askDefinition?v[1]:v[0]);
  const opts=[correct,...distract],rotate=(n*3)%4,ordered=opts.slice(rotate).concat(opts.slice(0,rotate));
  const kind=n%4,question=askDefinition?"Which meaning matches “"+term+"”?":kind===0?"Which business or technical English term means “"+def+"”?":kind===2?"Vocabulary mission: identify the term for “"+def+"”.":"Choose the correct professional expression for “"+def+"”.";
  items.push({question,options:ordered,answer:(4-rotate)%4,type:kind===0?"Vocabulary":kind===1?"Meaning":kind===2?"Professional language":"Concept review",explanation:"“"+term+"” refers to "+def+".",term,definition:def});
 }
 return items;
}
function update(){window.EBDA_APP_RENDER?.()}
function start(g,u,i){state={g,u,i,items:build(g,u,i),answers:{},cursor:0,done:false};note="";window.EBDAA_GAME.resetLesson("be",[g,u,i].join("-"));update()}
function choose(j){const s=state;if(s.answers[s.cursor]?.checked)return;s.answers[s.cursor]={value:Number(j),checked:false,correct:false};update()}
function check(){const s=state,q=s.items[s.cursor],a=s.answers[s.cursor];if(!a||a.checked)return;a.checked=true;a.correct=a.value===q.answer;update()}
function move(dir){const s=state;if(dir>0&&(!s.answers[s.cursor]?.checked))return;if(dir>0&&s.cursor===49){s.done=true;update();return;}s.cursor=Math.min(49,Math.max(0,s.cursor+dir));update()}
function restart(){start(state.g,state.u,state.i)}
function listen(){const s=window.speechSynthesis;if(!s||typeof SpeechSynthesisUtterance==="undefined")return;try{s.cancel();const utter=new SpeechSynthesisUtterance(lesson().title);utter.lang="en-GB";utter.rate=.87;s.speak(utter)}catch(_e){}}
function setNote(v){note=String(v).slice(0,3000)}
function project(){
 const u=unit(),l=lesson();return '<section class="practice-focus"><header class="practice-focus__header"><div class="practice-focus__header-row"><button class="practice-focus__exit" onclick="businessBackToUnit()">← Back to unit</button><span class="practice-focus__year">YEAR '+state.g+' · BUSINESS ENGLISH</span></div><div class="practice-focus__info"><h1 class="practice-focus__lesson">'+esc(l.title)+'</h1><span class="practice-focus__counter">GROUP PROJECT · PRACTICAL</span></div></header><div class="practice-focus__content"><div class="hint"><h2>🎤 Workplace project challenge</h2><p><strong>'+esc(u.project)+'</strong></p><p>Practice your professional English through a short group presentation, professional report, proposal or role-play as appropriate to the unit project.</p></div><div class="game-hud"><strong>Project preparation checklist</strong><p>□ Identify the workplace situation and intended audience</p><p>□ Organize your key points and use unit-specific language</p><p>□ Prepare an introduction, evidence, conclusion and questions</p><p>□ Rehearse and receive feedback from a teacher or group</p></div><label for="business-project-notes"><strong>Your presentation / proposal outline</strong></label><textarea id="business-project-notes" style="width:100%;box-sizing:border-box;min-height:180px;margin-top:10px;padding:14px;border:1px solid #d9e1dd;border-radius:12px" placeholder="Introduction, problem, proposed solution, benefits, closing..." oninput="EBDAA_BUSINESS_PRACTICE.setNote(this.value)">'+esc(note)+'</textarea><p class="muted">This outline is not saved or automatically graded. Teacher assessment is required for actual speaking and writing performance.</p></div></section>';
}
function render(){
 if(state.done&&lesson().kind!=="project")return window.EBDA_COMPLETION.render({subject:"be",grade:state.g,unit:state.u,index:state.i,lesson:lesson().title,correct:Object.values(state.answers).filter(v=>v.checked&&v.correct).length,retry:"EBDAA_BUSINESS_PRACTICE.restart()",back:"businessBackToUnit()"});

 const s=state,u=unit(),l=lesson();if(l.kind==="project")return project();
 const q=s.items[s.cursor],a=s.answers[s.cursor],correct=Object.values(s.answers).filter(x=>x.checked&&x.correct).length,answered=Object.values(s.answers).filter(x=>x.checked).length;
 const lessonKey=[s.g,s.u,s.i].join("-");
 const body=s.done?window.EBDAA_GAME.results(s.answers,50,false)+'<div class="feedback"><h2>🏆 Practice completed</h2><p>'+correct+' / 50 correct. This is supplementary formative practice, not a source-book exam.</p><button class="btn teal" onclick="EBDAA_BUSINESS_PRACTICE.restart()">Try again</button></div>':
 window.EBDAA_GAME.stats(s.answers,50,false)+'<div class="eyebrow">💼 '+esc(q.type)+' · '+esc(l.focus)+'</div><h2 class="practice-question">'+esc(q.question)+'</h2>'+window.EBDAA_GAME.render(q,s.cursor,a?.value,a?.checked,"be",lessonKey,"EBDAA_BUSINESS_PRACTICE.choose")+(a?.checked?'<div role="status" class="feedback '+(a.correct?'':'error')+'"><strong>'+(a.correct?'✓ Correct':'Review the meaning')+'</strong><p>'+esc(q.explanation)+'</p></div>':'')+'<div class="stepfooter"><button class="btn light" '+(!s.cursor?"disabled":"")+' onclick="EBDAA_BUSINESS_PRACTICE.move(-1)">← Previous</button><button class="btn teal" '+(!a||!a.checked&&a.value===undefined?"disabled":"")+' onclick="EBDAA_BUSINESS_PRACTICE.'+(a?.checked?'move(1)':'check()')+'">'+(a?.checked?(s.cursor===49?'Finish':'Next →'):'Check answer')+'</button></div>';
 return '<section class="practice-focus"><header class="practice-focus__header"><div class="practice-focus__header-row"><button class="practice-focus__exit" onclick="businessBackToUnit()">← All Business English lessons</button><span class="practice-focus__year">YEAR '+s.g+' · BUSINESS ENGLISH · UNIT '+u.unitNo+'</span></div><div class="practice-focus__info"><h1 class="practice-focus__lesson">'+esc(l.title)+'</h1><span class="practice-focus__counter">Mission '+(s.cursor+1)+' / 50</span></div><div class="practice-focus__track"><i style="width:'+(answered*2)+'%"></i></div></header><div class="practice-focus__content"><div class="guided-question"><button class="btn light" style="font-size:12px;margin-bottom:14px" onclick="EBDAA_BUSINESS_PRACTICE.listen()">🔊 Hear lesson title</button>'+body+'<p class="muted" style="font-size:12px;margin-top:22px">Supplementary generated vocabulary and professional-English practice based on lesson topics. It is not the verbatim publisher question bank. Some prompts use the same vocabulary in repeated formats; listening, speaking and free writing require teacher or separate review.</p></div></div></section>';
}
return {build,start,render,choose,check,move,restart,listen,setNote};
})();