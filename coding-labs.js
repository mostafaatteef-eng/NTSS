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
const text=k=>window.EBDA_I18N.t(k);
let embedded=false;
let kind="python",grade=1,unit=0,lesson=0,selection={python:0,sql:0},codes={python:"",sql:""},worker=null,timer=null,busy=false,result=null,feedback="",runId=0;
function task(){return challenges[kind][selection[kind]]}
function update(){window.EBDA_APP_RENDER?.()}
function stop(){runId++;if(timer)clearTimeout(timer);timer=null;if(worker)worker.terminate();worker=null;busy=false}
function start(g,u,i,type,options={}){embedded=!!options.embedded;stop();grade=g;unit=u;lesson=i;kind=type==="sql"?"sql":"python";codes[kind]=task()[2];result=null;feedback="";update()}
function switchTo(type){stop();kind=type;if(!codes[kind])codes[kind]=task()[2];result=null;feedback="";update()}
function choose(n){stop();selection[kind]=Math.min(5,Math.max(0,Number(n)||0));codes[kind]=task()[2];result=null;feedback="";update()}
function edit(value){codes[kind]=String(value).slice(0,kind==="python"?3000:2000)}
function reset(){codes[kind]=task()[2];result=null;feedback="";update()}
function check(reply,mode,t){
 if(!reply.ok)return false;
 if(mode==="python")return String(reply.output||"").split("\n").some(x=>x.trim()===t[3]);
 return JSON.stringify(reply.results?.[0]?.values)===JSON.stringify(t[3]);
}
function run(){
 if(busy)return;
 stop();const selected=kind,t=task(),source=codes[kind],id=++runId;
 busy=true;feedback="loading";result=null;update();
 try{
  worker=new Worker(selected==="python"?"python-lab-worker.js":"sql-lab-worker.js");
  timer=setTimeout(()=>{if(id!==runId)return;stop();feedback="timeout";update()},35000);
  worker.onmessage=e=>{if(id!==runId)return;const data=e.data&&typeof e.data==="object"?e.data:{ok:false,output:"Invalid worker response"};const passed=check(data,selected,t);stop();result={...data,passed};feedback=data.ok?(passed?"passed":"retry"):"failed";update()};
  worker.onerror=e=>{if(id!==runId)return;stop();result={ok:false,output:String(e.message||"Runtime loading error")};feedback="runtime_error";update()};
  worker.postMessage({code:String(source).slice(0,selected==="python"?3000:2000)});
 }catch(e){stop();result={ok:false,output:String(e)};feedback="worker_error" ;update()}
}
function output(){
 if(!result)return '<p>'+text("lab_output_empty")+'</p>';
 if(result.results?.length)return result.results.map(r=>'<div class="coding-lab__table" dir="ltr"><table><thead><tr>'+r.columns.map(x=>'<th>'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+r.values.map(row=>'<tr>'+row.map(x=>'<td>'+esc(x===null?'NULL':x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>').join('');
 return '<pre class="coding-lab__output" dir="ltr">'+esc(result.output||text("lab_no_rows"))+'</pre>';
}
function render(options={}){
 const inline=options.embedded??embedded;
 const language=kind==="python"?'Python':'SQL';
 const titles=text("lab_task_titles_"+kind),instructions=text("lab_task_instructions_"+kind);
 const t=task();
 const header=inline?'':'<header class="practice-focus__header"><div class="practice-focus__header-row"><button class="practice-focus__exit" onclick="closeCodeLab()">'+text("lab_back_subject")+'</button><span class="practice-focus__year">'+text("year_tag")(grade)+' · '+text("lab_free_title")+'</span></div><h1 class="practice-focus__lesson">'+text("lab_title")+'</h1></header>';
 return '<section class="coding-lab '+(inline?'coding-lab--embedded':'practice-focus')+'" dir="'+(window.EBDA_I18N.current()==='ar'?'rtl':'ltr')+'">'+header+'<div class="practice-focus__content coding-lab__content">'+
 '<div class="coding-lab__top"><h2>'+text("lab_title")+'</h2><button class="btn light coding-lab__language" onclick="EBDA_I18N.toggle()">'+(window.EBDA_I18N.current()==='ar'?'English':'عربي')+'</button></div>'+
 '<p class="coding-lab__notice">'+text(inline?"lab_shared_note":"lab_free_note")+'</p><div class="coding-lab__modes" role="group" aria-label="'+text("lab_language")+'">'+['python','sql'].map(x=>'<button class="btn '+(kind===x?'teal':'light')+'" aria-pressed="'+(kind===x)+'" onclick="EBDAA_CODE_LABS.switchTo(&#39;'+x+'&#39;)">'+(x==='python'?'Python':'SQL')+'</button>').join('')+'</div>'+
 '<div class="hint"><strong>'+esc(titles[selection[kind]])+'</strong><p>'+esc(instructions[selection[kind]])+'</p></div>'+
 '<div class="coding-lab__tasks" role="group" aria-label="'+text("lab_tasks")+'">'+challenges[kind].map((v,i)=>'<button class="btn '+(selection[kind]===i?'teal':'light')+'" aria-pressed="'+(selection[kind]===i)+'" onclick="EBDAA_CODE_LABS.choose('+i+')">'+text("lab_task")+' '+(i+1)+'</button>').join('')+'</div>'+
 '<label for="coding-editor"><b>'+text("lab_write")+' <bdi>'+language+'</bdi></b></label><textarea id="coding-editor" dir="ltr" spellcheck="false" autocorrect="off" autocapitalize="off" oninput="EBDAA_CODE_LABS.edit(this.value)">'+esc(codes[kind])+'</textarea>'+
 '<div class="coding-lab__actions"><button class="btn teal" '+(busy?'disabled':'')+' onclick="EBDAA_CODE_LABS.run()">▶ '+text("lab_run")+'</button><button class="btn light" onclick="EBDAA_CODE_LABS.reset()">↺ '+text("lab_reset")+'</button><span role="status">'+(feedback?esc(text("lab_status_"+feedback)):'')+'</span></div>'+
 '<div class="hint coding-lab__results"><strong>'+text("lab_output")+'</strong>'+output()+(result?.passed?'<p><b>✓ '+text("lab_correct")+'</b></p>':'')+'</div>'+
 '<button class="btn light" onclick="closeCodeLab()">'+text(inline?"lab_return_stage":"lab_back_subject")+'</button><p class="coding-lab__safety">'+text("lab_safety")+'</p></div></section>';
}
return {start,switchTo,choose,edit,reset,run,stop,render,challenges};
})();
