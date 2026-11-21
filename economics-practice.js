(function(){
/* Supplementary concept practice for source-indexed social studies. 50 interactions per lesson
   recycle five core concepts in multiple formats, not 50 independent textbook questions.
   Designed for practice; teacher review is needed before formal assessment. */
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const norm=x=>String(x||"").normalize("NFKC").replace(/[أإآٱ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/[\u064B-\u065F\u0670]/g,"").replace(/[.,،؟!\u200f\u200e]/g,"").replace(/\s+/g," ").trim().toLowerCase();

 const numericCases={
 "0-4":[["طالب اختار تدريبًا يوفر 800 جنيه بدل وظيفة مؤقتة تحقق 600 جنيه. ما تكلفة الفرصة البديلة (بالجنيه)؟","600"],["مشروع اختار عائدًا 900 جنيه وترك بديلًا يوفر 700 جنيه. ما تكلفة الفرصة البديلة؟","700"]],
 "1-1":[["انخفض سعر منتج من 20 إلى 15 جنيهًا فزادت الكمية المطلوبة من 40 إلى 60 وحدة. ما مقدار الزيادة في الكمية المطلوبة؟","20"],["إذا زادت الكمية المطلوبة من 50 إلى 80، فكم وحدة بلغت الزيادة؟","30"]],
 "1-2":[["عند سعر 10 جنيهات يعرض المنتج 30 وحدة، وعند سعر 15 يعرض 50 وحدة. ما مقدار الزيادة في العرض؟","20"]],
 "1-3":[["عند سعر 25 جنيهًا الكمية المطلوبة والمعروضة كل منهما 80 وحدة. ما الكمية التوازنية؟","80"],["عند سعر معين الطلب 120 وحدة والعرض 90 وحدة. احسب مقدار فائض الطلب.","30"],["زادت الكمية المطلوبة بنسبة 20% نتيجة انخفاض السعر بنسبة 10%. ما القيمة المطلقة لمرونة الطلب السعرية؟","2"]],
 "2-0":[["توقع مشروع إيرادات 90000 جنيه وتكاليف 65000 جنيه. ما الفائض المتوقع؟","25000"]],
 "2-1":[["تستهدف حملة تسويق 500 عميل، وصل الإعلان إلى 200 منهم. كم عميلًا لم يصل إليه الإعلان؟","300"]],
 "2-2":[["الطلب المتوقع 120 وحدة يوميًا والطاقة الإنتاجية 100 وحدة. كم وحدة ينقصها الإنتاج لتلبية الطلب؟","20"]],
 "2-3":[["خط إنتاج يحتاج 240 ساعة عمل شهريًا، ويعمل كل عامل 40 ساعة منتجة. كم عاملًا مباشرًا يلزم؟","6"],["يُنتج جهاز 12 وحدة في الساعة لمدة 5 ساعات. ما عدد الوحدات؟","60"]],
 "2-4":[["تمويل المشروع 100000 جنيه منها 40000 من رأس مال المالك. كم التمويل الخارجي المطلوب؟","60000"]],
 "3-0":[["إيرادات عامة 850 مليون جنيه ونفقات 800 مليون. ما فائض الموازنة بالمليون جنيه؟","50"]],
 "3-1":[["مخصصات الصحة 300 مليون والتعليم 400 مليون. ما إجمالي المخصصات بالمليون؟","700"]],
 "3-2":[["حصلت الدولة على ضرائب 80 مليون ورسوم 20 مليون. كم إجمالي الإيرادات بالمليون؟","100"]],
 "3-3":[["بطاقة مسبقة الدفع بها 500 جنيه. تم شراء منتجات بـ175 جنيهًا. ما الرصيد المتبقي؟","325"]],
 "3-4":[["قرض قيمته 12000 جنيه يسدد على 12 شهرًا بدون فوائد أو رسوم. ما القسط الشهري؟","1000"],["قرض قيمته 24000 جنيه يسدد على 24 شهرًا دون فوائد أو رسوم. ما قيمة القسط الشهري؟","1000"]]
 };
 function build(g,u,i){
  const pairs=window.EBDAA_ECONOMICS_UNITS[g][u].sessions[i].terms;const result=[];
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
  const cases=numericCases[u+"-"+i]||[];
  for(let n=7;n<50;n+=10)if(cases.length){const ex=cases[Math.floor(n/10)%cases.length];result[n]={type:"fill",prompt:"🧮 مسألة اقتصادية تطبيقية — اكتب الناتج رقمًا فقط:",clue:ex[0],answer:ex[1],explain:"الإجابة الحسابية: "+ex[1]+". هذه مسألة توضيحية مولدة وليست من نص امتحانات الدليل."}}
  return result;
 }
window.EBDAA_ECONOMICS_PRACTICE=window.EBDA_PRACTICE_FRAMEWORK.create({
 name:"EBDAA_ECONOMICS_PRACTICE",subject:"economics",gameKey:"economics",learningMode:"economicsPractice",appliedKey:"economics",
 locale:"ar",inputId:"practice-answer",checkId:"economics-check",back:"economicsBackToUnit()",completionArabic:true,
 checkFill:(q,v)=>String(q.answer).match(/^[0-9]+$/)?Number(String(v).replace(/[٠-٩]/g,x=>"٠١٢٣٤٥٦٧٨٩".indexOf(x)))===Number(q.answer):norm(v)===norm(q.answer),
 buildItems:(g,u,i)=>build(g,u,i).map(q=>q.type==="tf"?{mode:"choice",question:q.prompt,clue:q.clue,options:["صواب","خطأ"],answer:q.answer,explanation:q.explain}:q.type==="fill"?{mode:"fill",question:q.prompt,clue:q.clue,answer:q.answer,explanation:q.explain}:{mode:"choice",question:q.prompt,clue:q.clue,options:q.options,answer:q.answer,explanation:q.explain}),
 title:(g,u,i)=>window.EBDAA_ECONOMICS_UNITS[g][u].sessions[i].title,
 header:g=>({dir:"rtl",lang:"ar",exitLabel:"← العودة إلى الدروس",exit:"economicsBackToUnit()",yearLabel:"الصف الثالث · الاقتصاد",disclaimer:"الأنشطة تعليمية مساندة من مفاهيم الدرس، وتتضمن حسابات تدريبية أصلية وتستخدم إعادة صياغة متعددة للمعلومات الأساسية. لا تُمثل 50 سؤالًا أصليًا مستقلاً من الكتاب، وتحتاج مراجعة المعلم قبل التقييم الرسمي."}),
 eyebrow:(q,{cursor})=>["🗺 اكتشف المعلومة","✏️ أكمل المفهوم","🔎 استنتج","⚖️ صواب أم خطأ","🧠 تحدي الذاكرة"][cursor%5]+" · نقطة معرفة",
 beforeControls:q=>'<p style="font-size:18px;line-height:1.8;font-weight:600">'+esc(q.clue)+'</p>',
 afterControls:(q,{g,u,i,cursor})=>window.NTSS_APPLIED.render("economics",[g,u,i].join("-"),cursor,window.EBDAA_ECONOMICS_UNITS[g][u].sessions[i].title)
});

})();
