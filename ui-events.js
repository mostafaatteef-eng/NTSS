/* Bind callbacks from trusted application code without executable HTML attributes.
   Generated HTML carries opaque IDs only. No handler text is parsed or evaluated.
   Once an element is mounted, its listener owns the callback and the pending entry
   is deleted. Unmounted/discarded template callbacks expire after one minute. */
window.NTSS_EVENTS=(function(){
 const types=new Set(['click','input','change','toggle','keydown','submit']);
 const pending=new Map(),mounted=new WeakMap();
 let sequence=0,queued=false,cleanupTimer=null;
 function mount(root=document){
  if(!root)return;
  for(const type of types){
   const attr='data-ntss-'+type;
   const nodes=[];
   if(root.nodeType===1&&root.hasAttribute(attr))nodes.push(root);
   if(typeof root.querySelectorAll==='function')nodes.push(...root.querySelectorAll('['+attr+']'));
   for(const node of nodes){
    const id=node.getAttribute(attr),entry=pending.get(id);
    if(!entry||entry.type!==type)continue;
    let listeners=mounted.get(node);if(!listeners){listeners=new Map();mounted.set(node,listeners)}
    const previous=listeners.get(type);if(previous)node.removeEventListener(type,previous);
    const listener=function(event){const result=entry.callback.call(this,event);if(result===false)event.preventDefault()};
    node.addEventListener(type,listener);listeners.set(type,listener);pending.delete(id);
   }
  }
 }
 function schedule(){
  if(!queued){queued=true;queueMicrotask(()=>{queued=false;mount(document)})}
  if(cleanupTimer===null&&typeof setTimeout==='function'){
   cleanupTimer=setTimeout(function clean(){
    cleanupTimer=null;const cutoff=Date.now()-60000;
    for(const [id,entry] of pending)if(entry.created<=cutoff)pending.delete(id);
    if(pending.size)schedule();
   },60000);
   cleanupTimer?.unref?.();
  }
 }
 function bind(type,callback,label=''){
  if(!types.has(type)||typeof callback!=='function')throw TypeError('Expected a supported UI event and a callback');
  if(label&&!/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(label))throw TypeError('Invalid UI action label');
  const id='ui'+(++sequence);
  pending.set(id,{type,callback,created:Date.now()});schedule();
  return 'data-ntss-'+type+'="'+id+'"'+(label?' data-ntss-action="'+label+'"':'');
 }
 if(typeof MutationObserver==='function'&&document.documentElement){
  new MutationObserver(records=>{
   for(const record of records){
    if(record.type==='attributes')mount(record.target);
    else for(const node of record.addedNodes)if(node.nodeType===1)mount(node);
   }
  }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:[...types].map(t=>'data-ntss-'+t)});
 }
 return {bind,mount};
})();
