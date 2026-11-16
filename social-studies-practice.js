/* Supplementary concept practice for source-indexed social studies. 50 interactions per lesson
   recycle five core concepts in multiple formats, not 50 independent textbook questions.
   Designed for practice; teacher review is needed before formal assessment. */
window.EBDAA_SOCIAL_STUDIES_PRACTICE=(function(){
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const norm=x=>String(x||"").normalize("NFKC").replace(/[أإآٱ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/[\u064B-\u065F\u0670]/g,"").replace(/[.,،؟!\u200f\u200e]/g,"").replace(/\s+/g," ").trim().toLowerCase();
 let s={g:2,u:0,i:0,items:[],cursor:0,answers:{},done:false,typed:""},feedback="";
 const subject=()=>window.EBDAA_SOCIAL_STUDIES_UNITS[s.g][s.u];
 const lesson=()=>subject().sessions[s.i];
 function build(g,u,i){
  const pairs=window.EBDAA_SOCIAL_STUDIES_UNITS[g][u].sessions[i].terms;const result=[];
  for(let n=0;n<50;n++){
   const ix=(n*3+Math.floor(n/5))%pairs.length,p=pairs[ix],other=pairs[(ix+1+(Math.floor(n/10)%Math.max(1,pairs.length-1)))%pairs.length];
   const options=[p[0],...pairs.filter(x=>x!==p).slice(0,3).map(x=>x[0])];
   const meanings=[p[1],...pairs.filter(x=>x!==p).slice(0,3).map(x=>x[1])];
   const rotate=n%4,shift=xs=>xs.slice(rotate).concat(xs.slice(0,rotate));
   const type=n%5;
   if(type===0)result.push({type:"choice",prompt:"اختر المصطلح المناسب للتعريف الآتي:",clue:p[1],options:shift(options),answer:(4-rotate)%4,correct:p[0],explain:p[0]+" — "+p[1]});
   if(type===1)result.push({type:"fill",prompt:"أكمل بالمصطلح المناسب:",clue:p[1],answer:p[0],explain:p[0]+" — "+p[1]});
   if(type===2)result.push({type:"choice",prompt:"اختر التفسير الصحيح للمفهوم:",clue:p[0],options:shift(meanings),answer:(4-rotate)%4,correct:p[1],explain:p[0]+" — "+p[1]});
   if(type===3){const truth=n%2===1;result.push({type:"tf",prompt:"صح أم خطأ؟",clue:p[0]+" : "+(truth?p[1]:other[1]),answer:truth?0:1,correct:truth?"صواب":"خطأ",explain:p[0]+" — "+p[1]})}
   if(type===4)result.push({type:"fill",prompt:"اكتب المفهوم الذي تدرسه العبارة:",clue:p[1],answer:p[0],explain:p[0]+" — "+p[1]});
  }
  return result;
 }
 const draw=()=>window.EBDA_APP_RENDER?.();
 function start(g,u,i){s={g,u,i,items:build(g,u,i),cursor:0,answers:{},done:false,typed:""};feedback="";draw()}
 function select(v){if(s.answers[s.cursor]?.checked)return;s.answers[s.cursor]={value:v,checked:false,correct:false};draw()}
 function write(v){s.typed=String(v).slice(0,110)}
 function check(){
  const q=s.items[s.cursor],a=s.answers[s.cursor]||{},v=q.type==="fill"?s.typed:a.value;
  if(v===undefined||String(v).trim()==="")return;
  const ok=q.type==="fill"?norm(v)===norm(q.answer):Number(v)===q.answer;
  s.answers[s.cursor]={value:v,checked:true,correct:ok};feedback=ok?"أحسنت! إجابة صحيحة.":"راجع المعلومة وحاول تثبيتها في ذاكرتك.";draw();
 }
 function move(delta){
  if(delta>0&&!s.answers[s.cursor]?.checked)return;
  if(delta>0&&s.cursor===s.items.length-1){s.done=true;draw();return}
  s.cursor=Math.max(0,Math.min(s.items.length-1,s.cursor+delta));s.typed=String(s.answers[s.cursor]?.value||"");feedback="";draw()
 }
 function restart(){start(s.g,s.u,s.i)}
 function render(){
 if(s.done)return window.EBDA_COMPLETION.render({subject:"social",grade:s.g,unit:s.u,index:s.i,lesson:window.EBDAA_SOCIAL_STUDIES_UNITS[s.g][s.u].sessions[s.i].title,correct:Object.values(s.answers).filter(v=>v.checked&&v.correct).length,answers:s.answers,retry:"EBDAA_SOCIAL_STUDIES_PRACTICE.restart()",back:"socialBackToUnit()",arabic:true});

  const q=s.items[s.cursor],a=s.answers[s.cursor],answered=Object.values(s.answers).filter(x=>x.checked).length,correct=Object.values(s.answers).filter(x=>x.checked&&x.correct).length;
  const head='<header class="practice-focus__header" dir="rtl"><div class="practice-focus__header-row"><button class="practice-focus__exit" onclick="socialBackToUnit()">← العودة إلى الدروس</button><span class="practice-focus__year">الصف '+(s.g===2?"الثاني":"الثالث")+' · الدراسات الاجتماعية</span></div><div class="practice-focus__info"><h1 class="practice-focus__lesson">'+esc(lesson().title)+'</h1><span class="practice-focus__counter">'+(s.done?"إنجاز المهمة":"السؤال "+(s.cursor+1)+" من 50")+'</span></div><div class="practice-focus__track"><i style="width:'+(answered*2)+'%"></i></div></header>';
  if(s.done){const rate=Math.round(100*correct/50);return '<section class="practice-focus" lang="ar" dir="rtl">'+head+'<div class="practice-focus__content"><div class="guided-question"><h2>🏅 انتهت مهمة الدراسات الاجتماعية!</h2><div class="game-hud"><strong>نتيجتك: '+correct+' / 50</strong><p>معدل الإتقان: '+rate+'%</p><p>هذه أسئلة مراجعة تعليمية مولدة من مفاهيم الدرس، وليست اختبارًا رسميًا.</p></div><button class="btn teal" onclick="EBDAA_SOCIAL_STUDIES_PRACTICE.restart()">↻ إعادة التدريب</button><button class="btn light" onclick="socialBackToUnit()">العودة إلى الوحدة</button></div></div></section>';}
  let controls="";
  if(q.type==="fill")controls='<label style="display:block;margin:18px 0 8px;font-weight:700" for="social-answer">إجابتك</label><input id="social-answer" class="game-input" dir="rtl" lang="ar" style="width:100%;max-width:480px;padding:16px;border:1px solid #d9e1dd;border-radius:12px" placeholder="اكتب المصطلح هنا" value="'+esc(s.typed)+'" '+(a?.checked?"disabled":"")+' oninput="EBDAA_SOCIAL_STUDIES_PRACTICE.write(this.value)"/>';
  else controls='<div style="display:grid;gap:10px;margin:20px 0">'+(q.type==="tf"?["صواب","خطأ"]:q.options).map((o,j)=>'<button class="card" style="width:100%;padding:16px;min-height:54px;border:2px solid '+(a?.value===j?"#1ca29a":"#e5e7eb")+';border-radius:14px;text-align:right;cursor:pointer;background:'+(a?.value===j?"#e9faf5":"white")+'" '+(a?.checked?"disabled":"")+' onclick="EBDAA_SOCIAL_STUDIES_PRACTICE.select('+j+')">'+esc(o)+'</button>').join("")+'</div>';
  const fb=a?.checked?'<div class="feedback '+(a.correct?"":"error")+'" role="status"><strong>'+(a.correct?"✓ صحيح":"الإجابة النموذجية: "+esc(q.correct||q.answer))+'</strong><p>'+esc(q.explain)+'</p></div>':"";
  const key=["🗺 اكتشف المعلومة","✏️ أكمل المفهوم","🔎 استنتج","⚖️ صواب أم خطأ","🧠 تحدي الذاكرة"][s.cursor%5];
  return '<section class="practice-focus" lang="ar" dir="rtl">'+head+'<div class="practice-focus__content"><div class="guided-question" dir="rtl"><div class="eyebrow">'+key+' · نقطة معرفة</div><h2 class="practice-question">'+esc(q.prompt)+'</h2><p style="font-size:18px;line-height:1.8;font-weight:600">'+esc(q.clue)+'</p>'+controls+fb+'<div class="stepfooter"><button class="btn light" '+(!s.cursor?"disabled":"")+' onclick="EBDAA_SOCIAL_STUDIES_PRACTICE.move(-1)">السابق</button><button class="btn teal" '+(a?.checked?"":q.type==="fill"?"":a?.value===undefined?"disabled":"")+' onclick="EBDAA_SOCIAL_STUDIES_PRACTICE.'+(a?.checked?"move(1)":"check()")+'">'+(a?.checked?(s.cursor===49?"إنهاء المهمة":"التالي ←"):"تحقق من الإجابة")+'</button></div><p class="muted" style="font-size:12px;margin-top:18px">الأنشطة تعليمية مساندة من مفاهيم الدرس وتستخدم إعادة صياغة متعددة للمعلومات الأساسية. لا تُمثل 50 سؤالًا أصليًا مستقلاً من الكتاب، وتحتاج مراجعة المعلم قبل التقييم الرسمي.</p></div></div></section>';
 }
 return {start,build,render,select,write,check,move,restart};
})();