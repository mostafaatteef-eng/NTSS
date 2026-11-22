/* Load optional Year 2/3 experimental lab modules only when a student opens that curriculum.
 * Scripts download in parallel but execute in declared order; no personal data leaves browser.
 */
window.NTSS_LAZY=(function(){
 const studioFiles=[
  "case-labs.js",
  "scenario-labs.js",
  "visual-playground.js",
  "code-challenges.js",
  "concept-visualizer.js",
  "theory-studio.js",
  "lab-studio.js"
 ];
 const subjectFiles={
  mathPractice:"math-practice.js",physicsPractice:"physics-practice.js",englishPractice:"english-practice.js",
  businessPractice:"business-english-practice.js",germanPractice:"german-practice.js",arabicPractice:"arabic-practice.js",
  socialPractice:"social-studies-practice.js",civicsPractice:"civics-practice.js",economicsPractice:"economics-practice.js",dataAnalysisPractice:"data-analysis-practice.js?v=20261122-da-grade3"
 };
 // Subject curricula (unit titles and session lists) download only when a student opens
 // that subject or searches across subjects; the landing page no longer downloads all of them.
 const curriculumFiles={
  "data-analysis":["data-analysis-curriculum.js?v=20261122-da-grade3"],
  "mathematics":["math-curriculum.js?v=20261115"],
  "advanced-english":["english-curriculum.js?v=20261115-review","english-grammar-extensions.js?v=20261115-review"],
  "arabic-language":["arabic-curriculum.js?v=20261115-books","arabic-source-questions.js?v=20261115-source","arabic-grammar-items.js?v=20261115-targeted"],
  "german-language":["german-curriculum.js?v=20261115","german-question-data.js?v=20261115","german-audio-dialogues.js?v=20261115"],
  "social-studies":["social-studies-curriculum.js?v=20261116-v1"],
  "civics":["civics-curriculum.js?v=20261116-v1"],
  "economics":["economics-curriculum.js?v=20261116-v1"],
  "business-english":["business-english-curriculum.js?v=20261116-verified"],
  "physics-stem":["physics-curriculum.js?v=20261116","physics-special-sims.js?v=20261116-1","physics-visual-lab.js?v=20261116"]
 };
 const ready=new Set(),loading=new Map();
 let pending=null;
 function request(file){
  if(ready.has(file))return Promise.resolve();
  if(loading.has(file))return loading.get(file);
  const promise=new Promise((resolve,reject)=>{
   const script=document.createElement("script");
   script.async=false;
   script.src=file;
   script.onload=()=>{ready.add(file);resolve()};
   script.onerror=()=>{script.remove();reject(Error("Unable to load "+file))};
   document.head.appendChild(script);
  }).finally(()=>loading.delete(file));
  loading.set(file,promise);
  return promise;
 }
 function ensureStudio(){
  if(studioFiles.every(file=>ready.has(file)))return Promise.resolve();
  if(pending)return pending;
  // All downloads start together. Explicit async=false preserves classic-script execution order.
  pending=Promise.all(studioFiles.filter(file=>!ready.has(file)).map(request)).then(()=>undefined).finally(()=>{pending=null});
  return pending;
 }
 function ensureSubject(mode){
  const file=subjectFiles[mode];
  return file?request(file):Promise.reject(Error("Unknown subject module"));
 }
 function isSubjectReady(mode){return !!subjectFiles[mode]&&ready.has(subjectFiles[mode])}
 function ensureCurriculum(subject){
  const files=curriculumFiles[subject];
  if(!files)return Promise.reject(Error("Unknown subject curriculum"));
  return Promise.all(files.filter(file=>!ready.has(file)).map(request)).then(()=>undefined);
 }
 function isCurriculumReady(subject){const files=curriculumFiles[subject];return !!files&&files.every(file=>ready.has(file))}
 function ensureAllCurricula(){
  const files=[...new Set(Object.values(curriculumFiles).flat())];
  return Promise.all(files.filter(file=>!ready.has(file)).map(request)).then(()=>undefined);
 }
 return {ensureStudio,isReady:()=>studioFiles.every(file=>ready.has(file)),ensureSubject,isSubjectReady,ensureCurriculum,isCurriculumReady,ensureAllCurricula,subjectFiles:{...subjectFiles},files:studioFiles.slice()};
})();