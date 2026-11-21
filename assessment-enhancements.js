/* EBDA scored assessment extensions: local coding, visual reasoning, and clean feedback. */
window.NTSS_ASSESSMENT=(function(){
 const safe=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const python=[
 {task:"Define average(values) to return the arithmetic mean of a non-empty list.",starter:"def average(values):\n    pass",tests:[["average([70,80,90])",80],["average([2,4,6])",4],["average([10,20])",15]],solution:"Return sum(values) / len(values)."},
 {task:"Define square(n) to return n squared.",starter:"def square(n):\n    pass",tests:[["square(7)",49],["square(0)",0],["square(-4)",16]],solution:"Return n * n or n ** 2."},
 {task:"Define count_high(scores) to count values strictly greater than 80.",starter:"def count_high(scores):\n    pass",tests:[["count_high([64,91,75,88,95])",3],["count_high([80,80,80])",0],["count_high([81,100])",2]],solution:"Use sum(x > 80 for x in scores)."},
 {task:"Define total(values) to return the sum of a list.",starter:"def total(values):\n    pass",tests:[["total([1,2,3,4,5])",15],["total([])",0],["total([-2,2,6])",6]],solution:"Return sum(values), or accumulate values in a loop."},
 {task:"Define count_ai(topics) to count occurrences of 'AI'.",starter:"def count_ai(topics):\n    pass",tests:[["count_ai(['AI','SQL','AI','Python','AI'])",3],["count_ai(['SQL'])",0],["count_ai(['AI'])",1]],solution:"Return topics.count('AI')."}
 ];
 const sql=[
 {task:"Show names of students whose grade is at least 85, highest grade first.",starter:"SELECT name FROM students",expected:[["Nour"],["Mona"],["Salma"]],second:[["Ali"],["Omar"],["Salma"]],solution:"SELECT name FROM students WHERE grade >= 85 ORDER BY grade DESC;"},
 {task:"Count the students from Cairo.",starter:"SELECT COUNT(*) FROM students",expected:[[2]],second:[[2]],solution:"SELECT COUNT(*) FROM students WHERE city='Cairo';"},
 {task:"Count students in each city, ordered alphabetically.",starter:"SELECT city, COUNT(*) FROM students",expected:[["Alexandria",1],["Cairo",2],["Giza",2]],second:[["Alexandria",1],["Cairo",2],["Giza",2]],solution:"SELECT city, COUNT(*) FROM students GROUP BY city ORDER BY city;"},
 {task:"Show students' names and project topics ordered alphabetically by student name.",starter:"SELECT s.name, p.topic FROM students s",expected:[["Mona","Python"],["Nour","AI"],["Salma","SQL"]],second:[["Ali","AI"],["Mona","Python"],["Salma","SQL"]],solution:"SELECT s.name, p.topic FROM students s JOIN projects p ON s.id=p.student_id ORDER BY s.name;"},
 {task:"Show the two highest student grades, highest first.",starter:"SELECT name, grade FROM students",expected:[["Nour",95],["Mona",91]],second:[["Ali",98],["Omar",90]],solution:"SELECT name, grade FROM students ORDER BY grade DESC LIMIT 2;"}
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
    const scenario=["a factory sensor report","a school records analysis","a production line audit","a weather station dataset","an inventory tracker"][(cycle+i+u)%5];
    return {...base,mode:"order",question:"🧩 Put these four steps in the correct order for this lesson's work on "+scenario+".",
      options:[steps[2],steps[0],steps[3],steps[1]],answer:steps.join("|"),
      explanation:"A sound workflow follows "+steps.join(" → ")+".",sourceStatus:"Original sequence-building question aligned with the lesson's general workflow."};
   }
   if(slot===2||slot===7){
    const readings=[5+(index+u)%5,9+(index+i)%6,14+(cycle%4),19+(u%5)];
    const threshold=12+(i%3);
    const exercise=(cycle+slot)%4;
    const count=readings.filter(x=>x>threshold).length;
    const sortedValues=readings.slice().sort((a,b)=>a-b);
    const result=exercise===0?count:exercise===1?sortedValues[3]-sortedValues[0]:exercise===2?readings.reduce((a,b)=>a+b,0):sortedValues[3];
    const task=exercise===0?"How many sensor readings are strictly above "+threshold+"?":exercise===1?"What is the range (highest minus lowest) of the readings?":exercise===2?"What is the total of all four readings?":"What is the highest recorded reading?";
    const answers=[result,result+1,result+2,Math.max(0,result-1)].map(String);
    const options=answers.slice((index+i)%4).concat(answers.slice(0,(index+i)%4));
    return {...base,mode:"visual-data",display:["bars","table","dots"][(cycle+u+i+slot)%3],question:"📊 Data Detective — "+task+" Readings: "+readings.join(", ")+".",visual:{readings,threshold},options,answer:String(result),
      explanation:"Values: "+readings.join(", ")+". "+(exercise===0?"Count only values greater than "+threshold:exercise===1?"Subtract the minimum from the maximum":exercise===2?"Add all four readings":"Find the maximum")+". Correct result: "+result+".",
      sourceStatus:"Original visual quantitative-reasoning question using synthetic factory sensor readings."};
   }
   return base;
  });
 }

 // Presentation rotates by question position while remaining faithful to question data.
 function questionView(q,index){
  const t=safe(q.question),slot=index%10;
  const kind=q.mode==="live-code"?"code":q.mode==="visual-data"?"data":q.mode==="order"?"sequence":slot===0||slot===5?"scenario":slot===1||slot===8?"calculation":"decision";
  const label={code:"CODING MISSION",data:"DATA INVESTIGATION",sequence:"SEQUENCE CHALLENGE",scenario:"REAL-WORLD REASONING",calculation:"NUMBER LAB",decision:"QUICK DECISION"}[kind];
  const emblem={code:"⌘",data:"▥",sequence:"↗",scenario:"◎",calculation:"∑",decision:"◇"}[kind];
  const instruction=kind==="code"?"Write and test a solution":kind==="data"?"Inspect the evidence before answering":kind==="sequence"?"Build a valid sequence":kind==="calculation"?"Work out the result":"Read carefully and choose";
  return '<section class="ntss-question-layout ntss-question-layout--'+kind+'" aria-label="'+label+'">'+
   '<div class="ntss-presentation-top"><span class="ntss-presentation-symbol" aria-hidden="true">'+emblem+'</span><span>'+label+'</span><small>'+safe(instruction)+'</small></div>'+
   '<h3 class="practice-question">'+t+'</h3></section>';
 }
 function visual(q,probe){
  const v=q.visual;if(!v)return "";
  const max=Math.max(...v.readings,24),selected=Number.isFinite(probe)?probe:v.threshold;
  const display=q.display||"bars";
  if(display==="table"){
   return '<div class="ntss-data-card ntss-data-table"><div class="ntss-chart-head"><b>Sensor inspection sheet</b><span>DATA TABLE</span></div>'+
    '<table><thead><tr><th scope="col">Sensor</th><th scope="col">Reading</th></tr></thead><tbody>'+
    v.readings.map((n,j)=>'<tr><th scope="row">S'+(j+1)+'</th><td>'+n+'</td></tr>').join("")+
    '</tbody></table><p class="ntss-probe-note">Only readings strictly greater than '+v.threshold+' are counted.</p></div>';
  }
  if(display==="dots"){
   return '<div class="ntss-data-card ntss-data-dot"><div class="ntss-chart-head"><b>Sensor readings · dot plot</b><span>COMPARE VALUES</span></div>'+
    '<div class="ntss-dots" role="img" aria-label="Readings '+safe(v.readings.join(", "))+'; threshold '+v.threshold+'">'+
    v.readings.map((n,j)=>'<div class="ntss-dot-line"><span>S'+(j+1)+'</span><div class="ntss-dot-track"><span class="ntss-dot-position '+(n>v.threshold?"is-high":"")+'" style="left:'+Math.round(n/max*100)+'%"></span></div><b>'+n+'</b></div>').join("")+'</div>'+
    '<p class="ntss-probe-note">Threshold: '+v.threshold+' · Values to its right exceed the limit.</p></div>';
  }

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
    if(!r.ok){
     const error=String(r.output||"Execution error");
     const infrastructure=/importScripts|loadPyodide|failed to fetch|network error|networkerror|webassembly|wasm|failed to load|cdn\.jsdelivr|sql-wasm\.js|pyodide\.js|out of memory/i.test(error);
     return finish({runtimeError:infrastructure,passed:false,message:(infrastructure?"Coding runtime unavailable — check internet or reload. Your attempt was not graded. ":"Code error — ")+error.slice(0,320)});
    }
    if(kind==="python"){
     const tests=Array.isArray(r.testCases)?r.testCases:[];
     const completed=tests.length===task.tests.length;
     const passCount=tests.filter(t=>t?.pass===true).length;
     const passed=completed&&passCount===task.tests.length;
     return finish({runtimeError:false,passed,message:passCount+"/"+task.tests.length+" independent Python tests passed"+(passed?" ✓":" · Review your function and edge cases")});
    }
    const got=r.assessmentCases||[];
    const passed=got.length===2&&JSON.stringify(got[0])===JSON.stringify(task.expected)&&JSON.stringify(got[1])===JSON.stringify(task.second);
    const passedCount=got.filter((rows,j)=>JSON.stringify(rows)===JSON.stringify(j===0?task.expected:task.second)).length;
    finish({runtimeError:false,passed,message:passedCount+"/2 SQL datasets passed"+(passed?" ✓":" · Compare the result and try again")});
   };
   if(kind==="python")worker.postMessage({code,assessment:true,tests:q.codeTask.tests});
   else worker.postMessage({code,assessment:true});
  }catch(err){finish({runtimeError:true,message:String(err?.message||err)})}
  return ()=>finish({runtimeError:true,message:"Cancelled"});
 }
 return {enhance,visual,questionView,codePanel,run};
})();