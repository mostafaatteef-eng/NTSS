/* NTSS Quest Path: understated learning-game progression across all subjects.
   Pure presentation; no grade manipulation, tracking, accounts or timers. */
window.NTSS_QUEST_PATH=(function(){
 const STAGES={en:["Discover","Understand","Apply","Challenge","Master"],ar:["اكتشف","افهم","طبّق","تحدَّ","أتقن"],de:["Entdecken","Verstehen","Anwenden","Challenge","Meistern"]};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 let seen=null;
 function language(mode){return window.EBDA_I18N?.current?.()||(["arabicPractice","civicsPractice","socialPractice","economicsPractice"].includes(mode)?"ar":mode==="germanPractice"?"de":"en")}
 function stepFromCounter(text){
  if(/Completed|مكتمل|إنجاز المهمة|GROUP PROJECT/i.test(text))return null;
  const m=String(text).match(/(?:Question|Frage|Mission|السؤال|سؤال)\s*(\d+)/i);
  if(m)return Math.min(50,Math.max(1,Number(m[1])));
  return null;
 }
 function label(language,n){
  const t=STAGES[language]||STAGES.en;
  return t[Math.floor((n-1)/10)];
 }
 function render(root,mode){
  if(!root||!root.querySelector)return;
  const screen=root.querySelector(".practice-focus");
  if(!screen||screen.querySelector(".ebda-lesson-completed")||root.querySelector(".ebda-lesson-completed"))return;
  const counter=screen.querySelector(".practice-focus__counter"),number=stepFromCounter(counter?.textContent||"");
  if(number===null)return;
  const body=screen.querySelector(".practice-focus__content");
  if(!body)return;
  const lang=language(mode),stage=Math.ceil(number/10),position=((number-1)%10)+1,labels=STAGES[lang]||STAGES.en;
  const title=lang==="ar"?"مسار التعلّم":lang==="de"?"Lernpfad":"Learning path";
  const subtitle=lang==="ar"?"المرحلة "+stage+" من 5 · "+label(lang,number):lang==="de"?"Etappe "+stage+" von 5 · "+label(lang,number):"Stage "+stage+" of 5 · "+label(lang,number);
  const chunks=labels.map((name,i)=>{
   const active=i===stage-1,complete=i<stage-1;
   return '<span class="ntss-quest-step '+(active?"is-active":complete?"is-complete":"")+'" aria-label="'+esc(name+(complete?" completed":active?" current":" pending"))+'"><i class="ntss-quest-pill"></i><span>'+esc(name)+'</span></span>';
  }).join("");
  const html='<section class="ntss-quest-path" aria-label="'+esc(title)+'" dir="'+(lang==="ar"?"rtl":"ltr")+'"><div class="ntss-quest-info"><div><span class="ntss-quest-overline">'+title+'</span><strong>'+esc(subtitle)+'</strong></div><span class="ntss-quest-position">'+position+' / 10</span></div><div class="ntss-quest-steps" role="group" aria-label="'+esc(subtitle)+'">'+chunks+'</div></section>';
  body.insertAdjacentHTML("afterbegin",html);
  // Announce stage changes only on actual forward movement; do not interrupt screen readers on re-render.
  const id=mode+":"+(screen.querySelector(".practice-focus__lesson")?.textContent||"")+":"+stage;
  if(seen!==id){seen=id;}
 }
 return {render,stepFromCounter,language,label};
})();