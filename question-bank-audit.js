/* EBDA question bank quality audit. Static structural checks are not scientific validation.
   Teacher feedback is local until explicitly exported and reviewed in GitHub. */
window.NTSS_BANK_AUDIT=(function(){
 const engines={ai:"EBDAA_QUESTION_FACTORY",math:"EBDAA_MATH_PRACTICE",en:"EBDAA_ENGLISH_PRACTICE",ar:"EBDAA_ARABIC_PRACTICE",de:"EBDAA_GERMAN_PRACTICE",physics:"EBDAA_PHYSICS_PRACTICE",business:"EBDAA_BUSINESS_PRACTICE",economics:"EBDAA_ECONOMICS_PRACTICE",civics:"EBDAA_CIVICS_PRACTICE",social:"EBDAA_SOCIAL_STUDIES_PRACTICE"};
 const notes=new Map();
 const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const norm=x=>String(x??"").normalize("NFKC").toLowerCase().replace(/\s+/g," ").trim();
 function questions(subject,g,u,i){
   const eng=window[engines[subject]];
   if(!eng)throw Error("Question engine not available");
   const list=subject==="ai"?eng.all(g,u,i):eng.build(g,u,i);
   if(!Array.isArray(list))throw Error("Question bank returned invalid data");
   return list;
 }
 function audit(subject,g,u,i){
   const list=questions(subject,g,u,i),seen=new Map();
   const items=list.map((q,index)=>{
     const prompt=String(q.question??q.prompt??q.stem??"").trim(),answer=q.answer??q.value;
     const issues=[];
     if(!prompt||prompt.length<12)issues.push("Question text missing or unusually short");
     if(answer===undefined||answer===null||String(answer).trim()==="")issues.push("Missing answer key");
     const choices=Array.isArray(q.options)?q.options:Array.isArray(q.choices)?q.choices:null;
     if(choices&&new Set(choices.map(norm)).size!==choices.length)issues.push("Repeated options");
     if(q.mode==="order"&&typeof answer!=="string")issues.push("Unexpected ordering answer format");
     const signature=norm(prompt).replace(/\b\d+(?:\.\d+)?\b/g,"#");
     if(seen.has(signature))issues.push("Similar question template (#"+(seen.get(signature)+1)+")");
     else seen.set(signature,index);
     const key=[subject,g,u,i,index].join(":");
     return {index,prompt,answer,options:choices||[],explanation:String(q.explanation??q.explain??"").slice(0,1000),sourceStatus:String(q.sourceStatus??"").slice(0,280),issues,review:notes.get(key)||{status:"unreviewed",comment:""}};
   });
   return {subject,grade:g,unit:u,lesson:i,count:list.length,issues:items.reduce((n,q)=>n+q.issues.length,0),items,status:"Automatic structural screening only; academic accuracy and curriculum alignment require a subject teacher."};
 }
 function mark(subject,g,u,i,index,status,comment){
   if(!["unreviewed","approved","revise"].includes(status))return;
   const key=[subject,g,u,i,index].join(":");
   notes.set(key,{status,comment:String(comment||"").slice(0,600)});
 }
 function exportReport(subject,g,u,i){
   const result=audit(subject,g,u,i);
   const blob=new Blob([JSON.stringify({type:"NTSS_TEACHER_REVIEW",exportedAt:new Date().toISOString(),...result},null,2)],{type:"application/json"});
   const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="ntss-review-"+subject+"-"+g+"-"+u+"-"+i+".json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
 }
 return {engines,questions,audit,mark,exportReport,escape};
})();