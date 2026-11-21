/* NTSS application entrypoint. Extracted from inline HTML toward strict CSP. */

"use strict";const D=window.EBDAA_DATA;const $=q=>document.querySelector(q);const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));const app=$("#app");const t=k=>window.EBDA_I18N?window.EBDA_I18N.t(k):k;let focusReturnYear1=4,focusReturnAdvanced=4,advancedSession=0,advancedStep=4,grade=1,year2Unit=0,activeMission=null,missionRound=0,missionAnswer=null,missionChecked=false,missionHint=false,missionWins=0,missionReview=[],mode="home",unit=1,selectedId=null,step=4,answer=null,checked=false,hint=false,labValue=2,score=0;let lessonSearch="",subjectId="ai-data-engineering";const SUBJECT_DEFS={"mathematics":{name:"Mathematics",status:"starter-concept-checks",counts:{1:[3,12],2:[4,32],3:[4,32]}},"advanced-english":{name:"Advanced English",status:"starter-grammar-practice",counts:{1:[3,12],2:[12,60],3:[6,30]}},"civics":{name:"التربية الوطنية",status:"scanned-book-index-reviewed",grades:[1],counts:{1:[4,17]}},"economics":{name:"الاقتصاد",status:"textbook-index-reviewed",grades:[3],counts:{3:[4,20]}},"arabic-language":{name:"اللغة العربية",status:"textbook-index-reviewed",counts:{1:[8,24],2:[8,23],3:[5,26]}},"german-language":{name:"Deutsch · German",status:"book-index-reviewed",counts:{1:[3,9],2:[3,9],3:[2,6]}},"social-studies":{name:"الدراسات الاجتماعية",status:"textbook-index-reviewed",grades:[2,3],counts:{2:[2,6],3:[2,20]}},"business-english":{name:"Business English · AI",status:"pdf-index-verified",counts:{1:[5,37],2:[2,16],3:[2,16]}},"physics-stem":{name:"Physics · STEM",status:"book-mapped-practice",counts:{1:[4,22],2:[4,19],3:[4,22]}}};
window.EBDAA_GRADES.grades.forEach(g=>{for(const id of ["mathematics","advanced-english","civics","economics","arabic-language","german-language","social-studies","business-english","physics-stem"]){const def=SUBJECT_DEFS[id];if(def.grades&&!def.grades.includes(g.id))continue;g.subjects.push({id,name:def.name,units:null,status:def.status})}});const icons=["⌘","∑","▥","✦","◎","⌬"],desc=["Write, test and debug Python programs.","Discover the mathematics behind AI.","Turn raw information into visual stories.","Explore real-world artificial intelligence.","Understand how machines learn from data.","Think with algorithms, trees and graphs."];const subjectByAudit={math:"mathPractice",en:"englishPractice",ar:"arabicPractice",de:"germanPractice",physics:"physicsPractice",business:"businessPractice",economics:"economicsPractice",civics:"civicsPractice",social:"socialPractice"};
function queueSubjectCurriculum(subject,retry){
 mode="subjectLoading";render();
 return window.NTSS_LAZY.ensureCurriculum(subject).then(()=>{
  if(mode==="subjectLoading")retry();
 }).catch(()=>{
  if(mode!=="subjectLoading")return;
  app.innerHTML='<section class="practice-focus" role="alert"><div class="practice-focus__content"><h2>Unable to load this lesson</h2><p>Check your connection and retry. You will not lose your existing progress.</p><button class="btn teal" onclick="retrySubjectLoad()">Retry loading lesson</button></div></section>';
  window.__ntssSubjectRetry=retry;
 });
}
function queueSubjectLesson(subjectMode,retry){
 mode="subjectLoading";render();
 return window.NTSS_LAZY.ensureSubject(subjectMode).then(()=>{
  if(mode==="subjectLoading")retry();
 }).catch(()=>{
  if(mode!=="subjectLoading")return;
  app.innerHTML='<section class="practice-focus" role="alert"><div class="practice-focus__content"><h2>Unable to load this lesson</h2><p>Check your connection and retry. You will not lose your existing progress.</p><button class="btn teal" onclick="retrySubjectLoad()">Retry loading lesson</button></div></section>';
  window.__ntssSubjectRetry=retry;
 });
}
function retrySubjectLoad(){if(mode==="subjectLoading"&&window.__ntssSubjectRetry)window.__ntssSubjectRetry()}
function ensureTeacherAudit(){
 if(tq.subject==="ai"||!subjectByAudit[tq.subject]){mode="teacherReview";render();return}
 const subjectMode=subjectByAudit[tq.subject];
 const curriculumId={math:"mathematics",en:"advanced-english",ar:"arabic-language",de:"german-language",physics:"physics-stem",business:"business-english",economics:"economics",civics:"civics",social:"social-studies"}[tq.subject];
 if(window.NTSS_LAZY.isSubjectReady(subjectMode)&&window.NTSS_LAZY.isCurriculumReady(curriculumId)){mode="teacherReview";render();return}
 mode="teacherLoading";render();
 Promise.all([window.NTSS_LAZY.ensureSubject(subjectMode),window.NTSS_LAZY.ensureCurriculum(curriculumId)]).then(()=>{if(mode==="teacherLoading"){mode="teacherReview";render()}}).catch(()=>{
  if(mode!=="teacherLoading")return;
  app.innerHTML='<section role="alert"><h2>Unable to load review questions</h2><button class="btn teal" onclick="ensureTeacherAudit()">Retry</button></section>';
 });
}
function nav(n){mode=n;document.querySelectorAll(".nav button").forEach(b=>b.classList.toggle("active",b.dataset.nav===n));render();scrollTo(0,0)}function openUnit(n){window.EBDAA_PRACTICE.reset();stageAnswers={};unit=n;selectedId=D.sessions.find(s=>s.unit===n).id;step=0;answer=null;checked=false;hint=false;labValue=2;
 if(window.NTSS_LAZY.isReady()){nav("learn");return}
 mode="advancedLoading";render();
 window.NTSS_LAZY.ensureStudio().then(()=>{if(mode==="advancedLoading")nav("learn")}).catch(()=>{
  if(mode!=="advancedLoading")return;
  const holder=document.getElementById("app");
  if(holder)holder.innerHTML='<div class="card" role="alert"><h2>'+t("error_lab_title")+'</h2><p>'+t("error_lab_body")+'</p><button class="btn teal" onclick="openUnit('+unit+')">'+t("error_lab_retry")+'</button></div>';
 })}let stageAnswers={};
