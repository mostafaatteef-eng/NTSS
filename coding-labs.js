window.EBDAA_CODE_LABS=(function(){
const challenges={
 python:[
 ["Variables","Create a variable score = 75 and print score + 10.","score = 75\nprint(score + 10)","85"],
 ["Average","Print the mean of 70, 80 and 90.","scores = [70,80,90]\nprint(sum(scores)/len(scores))","80.0"],
 ["Filtering","Print only numbers over 80.","scores = [64,91,75,88,95]\nprint([x for x in scores if x>80])","[91, 88, 95]"],
 ["Functions","Create a function double and print double(12).","def double(x):\n    return x * 2\nprint(double(12))","24"],
 ["Frequency","Count how often 'AI' occurs.","topics=['AI','SQL','AI','Python','AI']\nprint(topics.count('AI'))","3"],
 ["Prediction","Print 2*x+3 when x=7.","x=7\nprint(2*x+3)","17"]
 ],
 sql:[
 ["SELECT + WHERE","Show names and grades >= 85, highest first.","SELECT name, grade FROM students WHERE grade >= 85 ORDER BY grade DESC;",[["Nour",95],["Mona",91],["Salma",88]]],
 ["COUNT","Count students from Cairo.","SELECT COUNT(*) FROM students WHERE city = 'Cairo';",[[2]]],
 ["GROUP BY","Count students per city, sorted by city.","SELECT city,COUNT(*) FROM students GROUP BY city ORDER BY city;",[["Alexandria",1],["Cairo",2],["Giza",2]]],
 ["JOIN","Show student name and project topic, alphabetical by name.","SELECT s.name,p.topic FROM students s JOIN projects p ON s.id=p.student_id ORDER BY s.name;",[["Mona","Python"],["Nour","AI"],["Salma","SQL"]]],
 ["AVG","Calculate average grade, rounded to one decimal.","SELECT ROUND(AVG(grade),1) FROM students;",[[82.6]]],
 ["LIMIT","Find the two students with highest grades.","SELECT name,grade FROM students ORDER BY grade DESC LIMIT 2;",[["Nour",95],["Mona",91]]]
 ]
};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let kind="python",grade=1,unit=0,lesson=0,selection={python:0,sql:0},codes={python:"",sql:""},worker=null,timer=null,busy=false,result=null,feedback="",runId=0;
function task(){return challenges[kind][selection[kind]]}
function update(){window.EBDA_APP_RENDER?.()}
function stop(){if(timer)clearTimeout(timer);timer=null;if(worker)worker.terminate();worker=null;busy=false}
function start(g,u,i,type){stop();grade=g;unit=u;lesson=i;kind=type==="sql"?"sql":"python";codes[kind]=task()[2];result=null;feedback="";update()}
function switchTo(type){stop();kind=type;if(!codes[kind])codes[kind]=task()[2];result=null;feedback="";update()}
function choose(n){stop();selection[kind]=Math.min(5,Math.max(0,Number(n)||0));codes[kind]=task()[2];result=null;feedback="";update()}
function edit(value){codes[kind]=String(value).slice(0,10000)}
function reset(){codes[kind]=task()[2];result=null;feedback="";update()}
function check(reply,mode,t){
 if(!reply.ok)return false;
 if(mode==="python")return String(reply.output||"").split("\n").some(x=>x.trim()===t[3]);
 return JSON.stringify(reply.results?.[0]?.values)===JSON.stringify(t[3]);
}
function run(){
 if(busy)return;
 stop();const selected=kind,t=task(),source=codes[kind],id=++runId;
 busy=true;feedback="Loading "+(selected==="python"?"Python":"SQLite")+" and running…";result=null;update();
 try{
  worker=new Worker(selected==="python"?"python-lab-worker.js":"sql-lab-worker.js");
  timer=setTimeout(()=>{if(id!==runId)return;stop();feedback="Execution timeout. Check for an infinite loop or slow runtime download.";update()},35000);
  worker.onmessage=e=>{if(id!==runId)return;const data=e.data,passed=check(data,selected,t);stop();result={...data,passed};feedback=data.ok?(passed?"✓ Challenge passed":"Code ran — compare the output and try the challenge again"):"Execution failed — see the error below";update()};
  worker.onerror=e=>{if(id!==runId)return;stop();result={ok:false,output:String(e.message||"Runtime loading error")};feedback="Cannot load runtime. Check internet and WebAssembly support.";update()};
  worker.postMessage({code:source});
 }catch(e){stop();result={ok:false,output:String(e)};feedback="Web Worker not available." ;update()}
}
function output(){
 if(!result)return '<p>Run the code to see the result.</p>';
 if(result.results?.length)return result.results.map(r=>'<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr>'+r.columns.map(x=>'<th style="text-align:left;padding:9px;border-bottom:2px solid #ddd">'+esc(x)+'</th>').join("")+'</tr></thead><tbody>'+r.values.map(row=>'<tr>'+row.map(x=>'<td style="padding:9px;border-bottom:1px solid #ddd">'+esc(x===null?"NULL":x)+'</td>').join("")+'</tr>').join("")+'</tbody></table></div>').join("");
 return '<pre style="white-space:pre-wrap;overflow-wrap:anywhere">'+esc(result.output||"No output rows.")+'</pre>';
}
function render(){
 const t=task(),u=grade===1?window.EBDAA_DATA.sessions.filter(x=>x.unit===unit+1)[lesson]?.title:window.EBDAA_GRADES.grades[grade-1].subjects[0].units[unit]?.sessions[lesson];
 return '<section class="practice-focus"><header class="practice-focus__header"><div class="practice-focus__header-row"><button class="practice-focus__exit" onclick="closeCodeLab()">← Back to lessons</button><span class="practice-focus__year">YEAR '+grade+' · AI & DATA</span></div><div class="practice-focus__info"><h1 class="practice-focus__lesson">Coding Laboratory</h1><span class="practice-focus__counter">'+esc(u||"Practical exercises")+'</span></div></header><div class="practice-focus__content" style="max-width:1000px;margin:0 auto"><div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px"><button class="btn '+(kind==="python"?"teal":"light")+'" onclick="EBDAA_CODE_LABS.switchTo(\'python\')">🐍 Python Lab</button><button class="btn '+(kind==="sql"?"teal":"light")+'" onclick="EBDAA_CODE_LABS.switchTo(\'sql\')">🗄 SQL Lab</button><button class="btn light" onclick="backToAIQuestions()">Return to questions →</button></div><div class="hint"><strong>'+esc(t[0])+'</strong><p>'+esc(t[1])+'</p></div><div style="display:flex;flex-wrap:wrap;gap:7px;margin:16px 0">'+challenges[kind].map((v,i)=>'<button class="btn '+(selection[kind]===i?"teal":"light")+'" style="font-size:12px;padding:9px 12px" onclick="EBDAA_CODE_LABS.choose('+i+')">Task '+(i+1)+'</button>').join("")+'</div><label for="coding-editor"><b>Write your '+(kind==="python"?"Python":"SQL")+' code</b></label><textarea id="coding-editor" spellcheck="false" autocorrect="off" autocapitalize="off" style="display:block;box-sizing:border-box;width:100%;min-height:260px;margin:10px 0 16px;padding:16px;border:1px solid #263c49;border-radius:14px;resize:vertical;background:#11212c;color:#e3f5ed;font:14px/1.65 monospace;tab-size:4" oninput="EBDAA_CODE_LABS.edit(this.value)">'+esc(codes[kind])+'</textarea><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><button class="btn teal" '+(busy?"disabled":"")+' onclick="EBDAA_CODE_LABS.run()">▶ Run Code</button><button class="btn light" onclick="EBDAA_CODE_LABS.reset()">↺ Reset</button><span role="status">'+esc(feedback)+'</span></div><div class="hint" style="margin-top:18px"><strong>Output</strong>'+output()+(result?.passed?'<p><b>✓ Correct output</b></p>':'')+'</div><p class="muted" style="font-size:12px;margin-top:18px">Python runs through Pyodide WebAssembly; SQL uses SQLite via sql.js (not MySQL). Sample data are fictional and SQL resets for each run. External libraries require internet; code runs locally in isolated workers. Do not enter passwords, personal data or secret keys. Code from untrusted sources is unsafe.</p></div></section>';
}
return {start,switchTo,choose,edit,reset,run,stop,render,challenges};
})();