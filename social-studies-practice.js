(function(){
/* Supplementary concept practice for source-indexed social studies. 50 interactions per lesson
   recycle five core concepts in multiple formats, not 50 independent textbook questions.
   Designed for practice; teacher review is needed before formal assessment. */
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const norm=x=>String(x||"").normalize("NFKC").replace(/[أإآٱ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/[\u064B-\u065F\u0670]/g,"").replace(/[.,،؟!\u200f\u200e]/g,"").replace(/\s+/g," ").trim().toLowerCase();
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
window.EBDAA_SOCIAL_STUDIES_PRACTICE=window.EBDA_PRACTICE_FRAMEWORK.create({
 name:"EBDAA_SOCIAL_STUDIES_PRACTICE",subject:"social",gameKey:"social",learningMode:"socialPractice",appliedKey:"social",
 locale:"ar",inputId:"practice-answer",checkId:"social-check",back:()=>socialBackToUnit(),completionArabic:true,
 checkFill:(q,v)=>String(q.answer).match(/^[0-9]+$/)?Number(String(v).replace(/[٠-٩]/g,x=>"٠١٢٣٤٥٦٧٨٩".indexOf(x)))===Number(q.answer):norm(v)===norm(q.answer),
 buildItems:(g,u,i)=>build(g,u,i).map(q=>q.type==="tf"?{mode:"choice",question:q.prompt,clue:q.clue,options:["صواب","خطأ"],answer:q.answer,explanation:q.explain}:q.type==="fill"?{mode:"fill",question:q.prompt,clue:q.clue,answer:q.answer,explanation:q.explain}:{mode:"choice",question:q.prompt,clue:q.clue,options:q.options,answer:q.answer,explanation:q.explain}),
 title:(g,u,i)=>window.EBDAA_SOCIAL_STUDIES_UNITS[g][u].sessions[i].title,
 header:g=>({dir:"rtl",lang:"ar",exitLabel:"← العودة إلى الدروس",exit:()=>socialBackToUnit(),yearLabel:"الصف "+(g===2?"الثاني":"الثالث")+" · الدراسات الاجتماعية",disclaimer:"الأنشطة تعليمية مساندة من مفاهيم الدرس وتستخدم إعادة صياغة متعددة للمعلومات الأساسية. لا تُمثل 50 سؤالًا أصليًا مستقلاً من الكتاب، وتحتاج مراجعة المعلم قبل التقييم الرسمي."}),
 eyebrow:(q,{cursor})=>["🗺 اكتشف المعلومة","✏️ أكمل المفهوم","🔎 استنتج","⚖️ صواب أم خطأ","🧠 تحدي الذاكرة"][cursor%5]+" · نقطة معرفة",
 beforeControls:q=>'<p style="font-size:18px;line-height:1.8;font-weight:600">'+esc(q.clue)+'</p>',
 afterControls:(q,{g,u,i,cursor})=>window.NTSS_APPLIED.render("social",[g,u,i].join("-"),cursor,window.EBDAA_SOCIAL_STUDIES_UNITS[g][u].sessions[i].title)
});

})();