function rememberStage(){stageAnswers[step]={answer,checked,hint}}
function restoreStage(n){const saved=stageAnswers[n]||{};step=n;answer=saved.answer??null;checked=!!saved.checked;hint=!!saved.hint}
function choose(id){window.EBDAA_PRACTICE.reset();selectedId=id;stageAnswers={};step=0;answer=null;checked=false;hint=false;labValue=2;render()}
function next(){
 if(step===4&&!window.EBDAA_PRACTICE.isFinished())return;
 if((step===0||step===3)&&!checked)return;
 if(step<4){if(step===3)focusReturnYear1=3;rememberStage();restoreStage(step+1);render()}
 else{let arr=D.sessions.filter(s=>s.unit===unit),k=arr.findIndex(s=>s.id===selectedId);if(k+1<arr.length)choose(arr[k+1].id);else nav("subject")}
}
function back(){if(step>0){rememberStage();restoreStage(step-1);render()}else nav("home")}
function jumpToPractice(){if(step<4){focusReturnYear1=step;rememberStage();restoreStage(4);render()}}
function chooseAnswer(n){if(checked)return;answer=n;render()}function verify(){if(answer===null||checked)return;checked=true;const expected=step===3?currentChallenge().answer:current().answer;if(answer===expected)score++;render()}function current(){return D.sessions.find(s=>s.id===selectedId)}function currentChallenge(){const s=current(),mission=window.EBDAA_MISSIONS.find(m=>m.g===1&&m.u===s.unit-1);if(!mission)return window.EBDAA_CHALLENGE(s);const idx=D.sessions.filter(x=>x.unit===s.unit).findIndex(x=>x.id===s.id);const q=mission.steps[idx%mission.steps.length];return {question:q[0],options:q[1],answer:q[2],explanation:q[3]}}function label(){return '<div class="eyebrow">'+t("label_school")+'</div>'}
function chooseGrade(n){grade=n;subjectId="ai-data-engineering";nav("browse")}
function chooseSubject(id="ai-data-engineering"){
 subjectId=id;
 if(id==="ai-data-engineering"||window.NTSS_LAZY.isCurriculumReady(id)){nav("subject");return Promise.resolve()}
 mode="subjectLoading";render();
 return window.NTSS_LAZY.ensureCurriculum(id).then(()=>{
  if(mode==="subjectLoading")nav("subject");
 }).catch(()=>{
  if(mode!=="subjectLoading")return;
  app.innerHTML='<section class="practice-focus" role="alert"><div class="practice-focus__content"><h2>'+t("error_lesson_title")+'</h2><p>'+t("error_lesson_body")+'</p><button class="btn teal" onclick="retrySubjectLoad()">'+t("error_retry")+'</button></div></section>';
  window.__ntssSubjectRetry=()=>chooseSubject(id);
 });
}
let codeLabReturn=null;
function openCodeLab(language="python"){const oldMode=mode;codeLabReturn={mode:oldMode,grade,unit,year2Unit,advancedSession,selectedId,step,advancedStep};const u=grade===1?Math.max(0,unit-1):year2Unit;const i=grade===1?Math.max(0,D.sessions.filter(s=>s.unit===unit).findIndex(s=>s.id===selectedId)):advancedSession;mode="codeLab";window.EBDAA_CODE_LABS.start(grade,u,i,language);scrollTo(0,0)}
function closeCodeLab(){window.EBDAA_CODE_LABS.stop();mode=codeLabReturn?.mode||"subject";render();scrollTo(0,0)}
function backToAIQuestions(){window.EBDAA_CODE_LABS.stop();if(codeLabReturn?.mode==="learn"||codeLabReturn?.mode==="advancedLab"){mode=codeLabReturn.mode;render()}else if(grade===1){mode="subject";render()}else{mode="unitPreview";render()}scrollTo(0,0)}
function chooseGradeUnit(n){if(grade===1){openUnit(n+1)}else{year2Unit=n;nav("unitPreview");window.NTSS_LAZY.ensureStudio().catch(()=>{/* Retry on lesson open. */})}}function openAdvancedSession(i){
 window.EBDAA_PRACTICE.reset();
 advancedSession=i;advancedStep=0;
 if(window.NTSS_LAZY.isReady()){window.EBDAA_STUDIO.reset();nav("advancedLab");return}
 mode="advancedLoading";
 render();
 window.NTSS_LAZY.ensureStudio().then(()=>{
  if(mode!=="advancedLoading")return;
  window.EBDAA_STUDIO.reset();nav("advancedLab");
 }).catch(error=>{
  if(mode!=="advancedLoading")return;
  const holder=document.getElementById("app");
  if(holder)holder.innerHTML='<div class="card" role="alert"><h2>Unable to load the laboratory</h2><p>Check your connection and try again. Your lesson progress is not changed.</p><button class="btn teal" onclick="openAdvancedSession('+advancedSession+')">Retry loading</button></div>';
 });
}
function goAdvancedStep(n){
 const next=Math.max(0,Math.min(4,Number(n)||0));
 if(advancedStep===3&&next>3&&!window.EBDAA_STUDIO.isChecked())return;
 if(next===4&&advancedStep!==4)focusReturnAdvanced=advancedStep;advancedStep=next;render();scrollTo(0,0);
}
function jumpAdvancedPractice(){if(advancedStep!==4)focusReturnAdvanced=advancedStep;advancedStep=4;render();scrollTo(0,0)}
function nextAdvanced(){const u=window.EBDAA_GRADES.grades[grade-1].subjects[0].units[year2Unit];if(advancedSession+1<u.sessions.length)openAdvancedSession(advancedSession+1);else nav("unitPreview")}
function allSearchLessons(){const index=[];for(let u=0;u<6;u++)for(const [i,session] of D.sessions.filter(x=>x.unit===u+1).entries())index.push({grade:1,unit:u,session:i,name:session.title,unitName:D.names[u],subject:"ai",id:session.id});for(const g of [2,3]){const units=window.EBDAA_GRADES.grades[g-1].subjects[0].units;for(const [u,unitData] of units.entries())for(const [i,name] of unitData.sessions.entries())index.push({grade:g,unit:u,session:i,name,unitName:unitData.title,subject:"ai",id:""})}for(const g of [1,2,3])for(const [u,unitData] of window.EBDAA_MATH_UNITS[g].entries())for(const [i,name] of unitData.sessions.entries())index.push({grade:g,unit:u,session:i,name,unitName:unitData.title,subject:"mathematics",id:""});for(const g of [1,2,3])for(const [u,unitData] of window.EBDAA_ENGLISH_UNITS[g].entries())for(const [i,name] of unitData.sessions.entries())index.push({grade:g,unit:u,session:i,name,unitName:unitData.title,subject:"advanced-english",id:""});for(const g of [1,2,3])for(const [u,unitData] of window.EBDAA_ARABIC_UNITS[g].entries())for(const [i,name] of unitData.sessions.entries())index.push({grade:g,unit:u,session:i,name,unitName:unitData.title,subject:"arabic-language",id:""});for(const g of [1,2,3])for(const [u,unitData] of window.EBDAA_GERMAN_UNITS[g].entries())for(const [i,name] of unitData.sessions.entries())index.push({grade:g,unit:u,session:i,name,unitName:unitData.title,subject:"german-language",id:""});for(const g of [1,2,3])for(const [u,unitData] of window.EBDAA_BUSINESS_ENGLISH_UNITS[g].entries())for(const [i,l] of unitData.sessions.entries())index.push({grade:g,unit:u,session:i,name:l.title,unitName:unitData.title,subject:"business-english",id:""});for(const g of [1,2,3])for(const [u,unitData] of window.EBDAA_PHYSICS_UNITS[g].entries())for(const [i,name] of unitData.sessions.entries())index.push({grade:g,unit:u,session:i,name,unitName:unitData.title,subject:"physics-stem",id:""});for(const g of [2,3])for(const [u,unitData] of window.EBDAA_SOCIAL_STUDIES_UNITS[g].entries())for(const [i,l] of unitData.sessions.entries())index.push({grade:g,unit:u,session:i,name:l.title,unitName:unitData.title,subject:"social-studies",id:""});for(const [u,unitData] of window.EBDAA_CIVICS_UNITS[1].entries())for(const [i,l] of unitData.sessions.entries())index.push({grade:1,unit:u,session:i,name:l.title,unitName:unitData.title,subject:"civics",id:""});for(const [u,unitData] of window.EBDAA_ECONOMICS_UNITS[3].entries())for(const [i,l] of unitData.sessions.entries())index.push({grade:3,unit:u,session:i,name:l.title,unitName:unitData.title,subject:"economics",id:""});return index}
let searchIndex=null,searchIndexLoading=false;
function ensureSearchIndex(){
 if(searchIndex)return Promise.resolve();
 if(searchIndexLoading)return Promise.resolve();
 searchIndexLoading=true;
 return window.NTSS_LAZY.ensureAllCurricula().then(()=>{
  searchIndex=allSearchLessons();searchIndexLoading=false;
  const node=document.getElementById("search-results");if(node)node.innerHTML=searchCards();
 }).catch(()=>{searchIndexLoading=false;const node=document.getElementById("search-results");if(node)node.innerHTML='<p class="muted" role="alert">'+t("search_unavailable")+'</p>'});
}
function progressBadge(sub,g,u,i){const p=window.EBDA_PROGRESS?.get(sub,g,u,i);return p?'<span class="progress-badge" aria-label="'+t("progress_done")+' '+p.pct+'%">\u2713 '+p.pct+'%</span>':''}
function subjectSummary(s){if(s.id==="ai-data-engineering")return grade===1?t("ai_units_g1"):t("ai_units_g23");const c=SUBJECT_DEFS[s.id]?.counts?.[grade];return c?t("units_lessons")(c[0],c[1]):""}
function searchOpen(g,u,i,sub="ai"){lessonSearch="";grade=g;subjectId=sub==="economics"?"economics":sub==="civics"?"civics":sub==="social-studies"?"social-studies":sub==="mathematics"?"mathematics":sub==="advanced-english"?"advanced-english":sub==="arabic-language"?"arabic-language":sub==="german-language"?"german-language":sub==="business-english"?"business-english":sub==="physics-stem"?"physics-stem":"ai-data-engineering";if(sub==="economics"){year2Unit=u;economicsOpen(i)}else if(sub==="civics"){year2Unit=u;civicsOpen(i)}else if(sub==="social-studies"){year2Unit=u;socialOpen(i)}else if(sub==="business-english"){year2Unit=u;businessOpen(i)}else if(sub==="physics-stem"){year2Unit=u;physicsOpen(i)}else if(sub==="german-language"){year2Unit=u;germanOpen(i)}else if(sub==="arabic-language"){year2Unit=u;arabicOpen(i)}else if(sub==="advanced-english"){year2Unit=u;englishOpen(i)}else if(sub==="mathematics"){year2Unit=u;mathOpen(i)}else if(g===1){openUnit(u+1);choose(D.sessions.filter(x=>x.unit===u+1)[i].id)}else{year2Unit=u;openAdvancedSession(i)}}
function searchCards(){const term=lessonSearch.trim().toLocaleLowerCase();if(term.length<2)return '<p class="muted">'+t("search_hint_min")+'</p>';if(!searchIndex){ensureSearchIndex();return '<p class="muted" role="status">'+t("search_loading")+'</p>'}const found=searchIndex.filter(x=>[x.name,x.unitName,"Year "+x.grade,x.subject].some(s=>s.toLocaleLowerCase().includes(term))).slice(0,24);return found.length?'<p class="muted">'+t("search_count")(found.length)+'</p><div class="search-grid">'+found.map(x=>'<button class="search-result" onclick="searchOpen('+x.grade+','+x.unit+','+x.session+',\''+x.subject+'\')"><span class="eyebrow">YEAR '+x.grade+' · '+(x.subject==="mathematics"?"MATH":x.subject==="advanced-english"?"ENGLISH":x.subject==="arabic-language"?"ARABIC":x.subject==="german-language"?"GERMAN":x.subject==="business-english"?"BUSINESS ENGLISH":x.subject==="physics-stem"?"PHYSICS":"AI")+'</span><strong>'+esc(x.name)+'</strong><small>'+esc(x.unitName)+'</small></button>').join("")+'</div>':'<p class="muted">'+t("search_none")+'</p>'}
function setLessonSearch(value){lessonSearch=String(value);const node=document.getElementById("search-results");if(node)node.innerHTML=searchCards()}
function home(){
const labels=t("year_names");
const descriptions=t("year_descriptions");
return '<section class="hero" aria-label="Welcome to EBDA Learning"><div>'+label()+
'<h1>'+t("hero_title_1")+'<br><span style="color:var(--teald)">'+t("hero_title_2")+'</span></h1>'+
'<p class="hero-lead">'+t("hero_lead")+'</p>'+
'<div class="hero-actions"><button class="btn teal" onclick="document.getElementById(&quot;year-cards&quot;).scrollIntoView()">'+t("hero_cta_year")+'</button><button class="btn light" onclick="document.getElementById(&quot;lesson-search&quot;).focus()">'+t("hero_cta_find")+'</button></div>'+
'<p style="font-size:12px;margin-top:18px">'+t("hero_note")+'</p></div>'+
'<div class="hero-art" aria-hidden="true"><div class="hero-preview"><div class="hero-preview__top"><span class="hero-preview__dot"></span><span class="hero-preview__dot"></span><span class="hero-preview__dot"></span><span class="hero-preview__label">'+t("hero_preview_label")+'</span></div><div class="hero-preview__title">'+t("hero_preview_title")+'</div><div class="hero-preview__bars"><span style="height:28%"></span><span style="height:42%"></span><span style="height:37%"></span><span style="height:66%"></span><span style="height:57%"></span><span style="height:84%"></span><span style="height:96%"></span></div><div class="hero-preview__footer"><span class="hero-preview__check">✓</span> '+t("hero_preview_footer")+'</div></div></div></section>'+
'<section class="search-panel" aria-label="Find a lesson"><label for="lesson-search"><strong>'+t("search_label")+'</strong></label><input id="lesson-search" type="search" autocomplete="off" placeholder="'+t("search_placeholder")+'" value="'+esc(lessonSearch)+'" oninput="setLessonSearch(this.value)" aria-controls="search-results"><div id="search-results" aria-live="polite">'+searchCards()+'</div></section>'+
'<div class="section-title"><h2>'+t("years_title")+'</h2><span class="count">'+t("years_count")+'</span></div>'+
'<div class="cards" id="year-cards">'+labels.map((name,i)=>'<article class="course"><div class="course-art"><i>'+String(i+1).padStart(2,"0")+'</i></div><div class="course-body"><small>'+t("year_tag")(i+1)+'</small><h3>'+name+'</h3><p>'+descriptions[i]+'</p><button onclick="chooseGrade('+(i+1)+')">'+t("year_view")+'</button></div></article>').join("")+'</div>';
}
function browse(){const g=window.EBDAA_GRADES.grades.find(g=>g.id===grade);return '<div class="eyebrow"><a href="#" onclick="nav(\'home\');return false">'+t("browse_all_years")+'</a> / '+t("year_tag")(grade)+'</div><h1>'+esc(g.name)+'</h1><p>'+t("browse_select")+'</p><div class="cards">'+g.subjects.map(s=>'<article class="course"><div class="course-art"><i>'+(s.id==="mathematics"?'∑':s.id==="advanced-english"?'Aa':s.id==="arabic-language"?'ع':s.id==="german-language"?'DE':s.id==="economics"?"📈":s.id==="civics"?"🇪🇬":s.id==="social-studies"?"🌍":s.id==="business-english"?'BE':s.id==="physics-stem"?'⚛':'AI')+'</i></div><div class="course-body"><small>'+(s.id==="ai-data-engineering"?t("tag_specialization"):t("tag_general"))+'</small><h3>'+esc(s.name)+'</h3><p>'+subjectSummary(s)+'</p><button onclick="chooseSubject(\''+s.id+'\')">'+t("subject_explore")+'</button></div></article>').join('')+'</div>'}
function subjectUnits(){if(subjectId==="economics")return economicsUnits();if(subjectId==="civics")return civicsUnits();if(subjectId==="social-studies")return socialUnits();if(subjectId==="business-english")return businessUnits();if(subjectId==="physics-stem")return physicsUnits();if(subjectId==="german-language")return germanUnits();if(subjectId==="arabic-language")return arabicUnits();if(subjectId==="advanced-english")return englishUnits();if(subjectId==="mathematics")return mathUnits();const g=window.EBDAA_GRADES.grades.find(g=>g.id===grade),subject=g.subjects[0];if(!subject)return browse();const units=grade===1?D.names.map((title,i)=>({title,term:i<3?1:2,sessions:D.sessions.filter(s=>s.unit===i+1).map(x=>x.title)})):subject.units;return '<div style="display:flex;gap:10px;flex-wrap:wrap;margin:15px 0 22px"><button class="btn teal" onclick="openCodeLab(&#39;python&#39;)">🐍 Open Python Lab</button><button class="btn light" onclick="openCodeLab(&#39;sql&#39;)">🗄 Open SQL Lab</button></div>'+'<div class="eyebrow"><a href="#" onclick="nav(\'home\');return false">Grades</a> / <a href="#" onclick="nav(\'browse\');return false">Year '+grade+'</a> / Subject</div><h1>'+esc(subject.name)+'</h1><p>'+esc(g.name)+' · Browse both semesters and select a unit.</p><div class="unit-strip"><button onclick="nav(\'browse\')">← Back to subjects</button></div>'+[1,2].map(term=>'<div class="section-title"><h2>Term '+term+'</h2><span class="count">'+units.filter(u=>u.term===term).length+' UNITS</span></div><div class="cards">'+units.map((u,i)=>u.term!==term?'':'<article class="course"><div class="course-art"><i>'+icons[i]+'</i></div><div class="course-body"><small>UNIT 0'+(i+1)+'</small><h3>'+esc(u.title)+'</h3><p>'+u.sessions.length+' sessions · '+(grade===1?'Interactive lessons':'Official session index')+'</p><button onclick="chooseGradeUnit('+i+')">'+(grade===1?'Start learning':'View session index')+' ↗</button></div></article>').join("")+'</div>').join("")}
function previewUnit(){if(subjectId==="economics")return economicsPreview();if(subjectId==="civics")return civicsPreview();if(subjectId==="social-studies")return socialPreview();if(subjectId==="business-english")return businessPreview();if(subjectId==="physics-stem")return physicsPreview();if(subjectId==="german-language")return germanPreview();if(subjectId==="arabic-language")return arabicPreview();if(subjectId==="advanced-english")return englishPreview();if(subjectId==="mathematics")return mathPreview();const g=window.EBDAA_GRADES.grades.find(g=>g.id===grade),u=g.subjects[0].units[year2Unit];return '<div class="eyebrow"><a href="#" onclick="nav(\'home\');return false">Grades</a> / <a href="#" onclick="nav(\'browse\');return false">Year '+grade+'</a> / <a href="#" onclick="nav(\'subject\');return false">Subject</a></div><div class="pill" style="display:inline-block;margin-top:15px">TERM '+u.term+' · UNIT '+(year2Unit+1)+'</div><h1>'+esc(u.title)+'</h1><p>'+esc(u.source)+'</p><div class="no-data">Practical sessions: select a lesson to experiment, run calculations or code, then answer its integrated challenge. Exercises are supplementary and subject to academic review.</div><div class="grid" style="display:grid;gap:12px;margin-top:22px">'+u.sessions.map((name,i)=>'<button class="card" style="background:white;border:1px solid #e6e3de;border-radius:15px;padding:20px;text-align:left;cursor:pointer" onclick="openAdvancedSession('+i+')"><span class="eyebrow">SESSION '+(i+1)+' · HANDS-ON LAB</span><h3>'+esc(name)+'</h3>'+progressBadge("ai",grade,year2Unit,i)+'<p style="font-size:13px">Try interactive experiment → solve an integrated challenge</p></button>').join("")+'</div><div class="actions"><button class="btn light" onclick="nav(\'subject\')">← Back to units</button></div>'}
function advancedLab(){
 if(advancedStep===4)return focusPractice();
 const g=window.EBDAA_GRADES.grades[grade-1],u=g.subjects[0].units[year2Unit],sessions=u.sessions;
 const stages=t("stages");
 const n=advancedStep;
 const content=window.EBDAA_STUDIO.session(grade,year2Unit,advancedSession,n);
 const next=n===3&&!window.EBDAA_STUDIO.isChecked()?'<span class="muted" style="font-size:12px">'+t("check_to_continue")+'</span>':'<button class="btn teal" onclick="goAdvancedStep('+(n+1)+')">'+(n===3?t("start_practice"):t("continue_btn"))+'</button>';
 return '<div class="unit-strip"><button onclick="nav(&quot;unitPreview&quot;)">'+t("all_lessons_unit")+'</button><span class="pill">'+t("year_word")+' '+grade+' \u00b7 '+t("unit_word")+' '+(year2Unit+1)+'</span></div>'+
 '<div class="topmeta"><span class="eyebrow">'+esc(u.title)+'</span><span class="pill">'+t("lesson_word")+' '+(advancedSession+1)+' / '+sessions.length+'</span></div>'+
 '<div class="lesson-layout"><nav class="side-list" aria-label="'+t("lessons_in_unit")+'">'+sessions.map((title,i)=>'<button class="'+(advancedSession===i?'active':'')+'" '+(advancedSession===i?'aria-current="step"':'')+' onclick="openAdvancedSession('+i+')"><span class="stepnum">'+(i+1)+'</span><span>'+esc(title)+'</span>'+progressBadge("ai",grade,year2Unit,i)+'</button>').join("")+'</nav>'+
 '<section class="stage"><nav class="lesson-steps" aria-label="'+t("stages_aria")+'">'+stages.map((name,i)=>'<span class="lesson-step '+(i===n?'current':i<n?'done':'')+'"><span class="lesson-step__num">'+(i<n?'\u2713':(i+1))+'</span>'+esc(name)+'</span>').join('')+'</nav>'+
 (n<4?'<div class="lesson-shortcut"><button class="lesson-jump" onclick="jumpAdvancedPractice()">'+t("go_practice")+'</button></div>':'')+
 content+
 '<div class="stepfooter"><button class="btn light" onclick="'+(n===0?'nav(&quot;unitPreview&quot;)':'goAdvancedStep('+(n-1)+')')+'">'+(n===0?t("all_lessons"):t("back_btn"))+'</button>'+
 '<div class="stage-next">'+next+'</div></div></section></div>';
}
function sourceFor(s){if(s.unit===1)return "First Term Teacher Guide, pp. 5–8 (session map)";if(s.unit===2)return "First Term Teacher Guide, pp. 38–41 (session map)";if(s.unit===3)return "First Term Teacher Guide, pp. 74–76 (session map)";const pages={4:[6,16,27,37,45,55],5:[62,74,85,94,105,113],6:[117,128,139,147,159,169,176]};const part=Number(s.id.split("-")[1])-1;return "Second Term Student Book, p. "+pages[s.unit][part]+" (session starting page); Second Term Teacher Guide for teaching and assessment";}function lab(s){return window.EBDAA_MICRO_RENDER(s)+(window.EBDAA_ADVANCED_LAB(s,labValue)||window.EBDAA_LAB_RENDER(s,labValue))}function setLab(v){labValue=Number(v);render()}function learn(){
 let sessions=D.sessions.filter(s=>s.unit===unit),s=current();
 if(!s)return browse();
 if(step===4)return focusPractice();
 const stages=t("stages");
 const lessonIndex=sessions.findIndex(x=>x.id===s.id);
 let main='';
 if(step===0){
  main='<div class="eyebrow">'+t("stage1_eyebrow")+'</div><h2>'+t("stage1_title")+'</h2><p>'+esc(s.title)+'</p><div class="interactive"><p><b>'+esc(s.question)+'</b></p><div class="choices">'+s.options.map((v,i)=>'<button class="choice '+(answer===i?'chosen ':'')+(checked&&i===s.answer?'correct':'')+(checked&&answer===i&&i!==s.answer?'wrong':'')+'" onclick="chooseAnswer('+i+')">'+String.fromCharCode(65+i)+'. '+esc(v)+'</button>').join('')+'</div>'+(checked?'<div class="feedback '+(answer===s.answer?'':'error')+'"><b>'+(answer===s.answer?t("stage1_right"):t("stage1_wrong"))+'</b><p>'+esc(s.explanation)+'</p></div>':'')+'</div>';
 }else if(step===1){
  main='<div class="eyebrow">'+t("stage2_eyebrow")+'</div><h2>'+t("stage2_title")+'</h2><p>'+t("stage2_lead")+'</p>'+lab(s)+window.EBDA_VISUALIZER.panel(1,s.unit-1,lessonIndex);
 }else if(step===2){
  main=window.EBDA_PUZZLES.panel(1,s.unit-1,lessonIndex)+
  '<details class="lab-support puzzle-expand"><summary>\u{1F4D6} '+t("stage3_theory")+'</summary><div class="lab-support__body">'+window.EBDA_THEORY.yearOne(s,s.unit-1,lessonIndex)+'</div></details>'+
  '<details class="lab-support puzzle-expand"><summary>\u{1F50E} '+t("stage3_mystery")+'</summary><div class="lab-support__body">'+window.EBDAA_STORIES.panel(1,s.unit-1,lessonIndex)+'</div></details>';
 }else{
  const challenge=currentChallenge();
  main='<div class="eyebrow">'+t("stage4_eyebrow")+'</div><h2>'+t("stage4_title")+'</h2><p>'+t("stage4_lead")+'</p><div class="interactive"><p><b>'+esc(challenge.question)+'</b></p><div class="choices">'+challenge.options.map((v,i)=>'<button class="choice '+(answer===i?'chosen ':'')+(checked&&i===challenge.answer?'correct':'')+(checked&&answer===i&&i!==challenge.answer?'wrong':'')+'" onclick="chooseAnswer('+i+')">'+esc(v)+'</button>').join('')+'</div>'+(checked?'<div class="feedback '+(answer===challenge.answer?'':'error')+'">'+esc(challenge.explanation)+'</div>':'')+'</div>';
 }
 return '<div class="topmeta"><span class="eyebrow">'+t("unit_word")+' '+unit+' / '+esc(D.names[unit-1])+'</span><span class="pill">'+t("concept_word")+' '+(lessonIndex+1)+' / '+sessions.length+'</span></div><div class="lesson-layout"><div class="side-list">'+sessions.map((x,i)=>'<button class="'+(x.id===selectedId?'active':'')+'" onclick="choose(\''+x.id+'\')"><span class="stepnum">'+(i+1)+'</span><span>'+esc(x.title)+'</span>'+progressBadge("ai",1,unit-1,i)+'</button>').join('')+'</div><section class="stage"><nav class="lesson-steps" aria-label="'+t("stages_aria")+'">'+stages.map((name,i)=>'<span class="lesson-step '+(i===step?'current':i<step?'done':'')+'"><span class="lesson-step__num">'+(i<step?'\u2713':(i+1))+'</span>'+esc(name)+'</span>').join('')+'</nav>'+(step<4?'<div class="lesson-shortcut"><button class="lesson-jump" onclick="jumpToPractice()">'+t("go_practice")+'</button></div>':'')+main+(hint?'<div class="hint"><b>'+t("hint_label")+'</b> '+esc(step===1?'Change the input and compare two outcomes. Explain the pattern you observe.':step===2?'Connect the model to the lesson title. Which variable is changing?':'Eliminate choices that conflict with the definition. Use the experiment before choosing.')+'</div>':'')+'<div class="stepfooter"><button class="btn light" onclick="back()">'+t("back_btn")+'</button><div style="display:flex;gap:8px">'+(step===0||step===3?(!checked?'<button class="btn teal" '+(answer===null?'disabled':'')+' onclick="verify()">'+t("check_btn")+'</button>':'<button class="btn teal" onclick="next()">'+t("continue_btn")+'</button>'):'<button class="btn teal" onclick="next()">'+t("continue_btn")+'</button>')+'</div></div>'+(step===4?'':'<button class="btn light" onclick="hint=true;render()">'+t("hint_btn")+'</button>')+'<div class="source">'+t("source_line")+' '+esc(sourceFor(s))+'. '+t("source_extra")+'</div></section></div>';
}
function germanUnits(){
 const units=window.EBDAA_GERMAN_UNITS[grade];
 return '<div class="eyebrow"><a href="#" onclick="nav(\'browse\');return false">Year '+grade+'</a> / Deutsch</div><h1>Deutsch · Dabei! A1.'+grade+'</h1><p>German course organized by modules and lessons from the supplied Dabei! Kursbuch. Each lesson opens focused practice.</p><div class="unit-strip"><button onclick="nav(\'browse\')">← Subjects</button></div><div class="cards">'+units.map((u,i)=>'<article class="course"><div class="course-art"><i>DE</i></div><div class="course-body"><small>MODUL '+(grade===1?i+1:grade===2?i+4:i+7)+' · A1.'+grade+'</small><h3>'+esc(u.title)+'</h3><p>'+u.sessions.length+' Lektionen</p><button onclick="germanChooseUnit('+i+')">Lektionen anzeigen →</button></div></article>').join('')+'</div>';
}
function germanChooseUnit(i){year2Unit=i;nav("unitPreview")}
function germanPreview(){
 const u=window.EBDAA_GERMAN_UNITS[grade][year2Unit];
 return '<div class="eyebrow"><a href="#" onclick="nav(\'subject\');return false">Deutsch A1.'+grade+'</a> / '+esc(u.title)+'</div><h1>'+esc(u.title)+'</h1><p>'+esc(u.source)+' · Vocabulary and grammar: '+esc(u.focus.join(", "))+'</p><p>50 interactive tasks covering vocabulary, grammar, reading, listening, speaking and dialogue. Audio uses browser speech synthesis and microphone transcription is optional, not a pronunciation grade.</p><div class="grid" style="display:grid;gap:12px;margin-top:20px">'+u.sessions.map((name,i)=>'<button class="card" style="background:white;border:1px solid #e6e3de;border-radius:15px;padding:20px;text-align:left;cursor:pointer" onclick="germanOpen('+i+')"><span class="eyebrow">LEKTION '+(i+1)+' · KURSBUCH S. '+u.pages[i]+'</span><h3>'+esc(name)+'</h3>'+progressBadge("de",grade,year2Unit,i)+'<p>50 Aufgaben starten →</p></button>').join('')+'</div><button class="btn light" onclick="nav(\'subject\')">← Alle Module</button>';
}
function germanOpen(i){if(!window.NTSS_LAZY.isCurriculumReady("german-language"))return queueSubjectCurriculum("german-language",()=>germanOpen(i));registerNamedLesson("de",grade,year2Unit,i,window.EBDAA_GERMAN_UNITS[grade][year2Unit].sessions[i],"germanPractice");if(!window.NTSS_LAZY.isSubjectReady("germanPractice"))return queueSubjectLesson("germanPractice",()=>germanOpen(i));mode="germanPractice";window.EBDAA_GERMAN_PRACTICE.start(grade,year2Unit,i)}
function germanBackToUnit(){nav("unitPreview")}
function arabicUnits(){const units=window.EBDAA_ARABIC_UNITS[grade];return '<section dir="rtl" lang="ar"><div class="eyebrow"><a href="#" onclick="nav(\'browse\');return false">الصف '+grade+'</a> / اللغة العربية</div><h1>اللغة العربية</h1><p>دروس وفروع اللغة العربية وفق فهارس كتب التعليم الثانوي الفني المرفوعة (طبعة 2023/2024). الأسئلة الحالية مراجعة تأسيسية عامة وتحتاج إعدادًا خاصًا بكل نص ومراجعة المعلم.</p><button class="btn light" onclick="nav(\'browse\')">العودة للمواد</button>'+[1,2].map(term=>'<div class="section-title"><h2>الفصل الدراسي '+(term===1?'الأول':'الثاني')+'</h2></div><div class="cards">'+units.map((u,i)=>u.term!==term?'':'<article class="course"><div class="course-art"><i>ع</i></div><div class="course-body"><small>من فهرس الكتاب المرفوع</small><h3>'+esc(u.title)+'</h3><p>'+u.sessions.length+' دروس من الكتاب</p><button onclick="arabicChooseUnit('+i+')">عرض التدريبات</button></div></article>').join('')+'</div>').join('')+'</section>'}
function arabicChooseUnit(i){year2Unit=i;nav("unitPreview")}
function arabicPreview(){const u=window.EBDAA_ARABIC_UNITS[grade][year2Unit];return '<section dir="rtl" lang="ar"><div class="eyebrow"><a href="#" onclick="nav(\'subject\');return false">اللغة العربية</a> / '+esc(u.title)+'</div><h1>'+esc(u.title)+'</h1><p>'+esc(u.source)+'</p><p>العناوين من الكتب المرفوعة. أُضيفت أسئلة فهم من مضمون نصوص القراءة وتدريبات نحوية مرتبطة بقواعد بعض الدروس. الأسئلة الأخرى مراجعات عامة متكررة، ولا تمثل 50 سؤالًا مستقلًا لكل درس.</p><div class="grid" style="display:grid;gap:12px">'+u.sessions.map((name,i)=>'<button class="card" style="background:white;border:1px solid #e6e3de;border-radius:15px;padding:20px;text-align:right" onclick="arabicOpen('+i+')"><h3>'+esc(name)+'</h3>'+progressBadge("ar",grade,year2Unit,i)+'<p>ابدأ التدريب ←</p></button>').join('')+'</div></section>'}
function arabicOpen(i){if(!window.NTSS_LAZY.isCurriculumReady("arabic-language"))return queueSubjectCurriculum("arabic-language",()=>arabicOpen(i));registerNamedLesson("ar",grade,year2Unit,i,window.EBDAA_ARABIC_UNITS[grade][year2Unit].sessions[i],"arabicPractice");if(!window.NTSS_LAZY.isSubjectReady("arabicPractice"))return queueSubjectLesson("arabicPractice",()=>arabicOpen(i));mode="arabicPractice";window.EBDAA_ARABIC_PRACTICE.start(grade,year2Unit,i)}
function arabicBackToUnit(){nav("unitPreview")}



