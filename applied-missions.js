/* NTSS Applied Missions: original scenario-based transfer practice.
   Show at questions 15 and 35, independent from grades and certificates.
   Examples are illustrative, not official textbook exam questions. */
window.NTSS_APPLIED=(function(){
 const state=new Map(),first=new Map();
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const key=(subject,lesson,idx)=>subject+":"+lesson+":"+idx;
 const cases={
  ai:[
   [/sql|database|query|relational/i,[["A school needs the number of students in each city. Which SQL approach is correct?",["SELECT city, COUNT(*) FROM students GROUP BY city","SELECT * FROM cities ORDER BY students","DELETE FROM students"],0,"GROUP BY groups rows by city before COUNT(*) is computed."],["The database has student names and project topics in separate linked tables. How do you combine them?",["Use a JOIN with the student ID","Sort both tables independently","Delete unmatched projects"],0,"A JOIN connects related tables through their key fields."]]],
   [/python|program|coding|loop|algorithm|function/i,[["A list may contain zero items. What should a Python average function do before division?",["Check that len(values) is greater than zero","Always divide by one","Convert all elements to strings"],0,"Checking for an empty list prevents division by zero."],["You need to reuse the same computation for many inputs. What is a suitable approach?",["Create a function with parameters","Copy and paste the calculation 40 times","Replace every variable with a fixed number"],0,"A function improves reuse and reduces duplicated logic."]]],
   [/model|machine learning|training|prediction|classification|ai/i,[["A model scores 99% on the training data but performs poorly on new students. What should you investigate?",["Overfitting and evaluation on a held-out set","Increasing the training score further","Removing all test examples"],0,"Strong training performance alone does not establish generalization."],["A student dataset contains full names and phone numbers. What is the safest first step?",["Remove unnecessary personal fields before analysis","Publish the original data to classmates","Add more identifiers to improve accuracy"],0,"Data minimization reduces unnecessary exposure of personal information."]]],
   [/statistics|analysis|visual|chart|data/i,[["You are comparing categories of student projects. Which chart communicates counts clearly?",["Bar chart","Continuous line chart of category names","A random color palette without labels"],0,"A bar chart is appropriate for comparing categorical counts."],["A class has one extremely high score compared with the rest. Which statistic is often more resistant to that outlier?",["Median","Maximum","Range"],0,"The median is less sensitive to extreme values than the mean."]]]
  ],
  physics:[
   [/ohm|resistan|electric current|dynamic electricity/i,[["A circuit keeps the same resistance, but its voltage doubles. What happens to current according to Ohm's law?",["Current doubles","Current halves","Current stays constant"],0,"I = V / R; when R stays fixed, current is proportional to voltage."],["Two equal resistors are connected in series. What happens to equivalent resistance?",["It is the sum of both resistances","It becomes zero","It equals half one resistor"],0,"For series resistors: R_total = R1 + R2."]]],
   [/wave|sound|light|refraction|reflection/i,[["Wave speed stays constant while frequency doubles. What happens to wavelength?",["It halves","It doubles","It stays constant"],0,"v = f × λ. With v constant, doubling f halves λ."],["A ray passes into a different medium and its speed changes. Which phenomenon should you investigate?",["Refraction","Electric induction","Nuclear decay"],0,"Refraction is associated with a change in wave speed across media."]]],
   [/force|newton|motion|acceleration|velocity/i,[["A cart experiences the same net force but its mass doubles. What happens to acceleration?",["It halves","It doubles","It becomes negative"],0,"Newton's second law: a = F/m."],["A vehicle moves with constant speed in a straight line. What is its acceleration?",["Zero","Equal to its speed","Always increasing"],0,"Acceleration measures change in velocity, not the value of speed."]]],
   [/energy|work|power|heat/i,[["A motor does the same work in half the time. What happens to its power?",["It doubles","It halves","It stays constant"],0,"Power is work divided by time."],["A metal spoon warms when placed in hot soup. What is the main heat transfer mechanism through the spoon?",["Conduction","Evaporation","Diffraction"],0,"Conduction transfers heat through direct material contact."]]],
   [/magnet|induction|transformer|generator/i,[["A transformer has twice as many secondary turns as primary turns. In the ideal model, what happens to voltage?",["It doubles","It halves","It becomes zero"],0,"Ideal transformer ratio: Vs / Vp = Ns / Np."],["A magnet is moved through a coil. Which effect may generate a voltage?",["Electromagnetic induction","Static friction","Evaporation"],0,"Changing magnetic flux can induce an electromotive force."]]]
  ],
  business:[
   [/support|troubleshoot|issue|fix/i,[["A customer reports a recurring software fault. What is the best first professional response?",["Ask for steps to reproduce the issue and document the impact","Tell the customer to stop reporting it","Promise a fix without investigation"],0,"Clarifying the problem and documenting evidence supports effective troubleshooting."],["A fix is ready. What should your follow-up message include?",["What changed, how to verify it, and how to seek help","Only 'done' with no context","A technical blame statement"],0,"A useful support closure is clear and verifiable."]]],
   [/data|visual|management|report/i,[["A manager needs a concise data report. Which approach is best?",["State the finding, evidence, and recommended action","Paste all raw data without context","Remove chart labels"],0,"Evidence and an actionable takeaway make data reports useful."],["You discover missing fields in a data export. What should you do before presenting results?",["Flag the missing data and assess its impact","Invent replacement values without disclosure","Delete the entire report silently"],0,"Responsible reporting explains data limitations."]]],
   [/project|team|collaborat|leadership|management/i,[["A team is late delivering an AI project. What is the best professional response?",["Communicate the risk and propose a revised action plan","Hide the delay until the deadline","Blame a teammate publicly"],0,"Early communication and clear next steps support effective teamwork."],["A project meeting ends without assigned actions. What is the next useful step?",["Document tasks, owners, and dates","Schedule another meeting with no agenda","Assume everyone knows their responsibilities"],0,"Named ownership and dates make tasks trackable."]]],
   [/ethic|privacy|risk|ai/i,[["A workplace chatbot suggests sharing confidential customer records. What should you do?",["Follow the approved privacy policy and avoid sharing sensitive records","Upload the complete dataset to test it","Post customer records to a public forum"],0,"Workplace AI use must respect confidentiality and data protection."],["An AI recommendation may disadvantage a group. What is an appropriate action?",["Review the data and decision process for unfair bias","Ignore feedback","Treat every AI output as automatically correct"],0,"AI-assisted decisions require human review and fairness checks."]]]
  ],
  economics:[
   [/الندرة|الفرصة|اقتصاد وسوق العمل/i,[["طالب أمامه تدريبان ولا يستطيع حضور الاثنين. ماذا تمثل قيمة أفضل تدريب تخلى عنه؟",["تكلفة الفرصة البديلة","الإيراد الحكومي","التضخم"],0,"تكلفة الفرصة البديلة هي قيمة أفضل بديل متروك عند الاختيار."]]],
   [/الطلب|العرض|الثمن|المنافسة/i,[["ارتفع سعر منتج مع ثبات العوامل الأخرى. وفق قانون الطلب، ما المتوقع للكمية المطلوبة عادة؟",["تنخفض","ترتفع دائمًا","لا يمكن أن تتأثر بالسعر"],0,"قانون الطلب يربط السعر والكمية المطلوبة بعلاقة عكسية عادة مع ثبات العوامل الأخرى."]]],
   [/الجدوى|المشروع|التمويل|الآلات|التسويق/i,[["قبل شراء آلات مشروع صغير، ما القرار الأكثر مسؤولية؟",["تقدير الطلب والتكاليف والطاقة الإنتاجية","شراء أغلى آلة دون دراسة","تجاهل احتياجات العمالة"],0,"دراسة الجدوى تربط القرار بحجم السوق وتكلفة التشغيل والموارد."]]],
   [/البنوك|القروض|النفقات|الإيرادات|المالية العامة/i,[["شخص يفكر في الحصول على قرض لمشروعه. ما أفضل خطوة قبل التوقيع؟",["مقارنة تكلفة التمويل وجدول السداد بقدرته على الدفع","الاعتماد على قيمة القسط الأول فقط","تجاهل الفوائد والرسوم"],0,"الاقتراض المسؤول يقتضي فهم التكلفة الكلية والقدرة على السداد."]]]
  ],
  social:[
   [/التلوث|البيئية|الانفجار السكاني|البطالة/i,[["لاحظ الطلاب تراكم مخلفات قرب مورد مائي. ما أول خطوة مسؤولة؟",["توثيق المشكلة وإبلاغ الجهة المختصة واقتراح حل","إلقاء المزيد من المخلفات","تجاهل الأثر البيئي"],0,"المشاركة الإيجابية تبدأ بفهم المشكلة والتعامل معها بوسائل آمنة ومنظمة."]]],
   [/قناة السويس|النقل|التجارة|الميزان/i,[["تريد شركة شحن مقارنة مسارين للتجارة. ما العامل الذي يجب دراسته؟",["المسافة والزمن والتكلفة والموانئ المتاحة","لون السفينة فقط","الطريق الأطول دائمًا"],0,"قرارات النقل تعتمد على الوقت والتكلفة والطرق والقدرة التشغيلية."]]],
   [/الطاقة|البترول|الغاز|الفحم|المعادن/i,[["مدينة تخطط لتقليل الاعتماد على الوقود الأحفوري. أي خيار يستحق دراسة جدوى محلية؟",["الطاقة الشمسية وطاقة الرياح","زيادة الاعتماد على الوقود الأحفوري فقط","إلغاء دراسة احتياجات الكهرباء"],0,"المصادر المتجددة يمكن تقييمها فنيًا واقتصاديًا حسب ظروف الموقع."]]]
  ],
  civics:[
   [/المواطنة|الوطن|الهوية|القيم/i,[["اختلف زميلان حول رأي عام في المدرسة. ما السلوك الأقرب للمواطنة الإيجابية؟",["احترام الرأي المختلف والحوار دون إساءة","إقصاء من يختلف","نشر اتهامات بلا دليل"],0,"الحوار واحترام الآخر والمشاركة المسؤولة من قيم المواطنة."]]],
   [/الشباب|التنمية|التطوعي/i,[["يريد فريق طلاب خدمة المجتمع. ما أفضل بداية لمبادرة تطوعية؟",["تحديد حاجة فعلية وخطة آمنة وتوزيع الأدوار","اختيار النشاط عشوائيًا دون فهم الاحتياج","جمع بيانات شخصية بلا ضرورة"],0,"المبادرة الفعالة تنطلق من احتياج واضح وتعاون منظم."]]],
   [/مشرفة|موسى|محمود|العلم/i,[["تعد مجموعة عرضًا عن شخصية مصرية رائدة. كيف تضمن دقة المعلومات؟",["الاعتماد على مصادر موثوقة وذكر الإنجازات المثبتة","نقل شائعات غير موثقة","اختراع اقتباسات لجذب الانتباه"],0,"توثيق المعلومة واحترام إنجازات الشخصيات العلمية جزء من البحث المسؤول."]]]
  ]
 };
 const fallback={ai:["data","statistics"],physics:["force","waves"],business:["team","project"],economics:["الجدوى","العرض"],social:["الطاقة","النقل"],civics:["المواطنة","التطوعي"]};
 function select(subject,title,n){
  const entries=cases[subject]||[];if(!entries.length)return null;
  let hits=entries.filter(([re])=>re.test(title));
  if(!hits.length)return null; // No inaccurate topic substitution.
  const scenarios=hits[0][1];return scenarios[Math.floor(n/20)%scenarios.length];
 }
 function render(subject,lesson,n,lessonTitle){
  if(n!==14&&n!==34)return "";
  const mission=select(subject,String(lessonTitle||""),n);if(!mission)return "";
  const k=key(subject,lesson,n),st=state.get(k)||{selected:null,done:false},arabic=["economics","social","civics"].includes(subject);
  const [scenario,opts,correct,why]=mission;
  const order=[1,2,0];
  return '<section class="ntss-applied" dir="'+(arabic?"rtl":"ltr")+'" aria-label="'+(arabic?"تحدي اتخاذ قرار":"Applied decision mission")+'">'+
  '<header class="ntss-applied-head"><span class="ntss-applied-symbol">◈</span><div><small>'+(arabic?"مهمة تطبيقية · اختيارية":"APPLIED MISSION · OPTIONAL")+'</small><strong>'+(arabic?"تصرّف في الموقف":"Make the decision")+'</strong></div><span class="ntss-applied-status">'+(st.done?"✓":"02 / 05")+'</span></header>'+
  '<p class="ntss-applied-scenario">'+esc(scenario)+'</p><div class="ntss-applied-choices">'+order.map(i=>'<button class="ntss-applied-option '+(st.done&&i===correct?"is-right":"")+'" '+(st.done?"disabled":"")+' onclick="NTSS_APPLIED.choose('+JSON.stringify(k)+','+i+','+correct+')">'+esc(opts[i])+'</button>').join("")+'</div>'+
  '<p class="ntss-applied-feedback" role="status">'+(st.done?esc(why):st.selected!==null?(arabic?"ليست الإجابة الأنسب. فكّر في أثر القرار ثم حاول مرة أخرى.":"Not the best decision. Reconsider the impact and try again."):arabic?"تطبيق إضافي مستقل لا يغيّر درجة الدرس.":"A separate transfer-of-learning challenge; does not change the lesson score.")+'</p>'+
  '<footer class="ntss-applied-foot"><span>'+(arabic?"المحاولة الأولى: ":"First attempt: ")+(first.has(k)?(first.get(k)?(arabic?"صحيحة":"Correct"):(arabic?"للمراجعة":"Review")):(arabic?"لم تُحسم":"Not submitted"))+'</span><button onclick="NTSS_APPLIED.retry('+JSON.stringify(k)+')">'+(arabic?"إعادة التدريب":"Try again")+'</button></footer></section>';
 }
 function choose(k,i,correct){
  const st=state.get(k)||{selected:null,done:false};
  if(st.done)return;
  if(!first.has(k))first.set(k,i===correct);
  st.selected=i;st.done=i===correct;state.set(k,st);window.EBDA_APP_RENDER?.();
 }
 function retry(k){state.delete(k);window.EBDA_APP_RENDER?.()}
 function reset(subject,lesson){const prefix=subject+":"+lesson+":";for(const map of [state,first])for(const k of [...map.keys()])if(k.startsWith(prefix))map.delete(k)}
 function progress(subject,lesson){const prefix=subject+":"+lesson+":";const a=[...first].filter(([k])=>k.startsWith(prefix));return {attempted:a.length,correct:a.filter(([,v])=>v).length}}
 return {render,choose,retry,reset,progress,select};
})();