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
  socialPractice:"social-studies-practice.js",civicsPractice:"civics-practice.js",economicsPractice:"economics-practice.js"
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
 return {ensureStudio,isReady:()=>studioFiles.every(file=>ready.has(file)),ensureSubject,isSubjectReady,subjectFiles:{...subjectFiles},files:studioFiles.slice()};
})();