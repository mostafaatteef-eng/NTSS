/* EBDA | completion and local print-ready certificate.
   This is an unverified practice certificate, not a school-issued credential.
   Student name lives in memory only; no network, localStorage or account data. */
window.EBDA_COMPLETION=(function(){
 const names=new Map(),shown=new Set(),subjects={math:"Mathematics",en:"Advanced English",ar:"Arabic Language",de:"German",physics:"Physics STEM",be:"Business English",social:"Social Studies",civics:"National Education",economics:"Economics",ai:"AI & Data Analysis"};
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const id=x=>String(x).replace(/[^a-z0-9:_-]/gi,"");
 const key=({subject,grade,unit,index})=>[subject,grade,unit,index].join(":");
 function getName(k){return names.get(k)||""}
 function setName(k,v){names.set(k,String(v||"").replace(/[\u0000-\u001f]/g,"").trimStart().slice(0,80))}
 function open(k){if(getName(k).trim().length<3)return;shown.add(k);window.EBDA_APP_RENDER?.()}
 function edit(k){shown.delete(k);window.EBDA_APP_RENDER?.()}
 function forget(k){names.delete(k);shown.delete(k)}
 function print(){if(typeof window.print==="function")window.print()}
 function logo(){
  // Use the actual uploaded NTSS school artwork, included as a local image asset.
  const src=window.NTSS_ORIGINAL_LOGO||"";
  return src.startsWith("data:image/webp;base64,")?'<img class="ebda-certificate-logo" alt="NTSS – National Technical Science Schools" src="'+src+'">':'<span class="ebda-certificate-logo-unavailable">NTSS logo could not be loaded</span>';
 }
 function render({subject,grade,unit,index,lesson,correct,total=50,retry,back,arabic=false,answers=null}){
  const k=key({subject,grade,unit,index}),score=Math.round(100*correct/Math.max(1,total)),eligible=score>=70,excellent=score>=85,visible=shown.has(k),name=getName(k);
  const locale=arabic?"ar":"en",gradeLabel=arabic?["","الأول","الثاني","الثالث"][grade]:["","First","Second","Third"][grade];
  const date=new Intl.DateTimeFormat(arabic?"ar-EG":"en-GB",{year:"numeric",month:"long",day:"numeric"}).format(new Date());
  const title=arabic?"اكتمل الدرس!":"Lesson Completed!";
  const header='<div class="ebda-finish-header"><span class="ebda-brand-tag">EBDA <span>NTSS</span></span><span class="ebda-finish-eyebrow">LEARN · PRACTICE · ACHIEVE</span></div>';
  const intro='<div class="ebda-finish-celebration" aria-hidden="true"><span class="ebda-finish-ring">✦</span></div><h1 class="ebda-finish-title">'+title+'</h1><p class="ebda-finish-lesson">'+esc(lesson)+'</p><div class="ebda-finish-data"><div><strong>'+correct+' / '+total+'</strong><span>'+(arabic?"إجابات صحيحة":"Correct answers")+'</span></div><div><strong>'+score+'%</strong><span>'+(arabic?"النتيجة":"Score")+'</span></div><div><strong>'+(eligible?"🏅":"↻")+'</strong><span>'+(arabic?(eligible?"مؤهل للشهادة":"راجع وتدرب"):(eligible?"Certificate ready":"Keep practicing"))+'</span></div></div>';
  const msg=eligible?(arabic?"أحسنت! يمكنك كتابة اسمك لمعاينة شهادة إتمام الدرس وحفظها بصيغة PDF.":"Excellent work! Enter your name to preview and print your lesson certificate."):(arabic?"لقد أكملت الدرس. يلزم الحصول على 70% على الأقل لإصدار شهادة الإتمام. راجع أخطاءك وأعد المحاولة.":"You completed the lesson. A score of at least 70% is required for a completion certificate. Review and try again.");

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
  const form=eligible?(visible?'<div class="ebda-finish-print-actions"><button class="ebda-finish-btn ebda-finish-primary" onclick="EBDA_COMPLETION.print()">⬇ '+(arabic?"حفظ PDF / طباعة":"Save as PDF / Print")+'</button><button class="ebda-finish-btn ebda-finish-secondary" onclick="EBDA_COMPLETION.edit('+JSON.stringify(k)+')">'+(arabic?"تعديل الاسم":"Edit name")+'</button></div>':'<div class="ebda-finish-form"><label for="ebda-student-name">'+(arabic?"اسم الطالب على الشهادة":"Student name on certificate")+'</label><div class="ebda-finish-input-wrap"><input id="ebda-student-name" dir="auto" type="text" maxlength="80" autocomplete="off" placeholder="'+(arabic?"اكتب الاسم كما تريد ظهوره":"Enter your full name")+'" value="'+esc(name)+'" oninput="EBDA_COMPLETION.setName('+JSON.stringify(k)+',this.value)"><button class="ebda-finish-btn ebda-finish-primary" onclick="EBDA_COMPLETION.open('+JSON.stringify(k)+')">'+(arabic?"معاينة الشهادة":"Preview certificate")+'</button></div><small>'+(arabic?"الاسم للاستخدام داخل متصفحك فقط، ولا يُحفظ على خادم.":"Your name is used in this browser session only.")+'</small></div>'):"";
  return '<section class="ebda-lesson-completed" dir="'+(arabic?"rtl":"ltr")+'" lang="'+locale+'"><div class="ebda-finish-card">'+header+intro+'<p class="ebda-finish-message">'+msg+'</p>'+missionReview+form+actions+'</div>'+certificate+'</section>';
 }
 return {render,setName,getName,open,edit,forget,print};
})();