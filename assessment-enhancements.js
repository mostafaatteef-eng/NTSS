/* EBDA scored assessment extensions: local coding, visual reasoning, and clean feedback. */
window.NTSS_ASSESSMENT=(function(){
 const safe=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const python=[
 {task:"Write Python that prints the average of these three scores.",starter:"scores = [70, 80, 90]\nprint()",expected:"80.0",solution:"Use sum(scores) / len(scores) inside print()."},
 {task:"Print the square of 7 using Python.",starter:"n = 7\nprint()",expected:"49",solution:"Multiply n by n, or use n ** 2."},
 {task:"Count how many scores are greater than 80.",starter:"scores = [64, 91, 75, 88, 95]\nprint()",expected:"3",solution:"Count values for which x > 80."},
 {task:"Print the sum of the first five positive integers.",starter:"values = [1, 2, 3, 4, 5]\nprint()",expected:"15",solution:"Use sum(values) or a for loop."},
 {task:"Print the number of times AI appears in the list.",starter:"topics = ['AI', 'SQL', 'AI', 'Python', 'AI']\nprint()",expected:"3",solution:"Use topics.count('AI')."}
 ];
 const sql=[
 {task:"Show names of students whose grade is at least 85, highest grade first.",starter:"SELECT name FROM students",expected:[["Nour"],["Mona"],["Salma"]],solution:"SELECT name FROM students WHERE grade >= 85 ORDER BY grade DESC;"},
 {task:"Count the students from Cairo.",starter:"SELECT COUNT(*) FROM students",expected:[[2]],solution:"SELECT COUNT(*) FROM students WHERE city='Cairo';"},
 {task:"Count students in each city, ordered alphabetically.",starter:"SELECT city, COUNT(*) FROM students",expected:[["Alexandria",1],["Cairo",2],["Giza",2]],solution:"SELECT city, COUNT(*) FROM students GROUP BY city ORDER BY city;"},
 {task:"Show students' names and project topics ordered alphabetically by student name.",starter:"SELECT s.name, p.topic FROM students s",expected:[["Mona","Python"],["Nour","AI"],["Salma","SQL"]],solution:"SELECT s.name, p.topic FROM students s JOIN projects p ON s.id=p.student_id ORDER BY s.name;"},
 {task:"Show the two highest student grades, highest first.",starter:"SELECT name, grade FROM students",expected:[["Nour",95],["Mona",91]],solution:"SELECT name, grade FROM students ORDER BY grade DESC LIMIT 2;"}
 ];
 function enhance(all,g,u,i){
  return all.map((base,index)=>{
   const slot=index%10,cycle=Math.floor(index/10);
   if(slot===4){
    const label=String(base.title||"")+" "+String(base.unit||"");
    const engine=window.EBDAA_PERFORMANCE?.[g+"-"+(u+1)]?.engine||"";
    const kind=/sql|database|relational|query|normaliz/i.test(label+" "+engine)?"sql":/python|script|program|algorithm|function/i.test(label+" "+engine)?"python":cycle%2?"sql":"python";
    const task=(kind==="sql"?sql:python)[(cycle+i+u)%5];
    return {...base,mode:"live-code",engine:kind,codeTask:task,question:(kind==="sql"?"🗄 SQL Challenge — ":"🐍 Python Challenge — ")+task.task,
      options:[],answer:"pass",explanation:task.solution,sourceStatus:"Original assessed coding task executed inside a browser worker using fictional data."};
   }
   if(slot===6){
    const family=String(base.unit||"")+" "+String(base.title||"");
    const steps=/sql|database|relational/i.test(family)?["Inspect schema","Write SELECT query","Run read-only query","Interpret resulting rows"]:
      /python|program|script|algorithm/i.test(family)?["Understand input","Write the algorithm","Execute the program","Verify output"]:
      ["Inspect source data","Choose a suitable method","Apply the method","Validate the result"];
    return {...base,mode:"order",question:"🧩 Put these four steps in the correct order for this lesson.",
      options:[steps[2],steps[0],steps[3],steps[1]],answer:steps.join("|"),
      explanation:"A sound workflow follows "+steps.join(" → ")+".",sourceStatus:"Original sequence-building question aligned with the lesson's general workflow."};
   }
   if(slot===2||slot===7){
    const readings=[5+(index+u)%5,9+(index+i)%6,14+(cycle%4),19+(u%5)];
    const threshold=12+(i%3);
    const count=readings.filter(x=>x>threshold).length;
    const options=[0,1,2,3,4].filter(v=>Math.abs(v-count)<3).slice(0,4);
    if(!options.includes(count))options[0]=count;
    while(options.length<4)options.push([0,1,2,3,4].find(v=>!options.includes(v)));
    const sorted=options.sort((a,b)=>a-b).map(String);
    return {...base,mode:"visual-data",question:"📊 Data Detective — How many sensor readings are strictly above "+threshold+"?",visual:{readings,threshold},options:sorted,answer:String(count),
      explanation:"Readings: "+readings.join(", ")+". Only values greater than "+threshold+" count. Correct answer: "+count+".",
      sourceStatus:"Original visual reasoning question using synthetic factory sensor readings."};
   }
   return base;
  });
 }
 function visual(q,probe){
  const v=q.visual;if(!v)return "";
  const max=Math.max(...v.readings,24),selected=Number.isFinite(probe)?probe:v.threshold;
  return '<div class="ntss-data-card"><div class="ntss-chart-head"><b>Factory sensor readings</b><span>Explore the threshold</span></div>'+
   '<div class="ntss-chart" role="img" aria-label="Sensor readings: '+safe(v.readings.join(", "))+'">'+
   v.readings.map((n,j)=>'<div class="ntss-chart-item"><strong>'+n+'</strong><div class="ntss-chart-track"><div class="ntss-chart-bar '+(n>selected?"is-high":"")+'" style="height:'+Math.round(100*n/max)+'%"></div></div><small>S'+(j+1)+'</small></div>').join("")+'</div>'+
   '<label class="ntss-probe-label" for="ntss-probe">Explore threshold: <output>'+selected+'</output></label>'+
   '<input id="ntss-probe" aria-label="Explore threshold; the question uses its original value" type="range" min="5" max="22" step="1" value="'+selected+'" oninput="EBDAA_PRACTICE.probe(this.value)">'+
   '<p class="ntss-probe-note">Explore freely; answer using the fixed threshold of <b>'+v.threshold+'</b> stated in the question.</p></div>';
 }
 function codePanel(q,draft,running,message){
  const isSQL=q.engine==="sql";
  return '<section class="ntss-live-code" aria-label="Executable '+(isSQL?"SQL":"Python")+' question">'+
   '<label for="ntss-code-editor">Write your '+(isSQL?"SQL SELECT":"Python")+' solution</label>'+
   '<textarea id="ntss-code-editor" spellcheck="false" autocorrect="off" autocapitalize="off" autocomplete="off" rows="6" maxlength="'+(isSQL?2000:3000)+'" oninput="EBDAA_PRACTICE.codeInput(this.value)">'+safe(draft)+'</textarea>'+
   '<div class="ntss-code-actions"><button class="btn teal" type="button" '+(running?"disabled":"")+' onclick="EBDAA_PRACTICE.runCode()">▶ '+(running?"Running…":"Run & check")+'</button>'+
   '<span role="status">'+safe(message||"Your first executable submission counts as this question's answer.")+'</span></div>'+
   '<small>Runs locally in a time-limited worker. Sample data are fictional. Do not enter personal data or passwords.</small></section>';
 }
 function run(q,code,callback){
  const kind=q.engine;let worker,timeout,settled=false;
  function finish(result){if(settled)return;settled=true;clearTimeout(timeout);worker?.terminate();callback(result)}
  try{
   if(!code.trim())return finish({runtimeError:true,message:"Write code before running."});
   if(code.length>(kind==="sql"?2000:3000))return finish({runtimeError:true,message:"The code exceeds the exercise limit."});
   worker=new Worker(kind==="sql"?"sql-lab-worker.js":"python-lab-worker.js");
   timeout=setTimeout(()=>finish({runtimeError:true,message:"Runtime timed out. Check your code and try again."}),35000);
   worker.onerror=()=>finish({runtimeError:true,message:"Runtime failed to load. Check your connection and retry."});
   worker.onmessage=event=>{
    const r=event.data||{},task=q.codeTask;
    if(!r.ok)return finish({runtimeError:false,passed:false,message:String(r.output||"Execution error").slice(0,400)});
    if(kind==="python"){
     const got=String(r.output||"").trim();
     return finish({runtimeError:false,passed:got===String(task.expected),message:"Output: "+got.slice(0,200)+(got===String(task.expected)?" · Test passed":" · Expected: "+task.expected)});
    }
    const got=r.results?.[0]?.values||[];
    const passed=JSON.stringify(got)===JSON.stringify(task.expected);
    finish({runtimeError:false,passed,message:(passed?"Query passed":"Query result differs from the expected rows")+" · "+JSON.stringify(got).slice(0,230)});
   };
   worker.postMessage({code});
  }catch(err){finish({runtimeError:true,message:String(err?.message||err)})}
  return ()=>finish({runtimeError:true,message:"Cancelled"});
 }
 return {enhance,visual,codePanel,run};
})();