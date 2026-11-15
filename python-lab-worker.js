/* Worker isolation keeps student Python code off the UI thread. */
let pyodide;
self.onmessage=async ({data})=>{
 const out=[];try{
  if(!pyodide){importScripts("https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.js");pyodide=await loadPyodide({indexURL:"https://cdn.jsdelivr.net/pyodide/v0.28.3/full/"});}
  pyodide.setStdout({batched:s=>{if(out.join("").length<12000)out.push(s)}});
  pyodide.setStderr({batched:s=>{if(out.join("").length<12000)out.push(s)}});
  const result=await pyodide.runPythonAsync(String(data.code).slice(0,10000));
  if(result!==undefined&&result!==null&&out.length===0)out.push(String(result));
  if(result?.destroy)result.destroy();
  self.postMessage({ok:true,output:out.join("\n").slice(0,12000)||"(Executed. No printed output)"});
 }catch(e){self.postMessage({ok:false,output:out.join("\n")+"\n"+String(e).slice(0,1300)})}
};