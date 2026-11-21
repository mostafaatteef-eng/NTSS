(function(){
/* Original supplementary Business English (AI) practice.
 * Curriculum titles and objectives are indexed from supplied books; these questions
 * are freshly generated vocabulary/communication drills, NOT transcriptions of tests.
 * No student data is sent or stored.
 */
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
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
let note="";
function unitOf(st){return window.EBDAA_BUSINESS_ENGLISH_UNITS[st.g][st.u]}
function lessonOf(st){return unitOf(st).sessions[st.i]}
window.EBDAA_BUSINESS_PRACTICE=window.EBDA_PRACTICE_FRAMEWORK.create({
 name:"EBDAA_BUSINESS_PRACTICE",subject:"be",gameKey:"be",learningMode:"businessPractice",appliedKey:"business",
 locale:"en",inputId:"practice-answer",checkId:"business-check",back:"businessBackToUnit()",
 buildItems:(g,u,i)=>build(g,u,i).map(q=>({...q,mode:"choice"})),
 title:(g,u,i)=>window.EBDAA_BUSINESS_ENGLISH_UNITS[g][u].sessions[i].title,
 header:(g,u)=>({exitLabel:"← All Business English lessons",exit:"businessBackToUnit()",yearLabel:"YEAR "+g+" · BUSINESS ENGLISH · UNIT "+window.EBDAA_BUSINESS_ENGLISH_UNITS[g][u].unitNo,disclaimer:"Supplementary generated vocabulary and professional-English practice based on lesson topics. It is not the verbatim publisher question bank. Some prompts use the same vocabulary in repeated formats; listening, speaking and free writing require teacher or separate review."}),
 eyebrow:(q,{g,u,i})=>"💼 "+esc(q.type)+" · "+esc(window.EBDAA_BUSINESS_ENGLISH_UNITS[g][u].sessions[i].focus),
 topExtras:()=>'<button class="btn light" style="font-size:12px;margin-bottom:14px" onclick="EBDAA_BUSINESS_PRACTICE.listen()">🔊 Hear lesson title</button>',
 afterControls:(q,{g,u,i,cursor})=>window.NTSS_APPLIED.render("business",[g,u,i].join("-"),cursor,window.EBDAA_BUSINESS_ENGLISH_UNITS[g][u].sessions[i].title),
 render2:(st,api)=>{
  const u=unitOf(st),l=lessonOf(st);
  if(l.kind!=="project")return null;
  if(st.done)return window.EBDA_COMPLETION.participation({subject:"be",grade:st.g,unit:st.u,index:st.i,lesson:l.title,back:"businessBackToUnit()"});
  return '<section class="practice-focus"><header class="practice-focus__header"><div class="practice-focus__header-row"><button class="practice-focus__exit" onclick="businessBackToUnit()">← Back to unit</button><span class="practice-focus__year">YEAR '+st.g+' · BUSINESS ENGLISH</span></div><div class="practice-focus__info"><h1 class="practice-focus__lesson">'+esc(l.title)+'</h1><span class="practice-focus__counter">GROUP PROJECT · PRACTICAL</span></div></header><div class="practice-focus__content"><div class="hint"><h2>🎤 Workplace project challenge</h2><p><strong>'+esc(u.project)+'</strong></p><p>Practice your professional English through a short group presentation, professional report, proposal or role-play as appropriate to the unit project.</p></div><div class="game-hud"><strong>Project preparation checklist</strong><p>□ Identify the workplace situation and intended audience</p><p>□ Organize your key points and use unit-specific language</p><p>□ Prepare an introduction, evidence, conclusion and questions</p><p>□ Rehearse and receive feedback from a teacher or group</p></div><label for="business-project-notes"><strong>Your presentation / proposal outline</strong></label><textarea id="business-project-notes" style="width:100%;box-sizing:border-box;min-height:180px;margin-top:10px;padding:14px;border:1px solid #d9e1dd;border-radius:12px" placeholder="Introduction, problem, proposed solution, benefits, closing..." oninput="EBDAA_BUSINESS_PRACTICE.setNote(this.value)">'+esc(note)+'</textarea><p id="business-project-warning" role="alert" class="muted"></p><button class="btn teal" onclick="EBDAA_BUSINESS_PRACTICE.completeProject()">Complete project preparation →</button><p class="muted">This outline is not saved or automatically graded. Completion creates an ungraded participation record. Speaking and writing require teacher review.</p></div></section>';
 },
 methods:api=>({
  listen(){const s=window.speechSynthesis;if(!s||typeof SpeechSynthesisUtterance==="undefined")return;try{s.cancel();const utter=new SpeechSynthesisUtterance(lessonOf(api._state()).title);utter.lang="en-GB";utter.rate=.87;s.speak(utter)}catch(_e){}},
  setNote(v){note=String(v).slice(0,3000)},
  completeProject(){
   const st=api._state(),l=lessonOf(st);
   if(l.kind!=="project")return;
   note=String(document.getElementById("business-project-notes")?.value||note).trim().slice(0,3000);
   if(note.length<30){const n=document.getElementById("business-project-warning");if(n)n.textContent="Add at least 30 characters to your outline before completing preparation.";return}
   api._markDone();
  }
 })
});

})();
