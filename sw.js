/* EBDA lightweight service worker: cache shell immediately, other same-origin assets on demand.
   No student answers or names are handled or cached here; external WebAssembly runtimes stay network-only. */
const CACHE="ntss-static-20261122-round2";
const CORE=["./","./index.html","./ebda-ui.css"];
const scope=new URL(self.registration.scope);
const root=scope.pathname;
const staticPattern=/\.(?:js|css|png|svg|webp|jpg|jpeg|woff2?)(?:$)/i;
self.addEventListener("install",event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await Promise.allSettled(CORE.map(p=>cache.add(new Request(new URL(p,scope),{cache:"reload"}))));
  await self.skipWaiting();
 })());
});
self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith("ntss-static-")&&key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});
// Offline-ready signal only after the actual HTML-referenced same-origin app shell is cached.
// Run after the page load event; no eager 48-file download during Service Worker installation.
let warming=null;
async function warmAppShell(){
 if(warming)return warming;
 warming=(async()=>{
  const cache=await caches.open(CACHE),indexUrl=new URL("./index.html",scope);
  const cached=await cache.match(indexUrl),htmlResponse=cached||await fetch(indexUrl,{cache:"force-cache"});
  if(!htmlResponse?.ok)throw Error("App shell markup unavailable");
  const html=await htmlResponse.text(),re=/(?:src|href)="([^"]+\.(?:js|css|png|svg|webp|jpg|jpeg)(?:\?[^"]*)?)"/gi;
  const urls=new Set();let m;
  while((m=re.exec(html))){
   const url=new URL(m[1],scope);
   if(url.origin===self.location.origin&&url.pathname.startsWith(root))urls.add(url.href);
  }
  const assets=[...urls],errors=[];
  let position=0;
  async function worker(){
   while(position<assets.length){
    const url=assets[position++];
    try{
     if(await cache.match(url))continue;
     const response=await fetch(new Request(url,{cache:"force-cache"}));
     if(!response.ok||response.type==="opaque")throw Error("Unexpected response");
     await cache.put(url,response);
    }catch(_){errors.push(url)}
   }
  }
  await Promise.all(Array.from({length:Math.min(6,assets.length)},()=>worker()));
  if(errors.length)throw Error(errors.length+" application resources could not be cached");
  return {resources:assets.length};
 })().finally(()=>{warming=null});
 return warming;
}
self.addEventListener("message",event=>{
 if(event.data?.type!=="NTSS_CACHE_SHELL")return;
 event.waitUntil(warmAppShell().then(result=>{
  event.source?.postMessage({type:"NTSS_OFFLINE_READY",resources:result.resources});
 }).catch(()=>{
  event.source?.postMessage({type:"NTSS_OFFLINE_UNAVAILABLE"});
 }));
});
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.method!=="GET")return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin||!url.pathname.startsWith(root))return;
 if(request.mode==="navigate"){
  event.respondWith((async()=>{
   try{
    const fresh=await fetch(request);
    if(fresh.ok){const cache=await caches.open(CACHE);event.waitUntil(cache.put(new URL("./index.html",scope),fresh.clone()))}
    return fresh;
   }catch(_){
    const cache=await caches.open(CACHE);
    return await cache.match(new URL("./index.html",scope))||Response.error();
   }
  })());
  return;
 }
 if(!staticPattern.test(url.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(request);
  if(cached)return cached;
  try{
   const response=await fetch(request);
   if(response.ok&&response.type==="basic")event.waitUntil(cache.put(request,response.clone()));
   return response;
  }catch(_){return Response.error()}
 })());
});
