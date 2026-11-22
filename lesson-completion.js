/* EBDA | completion and local print-ready certificate.
   This is an unverified practice certificate, not a school-issued credential.
   Names stay in memory and in device-local saved attempts for up to seven days. No server upload. */
window.EBDA_COMPLETION=(function(){
 // Expired drafts are removed on the next site visit, including lazy subjects.
 try{
  const prefix="ntss-private-practice-checkpoint-v4",now=Date.now(),ttl=7*24*60*60*1000;
  for(const k of Object.keys(localStorage))if(k.startsWith(prefix)){
   try{const v=JSON.parse(localStorage.getItem(k));if(!Number.isFinite(v?.savedAt)||now-v.savedAt>ttl||now<v.savedAt)localStorage.removeItem(k)}catch(_){localStorage.removeItem(k)}
  }
 }catch(_){} // Storage may be unavailable; current-session practice still works.
 const names=new Map(),shown=new Set(),unbound=new Set(),subjects={da:"Data Analysis",math:"Mathematics",en:"Advanced English",ar:"Arabic Language",de:"German",physics:"Physics STEM",be:"Business English",social:"Social Studies",civics:"National Education",economics:"Economics",ai:"AI & Data Analysis"};
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const id=x=>String(x).replace(/[^a-z0-9:_-]/gi,"");
 const key=({subject,grade,unit,index})=>[subject,grade,unit,index].join(":");
 function getName(k){return names.get(k)||""}
 function setName(k,v){
  // The name is chosen at lesson entry, never replaced on a completed attempt.
  if(names.has(k))return false;
  const name=String(v||"").replace(/[\u0000-\u001f]/g,"").trim().replace(/\s+/g," ").slice(0,80);
  if(name.length<3)return false;
  names.set(k,name);return true;
 }
 function freshAttempt(k){unbound.delete(k)}
 function checkpointIdentity(k){return !unbound.has(k)&&getName(k)?{name:getName(k)}:null}
 function restoreIdentity(k,identity){
  const name=String(identity?.name||"").replace(/[\u0000-\u001f]/g,"").trim().replace(/\s+/g," ").slice(0,80);
  if(name.length<3){unbound.add(k);shown.delete(k);return false}
  names.set(k,name);unbound.delete(k);shown.add(k);return true;
 }
 function attemptNotice(k,arabic=false){
  return '<p class="ebda-attempt-identity" role="status" dir="auto">'+(unbound.has(k)?(arabic?"هذه محاولة محفوظة قديمة بلا اسم أصلي. يمكنك استكمال التدريب، لكن إصدار شهادة يحتاج محاولة جديدة.":"This saved attempt has no original name. You can continue learning, but a certificate requires a new attempt."):(arabic?"اسم هذه المحاولة: ":"Name for this attempt: ")+esc(getName(k)))+'</p>';
 }
 function open(k){if(unbound.has(k)||getName(k).trim().length<3)return;shown.add(k);window.EBDA_APP_RENDER?.()}
 function forget(k){names.delete(k);shown.delete(k);unbound.delete(k)}
 function print(){if(typeof window.print==="function")window.print()}
 function logo(){
  // Use the actual uploaded NTSS school artwork, included as a local image asset.
  const src=window.NTSS_ORIGINAL_LOGO||"";
  return src.startsWith("data:image/webp;base64,")?'<img class="ebda-certificate-logo" alt="NTSS – National Technical Science Schools" src="'+src+'">':'<span class="ebda-certificate-logo-unavailable">NTSS logo could not be loaded</span>';
 }
 function render({subject,grade,unit,index,lesson,correct,total=50,retry,back,arabic=false,answers=null}){
  const k=key({subject,grade,unit,index}),score=Math.round(100*correct/Math.max(1,total)),eligible=score>=70&&!unbound.has(k),excellent=score>=85,visible=shown.has(k),name=getName(k);
  const locale=arabic?"ar":"en",gradeLabel=arabic?["","الأول","الثاني","الثالث"][grade]:["","First","Second","Third"][grade];
  const date=new Intl.DateTimeFormat(arabic?"ar-EG":"en-GB",{year:"numeric",month:"long",day:"numeric"}).format(new Date());
  const title=arabic?"اكتمل الدرس!":"Lesson Completed!";
  const header='<div class="ebda-finish-header"><span class="ebda-brand-tag">EBDA <span>NTSS</span></span><span class="ebda-finish-eyebrow">LEARN · PRACTICE · ACHIEVE</span></div>';
  const intro='<div class="ebda-finish-celebration" aria-hidden="true"><span class="ebda-finish-ring">✦</span></div><h1 class="ebda-finish-title">'+title+'</h1><p class="ebda-finish-lesson">'+esc(lesson)+'</p><div class="ebda-finish-data"><div><strong>'+correct+' / '+total+'</strong><span>'+(arabic?"إجابات صحيحة":"Correct answers")+'</span></div><div><strong>'+score+'%</strong><span>'+(arabic?"النتيجة":"Score")+'</span></div><div><strong>'+(eligible?"🏅":"↻")+'</strong><span>'+(arabic?(unbound.has(k)?"للتدريب فقط":eligible?"مؤهل للشهادة":"راجع وتدرب"):(unbound.has(k)?"Learning only":eligible?"Certificate ready":"Keep practicing"))+'</span></div></div>';
  const msg=unbound.has(k)?(arabic?"هذه النتيجة للمراجعة فقط، وليست شهادة باسم الطالب.":"This result is for learning only, not a named certificate."):eligible?(arabic?"أحسنت! تصدر الشهادة بالاسم الذي أدخلته في بداية المحاولة، ولا يمكن تغييره هنا.":"Excellent work! Your certificate uses the name entered at the start of this attempt. It cannot be changed here."):(arabic?"لقد أكملت الدرس. يلزم الحصول على 70% على الأقل لإصدار شهادة الإتمام. راجع أخطاءك وأعد المحاولة.":"You completed the lesson. A score of at least 70% is required for a completion certificate. Review and try again.");

  // Show evidence-based feedback from the five actual ten-question stages.
  // This is a formative breakdown and is not part of the certificate itself.
  let missionReview="";
  if(answers&&total===50){
    const stages=Array.from({length:5},(_,i)=>{
      let good=0,completed=0;
      for(let k=i*10;k<(i+1)*10;k++){const a=answers[k];if(a?.checked){completed++;if(a.correct)good++}}
      return {good,completed};
    });
    const labels=arabic?["اكتشف","افهم","طبّق","تحدَّ","أتقن"]:["Discover","Understand","Apply","Challenge","Master"];
    const weak=stages.findIndex(v=>v.completed>0&&v.good/v.completed<0.7);
    missionReview='<details class="ebda-mastery-review"><summary>📊 '+(arabic?"تحليل مراحل التعلم":"Learning journey breakdown")+'</summary><div class="ebda-mastery-grid">'+stages.map((v,i)=>'<div class="ebda-mastery-item"><span>'+labels[i]+'</span><b>'+v.good+' / '+v.completed+'</b><div class="ebda-mastery-track"><i style="width:'+(v.completed?Math.round(v.good/v.completed*100):0)+'%"></i></div></div>').join('')+'</div><p>'+(weak>=0?(arabic?"راجع مرحلة "+labels[weak]+" ثم أعد تجربة الأسئلة غير الصحيحة.":"Suggested review: revisit the "+labels[weak]+" stage and your missed questions."):(arabic?"عمل ممتاز؛ واصل التدرب بانتظام.":"Strong progress across the completed stages. Keep practicing."))+'</p></details>';
  }
  const actions='<div class="ebda-finish-actions">'+(retry?'<button class="ebda-finish-btn ebda-finish-secondary" onclick="'+retry+'">'+(arabic?"↻ إعادة التدريب":"↻ Try again")+'</button>':'')+(back?'<button class="ebda-finish-btn ebda-finish-secondary" onclick="'+back+'">'+(arabic?"العودة للدروس":"Back to lessons")+'</button>':'')+'</div>';
  let certificate="";
  if(eligible&&visible&&name.trim().length>=3){
    const displayName=esc(name.trim()),subjectName=esc(subjects[subject]||subject),displayLesson=esc(lesson),fullDate=new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric"}).format(new Date());
    certificate='<article id="ebda-certificate-sheet" class="ebda-certificate" dir="ltr" lang="en">'+
      '<div class="ebda-certificate-corner ebda-certificate-corner--top"></div><div class="ebda-certificate-corner ebda-certificate-corner--bottom"></div>'+
      '<div class="ebda-certificate-header">'+logo()+'</div>'+
      '<h2 class="ebda-certificate-heading">Certificate of Achievement</h2>'+
      '<div class="ebda-certificate-highlight" aria-hidden="true"></div>'+
      '<p class="ebda-certificate-pretitle">This certificate is proudly awarded to</p>'+
      '<div class="ebda-certificate-student" dir="auto">'+displayName+'</div>'+
      '<p class="ebda-certificate-text">For successfully completing the lesson</p>'+
      '<div class="ebda-certificate-lesson" dir="auto">'+displayLesson+'</div>'+
      '<p class="ebda-certificate-platform">on the NTSS Educational Platform</p>'+
      '<div class="ebda-certificate-metadata">'+
        '<div><span class="ebda-certificate-detail-label">Completion Date</span><b>'+esc(fullDate)+'</b></div>'+
        '<div><span class="ebda-certificate-detail-label">Subject</span><b dir="auto">'+subjectName+'</b></div>'+
        '<div><span class="ebda-certificate-detail-label">Grade</span><b>'+esc(["","First","Second","Third"][grade]||grade)+'</b></div>'+
        '<div><span class="ebda-certificate-detail-label">Score</span><b>'+score+'%</b></div>'+
      '</div>'+
      '<div class="ebda-certificate-result">'+(excellent?'Completed with Distinction':'Successfully Completed')+' · Score: '+score+'%</div>'+
      '<p class="ebda-certificate-disclaimer">Locally generated practice record · Not an officially verified school credential</p>'+
      '</article>';
  }
  const form=eligible?(name.trim().length>=3?'<div class="ebda-finish-print-actions">'+(visible?'<button class="ebda-finish-btn ebda-finish-primary" onclick="EBDA_COMPLETION.print()">⬇ '+(arabic?"حفظ PDF / طباعة":"Save as PDF / Print")+'</button>':'<button class="ebda-finish-btn ebda-finish-primary" onclick="EBDA_COMPLETION.open('+JSON.stringify(k)+')">'+(arabic?"معاينة الشهادة":"Preview certificate")+'</button>')+'</div>':'<p role="status">'+(arabic?"لا يوجد اسم مسجل لهذه المحاولة. ارجع لبداية الدرس.":"This attempt has no starting name. Return to the lesson start.")+'</p>'):"";
  return '<section class="ebda-lesson-completed" dir="'+(arabic?"rtl":"ltr")+'" lang="'+locale+'"><div class="ebda-finish-card">'+header+intro+attemptNotice(k,arabic)+'<p class="ebda-finish-message">'+msg+'</p>'+missionReview+form+actions+'</div>'+certificate+'</section>';
 }
 function participation({subject,grade,unit,index,lesson,back}){
  const k=key({subject,grade,unit,index}),name=getName(k).trim(),valid=name.length>=3&&!unbound.has(k);
  const date=new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric"}).format(new Date());
  if(!valid)return '<section class="ebda-lesson-completed"><div class="ebda-finish-card"><h2>Enter your name before this project</h2><p>Return to the project and enter your name to create your participation record.</p></div></section>';
  const sheet='<article id="ebda-certificate-sheet" class="ebda-certificate" dir="ltr" lang="en">'+
    '<div class="ebda-certificate-header">'+logo()+'</div>'+
    '<h2 class="ebda-certificate-heading">Certificate of Participation</h2>'+
    '<p class="ebda-certificate-pretitle">This local record is issued to</p>'+
    '<div class="ebda-certificate-student" dir="auto">'+esc(name)+'</div>'+
    '<p class="ebda-certificate-text">For preparing a self-reported project outline for</p>'+
    '<div class="ebda-certificate-lesson" dir="auto">'+esc(lesson)+'</div>'+
    '<div class="ebda-certificate-metadata">'+
      '<div><span class="ebda-certificate-detail-label">Date</span><b>'+esc(date)+'</b></div>'+
      '<div><span class="ebda-certificate-detail-label">Subject</span><b>'+esc(subjects[subject]||subject)+'</b></div>'+
      '<div><span class="ebda-certificate-detail-label">Grade</span><b>'+esc(["","First","Second","Third"][grade]||grade)+'</b></div>'+
      '<div><span class="ebda-certificate-detail-label">Assessment</span><b>Not graded</b></div>'+
    '</div>'+
    '<p class="ebda-certificate-disclaimer">Self-reported project preparation only · No teacher verification or academic grade · Not an official school certificate</p></article>';
  return '<section class="ebda-lesson-completed"><div class="ebda-finish-card"><h1 class="ebda-finish-title">'+(window.NTSS_UI?.pair("Project preparation recorded","تم تسجيل إعداد المشروع")||"Project preparation recorded")+'</h1>'+
    '<p>Your outline has been prepared. Actual presentation and writing skills require teacher assessment.</p>'+
    '<div class="ebda-finish-print-actions"><button class="ebda-finish-btn ebda-finish-primary" onclick="EBDA_COMPLETION.print()">'+(window.NTSS_UI?.pair("Save as PDF / Print","حفظ PDF / طباعة")||"Save as PDF / Print")+'</button>'+
    (back?'<button class="ebda-finish-btn ebda-finish-secondary" onclick="'+back+'">'+(window.NTSS_UI?.back()||'Back to lessons')+'</button>':'')+'</div></div>'+sheet+'</section>';
 }
 return {render,participation,setName,getName,open,forget,print,freshAttempt,checkpointIdentity,restoreIdentity,attemptNotice};
})();