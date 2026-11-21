/* EBDA | per-lesson completion map. Stored only in this browser's localStorage
 * (best score per lesson + timestamp). No answers, no names, no network. */
window.EBDA_PROGRESS=(function(){
 "use strict";
 const KEY="ntss-progress-v1";
 function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||"{}");return v&&typeof v==="object"&&!Array.isArray(v)?v:{}}catch(e){return{}}}
 function write(d){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}}
 function mark(subject,g,u,i,pct){
  if(!subject||!Number.isFinite(pct))return;
  const d=read(),k=[g,u,i].join(":"),cur=Math.max(0,Math.min(100,Math.round(pct)));
  d[subject]=d[subject]||{};
  const prev=d[subject][k];
  if(!prev||cur>prev.pct){d[subject][k]={pct:cur,at:Date.now()};write(d)}
 }
 function get(subject,g,u,i){return read()[subject]?.[[g,u,i].join(":")]||null}
 function clear(){try{localStorage.removeItem(KEY)}catch(e){}}
 return {mark,get,clear};
})();
