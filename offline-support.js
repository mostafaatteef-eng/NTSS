/* Progressive enhancement: best-effort offline course shell; no student data sent. */
window.NTSS_OFFLINE=(function(){
 let state="Checking offline availability";
 function register(){
  if(!("serviceWorker" in navigator)||location.protocol!=="https:"&&!["localhost","127.0.0.1","[::1]"].includes(location.hostname)){state="Offline caching not supported";return}
  navigator.serviceWorker.register("./sw.js",{scope:"./"}).then(()=>{state="Learning pages can be cached for weak connections";document.documentElement.dataset.offlineReady="true"}).catch(()=>{state="Online connection required"});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",register,{once:true});else register();
 return {status:()=>state};
})();