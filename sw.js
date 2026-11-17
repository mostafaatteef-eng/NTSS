/* NTSS: limited offline reading and quiz shell; same-origin assets only.
   Does not cache student answers, CDN libraries or executable lab runtimes. */
const CACHE="ntss-static-20261117-v1";
const CORE=["./","./index.html","./app-main.js","./learning-support.js","./learning-concepts.js","./learning-ux.css","./question-factory.js","./practice-workshop.js","./lesson-completion.js","./teacher-review.css","./question-bank-audit.js"];
self.addEventListener("install",event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await Promise.allSettled(CORE.map(path=>cache.add(new Request(new URL(path,self.registration.scope),{cache:"reload"}))));
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