function economicsUnits(){
 const units=window.EBDAA_ECONOMICS_UNITS[3];
 return '<section dir="rtl" lang="ar"><div class="eyebrow"><a href="#" onclick="nav(\'browse\');return false">الصف الثالث</a> / الاقتصاد</div><h1>📈 الاقتصاد</h1><p>من دليل مادة الاقتصاد للصف الثالث الثانوي الفني، إصدار الملف المرفوع 2022–2023. لم يحدد المصدر توزيع الوحدات على الفصلين الدراسيين.</p><p>أربع وحدات أصلية، 20 درسًا، ومسائل حسابية ومراجعات تفاعلية إضافية.</p><div class="cards">'+units.map((u,i)=>'<article class="course"><div class="course-art"><i>📈</i></div><div class="course-body"><small>الوحدة '+u.unitNo+' · 5 دروس</small><h3>'+esc(u.title)+'</h3><button onclick="economicsChooseUnit('+i+')">استكشف الدروس ←</button></div></article>').join('')+'</div></section>';
}
function economicsChooseUnit(i){year2Unit=i;nav("unitPreview")}
function economicsPreview(){
 const u=window.EBDAA_ECONOMICS_UNITS[3][year2Unit];
 return '<section dir="rtl" lang="ar"><div class="eyebrow"><a href="#" onclick="nav(\'subject\');return false">الاقتصاد</a> / الوحدة '+u.unitNo+'</div><h1>'+esc(u.title)+'</h1><p>خمس دروس وفق عناوين الدليل، وكل درس يضم 50 تفاعلًا تدريبيًا متنوعًا. أسئلة المراجعة والمسائل الحسابية إضافات تعليمية وليست نقلًا حرفيًا من الكتاب.</p><div class="grid" style="display:grid;gap:12px">'+u.sessions.map((l,i)=>'<button class="card" style="background:white;border:1px solid #e6e3de;border-radius:15px;padding:20px;text-align:right;cursor:pointer" onclick="economicsOpen('+i+')"><span class="eyebrow">الدرس '+(i+1)+'</span><h3>'+esc(l.title)+'</h3>'+progressBadge("economics",3,year2Unit,i)+'<p>ابدأ 50 تفاعلًا ←</p></button>').join('')+'</div></section>';
}
function economicsOpen(i){if(!window.NTSS_LAZY.isCurriculumReady("economics"))return queueSubjectCurriculum("economics",()=>economicsOpen(i));registerNamedLesson("economics",3,year2Unit,i,window.EBDAA_ECONOMICS_UNITS[3][year2Unit].sessions[i],"economicsPractice");if(!window.NTSS_LAZY.isSubjectReady("economicsPractice"))return queueSubjectLesson("economicsPractice",()=>economicsOpen(i));mode="economicsPractice";window.EBDAA_ECONOMICS_PRACTICE.start(3,year2Unit,i);scrollTo(0,0)}
function economicsBackToUnit(){nav("unitPreview")}
function civicsUnits(){
 const units=window.EBDAA_CIVICS_UNITS[1];
 return '<section dir="rtl" lang="ar"><div class="eyebrow"><a href="#" onclick="nav(\'browse\');return false">الصف الأول</a> / التربية الوطنية</div><h1>🇪🇬 التربية الوطنية</h1><p>من كتاب «أنا المصري» للفصلين الدراسيين؛ إصدار الملف المرفوع 2023–2024.</p><p>الأنشطة مساندة لتثبيت المفاهيم وليست نسخة من أسئلة التقييم الرسمي.</p>'+[1,2].map(term=>'<div class="section-title"><h2>الفصل الدراسي '+(term===1?"الأول":"الثاني")+'</h2></div><div class="cards">'+units.map((u,i)=>u.term!==term?'':'<article class="course"><div class="course-art"><i>🇪🇬</i></div><div class="course-body"><small>الفصل '+u.unitNo+' · '+u.sessions.length+' موضوعات</small><h3>'+esc(u.title)+'</h3><button onclick="civicsChooseUnit('+i+')">استكشف الموضوعات ←</button></div></article>').join('')+'</div>').join('')+'</section>';
}
function civicsChooseUnit(i){year2Unit=i;nav("unitPreview")}
function civicsPreview(){const u=window.EBDAA_CIVICS_UNITS[1][year2Unit];return '<section dir="rtl" lang="ar"><div class="eyebrow"><a href="#" onclick="nav(\'subject\');return false">التربية الوطنية</a> / الفصل '+u.unitNo+'</div><h1>'+esc(u.title)+'</h1><p>موضوعات من فهرس الكتاب وأقسامه، مع تدريبات مراجعة متعددة الأنماط. المعلومات الأساسية مستندة إلى الكتاب؛ الأسئلة مولّدة وتحتاج مراجعة المعلم.</p><div class="grid" style="display:grid;gap:12px">'+u.sessions.map((l,i)=>'<button class="card" style="background:white;border:1px solid #e6e3de;border-radius:15px;padding:20px;text-align:right;cursor:pointer" onclick="civicsOpen('+i+')"><span class="eyebrow">موضوع '+(i+1)+'</span><h3>'+esc(l.title)+'</h3>'+progressBadge("civics",1,year2Unit,i)+'<p>ابدأ تدريب 50 سؤالًا وتفاعلًا ←</p></button>').join('')+'</div></section>'}
function civicsOpen(i){if(!window.NTSS_LAZY.isCurriculumReady("civics"))return queueSubjectCurriculum("civics",()=>civicsOpen(i));registerNamedLesson("civics",1,year2Unit,i,window.EBDAA_CIVICS_UNITS[1][year2Unit].sessions[i],"civicsPractice");if(!window.NTSS_LAZY.isSubjectReady("civicsPractice"))return queueSubjectLesson("civicsPractice",()=>civicsOpen(i));mode="civicsPractice";window.EBDAA_CIVICS_PRACTICE.start(1,year2Unit,i);scrollTo(0,0)}
function civicsBackToUnit(){nav("unitPreview")}
function socialUnits(){
 const units=window.EBDAA_SOCIAL_STUDIES_UNITS[grade]||[];
 const warning=grade===3?'دليل الصف الثالث المرفوع إصدار أقدم؛ لم يثبت من الملفات أنه إصدار 2026–2027.':'الصف الثاني · الفصل الدراسي الأول 2026–2027. لم يرفق الفصل الثاني.';
 return '<section lang="ar" dir="rtl"><div class="eyebrow"><a href="#" onclick="nav(\'browse\');return false">المواد الدراسية</a> / الصف '+grade+'</div><h1>🌍 الدراسات الاجتماعية</h1><p>'+esc(warning)+'</p><p>اختر الوحدة ثم الدرس. تدريبات متنوعة في المفاهيم والاستنتاج وتصحيح الأخطاء والكتابة المباشرة.</p><div class="cards">'+units.map((u,i)=>'<article class="course"><div class="course-art"><i>🌍</i></div><div class="course-body" dir="rtl"><small>الوحدة '+u.unitNo+' · '+u.sessions.length+' دروس</small><h3>'+esc(u.title)+'</h3><p>'+esc(u.source)+'</p><button onclick="socialChooseUnit('+i+')">استكشف الدروس ←</button></div></article>').join('')+'</div></section>';
}
function socialChooseUnit(i){year2Unit=i;nav("unitPreview")}
function socialPreview(){
 const u=window.EBDAA_SOCIAL_STUDIES_UNITS[grade][year2Unit];
 return '<section dir="rtl" lang="ar"><div class="eyebrow"><a href="#" onclick="nav(\'subject\');return false">الدراسات الاجتماعية</a> / الوحدة '+u.unitNo+'</div><h1>'+esc(u.title)+'</h1><p>'+esc(u.source)+'</p><p>50 تدريبًا لكل درس بأساليب مختلفة. الأسئلة مساندة ومولدة من المفاهيم الأساسية وليست نقلًا حرفيًا من أسئلة الكتاب.</p><div class="grid" style="display:grid;gap:12px">'+u.sessions.map((l,i)=>'<button class="card" style="background:white;border:1px solid #e6e3de;border-radius:15px;padding:20px;text-align:right;cursor:pointer" onclick="socialOpen('+i+')"><span class="eyebrow">الدرس '+(i+1)+'</span><h3>'+esc(l.title)+'</h3>'+progressBadge("social",grade,year2Unit,i)+'<p>ابدأ التدريب التفاعلي ←</p></button>').join('')+'</div></section>';
}
function socialOpen(i){if(!window.NTSS_LAZY.isCurriculumReady("social-studies"))return queueSubjectCurriculum("social-studies",()=>socialOpen(i));registerNamedLesson("social",grade,year2Unit,i,window.EBDAA_SOCIAL_STUDIES_UNITS[grade][year2Unit].sessions[i],"socialPractice");if(!window.NTSS_LAZY.isSubjectReady("socialPractice"))return queueSubjectLesson("socialPractice",()=>socialOpen(i));mode="socialPractice";window.EBDAA_SOCIAL_STUDIES_PRACTICE.start(grade,year2Unit,i);scrollTo(0,0)}
function socialBackToUnit(){nav("unitPreview")}
function businessUnits(){
 const units=window.EBDAA_BUSINESS_ENGLISH_UNITS[grade];const group=(title,arr)=>arr.length?'<div class="section-title"><h2>'+title+'</h2><span class="count">'+arr.length+' UNITS</span></div><div class="cards">'+arr.map(({u,i})=>'<article class="course"><div class="course-art"><i>💼</i></div><div class="course-body"><small>'+(u.unitNo===0?'FOUNDATION':'UNIT '+u.unitNo)+' · '+u.sessions.length+' ITEMS</small><h3>'+esc(u.title)+'</h3><p>'+esc(u.source.split(" · ")[0])+'</p><button onclick="businessChooseUnit('+i+')">Explore lessons →</button></div></article>').join("")+'</div>':'';
 return '<div class="eyebrow"><a href="#" onclick="nav(\'browse\');return false">Year '+grade+'</a> / Business English · AI</div><h1>💼 Business English · AI</h1><p>English for Artificial Intelligence — exact supplied textbook unit and lesson order. Project evaluation and exams are separate from lesson practice.</p><div class="unit-strip"><button onclick="nav(\'browse\')">← Subjects</button></div>'+(grade===1?group("Foundation · Unit 0",units.map((u,i)=>({u,i})).filter(x=>x.u.term===0))+group("First term · Units 1–2",units.map((u,i)=>({u,i})).filter(x=>x.u.term===1))+group("Second term · Units 3–4",units.map((u,i)=>({u,i})).filter(x=>x.u.term===2)):group("Provided Units · Term not specified in supplied book",units.map((u,i)=>({u,i}))));
}
function businessChooseUnit(i){year2Unit=i;nav("unitPreview")}
function businessPreview(){
 const u=window.EBDAA_BUSINESS_ENGLISH_UNITS[grade][year2Unit];
 return '<div class="eyebrow"><a href="#" onclick="nav(\'subject\');return false">Business English · AI</a> / '+(u.unitNo===0?'Foundation':'Unit '+u.unitNo)+'</div><h1>'+esc(u.title)+'</h1><p>'+esc(u.source)+'</p><p>'+esc(u.project||"Foundational English and classroom communication")+'</p><div style="display:grid;gap:12px;margin-top:20px">'+u.sessions.map((l,i)=>'<button class="card" style="background:white;border:1px solid #e6e3de;border-radius:16px;padding:20px;text-align:left;cursor:pointer" onclick="businessOpen('+i+')"><span class="eyebrow">'+(l.kind==="project"?"🗣 UNIT PROJECT":l.kind==="revision"?"🔁 REVISION":l.kind==="exam"?"📝 PRACTICE EXAM":"📚 LESSON "+(i+1))+'</span><h3>'+esc(l.title)+'</h3>'+progressBadge("be",grade,year2Unit,i)+'<p>'+esc(l.focus)+'</p></button>').join("")+'</div><p class="muted">Lesson questions are original supplementary drills using the book topics. The included exam is practice, not the official exam. Projects require teacher assessment.</p>';
}
function businessOpen(i){if(!window.NTSS_LAZY.isCurriculumReady("business-english"))return queueSubjectCurriculum("business-english",()=>businessOpen(i));registerNamedLesson("be",grade,year2Unit,i,window.EBDAA_BUSINESS_ENGLISH_UNITS[grade][year2Unit].sessions[i],"businessPractice");if(!window.NTSS_LAZY.isSubjectReady("businessPractice"))return queueSubjectLesson("businessPractice",()=>businessOpen(i));mode="businessPractice";window.EBDAA_BUSINESS_PRACTICE.start(grade,year2Unit,i);scrollTo(0,0)}
function businessBackToUnit(){nav("unitPreview")}
function englishUnits(){const units=window.EBDAA_ENGLISH_UNITS[grade];return '<div class="eyebrow"><a href="#" onclick="nav(\'browse\');return false">Year '+grade+'</a> / Advanced English</div><h1>Advanced English</h1><p>English curriculum organized by term and unit.</p><div class="unit-strip"><button onclick="nav(\'browse\')">← Subjects</button></div>'+[1,2].map(t=>{const arr=units.map((u,i)=>({u,i})).filter(x=>x.u.term===t);return arr.length?'<div class="section-title"><h2>Term '+t+'</h2><span class="count">'+arr.length+' UNITS</span></div><div class="cards">'+arr.map(({u,i})=>'<article class="course"><div class="course-art"><i>Aa</i></div><div class="course-body"><small>UNIT '+(i+1)+'</small><h3>'+esc(u.title)+'</h3><p>'+u.sessions.length+' lessons · '+esc(u.focus)+'</p><button onclick="englishChooseUnit('+i+')">View lessons →</button></div></article>').join('')+'</div>':(grade!==2?'<p class="muted">Term 2 English guide has not been supplied for this year.</p>':'')}).join('')}
function englishChooseUnit(i){year2Unit=i;nav("unitPreview")}
function englishPreview(){const u=window.EBDAA_ENGLISH_UNITS[grade][year2Unit];return '<div class="eyebrow"><a href="#" onclick="nav(\'subject\');return false">Advanced English</a> / Unit '+(year2Unit+1)+'</div><span class="pill">TERM '+u.term+'</span><h1>'+esc(u.title)+'</h1><p>'+esc(u.focus)+' · '+esc(u.source)+'</p><p>Choose a lesson to start 50 formative questions covering Grammar, Vocabulary, Reading, Listening and guided Writing and Speaking. Audio playback uses browser text-to-speech; drafts and pronunciation are not automatically graded.</p><div class="grid" style="display:grid;gap:12px;margin-top:20px">'+u.sessions.map((title,i)=>'<button class="card" style="background:white;border:1px solid #e6e3de;border-radius:15px;padding:20px;text-align:left;cursor:pointer" onclick="englishOpen('+i+')"><span class="eyebrow">LESSON '+(i+1)+'</span><h3>'+esc(title)+'</h3>'+progressBadge("en",grade,year2Unit,i)+'<p style="font-size:13px">Start 50 questions →</p></button>').join('')+'</div><button class="btn light" onclick="nav(\'subject\')">← All English units</button>'}
function englishOpen(i){if(!window.NTSS_LAZY.isCurriculumReady("advanced-english"))return queueSubjectCurriculum("advanced-english",()=>englishOpen(i));registerNamedLesson("en",grade,year2Unit,i,window.EBDAA_ENGLISH_UNITS[grade][year2Unit].sessions[i],"englishPractice");if(!window.NTSS_LAZY.isSubjectReady("englishPractice"))return queueSubjectLesson("englishPractice",()=>englishOpen(i));mode="englishPractice";window.EBDAA_ENGLISH_PRACTICE.start(grade,year2Unit,i)}
function englishBackToUnit(){nav("unitPreview")}
function physicsUnits(){
 const units=window.EBDAA_PHYSICS_UNITS[grade];
 return '<div class="eyebrow"><a href="#" onclick="nav(\'browse\');return false">Year '+grade+'</a> / Physics STEM</div><h1>⚛ Physics Discovery Lab</h1><p>Physics in action: predict results, change values and solve experiments, directly from the topics in your 2024 STEM Physics Student Guide.</p>'+[1,2].map(t=>'<div class="section-title"><h2>Term '+t+'</h2></div><div class="cards">'+units.map((u,i)=>u.term!==t?'':'<article class="course"><div class="course-art"><i>⚛</i></div><div class="course-body"><small>STEM LAB · '+u.sessions.length+' LESSONS</small><h3>'+esc(u.title)+'</h3><p>Discover, predict and solve physics challenges.</p><button onclick="physicsChooseUnit('+i+')">Explore experiments →</button></div></article>').join("")+'</div>').join("");
}
function physicsChooseUnit(i){year2Unit=i;nav("unitPreview")}
function physicsPreview(){
 const u=window.EBDAA_PHYSICS_UNITS[grade][year2Unit];
 return '<div class="eyebrow"><a href="#" onclick="nav(\'subject\');return false">Physics</a> / '+esc(u.title)+'</div><h1>'+esc(u.title)+'</h1><p>Explore '+u.sessions.length+' lessons from the supplied 2024 STEM Physics guides. Each lesson offers 50 parameter-based numerical and prediction missions, with immediate calculation feedback.</p><div class="grid" style="display:grid;gap:12px;margin-top:20px">'+u.sessions.map((name,i)=>'<button class="card" style="background:white;border:1px solid #e6e3de;border-radius:16px;padding:20px;text-align:left;cursor:pointer" onclick="physicsOpen('+i+')"><span class="eyebrow">🔬 EXPERIMENT '+(i+1)+'</span><h3>'+esc(name)+'</h3>'+progressBadge("physics",grade,year2Unit,i)+'<p>Start physics mission →</p></button>').join("")+'</div><p class="muted">These are generated educational simulation exercises, not verbatim assessment questions from the study guides. Physics teacher review required.</p>';
}
function physicsOpen(i){if(!window.NTSS_LAZY.isCurriculumReady("physics-stem"))return queueSubjectCurriculum("physics-stem",()=>physicsOpen(i));registerNamedLesson("physics",grade,year2Unit,i,window.EBDAA_PHYSICS_UNITS[grade][year2Unit].sessions[i],"physicsPractice");if(!window.NTSS_LAZY.isSubjectReady("physicsPractice"))return queueSubjectLesson("physicsPractice",()=>physicsOpen(i));window.EBDAA_PHYSICS_PRACTICE.start(grade,year2Unit,i);nav("physicsPractice")}
function physicsBack(){nav("unitPreview")}
function mathUnits(){const units=window.EBDAA_MATH_UNITS[grade];return '<div class="eyebrow"><a href="#" onclick="nav(\'browse\');return false">Year '+grade+'</a> / Mathematics</div><h1>Mathematics</h1><p>Officially listed lessons from the supplied mathematics study guides. Choose a unit to begin practicing.</p><div class="unit-strip"><button onclick="nav(\'browse\')">← Subjects</button></div>'+[1,2].map(t=>{const arr=units.map((u,i)=>({u,i})).filter(x=>x.u.term===t);return arr.length?'<div class="section-title"><h2>Term '+t+'</h2><span class="count">'+arr.length+' UNITS</span></div><div class="cards">'+arr.map(({u,i})=>'<article class="course"><div class="course-art"><i>∑</i></div><div class="course-body"><small>UNIT '+(i+1)+'</small><h3>'+esc(u.title)+'</h3><p>'+u.sessions.length+' lessons</p><button onclick="mathChooseUnit('+i+')">View lessons →</button></div></article>').join('')+'</div>':(grade===1&&t===2?'<p class="muted">First-year Term 2 mathematics guide was not supplied.</p>':'')}).join('')}
function mathChooseUnit(n){year2Unit=n;nav("unitPreview")}
function mathPreview(){const u=window.EBDAA_MATH_UNITS[grade][year2Unit];return '<div class="eyebrow"><a href="#" onclick="nav(\'browse\');return false">Year '+grade+'</a> / <a href="#" onclick="nav(\'subject\');return false">Mathematics</a></div><span class="pill">TERM '+u.term+'</span><h1>'+esc(u.title)+'</h1><p class="muted">'+esc(u.source)+'</p><p>Choose a lesson to start a focused concept check. Extended exercises are under development.</p><div class="grid" style="display:grid;gap:12px;margin-top:20px">'+u.sessions.map((title,i)=>'<button class="card" style="background:white;border:1px solid #e6e3de;border-radius:15px;padding:20px;text-align:left;cursor:pointer" onclick="mathOpen('+i+')"><span class="eyebrow">LESSON '+(i+1)+'</span><h3>'+esc(title)+'</h3>'+progressBadge("math",grade,year2Unit,i)+'<p style="font-size:13px">Start question →</p></button>').join('')+'</div><div class="actions"><button class="btn light" onclick="nav(\'subject\')">← All math units</button></div>'}
function mathOpen(i){if(!window.NTSS_LAZY.isCurriculumReady("mathematics"))return queueSubjectCurriculum("mathematics",()=>mathOpen(i));registerNamedLesson("math",grade,year2Unit,i,window.EBDAA_MATH_UNITS[grade][year2Unit].sessions[i],"mathPractice");if(!window.NTSS_LAZY.isSubjectReady("mathPractice"))return queueSubjectLesson("mathPractice",()=>mathOpen(i));window.EBDAA_MATH_PRACTICE.start(grade,year2Unit,i);nav("mathPractice")}
function mathBackToUnit(){nav("unitPreview")}
function about(){return '<section class="ntss-review-entry"><h2>Teacher Mode · Curriculum Review</h2><p>Open a public, local question-audit workspace. No teacher login, school authorization, or publishing privilege is implied.</p><button class="btn teal" onclick="teacherOpen()">Open Teacher Preview</button></section>'+label()+'<h1>For learners, not profiles.</h1><div class="cards"><div class="course-body" style="background:white;border-radius:20px;padding:25px"><h3>✓ No student registration</h3><p>Only your name is requested locally for the completion certificate; no account or email is required.</p></div><div class="course-body" style="background:white;border-radius:20px;padding:25px"><h3>✓ No student analytics</h3><p>Answers are used to give immediate feedback in the current browser session. They are not sent to a server.</p></div><div class="course-body" style="background:white;border-radius:20px;padding:25px"><h3>✓ Admin-only editing</h3><p>Content edits are secured by repository permissions and GitHub authentication, not an unsafe login form in a static website.</p></div></div><div class="hint" style="margin-top:24px">Site editing requires an authorized GitHub contributor account. Manage <a href="https://github.com/mostafaatteef-eng/NTSS/edit/main/curriculum-data.js" target="_blank" rel="noopener">curriculum</a>, <a href="https://github.com/mostafaatteef-eng/NTSS/edit/main/question-factory.js" target="_blank" rel="noopener">question templates</a>, and <a href="https://github.com/mostafaatteef-eng/NTSS/blob/main/ASSESSMENT_AUDIT.md" target="_blank" rel="noopener">assessment review</a>. A public JavaScript password is not secure; a custom admin CMS would require backend authentication.</div>'}function practiceActive(){return mode==="learn"&&step===4||mode==="advancedLab"&&advancedStep===4}
function exitPractice(){
 if(mode==="advancedLab")nav("unitPreview");
 else nav("subject");
}
let namedLessonContext=null;
function registerNamedLesson(subject,g,u,i,title,lessonMode){
 namedLessonContext={subject,grade:g,unit:u,index:i,title:String(title?.title||title||"Lesson"),mode:lessonMode};
}
function namedLessonKey(d){return [d.subject,d.grade,d.unit,d.index].join(":")}
function namedLessonGate(d){
 const ar=["ar","social","civics","economics"].includes(d.subject);
 return '<section class="practice-focus" aria-label="Student name before lesson" dir="'+(ar?"rtl":"ltr")+'">'+
 '<header class="practice-focus__header"><button class="practice-focus__exit" onclick="nav(&quot;unitPreview&quot;)">'+(ar?"العودة للدروس":"← Back to lessons")+'</button></header>'+
 '<div class="practice-focus__content"><div class="ebda-name-gate"><div class="ebda-name-gate__symbol">✦</div>'+
 '<h1>'+(ar?"أهلًا بك في الدرس":"Welcome to your lesson")+'</h1>'+
 '<p class="ebda-name-gate__lesson">'+esc(d.title)+'</p>'+
 '<p>'+(ar?"اكتب اسمك كما تريد ظهوره على شهادة إتمام الدرس.":"Enter your name as you want it printed on your certificate.")+'</p>'+
 '<form onsubmit="submitNamedLesson();return false">'+
 '<label for="ebda-lesson-student-name">'+(ar?"اسم الطالب بالكامل":"Student full name")+'</label>'+
 '<input id="ebda-lesson-student-name" type="text" dir="auto" minlength="3" maxlength="80" autocomplete="off" required placeholder="'+(ar?"اسم الطالب":"Your full name")+'" aria-describedby="ebda-name-error ebda-name-privacy">'+
 '<p id="ebda-name-error" class="ebda-name-gate__error" role="alert"></p>'+
 '<button class="btn teal" type="submit">'+(ar?"ابدأ الدرس":"Start lesson →")+'</button></form>'+
 '<p id="ebda-name-privacy" class="ebda-name-gate__privacy">'+(ar?"الاسم يستخدم داخل الجلسة فقط دون إرساله إلى خادم.":"Name is used only in this browser session and is not sent to a server.")+'</p></div></div></section>';
}
function submitNamedLesson(){
 const d=namedLessonContext;if(!d||d.mode!==mode)return;
 const field=document.getElementById("ebda-lesson-student-name");
 const name=String(field?.value||"").replace(/[\u0000-\u001f]/g,"").trim().replace(/\s+/g," ").slice(0,80);
 if(name.length<3){const error=document.getElementById("ebda-name-error");if(error)error.textContent="Enter at least three characters.";field?.focus();return}
 window.EBDA_COMPLETION.setName(namedLessonKey(d),name);
 window.EBDA_COMPLETION.open(namedLessonKey(d));
}
function startNamedPractice(g,u,i){
 const k=["ai",g,u,i].join(":");
 const field=document.getElementById("ebda-lesson-student-name");
 const name=String(field?.value||"").replace(/[\u0000-\u001f]/g,"").trim().replace(/\s+/g," ");
 if(name.length<3){
  const status=document.getElementById("ebda-name-error");
  if(status)status.textContent="Please enter your full name (at least 3 characters).";
  field?.focus();return;
 }
 window.EBDA_COMPLETION.setName(k,name);
 window.EBDA_COMPLETION.open(k);
}
function focusPractice(){
 let g,u,i,name;
 if(mode==="learn"){
  g=1;const s=current(),sessions=D.sessions.filter(x=>x.unit===unit);
  u=s.unit-1;i=sessions.findIndex(x=>x.id===s.id);name=s.title;
 }else{
  g=grade;u=year2Unit;i=advancedSession;
  name=window.EBDAA_GRADES.grades[g-1].subjects[0].units[u].sessions[i];
 }
 const studentKey=["ai",g,u,i].join(":");
 if(!window.EBDA_COMPLETION.getName(studentKey).trim()){
  return '<section class="practice-focus" aria-label="Student name before lesson">'+
   '<header class="practice-focus__header"><div class="practice-focus__header-row">'+
   '<button class="practice-focus__exit" onclick="exitPractice()">← All lessons</button>'+
   '<span class="practice-focus__year">YEAR '+g+' · WELCOME</span></div></header>'+
   '<div class="practice-focus__content"><div class="ebda-name-gate">'+
   '<div class="ebda-name-gate__symbol" aria-hidden="true">✦</div>'+
   '<span class="eyebrow">BEFORE YOU BEGIN</span><h1>Welcome to your lesson</h1>'+
   '<p class="ebda-name-gate__lesson">'+esc(name)+'</p>'+
   '<p>Enter your name as you want it printed on your completion certificate.</p>'+
   '<form onsubmit="startNamedPractice('+g+','+u+','+i+');return false">'+
   '<label for="ebda-lesson-student-name">Student full name</label>'+
   '<input id="ebda-lesson-student-name" name="studentName" type="text" dir="auto" minlength="3" maxlength="80" autocomplete="off" required placeholder="Your full name" aria-describedby="ebda-name-privacy ebda-name-error">'+
   '<p id="ebda-name-error" role="alert" class="ebda-name-gate__error"></p>'+
   '<button class="btn teal" type="submit">Start lesson →</button></form>'+
   '<p id="ebda-name-privacy" class="ebda-name-gate__privacy">Your name is only used for this certificate in the current browser session. It is not sent to a school server.</p>'+
   '</div></div></section>';
 }
 const content=window.EBDAA_PRACTICE.panel(g,u,i);
 const progress=window.EBDAA_PRACTICE.progress();
 const percent=Math.round(100*progress.answered/progress.total);
 const finished=window.EBDAA_PRACTICE.isFinished();
 const nextLesson=finished?'<button class="btn teal" onclick="'+(g===1?'next()':'nextAdvanced()')+'">Next lesson →</button>':'';
 return '<section class="practice-focus" aria-label="Focused practice session">'+
 '<header class="practice-focus__header"><div class="practice-focus__header-row">'+
 '<button class="practice-focus__exit" onclick="exitPractice()" aria-label="Back to lessons">← All lessons</button>'+
 '<span class="practice-focus__year">YEAR '+g+' · PRACTICE</span></div>'+
 '<div class="practice-focus__info"><h1 class="practice-focus__lesson">'+esc(name)+'</h1>'+
 '<span id="focus-counter" class="practice-focus__counter">'+(finished?'Completed · 50 / 50':'Question '+progress.position+' / '+progress.total)+'</span></div>'+
 '<div id="focus-progress-track" class="practice-focus__track" role="progressbar" aria-label="Answered questions" aria-valuemin="0" aria-valuemax="50" aria-valuenow="'+progress.answered+'"><i id="focus-progress-fill" style="width:'+percent+'%"></i></div></header>'+
 '<div class="practice-focus__content">'+content+(nextLesson?'<div class="practice-focus__finish">'+nextLesson+'</div>':'')+'</div>'+
 '</section>';
}

