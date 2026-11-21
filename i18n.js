/* EBDA Learning interface language: Arabic by default for students, English on demand.
 * The choice is stored only in this browser (localStorage); nothing leaves the device. */
window.EBDA_I18N=(function(){
 "use strict";
 const KEY="ebda-lang";
 const strings={
  en:{
   meta_title:"EBDA Learning | Learn by Doing",
   meta_description:"Free interactive learning for EBDA National Technical Science Schools. Learn AI and programming by doing.",
   skip_link:"Skip to main content",
   nav_grades:"Grades",
   nav_subjects:"Subjects",
   footer_rights:"© EBDA National Technical Science Schools",
   footer_privacy:"No learner accounts · No personal data collection",
   label_school:"EBDA NATIONAL TECHNICAL SCIENCE SCHOOLS · BADR",
   hero_title_1:"Learn by doing.",
   hero_title_2:"Build what’s next.",
   hero_lead:"Explore programming, data and artificial intelligence through short explanations, experiments and practical questions — at your own pace.",
   hero_cta_year:"Choose your year →",
   hero_cta_find:"Find a lesson",
   hero_note:"Open to all students · No account required",
   hero_preview_label:"DATA LAB",
   hero_preview_title:"Explore the pattern",
   hero_preview_footer:"Discover → Experiment → Understand",
   search_label:"Search all lessons",
   search_placeholder:"Python, SQL, statistics, machine learning…",
   search_hint_min:"Enter at least two letters to find a subject, unit or lesson.",
   search_loading:"Loading the lesson index…",
   search_unavailable:"The lesson index could not be loaded. Check your connection and try again.",
   search_none:"No matching lessons. Try a different term.",
   search_count:n=>n+" matching lessons shown (maximum 24)",
   years_title:"Choose your academic year",
   years_count:"3 YEARS · FREE LEARNING",
   year_names:["First Year","Second Year","Third Year"],
   year_descriptions:["Start with Python, mathematics and the foundations of AI.","Explore databases, data engineering and machine learning.","Apply statistics, data quality, governance and AI in practice."],
   year_tag:n=>"YEAR "+n,
   year_view:"View subjects →",
   browse_all_years:"All years",
   browse_select:"Select a subject to explore lessons by term and unit.",
   tag_specialization:"TECHNICAL SPECIALIZATION",
   tag_general:"GENERAL SUBJECT",
   ai_units_g1:"Six units · 39 interactive lessons",
   ai_units_g23:"Six units · interactive specialization practice",
   subject_explore:"Explore subject →",
   subject_tap:"Tap to load and explore lessons",
   loading_lesson:"Loading lesson resources…",
   loading_preparing:"Preparing questions for this subject.",
   loading_lab:"Loading the lesson…",
   loading_lab_preparing:"Preparing the practical activities.",
   error_lesson_title:"Unable to load this lesson",
   error_lesson_body:"Check your connection and retry. You will not lose your existing progress.",
   error_retry:"Retry loading lesson",
   error_review_title:"Unable to load review questions",
   error_retry_short:"Retry",
   error_lab_title:"Unable to load the laboratory",
   error_lab_body:"Check your connection and try again. Your lesson progress is not changed.",
   error_lab_retry:"Retry loading",
   stages:["Discover","Experiment","Play","Check","Practice"],
   stages_aria:"Learning stages",
   stage1_eyebrow:"01 · FIRST, MAKE A PREDICTION",
   stage1_title:"What do you already know?",
   stage1_right:"Nice reasoning!",
   stage1_wrong:"Not quite — keep exploring.",
   stage2_eyebrow:"02 · DISCOVER BY DOING",
   stage2_title:"Change something. See what happens.",
   stage2_lead:"Try moving the control. What pattern do you notice?",
   stage3_theory:"📖 Explore the concept explanation",
   stage3_mystery:"🔎 Unlock a factory mystery",
   stage4_eyebrow:"04 · PRACTICE & REFLECT",
   stage4_title:"One more question.",
   stage4_lead:"Can you explain the reasoning, not only pick the correct answer?",
   unit_word:"UNIT",
   concept_word:"CONCEPT",
   year_word:"YEAR",
   lesson_word:"LESSON",
   go_practice:"Go directly to 50 practice questions →",
   hint_label:"Thinking hint:",
   hint_btn:"Get a hint",
   check_btn:"Check answer →",
   continue_btn:"Continue →",
   back_btn:"← Back",
   all_lessons:"← All lessons",
   all_lessons_unit:"← All lessons in this unit",
   lessons_in_unit:"Lessons in this unit",
   check_to_continue:"Check your answer above to continue",
   start_practice:"Start 50 questions",
   source_line:"Curriculum topic based on",
   source_extra:"Interactive explanations and exercises are supplementary, newly authored learning materials.",
   progress_done:"completed",
   units_lessons:(u,l)=>u+" units · "+l+" lessons"
  },
  ar:{
   meta_title:"EBDA Learning | تعلّم بالممارسة",
   meta_description:"منصة تعليمية تفاعلية مجانية لمدارس ابدأ الوطنية للعلوم التقنية. تعلّم الذكاء الاصطناعي والبرمجة بالممارسة.",
   skip_link:"تخطَّ إلى المحتوى الرئيسي",
   nav_grades:"الصفوف",
   nav_subjects:"المواد",
   footer_rights:"© مدارس ابدأ الوطنية للعلوم التقنية",
   footer_privacy:"بدون حسابات للطلاب · لا نجمع بيانات شخصية",
   label_school:"مدارس ابدأ الوطنية للعلوم التقنية · بدر",
   hero_title_1:"تعلّم بالممارسة.",
   hero_title_2:"واصنع المستقبل.",
   hero_lead:"استكشف البرمجة والبيانات والذكاء الاصطناعي من خلال شروح قصيرة وتجارب وأسئلة عملية، وفق سرعتك الخاصة.",
   hero_cta_year:"← اختر صفك",
   hero_cta_find:"ابحث عن درس",
   hero_note:"متاح لجميع الطلاب · لا يحتاج إلى حساب",
   hero_preview_label:"معمل البيانات",
   hero_preview_title:"اكتشف النمط",
   hero_preview_footer:"اكتشف ← جرّب ← افهم",
   search_label:"ابحث في كل الدروس",
   search_placeholder:"بايثون، SQL، إحصاء، تعلم آلي…",
   search_hint_min:"اكتب حرفين على الأقل للبحث عن مادة أو وحدة أو درس.",
   search_loading:"جاري تحميل فهرس الدروس…",
   search_unavailable:"تعذر تحميل فهرس الدروس. تحقق من الاتصال وحاول مرة أخرى.",
   search_none:"لا توجد نتائج مطابقة. جرّب كلمة أخرى.",
   search_count:n=>"عدد الدروس المطابقة المعروضة: "+n+" (بحد أقصى 24)",
   years_title:"اختر صفك الدراسي",
   years_count:"٣ صفوف · تعليم مجاني",
   year_names:["الصف الأول","الصف الثاني","الصف الثالث"],
   year_descriptions:["ابدأ ببايثون والرياضيات وأساسيات الذكاء الاصطناعي.","استكشف قواعد البيانات وهندسة البيانات وتعلم الآلة.","طبّق الإحصاء وجودة البيانات والحوكمة والذكاء الاصطناعي عمليًا."],
   year_tag:n=>"الصف "+["الأول","الثاني","الثالث"][n-1],
   year_view:"عرض المواد ←",
   browse_all_years:"كل الصفوف",
   browse_select:"اختر مادة لاستكشاف الدروس حسب الفصل الدراسي والوحدة.",
   tag_specialization:"التخصص التقني",
   tag_general:"مادة عامة",
   ai_units_g1:"ست وحدات · 39 درسًا تفاعليًا",
   ai_units_g23:"ست وحدات · تدريب تخصصي تفاعلي",
   subject_explore:"استكشف المادة ←",
   subject_tap:"اضغط للتحميل واستكشاف الدروس",
   loading_lesson:"جاري تحميل موارد الدرس…",
   loading_preparing:"جاري تجهيز أسئلة هذه المادة.",
   loading_lab:"جاري تحميل الدرس…",
   loading_lab_preparing:"جاري تجهيز الأنشطة العملية.",
   error_lesson_title:"تعذر تحميل هذا الدرس",
   error_lesson_body:"تحقق من الاتصال وأعد المحاولة. لن يتم فقدان تقدمك الحالي.",
   error_retry:"إعادة تحميل الدرس",
   error_review_title:"تعذر تحميل أسئلة المراجعة",
   error_retry_short:"إعادة المحاولة",
   error_lab_title:"تعذر تحميل المعمل",
   error_lab_body:"تحقق من الاتصال وحاول مرة أخرى. تقدمك في الدرس لم يتغير.",
   error_lab_retry:"إعادة التحميل",
   stages:["اكتشف","جرّب","العب","تحقق","تدرّب"],
   stages_aria:"مراحل التعلم",
   stage1_eyebrow:"٠١ · أولًا، توقّع",
   stage1_title:"ماذا تعرف بالفعل؟",
   stage1_right:"استدلال موفق!",
   stage1_wrong:"ليس تمامًا، واصل الاستكشاف.",
   stage2_eyebrow:"٠٢ · اكتشف بالممارسة",
   stage2_title:"غيّر شيئًا ولاحظ ماذا يحدث.",
   stage2_lead:"حرّك أداة التحكم. ما النمط الذي تلاحظه؟",
   stage3_theory:"📖 استكشف شرح المفهوم",
   stage3_mystery:"🔎 افتح لغز المصنع",
   stage4_eyebrow:"٠٤ · تدرّب وتأمل",
   stage4_title:"سؤال إضافي.",
   stage4_lead:"هل تستطيع شرح الاستدلال، لا مجرد اختيار الإجابة الصحيحة؟",
   unit_word:"الوحدة",
   concept_word:"مفهوم",
   year_word:"الصف",
   lesson_word:"درس",
   go_practice:"انتقل مباشرة إلى أسئلة التدريب الخمسين ←",
   hint_label:"تلميح للتفكير:",
   hint_btn:"أريد تلميحًا",
   check_btn:"تحقق من الإجابة ←",
   continue_btn:"متابعة ←",
   back_btn:"رجوع →",
   all_lessons:"كل الدروس →",
   all_lessons_unit:"كل دروس هذه الوحدة →",
   lessons_in_unit:"دروس هذه الوحدة",
   check_to_continue:"تحقق من إجابتك أعلاه للمتابعة",
   start_practice:"ابدأ أسئلة التدريب الخمسين",
   source_line:"موضوع منهجي مستند إلى",
   source_extra:"الشروح والتمارين التفاعلية مواد تعليمية مساندة مؤلفة حديثًا.",
   progress_done:"مكتمل",
   units_lessons:(u,l)=>u+" وحدات · "+l+" درسًا"
  }
 };
 let lang=null;
 function current(){
  if(lang)return lang;
  let stored=null;
  try{stored=localStorage.getItem(KEY)}catch(e){}
  lang=stored==="en"?"en":"ar";
  return lang;
 }
 function t(key){
  const l=current();
  const value=strings[l][key];
  return value===undefined?strings.en[key]:value;
 }
 function apply(){
  const l=current();
  document.documentElement.lang=l;
  document.documentElement.dir=l==="ar"?"rtl":"ltr";
  document.title=t("meta_title");
  const description=document.querySelector('meta[name="description"]');
  if(description)description.setAttribute("content",t("meta_description"));
  document.querySelectorAll("[data-i18n]").forEach(el=>{el.textContent=t(el.getAttribute("data-i18n"))});
  const toggle=document.getElementById("lang-toggle");
  if(toggle)toggle.textContent=l==="ar"?"English":"عربي";
 }
 function toggle(){
  lang=current()==="ar"?"en":"ar";
  try{localStorage.setItem(KEY,lang)}catch(e){}
  apply();
  if(typeof window.EBDA_APP_RENDER==="function")window.EBDA_APP_RENDER();
 }
 return {current,t,apply,toggle};
})();
window.EBDA_I18N.apply();
