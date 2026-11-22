/* Shared interface language. Subject questions, source titles and student work keep their own language. */
window.NTSS_UI=(function(){
 const current=()=>window.EBDA_I18N?.current()==="ar"?"ar":"en";
 const pair=(en,ar)=>current()==="ar"?ar:en;
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const names={ai:["AI & Data Analysis","الذكاء الاصطناعي وتحليل البيانات"],da:["Data Analysis","تحليل البيانات"],math:["Mathematics","الرياضيات"],en:["Advanced English","اللغة الإنجليزية"],de:["German","اللغة الألمانية"],ar:["Arabic Language","اللغة العربية"],physics:["Physics STEM","الفيزياء"],be:["Business English","لغة الأعمال الإنجليزية"],social:["Social Studies","الدراسات الاجتماعية"],civics:["National Education","التربية الوطنية"],economics:["Economics","الاقتصاد"]};
 const subject=k=>(names[k]||[k,k])[current()==="ar"?1:0];
 const year=g=>pair("Year "+g,"الصف "+g);
 const back=()=>pair("Back to lessons","العودة للدروس");
 function toolbar(){return ("<div class=\"practice-language-bar\" dir=\""+(current()==="ar"?"rtl":"ltr")+"\"><span>EBDA Learning</span><button type=\"button\" class=\"btn light\" "+window.NTSS_EVENTS.bind("click",function(event){EBDA_I18N.toggle()},"EBDA_I18N.toggle")+" aria-label=\""+(pair("Switch interface to Arabic","تغيير لغة الواجهة إلى الإنجليزية"))+"\">"+(pair("عربي","English"))+"</button></div>")}
 function catalog(key,c,g){
  return {...c,dir:current()==="ar"?"rtl":"ltr",crumb:()=>year(g),termLabel:n=>pair("Term "+n,"الفصل الدراسي "+n),
   unitKicker:(u,i)=>{const n=key==="de"?i+(g===1?1:g===2?4:7):(u.unitNo??i+1);return pair((key==="de"?"Module ":"Unit ")+n+" · "+u.sessions.length+" lessons","الوحدة "+n+" · "+u.sessions.length+" درسًا")},
   unitCta:pair("View lessons →","عرض الدروس ←"),backSubject:pair("Back to subjects","العودة للمواد"),backUnits:pair("Back to units","العودة للوحدات"),
   sessionCta:pair("Start 50 questions →","ابدأ 50 سؤالًا ←"),
   sessionKicker:(l,i)=>l?.kind==="project"?pair("Group project · Teacher review","مشروع جماعي · مراجعة المعلم"):l?.kind==="exam"?pair("Practice exam","اختبار تدريبي"):l?.kind==="revision"?pair("Revision","مراجعة"):pair("Lesson "+(l.number??i+1),"الدرس "+(l.number??i+1))};
 }
 // Only structural controls are translated here, never questions, options or student text.
 const controls=[["▶ Play / replay", "▶ تشغيل / إعادة"], ["Show transcript", "عرض النص", "Transkript anzeigen"], ["Hide transcript", "إخفاء النص", "Transkript verbergen"], ["▶ Listen", "▶ استماع", "▶ Anhören"], ["🎙 Repeat aloud", "🎙 كرّر بصوتك", "🎙 Nachsprechen"], ["Play again", "إعادة اللعبة", "Nochmal spielen"], ["↺ Try again", "↺ حاول مرة أخرى"], ["↺ Restart mini game", "↺ إعادة اللعبة المصغرة"], ["Check", "تحقق"], ["▶ Launch projectile", "▶ إطلاق المقذوف"], ["Reveal one clue →", "اعرض تلميحًا ←"], ["Prediction guide revealed ✓", "تم عرض دليل التوقع ✓"], ["Show the explanation →", "اعرض الشرح ←"], ["Explanation revealed ✓", "تم عرض الشرح ✓"], ["Check calculated answer", "تحقق من الناتج"], ["↓ Save my lab evidence (.txt)", "↓ حفظ عمل المعمل (.txt)"], ["↺ Restore example", "↺ استعادة المثال"], ["▶ Run python", "▶ تشغيل python"], ["▶ Run sql", "▶ تشغيل sql"], ["▶ Run Python", "▶ تشغيل Python"], ["▶ Run SQL", "▶ تشغيل SQL"], ["▶ Run & check", "▶ تشغيل وتحقق"], ["▶ Running…", "▶ جارٍ التشغيل…"], ["Clear saved checkpoint", "مسح التدريب المحفوظ"], ["Save my progress on this device", "حفظ تقدمي على هذا الجهاز"], ["Next puzzle →", "اللغز التالي ←"], ["Complete mission ✓", "إتمام المهمة ✓"], ["Play again ↻", "إعادة اللعب ↻"], ["💡 Need a hint?", "💡 تحتاج تلميحًا؟"], ["💡 Hint shown", "💡 تم عرض التلميح"],
 ["← Previous","السابق"],["Next question →","التالي ←"],["Check answer","تحقق من الإجابة"],["Show summary","عرض النتيجة"],["Show result","عرض النتيجة"],["Next lesson →","الدرس التالي ←"],["💡 Need a hint?","💡 تحتاج تلميحًا؟"],["Review this mistake","راجع هذا الخطأ"],["Continue saved practice on this device","استئناف التدريب المحفوظ على هذا الجهاز"],["Back to lessons","العودة للدروس"],
 ["← Back to unit","العودة للدروس"],["← All lessons","العودة للدروس"],["← Back to lessons","العودة للدروس"],
 ["Complete project preparation →","إتمام إعداد المشروع ←"],["🔊 Hear lesson title","🔊 استمع لعنوان الدرس"]
 ];
 function localize(root){
  const ar=current()==="ar";
  root.querySelectorAll('.practice-focus__exit').forEach(el=>{el.textContent=back();el.setAttribute('aria-label',back())});
  root.querySelectorAll('.choice,.game-token,.game-tile,.practice-focus__lesson,.guided-question>.muted').forEach(el=>el.setAttribute('dir','auto'));
  root.querySelectorAll('button:not(.choice):not(.card):not(.context-tile):not(.ntss-applied-option):not(.game-tile),.focus-mistake>summary')?.forEach(el=>{
   const text=el.textContent.trim(),found=controls.find(labels=>labels.includes(text));if(found){el.textContent=found[ar?1:0];if(el.hasAttribute("aria-label"))el.setAttribute("aria-label",el.textContent)}
  });
  root.querySelectorAll('#focus-counter,.practice-flow>.topmeta .pill').forEach(el=>{
   const text=el.textContent.trim();let m=text.match(/^(?:Question|QUESTION|سؤال)\s+(\d+)\s*\/\s*(\d+)$/);if(m){el.innerHTML=pair('Question ','سؤال ')+'<bdi>'+m[1]+' / '+m[2]+'</bdi>';return}
   m=text.match(/^(?:Answered:|أُجيب:)\s*(\d+)\s*\/\s*(\d+)$/);if(m)el.innerHTML=pair('Answered: ','أُجيب: ')+'<bdi>'+m[1]+' / '+m[2]+'</bdi>';
  });
 }
 return {current,pair,subject,year,back,toolbar,catalog,localize,esc};
})();