/* Public teacher preview, no role authorization or server-side approval. */
let tq={subject:"ai",grade:1,unit:0,lesson:0};
function teacherOpen(){ensureTeacherAudit()}
function teacherChange(k,v){tq[k]=k==="subject"?v:Number(v);if(k==="subject"){tq.grade=v==="economics"?3:1;tq.unit=0;tq.lesson=0}if(k==="grade"){tq.unit=0;tq.lesson=0}if(k==="unit")tq.lesson=0;if(k==="subject")ensureTeacherAudit();else render()}
function teacherNote(i,text){const a=window.NTSS_BANK_AUDIT;const q=a.audit(tq.subject,tq.grade,tq.unit,tq.lesson).items[i];a.mark(tq.subject,tq.grade,tq.unit,tq.lesson,i,q.review.status,text)}
function teacherMark(i,status){const el=document.getElementById("teacher-review-note-"+i);window.NTSS_BANK_AUDIT.mark(tq.subject,tq.grade,tq.unit,tq.lesson,i,status,el?.value||"");render()}
function teacherView(){
 const a=window.NTSS_BANK_AUDIT,e=a.escape;
 const select=(label,key,items)=>'<label>'+label+'<select onchange="teacherChange(\''+key+'\',this.value)">'+items.map(x=>'<option value="'+e(x[0])+'" '+(String(x[0])===String(tq[key])?'selected':'')+'>'+e(x[1])+'</option>').join("")+'</select></label>';
 const names={math:"EBDAA_MATH_UNITS",en:"EBDAA_ENGLISH_UNITS",ar:"EBDAA_ARABIC_UNITS",de:"EBDAA_GERMAN_UNITS",physics:"EBDAA_PHYSICS_UNITS",business:"EBDAA_BUSINESS_ENGLISH_UNITS",economics:"EBDAA_ECONOMICS_UNITS",civics:"EBDAA_CIVICS_UNITS",social:"EBDAA_SOCIAL_STUDIES_UNITS"};
 const units=tq.subject==="ai"?(tq.grade===1?window.EBDAA_DATA.names.map((title,j)=>({title,sessions:window.EBDAA_DATA.sessions.filter(x=>x.unit===j+1).map(x=>x.title)})):window.EBDAA_GRADES.grades[tq.grade-1].subjects[0].units):(window[names[tq.subject]]?.[tq.grade]||[]);
 const sub=select("Subject","subject",Object.keys(a.engines).map(x=>[x,x.toUpperCase()]));
 const grd=select("Year","grade",[1,2,3].map(x=>[x,"Year "+x]));
 if(!units.length)return '<section class="ntss-teacher"><button class="btn light" onclick="nav(\'home\')">← Home</button><h1>Teacher review preview</h1><p>No lessons available for the selected year.</p>'+sub+grd+'</section>';
 tq.unit=Math.min(tq.unit,units.length-1);
 const unit=units[tq.unit],lessons=unit.sessions||[];
 if(!lessons.length)return '<section class="ntss-teacher"><h1>No lessons available</h1>'+sub+grd+'</section>';
 tq.lesson=Math.min(tq.lesson,lessons.length-1);
 const unitSelect=select("Unit","unit",units.map((x,j)=>[j,x.title||x.name||"Unit "+(j+1)]));
 const lessonSelect=select("Lesson","lesson",lessons.map((x,j)=>[j,typeof x==="string"?x:x.title||"Lesson "+(j+1)]));
 let report;try{report=a.audit(tq.subject,tq.grade,tq.unit,tq.lesson)}catch(err){return '<section class="ntss-teacher"><p>'+e(err.message)+'</p>'+sub+grd+unitSelect+lessonSelect+'</section>'}
 return '<section class="ntss-teacher"><button class="btn light" onclick="nav(\'home\')">← Back</button><h1>Teacher Mode · Question Bank Review</h1><p><b>Public preview, not an authenticated teacher account.</b> Review judgments are local until exported and checked by the academic team. Automated warnings do not confirm scientific accuracy.</p><div class="ntss-teacher-filters">'+sub+grd+unitSelect+lessonSelect+'</div><div class="ntss-teacher-summary"><b>'+report.count+' questions</b><span>'+report.issues+' structural warnings</span><button class="btn teal" onclick="NTSS_BANK_AUDIT.exportReport(tq.subject,tq.grade,tq.unit,tq.lesson)">Export review JSON</button></div><div class="ntss-teacher-items">'+report.items.map(q=>'<article class="ntss-teacher-item"><b>Question '+(q.index+1)+'</b><p>'+e(q.prompt)+'</p><p><b>Answer key:</b> '+e(q.answer)+'</p>'+(q.options.length?'<p><b>Options:</b> '+q.options.map((v,j)=>(j+1)+') '+e(v)).join(' · ')+'</p>':'')+(q.explanation?'<p><b>Explanation:</b> '+e(q.explanation)+'</p>':'')+(q.sourceStatus?'<p><b>Source status:</b> '+e(q.sourceStatus)+'</p>':'')+'<p class="'+(q.issues.length?"ntss-teacher-warning":"muted")+'">'+e(q.issues.join(" · ")||"No structural warning — teacher review still required")+'</p><label>Review note<textarea id="teacher-review-note-'+q.index+'" rows="2" oninput="teacherNote('+q.index+',this.value)">'+e(q.review.comment)+'</textarea></label><div class="actions"><button class="btn light" onclick="teacherMark('+q.index+',\'revise\')">Revise</button><button class="btn teal" onclick="teacherMark('+q.index+',\'approved\')">Reviewed locally</button><small>'+e(q.review.status)+'</small></div></article>').join("")+'</div></section>';
}
function render(){
 const focused=practiceActive()||mode==="codeLab"||mode==="mathPractice"||mode==="physicsPractice"||mode==="englishPractice"||mode==="businessPractice"||mode==="economicsPractice"||mode==="civicsPractice"||mode==="socialPractice"||mode==="arabicPractice"||mode==="germanPractice";
 if(document.body?.classList)document.body.classList.toggle("practice-focus-active",focused);
 const activeId=document.activeElement&&document.activeElement.id;
 const LTR=new Set(["learn","advancedLab","codeLab","mathPractice","physicsPractice","englishPractice","businessPractice","germanPractice","teacherReview"]);
 app.dir=LTR.has(mode)?"ltr":"";
 app.innerHTML=mode==="subjectLoading"||mode==="teacherLoading"?'<section class="practice-focus"><div class="practice-focus__content" role="status"><h2>'+t("loading_lesson")+'</h2><p>'+t("loading_preparing")+'</p></div></section>':namedLessonContext&&namedLessonContext.mode===mode&&!window.EBDA_COMPLETION.getName(namedLessonKey(namedLessonContext)).trim()?namedLessonGate(namedLessonContext):mode==="advancedLoading"?'<section class="practice-focus" aria-label="'+t("loading_lab")+'"><div class="practice-focus__content" role="status"><h2>'+t("loading_lab")+'</h2><p>'+t("loading_lab_preparing")+'</p></div></section>':mode==="teacherReview"?teacherView():mode==="economicsPractice"?window.EBDAA_ECONOMICS_PRACTICE.render():mode==="civicsPractice"?window.EBDAA_CIVICS_PRACTICE.render():mode==="socialPractice"?window.EBDAA_SOCIAL_STUDIES_PRACTICE.render():mode==="businessPractice"?window.EBDAA_BUSINESS_PRACTICE.render():mode==="physicsPractice"?window.EBDAA_PHYSICS_PRACTICE.render():mode==="codeLab"?window.EBDAA_CODE_LABS.render():mode==="germanPractice"?window.EBDAA_GERMAN_PRACTICE.render():mode==="arabicPractice"?window.EBDAA_ARABIC_PRACTICE.render():mode==="englishPractice"?window.EBDAA_ENGLISH_PRACTICE.render():mode==="mathPractice"?window.EBDAA_MATH_PRACTICE.render():focused?focusPractice():mode==="home"?home():mode==="browse"?browse():mode==="subject"?subjectUnits():mode==="unitPreview"?previewUnit():mode==="advancedLab"?advancedLab():mode==="learn"?learn():about();
 window.NTSS_QUEST_PATH?.render(app,mode);
 if(activeId){const el=document.getElementById(activeId);if(el)el.focus({preventScroll:true})}
 window.NTSS_LEARNING?.decorate(app,mode);
}
window.EBDA_APP_RENDER=render;
const SUBJECT_ENGINES={mathPractice:"EBDAA_MATH_PRACTICE",physicsPractice:"EBDAA_PHYSICS_PRACTICE",englishPractice:"EBDAA_ENGLISH_PRACTICE",arabicPractice:"EBDAA_ARABIC_PRACTICE",germanPractice:"EBDAA_GERMAN_PRACTICE",civicsPractice:"EBDAA_CIVICS_PRACTICE",economicsPractice:"EBDAA_ECONOMICS_PRACTICE",socialPractice:"EBDAA_SOCIAL_STUDIES_PRACTICE",businessPractice:"EBDAA_BUSINESS_PRACTICE"};
document.addEventListener?.("keydown",function(event){
 if(mode==="codeLab"||event.altKey||event.metaKey||event.ctrlKey||event.repeat)return;
 const tag=event.target?.tagName?.toLowerCase();
 if(["input","textarea","select","button","a","summary"].includes(tag)||event.target?.isContentEditable)return;
 const key=event.key;
 if(practiceActive()){
  if(/^[1-4]$/.test(key)){event.preventDefault();window.EBDAA_PRACTICE.chooseOption(Number(key)-1)}
  else if(key==="Enter"||key==="ArrowRight"){event.preventDefault();window.EBDAA_PRACTICE.submitOrNext()}
  else if(key==="ArrowLeft"){event.preventDefault();window.EBDAA_PRACTICE.prev()}
  return;
 }
 const eng=window[SUBJECT_ENGINES[mode]];
 if(!eng)return;
 if(/^[1-4]$/.test(key)){event.preventDefault();(eng.choose||eng.select||eng.respond)?.call(eng,Number(key)-1)}
 else if(key==="ArrowRight"){event.preventDefault();eng.next?eng.next():eng.move?.(1)}
 else if(key==="ArrowLeft"){event.preventDefault();eng.previous?eng.previous():eng.move?.(-1)}
 else if(key==="Enter"){event.preventDefault();eng.check?.();eng.next?eng.next():eng.move?.(1)}
});
document.querySelectorAll(".nav button[data-nav]").forEach(b=>b.addEventListener("click",()=>nav(b.dataset.nav)));render();
