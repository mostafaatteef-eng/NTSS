/* EBDA unified practice framework. One shared 50-question engine loop for every subject:
   deterministic per-lesson items, hints, XP/streak HUD, adaptive mastery checkpoints,
   guided mistake review and on-device checkpoint resume. Subject modules keep their own
   question banks and special activity panels as plugins on top of this loop.
   Answers live in memory; checkpoints stay in this browser's local storage only. */
window.EBDA_PRACTICE_FRAMEWORK=(function(){
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const STR={
 en:{question:"Question",answered:"Answered",streak:"in a row",check:"Check answer",next:"Next question →",last:"Show result",prev:"← Previous",hintBtn:"💡 Need a hint?",hintTitle:"Thinking hint:",correct:"✓ Correct — well done.",wrong:"Not quite — here is why.",wrongSub:"Review the reasoning, then try a new question testing the same concept.",mistake:"Review this mistake",resume:"Continue saved practice on this device",saved:"Saved on this device for up to 7 days. Clear it on shared devices.",saveFail:"Could not save. Your browser may block storage.",cleared:"Saved session cleared.",yourAnswer:"Your calculated answer",completed:"Completed",mEyebrow:"SMART MISTAKE REVIEW",mTitle:"A wrong answer is useful evidence",mSub:"Review in steps, then apply the same skill to a new item. This extra question does not change your 50-question order.",mSteps:["Get a diagnostic hint","Show worked explanation","Try a similar problem"],mStep1:"<strong>Step 1 · Find the misconception</strong><p>Identify the quantities, operations or prerequisites in the question. Which part of your approach might be different from the definition?</p>",mStep2:"<strong>Step 2 · Worked reasoning</strong>",mExpected:"Expected answer:",mStep3:"<strong>Step 3 · Transfer your understanding</strong>",mNone:"No separate matching practice item is available for this skill.",mCheck:"Check similar problem",mOk:"Correct — you applied the method.",mNo:"Not yet. Revisit the worked reasoning.",sPath:"Learning path",sStages:["Discover","Understand","Apply","Challenge","Master"],sDone:(n,name)=>"Stage "+n+" · "+name+" — complete",sScore:c=>"You answered "+c+" of 10 correctly in this stage.",sNext:(n,name,a,b)=>"Next: Stage "+n+" · "+name+" — questions "+a+"–"+b+".",sGo:"Continue →"},
 ar:{question:"سؤال",answered:"أُجيب",streak:"متتالية",check:"تحقق من الإجابة",next:"التالي ←",last:"النتيجة",prev:"السابق",hintBtn:"💡 تحتاج تلميحًا؟",hintTitle:"تلميح للتفكير:",correct:"✓ إجابة صحيحة — أحسنت.",wrong:"ليست الإجابة الصحيحة — إليك السبب.",wrongSub:"راجع طريقة الحل، ثم جرّب سؤالًا جديدًا على الفكرة نفسها.",mistake:"راجع هذا الخطأ",resume:"استئناف التدريب المحفوظ على هذا الجهاز",saved:"محفوظ على هذا الجهاز لمدة تصل إلى 7 أيام. امسحه على الأجهزة المشتركة.",saveFail:"تعذر الحفظ. قد يكون المتصفح يحظر التخزين.",cleared:"تم مسح الجلسة المحفوظة.",yourAnswer:"إجابتك",completed:"مكتمل",mEyebrow:"مراجعة ذكية للخطأ",mTitle:"الإجابة الخاطئة دليل مفيد",mSub:"راجع خطوة بخطوة، ثم طبّق المهارة نفسها على سؤال جديد. هذا السؤال الإضافي لا يغيّر ترتيب أسئلتك الخمسين.",mSteps:["احصل على تلميح تشخيصي","اعرض الشرح خطوة بخطوة","جرّب مسألة مشابهة"],mStep1:"<strong>الخطوة 1 · حدّد موضع الخلل</strong><p>حدّد الكميات أو العمليات أو المتطلبات في السؤال. أي جزء من طريقتك قد يختلف عن القاعدة؟</p>",mStep2:"<strong>الخطوة 2 · الحل خطوة بخطوة</strong>",mExpected:"الإجابة المتوقعة:",mStep3:"<strong>الخطوة 3 · انقل فهمك</strong>",mNone:"لا يوجد سؤال تدريب مطابق لهذه المهارة حاليًا.",mCheck:"تحقق من المسألة المشابهة",mOk:"صحيح — طبقت الطريقة بنجاح.",mNo:"ليس بعد. راجع الحل النموذجي.",sPath:"مسار التعلّم",sStages:["اكتشف","افهم","طبّق","تحدَّ","أتقن"],sDone:(n,name)=>"المرحلة "+n+" · "+name+" — اكتملت",sScore:c=>"أجبت إجابة صحيحة على "+c+" من 10 في هذه المرحلة.",sNext:(n,name,a,b)=>"التالية: المرحلة "+n+" · "+name+" — الأسئلة "+a+"–"+b+".",sGo:"متابعة ←"},
 de:{question:"Frage",answered:"Beantwortet",streak:"in Folge",check:"Antwort prüfen",next:"Weiter →",last:"Ergebnis",prev:"← Zurück",hintBtn:"💡 Hinweis?",hintTitle:"Denkhilfe:",correct:"✓ Richtig — gut gemacht.",wrong:"Noch nicht ganz — hier ist der Grund.",wrongSub:"Lies die Erklärung und versuche danach eine neue Frage zum gleichen Thema.",mistake:"Fehler wiederholen",resume:"Gespeicherte Übung auf diesem Gerät fortsetzen",saved:"Bis zu 7 Tage auf diesem Gerät gespeichert. Auf geteilten Geräten bitte löschen.",saveFail:"Speichern nicht möglich. Der Browser blockiert eventuell den Speicher.",cleared:"Gespeicherte Übung gelöscht.",yourAnswer:"Dein Ergebnis",completed:"Fertig",mEyebrow:"SMARTE FEHLERWIEDERHOLUNG",mTitle:"Eine falsche Antwort ist ein nützlicher Hinweis",mSub:"Wiederhole in Schritten und wende die Fähigkeit auf eine neue Aufgabe an. Diese Zusatzaufgabe ändert die Reihenfolge der 50 Fragen nicht.",mSteps:["Diagnose-Hinweis","Musterlösung anzeigen","Ähnliche Aufgabe versuchen"],mStep1:"<strong>Schritt 1 · Finde das Missverständnis</strong><p>Welche Größen, Rechenschritte oder Voraussetzungen stecken in der Frage? Welcher Teil deines Wegs weicht von der Regel ab?</p>",mStep2:"<strong>Schritt 2 · Musterlösung</strong>",mExpected:"Erwartete Antwort:",mStep3:"<strong>Schritt 3 · Wissen anwenden</strong>",mNone:"Für diese Fähigkeit gibt es gerade keine passende Zusatzaufgabe.",mCheck:"Ähnliche Aufgabe prüfen",mOk:"Richtig — die Methode sitzt.",mNo:"Noch nicht. Schau dir die Musterlösung an.",sPath:"Lernpfad",sStages:["Entdecken","Verstehen","Anwenden","Challenge","Meistern"],sDone:(n,name)=>"Etappe "+n+" · "+name+" — abgeschlossen",sScore:c=>"Du hast "+c+" von 10 in dieser Etappe richtig beantwortet.",sNext:(n,name,a,b)=>"Weiter: Etappe "+n+" · "+name+" — Fragen "+a+"–"+b+".",sGo:"Weiter →"}
};
const TTL=7*24*60*60*1000;
function create(cfg){
 const S=STR[cfg.locale]||STR.en;
 const name=cfg.name;
 const scope=cfg.subject;
 const storeKey="ntss-private-practice-checkpoint-v4-"+scope;
 let g=1,u=0,i=0,items=[],cursor=0,answers={},done=false,hintFlags={},session="",pendingStage=null;
 const mistakes=new Map();let mistakeKey="";
 const lessonKey=()=>[g,u,i].join("-");
 const answered=()=>Object.values(answers).filter(a=>a&&a.checked).length;
 const correctCount=()=>Object.values(answers).filter(a=>a&&a.checked&&a.correct).length;
 function refresh(){window.EBDA_APP_RENDER?.()}
 function normalize(list){
  return list.map((q,n)=>Object.assign({id:[g,u,i,n].join("-"),focus:(n%10)+1},q));
 }
 function start(gg,uu,ii){
  g=gg;u=uu;i=ii;session=lessonKey();
  window.NTSS_LEARNING?.reset(cfg.learningMode);
  if(cfg.appliedKey)window.NTSS_APPLIED?.reset(cfg.appliedKey,lessonKey());
  if(cfg.contextGames)window.EBDAA_CONTEXT_GAMES?.reset(cfg.gameKey,lessonKey());
  window.EBDAA_GAME?.resetLesson(cfg.gameKey,lessonKey());
  cfg.hooks?.onStart?.();
  items=normalize(cfg.buildItems(g,u,i));cursor=0;answers={};done=false;hintFlags={};pendingStage=null;mistakes.clear();mistakeKey="";
  window.EBDA_MASTERY?.begin(g,u,i,scope);
  refresh();
 }
 function restart(){start(g,u,i)}
 function current(){return items[cursor]||null}
 function rec(){return answers[cursor]}
 function answer(v){
  const a=rec();if(a?.checked)return;
  const q=current();if(!q)return;
  answers[cursor]={value:v,checked:false,correct:false};
  if(q.mode==="choice"||q.mode==="slider")refresh();else{const b=document.getElementById(cfg.checkId);if(b)b.disabled=String(v??"").trim()==="";scheduleSave()}
 }
 function gameChoose(j){answer(j)}
 function write(v){answer(String(v).slice(0,cfg.fillLimit||110))}
 function tolerance(q){return cfg.tolerance?cfg.tolerance(q):0.005}
 function isCorrect(q,v){
  if(q.mode==="choice")return Number(v)===Number(q.answer);
  if(q.mode==="fill")return cfg.checkFill?cfg.checkFill(q,v):String(v).trim().toLowerCase()===String(q.answer).trim().toLowerCase();
  const n=Number(v);return Number.isFinite(n)&&Math.abs(n-Number(q.answer))<=tolerance(q);
 }
 function check(){
  const q=current(),a=rec();if(!q||!a||a.checked)return;
  if(String(a.value??"").trim()==="")return;
  const ok=isCorrect(q,a.value);
  answers[cursor]={value:a.value,checked:true,correct:ok};
  window.NTSS_LEARNING?.record(cfg.learningMode,cursor,ok,q);
  window.EBDA_MASTERY?.record(g,u,i,q,ok,!!hintFlags[cursor],scope);
  scheduleSave();refresh();
 }
 function next(){
  if(!rec()?.checked||done)return;
  cfg.hooks?.onMove?.();
  if(cursor===49){finish();return}
  const target=cursor+1;
  if(target%10===0&&target<50){
   const remaining=items.slice(target,Math.min(target+10,items.length));
   const ordered=window.EBDA_MASTERY?window.EBDA_MASTERY.prioritizeUpcoming(g,u,i,remaining,scope):remaining;
   items.splice(target,remaining.length,...ordered);
   pendingStage=target/10;
  }
  cursor=target;refresh();scrollTop();
 }
 function prev(){
  pendingStage=null;if(cursor>0){cfg.hooks?.onMove?.();cursor--;refresh();scrollTop()}
 }
 function move(delta){if(delta>0)next();else prev()}
 function scrollTop(){const h=document.querySelector?.(".practice-focus__header");h?.scrollIntoView?.({behavior:"auto",block:"start"})}
 function finish(){
  done=true;clearCheckpoint();
  window.EBDA_PROGRESS?.mark(cfg.progressKey||scope,g,u,i,Math.round(100*correctCount()/Math.max(1,items.length)));
  refresh();
 }
 function showHint(){hintFlags[cursor]=true;scheduleSave();refresh()}
 // On-device checkpoint resume (7 days, this browser only).
 function saved(){try{const raw=localStorage.getItem(storeKey);if(!raw)return null;const v=JSON.parse(raw);if(v?.version!==1||Date.now()-v.savedAt>TTL||Date.now()<v.savedAt||!Array.isArray(v.order)||v.order.length!==50){localStorage.removeItem(storeKey);return null}return v}catch(_){return null}}
 let saveDelay=null;
 function scheduleSave(){if(saveDelay)clearTimeout(saveDelay);saveDelay=setTimeout(()=>{saveDelay=null;saveCheckpoint()},450)}
 function saveCheckpoint(){
  if(!session||!items.length||done)return false;
  try{
   localStorage.setItem(storeKey,JSON.stringify({version:1,savedAt:Date.now(),session,order:items.map(q=>q.id),cursor,answers,hintFlags}));
   const node=document.getElementById("ntss-checkpoint-status");if(node)node.textContent=S.saved;
   return true;
  }catch(_){const node=document.getElementById("ntss-checkpoint-status");if(node)node.textContent=S.saveFail;return false}
 }
 function clearCheckpoint(){if(saveDelay)clearTimeout(saveDelay);saveDelay=null;try{localStorage.removeItem(storeKey)}catch(_){}const node=document.getElementById("ntss-checkpoint-status");if(node)node.textContent=S.cleared}
 function resumeCheckpoint(){
  const v=saved();if(!v||!/^[123]-\d+-\d+$/.test(v.session))return false;
  const [gg,uu,ii]=v.session.split("-").map(Number);
  const bank=normalize(cfg.buildItems(gg,uu,ii)),byId=new Map(bank.map(q=>[q.id,q]));
  if(bank.length!==50||new Set(v.order).size!==50||v.order.some(id=>!byId.has(id))||!Number.isInteger(v.cursor)||v.cursor<0||v.cursor>=50)return false;
  g=gg;u=uu;i=ii;session=lessonKey();
  window.NTSS_LEARNING?.reset(cfg.learningMode);
  if(cfg.appliedKey)window.NTSS_APPLIED?.reset(cfg.appliedKey,lessonKey());
  if(cfg.contextGames)window.EBDAA_CONTEXT_GAMES?.reset(cfg.gameKey,lessonKey());
  window.EBDAA_GAME?.resetLesson(cfg.gameKey,lessonKey());
  window.EBDA_MASTERY?.begin(g,u,i,scope);
  items=v.order.map(id=>byId.get(id));cursor=v.cursor;done=false;pendingStage=null;
  answers={};for(const [k,a]of Object.entries(v.answers||{})){const j=Number(k);if(Number.isInteger(j)&&j>=0&&j<50&&a&&typeof a==="object")answers[j]={value:a.value,checked:!!a.checked,correct:!!a.correct}}
  hintFlags=v.hintFlags&&typeof v.hintFlags==="object"?v.hintFlags:{};
  mistakes.clear();mistakeKey="";
  for(const [k,a]of Object.entries(answers)){if(a.checked)window.EBDA_MASTERY?.record(g,u,i,items[Number(k)],a.correct,!!hintFlags[k],scope)}
  refresh();return true;
 }
 window.addEventListener?.("pagehide",()=>{if(saveDelay)clearTimeout(saveDelay);saveDelay=null;if(session&&!done&&answered()>0)saveCheckpoint()});
 // Guided mistake review: diagnostic hint → worked reasoning → similar item.
 function mistakeState(){const q=current();mistakeKey=session+"|"+cursor+"|"+q.id;if(!mistakes.has(mistakeKey))mistakes.set(mistakeKey,{level:0,typed:"",result:null,related:(cfg.relatedItem||defaultRelated)(q,items,cursor)});return mistakes.get(mistakeKey)}
 function defaultRelated(q,list,at){
  for(let step=1;step<list.length;step++){const cand=list[(at+step*7)%list.length];if(cand&&cand.id!==q.id&&cand.mode===q.mode&&cand.question!==q.question)return cand}
  return null;
 }
 function mistakeAdvance(){const st=mistakes.get(mistakeKey);if(st)st.level=Math.min(3,st.level+1);refresh()}
 function mistakeType(v){const st=mistakes.get(mistakeKey);if(st)st.typed=String(v)}
 function mistakeChoose(j){const st=mistakes.get(mistakeKey);if(st){st.typed=j;mistakeCheck()}}
 function mistakeCheck(){
  const st=mistakes.get(mistakeKey);if(!st||!st.related)return;
  const q=st.related;
  st.result=q.mode==="choice"?Number(st.typed)===Number(q.answer):isCorrect(q,st.typed);
  refresh();
 }
 function mistakeHtml(q){
  const st=mistakeState(),rel=st.related;
  let body="";
  if(st.level>=1)body+='<div class="hint">'+S.mStep1+'</div>';
  if(st.level>=2)body+='<div class="feedback">'+S.mStep2+'<p>'+esc(q.explanation)+'</p><p><b>'+S.mExpected+'</b> '+esc(q.mode==="choice"?q.options[q.answer]:q.answer)+'</p></div>';
  if(st.level>=3){
   body+=!rel?'<p>'+S.mNone+'</p>':'<div class="interactive" style="background:#f3fbf8">'+S.mStep3+'<p>'+esc(rel.question)+'</p>'+
    (rel.mode==="choice"?'<div class="choices">'+rel.options.map((x,j)=>'<button class="choice" onclick="'+name+'.mistakeChoose('+j+')">'+esc(x)+'</button>').join("")+'</div>'
     :'<input type="'+(rel.mode==="fill"?"text":"number")+'" step="any" value="'+esc(st.typed)+'" oninput="'+name+'.mistakeType(this.value)" style="max-width:240px;width:100%;padding:11px;border:1px solid #c8d9d2;border-radius:9px">')+
    (rel.mode==="choice"?"":'<button class="btn teal" onclick="'+name+'.mistakeCheck()">'+S.mCheck+'</button>')+
    (st.result!==null?'<p class="feedback '+(st.result?"":"error")+'">'+(st.result?S.mOk:S.mNo)+'</p>':"")+'</div>';
  }
  return '<section class="interactive" style="background:#fffbec;border:1px solid #e5d6a0"><div class="eyebrow">'+S.mEyebrow+'</div><h3>'+S.mTitle+'</h3><p>'+S.mSub+'</p>'+body+(st.level<3?'<button class="btn light" onclick="'+name+'.mistakeAdvance()">'+S.mSteps[st.level]+' →</button>':"")+'</section>';
 }
 function hintText(q){
  if(cfg.hintText)return cfg.hintText(q);
  return q.mode==="choice"?"Eliminate the options that contradict the lesson definition first, then compare the remaining pair.":q.mode==="fill"?"Say the definition aloud; the missing term is its key word.":"Write down the relevant operation, then test it on a simpler input before using the displayed values.";
 }
 function controls(q,a){
  const dis=a?.checked?"disabled":"";
  if(q.mode==="choice")return window.EBDAA_GAME.render({options:q.options,answer:q.answer,type:q.type},cursor,a?.value,a?.checked,cfg.gameKey,lessonKey(),name+".gameChoose",cfg.locale);
  if(q.mode==="fill")return '<label for="'+cfg.inputId+'">'+S.yourAnswer+'</label><input id="'+cfg.inputId+'" type="text" dir="auto" value="'+esc(a?.value??"")+'" '+dis+' oninput="'+name+'.write(this.value)" style="display:block;width:100%;max-width:480px;padding:14px;border:1px solid #d9e1dd;border-radius:12px">';
  if(q.mode==="slider"){
   const max=Math.max(20,Math.ceil(Math.abs(Number(q.answer))*1.8)+1);
   return '<label for="'+cfg.inputId+'">'+(cfg.sliderLabel?cfg.sliderLabel(q,a?.value):S.yourAnswer+": "+esc(a?.value??""))+'</label><input id="'+cfg.inputId+'" type="range" min="0" max="'+max+'" step="0.1" value="'+esc(a?.value??"0")+'" '+dis+' oninput="'+name+'.write(this.value)" style="display:block;width:100%;margin:18px 0">';
  }
  return '<label for="'+cfg.inputId+'">'+S.yourAnswer+'</label><input id="'+cfg.inputId+'" type="number" step="any" inputmode="decimal" value="'+esc(a?.value??"")+'" '+dis+' oninput="'+name+'.write(this.value)" style="display:block;max-width:280px;width:100%;margin:12px 0;padding:14px;border:1px solid #d6d7d8;border-radius:12px">';
 }
 function render(){
  if(done){
   const ar=cfg.completionArabic===true?true:window.EBDA_I18N?window.EBDA_I18N.current()==="ar":false;
   return window.EBDA_COMPLETION.render({subject:cfg.subject,grade:g,unit:u,index:i,lesson:cfg.title(g,u,i),correct:correctCount(),answers,retry:name+".restart()",back:cfg.back,arabic:ar});
  }
  if(pendingStage!==null){
   const stage=pendingStage,from=stage*10,to=stage*10+9;
   const sprintCorrect=Object.keys(answers).filter(k=>{const j=Number(k);return j>=stage*10-10&&j<stage*10&&answers[j].checked&&answers[j].correct}).length;
   const h=cfg.header(g,u,i);
   const gate='<section class="ntss-stage-gate"><div class="eyebrow">'+esc(S.sPath)+'</div><h2 class="practice-question">'+esc(S.sDone(stage,S.sStages[stage-1]))+'</h2><p class="feedback" role="status">'+esc(S.sScore(sprintCorrect))+'</p><p><b>'+esc(S.sNext(stage+1,S.sStages[stage],from+1,to+1))+'</b></p><div class="stepfooter"><button class="btn teal" onclick="'+name+'.continueStage()">'+S.sGo+'</button></div></section>';
   return '<section class="practice-focus'+(cfg.focusClass?" "+cfg.focusClass:"")+'"'+(h.dir?' dir="'+h.dir+'"':"")+(h.lang?' lang="'+h.lang+'"':"")+'><header class="practice-focus__header"><div class="practice-focus__header-row"><button class="practice-focus__exit" onclick="'+h.exit+'">'+h.exitLabel+'</button><span class="practice-focus__year">'+h.yearLabel+'</span></div><div class="practice-focus__info"><h1 class="practice-focus__lesson">'+esc(cfg.title(g,u,i))+'</h1><span class="practice-focus__counter">'+S.question+" "+(cursor+1)+" / 50"+'</span></div><div class="practice-focus__track" role="progressbar" aria-label="Answered questions" aria-valuemin="0" aria-valuemax="50" aria-valuenow="'+answered()+'"><i style="width:'+(answered()*2)+'%"></i></div></header><div class="practice-focus__content"><div class="guided-question">'+gate+'<p class="muted" style="font-size:12px">'+h.disclaimer+'</p></div></div></section>';
  }
  const q=current(),a=rec(),done_=answered(),correct=correctCount();
  const streak=(()=>{let n=0;for(let k=cursor;k>=0;k--){if(answers[k]?.checked&&answers[k].correct)n++;else if(answers[k]?.checked)break;else break}return n})();
  const xp=correct*10+Math.min(streak,5)*5;
  const h=cfg.header(g,u,i);
  const hud='<div class="topmeta"><span class="pill">'+S.question+' '+(cursor+1)+' / 50</span><span class="pill">'+S.answered+': '+done_+' / 50</span><span class="pill practice-hud__xp" aria-label="Experience points">⭐ '+xp+' XP</span><span class="pill practice-hud__streak" aria-label="Current streak">🔥 '+streak+' '+S.streak+'</span></div>';
  const eyebrow=cfg.eyebrow?'<div class="eyebrow">'+cfg.eyebrow(q,{g,u,i,cursor,items})+'</div>':"";
  const hint=hintFlags[cursor]?'<div class="hint"><b>'+S.hintTitle+'</b> '+esc(hintText(q))+'</div>':"";
  const verdict=a?.checked?'<div class="feedback '+(a.correct?"":"error")+'" role="status"><b>'+(a.correct?S.correct:S.wrong)+'</b><p>'+esc(q.explanation)+'</p>'+(a.correct?"":'<p>'+S.wrongSub+'</p>')+'</div>':"";
  const mistake=a?.checked&&!a.correct?'<details class="focus-mistake"><summary>'+S.mistake+'</summary><div>'+mistakeHtml(q)+'</div></details>':"";
  const action=a?.checked?'<button id="'+cfg.checkId+'" class="btn teal" onclick="'+name+'.submitOrNext()">'+(cursor===49?S.last:S.next)+'</button>':'<button id="'+cfg.checkId+'" class="btn teal" onclick="'+name+'.submitOrNext()"'+(a===undefined||String(a.value??"").trim()===""?" disabled":"")+'>'+S.check+'</button>';
  const resume=cursor===0&&done_===0&&saved()?.session===session?'<button class="ntss-restore" onclick="'+name+'.resumeCheckpoint()">'+S.resume+'</button>':"";
  const body=resume+hud+(cfg.topExtras?cfg.topExtras(q,{g,u,i,cursor,items}):"")+eyebrow+'<h2 class="practice-question">'+esc(q.question)+'</h2>'+(cfg.beforeControls?cfg.beforeControls(q,{g,u,i,cursor,items}):"")+controls(q,a)+(cfg.afterControls?cfg.afterControls(q,{g,u,i,cursor,items}):"")+hint+verdict+mistake+
   (!a?.checked&&!hintFlags[cursor]?'<div class="actions"><button class="btn light" onclick="'+name+'.showHint()">'+S.hintBtn+'</button></div>':"")+
   '<div class="stepfooter"><button class="btn light" onclick="'+name+'.prev()"'+(cursor===0?" disabled":"")+'>'+S.prev+'</button>'+action+'</div>';
  return '<section class="practice-focus'+(cfg.focusClass?" "+cfg.focusClass:"")+'"'+(h.dir?' dir="'+h.dir+'"':"")+(h.lang?' lang="'+h.lang+'"':"")+'><header class="practice-focus__header"><div class="practice-focus__header-row"><button class="practice-focus__exit" onclick="'+h.exit+'">'+h.exitLabel+'</button><span class="practice-focus__year">'+h.yearLabel+'</span></div><div class="practice-focus__info"><h1 class="practice-focus__lesson">'+esc(cfg.title(g,u,i))+'</h1><span class="practice-focus__counter">'+(done?S.completed+" · 50 / 50":S.question+" "+(cursor+1)+" / 50")+'</span></div><div class="practice-focus__track" role="progressbar" aria-label="Answered questions" aria-valuemin="0" aria-valuemax="50" aria-valuenow="'+done_+'"><i style="width:'+(done_*2)+'%"></i></div></header><div class="practice-focus__content"><div class="guided-question">'+body+'<p class="muted" style="font-size:12px">'+h.disclaimer+'</p></div></div></section>';
 }
 function submitOrNext(){const a=rec();if(a?.checked)next();else check()}
 function continueStage(){pendingStage=null;refresh();scrollTop()}
 function progress(){return {position:done?50:cursor+1,answered:answered(),total:50,finished:done}}
 const api={
  start,render,restart,answer,choose:answer,respond:answer,select:answer,write,setInput:write,gameChoose,check,next,prev,previous:prev,move,submitOrNext,showHint,
  saveCheckpoint,clearCheckpoint,resumeCheckpoint,hasCheckpoint:()=>!!saved(),progress,currentQuestion:current,continueStage,
  mistakeAdvance,mistakeType,mistakeChoose,mistakeCheck,
  build:(gg,uu,ii)=>cfg.buildItems(gg,uu,ii),
  _state:()=>({g,u,i,cursor,answers,done,items}),_refresh:refresh,_markDone:()=>{done=true;window.EBDA_PROGRESS?.mark(cfg.progressKey||scope,g,u,i,Math.round(100*correctCount()/Math.max(1,items.length)));refresh()},_esc:esc,_S:S
 };
 if(cfg.render2)api.render=function(){return cfg.render2(api._state(),api)??render()};
 Object.assign(api,cfg.methods?cfg.methods(api):{});
 window[name]=api;
 return api;
}
return {create};
})();
