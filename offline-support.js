/* Progressive enhancement: best-effort offline course shell; no student data sent. */
window.NTSS_OFFLINE=(function(){
 let state="Checking offline availability";
 function register(){
  if(!("serviceWorker" in navigator)||location.protocol!=="https:"&&!["localhost","127.0.0.1","[::1]"].includes(location.hostname)){state="Offline caching not supported";return}
  navigator.serviceWorker.addEventListener("message",event=>{
   if(event.data?.type==="NTSS_OFFLINE_READY"){
    state="Basic lessons are available for offline reading";
    document.documentElement.dataset.offlineReady="true";
   }else if(event.data?.type==="NTSS_OFFLINE_UNAVAILABLE"){
    state="Some resources require an internet connection";
   }
  });
  navigator.serviceWorker.register("./sw.js",{scope:"./"}).then(async()=>{
   state="Preparing offline lessons after page load";
   const ready=await navigator.serviceWorker.ready;
   const request=()=>{
    // Optional background caching happens after first paint, never during HTML parsing.
    (navigator.serviceWorker.controller||ready.active)?.postMessage({type:"NTSS_CACHE_SHELL"});
   };
   if(document.readyState==="complete")request();
   else window.addEventListener("load",request,{once:true});
  }).catch(()=>{state="Online connection required"});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",register,{once:true});else register();
 return {status:()=>state};
})();