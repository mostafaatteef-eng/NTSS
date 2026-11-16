/* NTSS educational Python worker: limits and restricted training subset.
   No untrusted code interpreter should be treated as a perfect security sandbox. */
let pyodide;
const PYO_URL="https://cdn.jsdelivr.net/pyodide/v0.28.3/full/";
const MAX_CODE=3000, MAX_OUTPUT=8000;
const CHECK="import ast\n_allowed = {'math','statistics','random','collections','itertools'}\n_blocked = {'eval','exec','compile','open','__import__','input','breakpoint','globals','locals','vars','getattr','setattr','delattr'}\n_tree = ast.parse(_ntss_source, mode='exec')\nif len(list(ast.walk(_tree))) > 1200:\n    raise ValueError('Exercise is too complex; simplify the code.')\nfor _node in ast.walk(_tree):\n    if isinstance(_node, ast.Import):\n        if any(_alias.name.split('.')[0] not in _allowed for _alias in _node.names):\n            raise ValueError('Only math, statistics, random, collections and itertools imports are supported.')\n    if isinstance(_node, ast.ImportFrom):\n        if (_node.module or '').split('.')[0] not in _allowed or _node.level:\n            raise ValueError('This Python module is not supported.')\n    if isinstance(_node, ast.Attribute) and _node.attr.startswith('__'):\n        raise ValueError('Private runtime attributes are not available.')\n    if isinstance(_node, ast.Name) and (_node.id.startswith('__') or _node.id in _blocked):\n        raise ValueError('This Python capability is not supported in the lab.')";
self.onmessage=async ({data})=>{
 const out=[];
 try{
  if(typeof data?.code!=="string"||data.code.length>MAX_CODE)throw Error("Python exercise limit: 3,000 characters.");
  if(!pyodide){importScripts(PYO_URL+"pyodide.js");pyodide=await loadPyodide({indexURL:PYO_URL});}
  pyodide.setStdout({batched:s=>{if(out.join("\n").length<MAX_OUTPUT)out.push(String(s).slice(0,MAX_OUTPUT))}});
  pyodide.setStderr({batched:s=>{if(out.join("\n").length<MAX_OUTPUT)out.push(String(s).slice(0,MAX_OUTPUT))}});
  pyodide.globals.set("_ntss_source",data.code);
  pyodide.runPython(CHECK);
  const result=await pyodide.runPythonAsync(data.code);
  if(result!==undefined&&result!==null&&out.length===0)out.push(String(result));
  if(result?.destroy)result.destroy();
  self.postMessage({ok:true,output:out.join("\n").slice(0,MAX_OUTPUT)||"(Executed. No printed output)"});
 }catch(e){self.postMessage({ok:false,output:(out.join("\n")+"\n"+String(e?.message||e)).slice(0,1000)})}
 finally{try{pyodide?.globals.delete("_ntss_source")}catch(_){}}
};
