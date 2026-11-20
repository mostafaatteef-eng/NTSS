/* NTSS: limited offline reading and quiz shell; same-origin assets only.
   Does not cache student answers, CDN libraries or executable lab runtimes. */
const CACHE="ntss-static-20261120-advanced-qa-v4";
const CORE=["./","./index.html","./app-main.js","./learning-support.js","./learning-concepts.js","./learning-ux.css","./question-factory.js","./assessment-enhancements.js","./practice-workshop.js","./lesson-completion.js","./teacher-review.css","./question-bank-audit.js"];
self.addEventListener("install",event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  // Pre-cache the exact versioned same-origin script/style URLs from the current HTML.
  // First visit may be uncontrolled, so caching only unversioned names is insufficient.
  let resources=[...CORE];
  try{
   const response=await fetch(new URL("./index.html",self.registration.scope),{cache:"reload"});
   if(response.ok){
    const html=await response.text();
    const matches=[...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css|png|svg|webp|jpg|jpeg)(?:\?[^"]*)?)"/gi)];
    for(const match of matches.slice(0,150)){
      const url=new URL(match[1],self.registration.scope);
      if(url.origin===self.location.origin&&url.pathname.startsWith(new URL(self.registration.scope).pathname))resources.push(url.href);
    }
   }
  }catch(_){}
  await Promise.allSettled([...new Set(resources.map(path=>new URL(path,self.registration.scope).href))].map(url=>cache.add(new Request(url,{cache:"reload"}))));
  await self.skipWaiting();
 })());
});
self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{
  const names=await caches.keys();
  await Promise.all(names.filter(x=>x.startsWith("ntss-static-")&&x!==CACHE).map(x=>caches.delete(x)));
  await self.clients.claim();
 })());
});
self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET"||new URL(req.url).origin!==self.location.origin)return;
 const url=new URL(req.url);
 if(!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 if(req.mode==="navigate"){
  event.respondWith((async()=>{
   try{
    const response=await fetch(req);
    if(response.ok){const cache=await caches.open(CACHE);await cache.put(new URL("./index.html",self.registration.scope),response.clone())}
    return response;
   }catch(e){
    const cache=await caches.open(CACHE);
    return await cache.match(new URL("./index.html",self.registration.scope))||Response.error();
   }
  })());return;
 }
 if(!/\.(?:js|css|png|svg|webp|jpg|jpeg|woff2?)(?:$)/i.test(url.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(req);
  if(cached)return cached;
  try{const response=await fetch(req);if(response.ok&&response.type==="basic")await cache.put(req,response.clone());return response}
  catch(e){return Response.error()}
 })());
});
