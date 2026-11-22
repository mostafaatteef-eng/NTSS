/* NTSS formative support: no persistence, no impact on grades. */
window.NTSS_LEARNING=(function(){
 const attempts=new Map(), opened=new Set(),skills=new Map(),toolsOpened=new Set();
 const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const lang=mode=>window.EBDA_I18N?.current?.()||(/arabic|economics|civics|social/i.test(mode)?"ar":/german/i.test(mode)?"de":"en");
 const strings={
  en:["Review the idea","Optional · no impact on score","Understand the question","Explain the reasoning","Apply it again","Identify the given information and the relevant rule. Explain your solution to yourself before continuing.","Optional practice game"],
  ar:["راجع الفكرة","اختياري · لا يؤثر على الدرجة","افهم السؤال","فسر الحل","طبّق الفكرة من جديد","حدد المعطيات والقاعدة المناسبة ثم اشرح لنفسك طريقة الحل.","نشاط تدريبي إضافي — اختياري"],
  de:["Überprüfe die Idee","Optional · ohne Einfluss auf die Note","Aufgabe verstehen","Lösung erklären","Erneut anwenden","Prüfe die Angaben und erkläre dir die Lösungsregel.","Optionales Lernspiel"]
 };
 function reset(mode){for(const k of [...toolsOpened])if(k.startsWith(mode+":"))toolsOpened.delete(k);for(const map of [attempts,skills])for(const k of [...map.keys()])if(k.startsWith(mode+":"))map.delete(k);for(const k of [...opened])if(k.startsWith(mode+":"))opened.delete(k)}
 function record(mode,index,correct,q){
  if(!Number.isInteger(index)||index<0||index>=50)return;
  const k=mode+":"+index;if(attempts.has(k))return;
  const entry={correct:!!correct,question:String(q?.question??q?.prompt??"").slice(0,260),explanation:String(q?.explanation??q?.explain??q?.formula??"").slice(0,700),skill:String(q?.focus??q?.kind??q?.type??"concept").slice(0,50)};
  attempts.set(k,entry);
  const id=mode+":skill:"+entry.skill,v=skills.get(id)||{attempted:0,correct:0};v.attempted++;if(correct)v.correct++;skills.set(id,v);
 }
 function report(mode){
  const a=[...attempts].filter(([k])=>k.startsWith(mode+":")).map(([,v])=>v);
  const weak=[...skills].filter(([k,v])=>k.startsWith(mode+":")&&v.attempted>=2&&v.correct/v.attempted<0.7).map(([k,v])=>({skill:k.split(":skill:")[1],...v}));
  return {attempted:a.length,correct:a.filter(v=>v.correct).length,weak};
 }
 function toggle(key,isOpen){if(isOpen)opened.add(key);else opened.delete(key)}
 function review(mode,index){
  const key=mode+":"+index,r=attempts.get(key);if(!r||r.correct)return "";
  const t=strings[lang(mode)],exp=r.explanation||t[5];
  return ("<details class=\"ntss-support\" "+(opened.has(key)?"open":"")+" "+window.NTSS_EVENTS.bind("toggle",function(event){NTSS_LEARNING.toggle((key),this.open)},"NTSS_LEARNING.toggle")+"><summary>"+(t[0])+" <small>"+(t[1])+"</small></summary><div class=\"ntss-support-inner\"><b>01 · "+(t[2])+"</b><p>"+(escape(r.question))+"</p><b>02 · "+(t[3])+"</b><p>"+(escape(exp))+"</p><b>03 · "+(t[4])+"</b><p>"+(t[5])+"</p></div></details>");
 }
 function adaptiveAdvice(mode,index){
  if(index<4)return "";
  const last=Array.from({length:5},(_,i)=>attempts.get(mode+":"+(index-5+i))).filter(Boolean);
  if(last.length<4||last.filter(x=>x.correct).length>=3)return "";
  const recent=last.filter(x=>!x.correct&&x.explanation).at(-1);
  const t=strings[lang(mode)],key=mode+":tip:"+index;
  return ("<details class=\"ntss-support ntss-adaptive-tip\" "+(opened.has(key)?"open":"")+" "+window.NTSS_EVENTS.bind("toggle",function(event){NTSS_LEARNING.toggle((key),this.open)},"NTSS_LEARNING.toggle")+"><summary>◈ "+(lang(mode)==="ar"?"اقتراح مراجعة بناءً على محاولاتك":lang(mode)==="de"?"Persönlicher Wiederholungstipp":"Suggested review based on recent answers")+" <small>"+(t[1])+"</small></summary><div class=\"ntss-support-inner\"><p>"+(escape(recent?.explanation||t[5]))+"</p><p>"+(t[5])+"</p></div></details>");
 }
 function toolsToggle(key,isOpen){if(isOpen)toolsOpened.add(key);else toolsOpened.delete(key)}
 function decorate(root,mode){
  // AI lessons use a single-question focus view. Never inject optional panels into this view.
  if(mode==="learn"||mode==="advancedLab")return;
  const screen=root?.querySelector?.(".practice-focus"),area=screen?.querySelector?.(".practice-focus__content");if(!area)return;
  const m=(screen.querySelector(".practice-focus__counter")?.textContent||"").match(/(?:Question|Frage|Mission|السؤال|سؤال)\s*(\d+)/i);if(!m)return;
  const index=Math.max(0,Math.min(49,Number(m[1])-1)),target=area.querySelector(".guided-question")||area.querySelector(".practice-flow")||area;
  const fragment=review(mode,index);if(fragment&&!target.querySelector(".focus-mistake"))target.insertAdjacentHTML("beforeend",fragment);
  const tip=adaptiveAdvice(mode,index);if(tip&&!fragment)target.insertAdjacentHTML("beforeend",tip);
  for(const el of [...target.querySelectorAll(".context-game")]){
   if(el.closest(".ntss-optional-game"))continue;
   const panel=document.createElement("details");panel.className="ntss-optional-game";
   const summary=document.createElement("summary");summary.textContent=strings[lang(mode)][6];
   el.parentNode.insertBefore(panel,el);panel.append(summary,el);
  }
  window.NTSS_CONCEPTS?.attach(target,mode,screen.querySelector(".practice-focus__lesson")?.textContent||"");
  // Disclose nonessential activities in a single drawer. Keep the assessed question in view.
  const optional=[...target.querySelectorAll(".ntss-optional-game,.ntss-applied,.context-report,.practice-milestone,.practice-source,.ntss-concept,.ntss-support,.focus-mistake,.ntss-journey")].filter(el=>!el.closest(".ntss-learning-tools"));
  const labs=[...screen.querySelectorAll(".practice-focus__header button")].filter(el=>el.getAttribute("data-ntss-action")==="openCodeLab");
  if(optional.length||labs.length){
    const key=mode+":"+index,drawer=document.createElement("details");drawer.className="ntss-learning-tools";
    if(toolsOpened.has(key))drawer.open=true;
    drawer.addEventListener("toggle",function(){toolsToggle(key,this.open)});
    const summary=document.createElement("summary");summary.textContent=lang(mode)==="ar"?"✦ أدوات التعلم (اختيارية)":lang(mode)==="de"?"✦ Lernwerkzeuge (optional)":"✦ Learning tools (optional)";
    drawer.appendChild(summary);
    if(labs.length){
      const labWrap=document.createElement("div");labWrap.className="ntss-learning-tools-labs";
      for(const el of labs){const parent=el.parentElement;labWrap.appendChild(el);if(parent&&parent.childElementCount===0)parent.remove()}
      drawer.appendChild(labWrap);
    }
    for(const el of optional)drawer.appendChild(el);
    target.appendChild(drawer);
  }
 }
 return {record,reset,report,review,adaptiveAdvice,decorate,toggle,toolsToggle};
})();