/* NTSS concept explorer — deterministic synthetic instructional models, not assessed answers. */
window.NTSS_CONCEPTS=(function(){
 const values=new Map(),opened=new Set();
 const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function type(mode,title){
  const t=String(title||"").toLowerCase();
  if(/arabic/i.test(mode)&&/الجملة الاسمية/.test(t))return "arabic-nominal";
  if(/arabic/i.test(mode)&&/الجملة الفعلية/.test(t))return "arabic-verbal";
  if(/arabic/i.test(mode)&&/كان وأخواتها/.test(t))return "arabic-kan";
  if(/arabic/i.test(mode)&&/إن وأخواتها/.test(t))return "arabic-inna";
  if(/english/i.test(mode)&&/past perfect/i.test(t))return "english-past";
  if(/physics/i.test(mode)&&/ohm|resistan|electric|current|voltage|circuit/i.test(t))return "ohm";
  if(/physics/i.test(mode)&&/motion|speed|velocity|acceleration|force|newton/i.test(t))return "motion";
  if(/math/i.test(mode)&&/mean|average|statistics|statistical|المتوسط|المتوسط الحسابي/i.test(t))return "mean";
  if(/math/i.test(mode)&&/linear|equation|function|gradient|المعادلة|الدالة/i.test(t))return "linear";
  if(/economics/i.test(mode)&&/الطلب|العرض|السعر|الثمن/i.test(t))return "demand";
  if(/english|german|arabic/i.test(mode)&&/grammar|sentence|tense|past perfect|الجملة|إعراب|نحو|grammatik/i.test(t))return "sentence";
  if(/learn|advancedLab/i.test(mode)&&/python|program|script|functions?|debug|loop|flow control/i.test(t))return "python";
  if(/learn|advancedLab/i.test(mode)&&/sql|database|schema|normalization|query|join|data modeling/i.test(t))return "sql";
  if(/learn|advancedLab/i.test(mode)&&/machine learning|deep learning|knn|classif|clustering|gradient descent|model evaluation/i.test(t))return "knn";
  if(/learn|advancedLab/i.test(mode)&&/statistics|data analysis|visual|chart|preprocess|monitor|quality/i.test(t))return "data";
  return null;
 }
 function bars(pairs,max,color){
  return '<div class="ntss-viz-bars" role="img" aria-label="Illustrative comparison chart">'+pairs.map(([label,value])=>'<div class="ntss-viz-bar"><span class="ntss-viz-value">'+escape(value)+'</span><div class="ntss-viz-column" style="height:'+Math.max(8,Math.round(Number(value)/max*108))+'px;background:'+color+'"></div><small>'+escape(label)+'</small></div>').join("")+'</div>';
 }
 function graph(points){
  const maxY=Math.max(1,...points.map(p=>p[1]));const yPos=y=>158-(y/maxY)*132;
  const coordinates=points.map(([x,y])=>(24+x*27)+","+yPos(y).toFixed(2)).join(" ");
  return '<svg class="ntss-viz-svg" viewBox="0 0 300 185" role="img" aria-label="Computed x and y relationship"><path d="M24 10 V158 H296" fill="none" stroke="#96b7aa" stroke-width="2"/><polyline points="'+coordinates+'" fill="none" stroke="#1CA29A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+points.map(([x,y])=>'<circle cx="'+(24+x*27)+'" cy="'+yPos(y).toFixed(2)+'" r="4" fill="#117e75"/>').join("")+'<text x="280" y="176" fill="#58736a" font-size="12">x</text><text x="9" y="16" fill="#58736a" font-size="12">y</text></svg>';
 }
 function grammarDiagram(bits){
  return '<div class="ntss-viz-sentence" dir="auto">'+bits.map(([word,role])=>'<span><strong>'+escape(word)+'</strong><small>'+escape(role)+'</small></span>').join("")+'</div>';
 }
 function visualization(kind,n){
  if(kind==="arabic-nominal")return {prompt:"الجملة الاسمية تبدأ في صورتها الأساسية بمبتدأ وخبر.",visual:grammarDiagram([["العلمُ","مبتدأ مرفوع"],["نافعٌ","خبر مرفوع"]]),result:"العلمُ نافعٌ: جملة اسمية تتكون من مبتدأ وخبر.",unit:"",value:n};
  if(kind==="arabic-verbal")return {prompt:"الجملة الفعلية تبدأ بفعل، وقد تتضمن فاعلًا ومفعولًا به.",visual:grammarDiagram([["قرأَ","فعل ماض"],["الطالبُ","فاعل مرفوع"],["الكتابَ","مفعول به منصوب"]]),result:"حدد الفعل والفاعل والمفعول به إن وجد، ولا تفترض أن كل جملة فعلية لها مفعول به.",unit:"",value:n};
  if(kind==="arabic-kan")return {prompt:"كان وأخواتها تدخل على الجملة الاسمية فترفع الاسم وتنصب الخبر.",visual:grammarDiagram([["كانَ","فعل ناسخ"],["الجوُّ","اسم كان مرفوع"],["جميلًا","خبر كان منصوب"]]),result:"كان الجوُّ جميلًا: انتبه إلى تغير إعراب الخبر.",unit:"",value:n};
  if(kind==="arabic-inna")return {prompt:"إنَّ وأخواتها تنصب الاسم وترفع الخبر.",visual:grammarDiagram([["إنَّ","حرف ناسخ"],["الجوَّ","اسم إن منصوب"],["جميلٌ","خبر إن مرفوع"]]),result:"إنَّ الجوَّ جميلٌ: اسم إن منصوب وخبرها مرفوع.",unit:"",value:n};
  if(kind==="english-past")return {prompt:"Past perfect often clarifies which of two past events happened first.",visual:grammarDiagram([["had finished","Earlier completed action"],["the meeting started","Later past action"]]),result:"The team had finished before the meeting started. Form: had + past participle.",unit:"",value:n};

  if(kind==="python"){
    const sequence=Array.from({length:n},(_,i)=>i+1),sum=sequence.reduce((a,b)=>a+b,0);
    return {prompt:"Trace this Python loop, one iteration at a time.",visual:'<pre class="ntss-viz-code">total = 0\nfor value in range(1, '+(n+1)+'):\n    total += value\nprint(total)</pre>'+bars(sequence.map((x,i)=>["Step "+x,(x*(x+1))/2]),36,"#1CA29A"),result:"After "+n+" iterations: total = "+sum+". Trace values: "+sequence.map(x=>x*(x+1)/2).join(" → ")+".",unit:"Iterations",value:n};
  }
  if(kind==="sql"){
    const id=(n-1)%3+1,students={1:"Mona",2:"Nour",3:"Salma"},projects={1:"Python",2:"Data Analysis"};
    return {prompt:"Explore what an INNER JOIN does with a matching foreign key.",visual:'<div class="ntss-viz-tables"><table><caption>students</caption><tr><th>id</th><th>name</th></tr>'+Object.keys(students).map(x=>'<tr><td>'+x+'</td><td>'+students[x]+'</td></tr>').join("")+'</table><table><caption>projects</caption><tr><th>student_id</th><th>topic</th></tr>'+Object.keys(projects).map(x=>'<tr><td>'+x+'</td><td>'+projects[x]+'</td></tr>').join("")+'</table></div>',result:"Selected student id = "+id+" ("+students[id]+"). INNER JOIN result: "+(projects[id]?students[id]+" — "+projects[id]:"no matching project; this row is excluded")+".",unit:"Student selector",value:id};
  }
  if(kind==="knn"){
    const points=[{x:1,label:"Low"},{x:3,label:"Low"},{x:5,label:"High"},{x:7,label:"High"},{x:8,label:"High"}];
    const nearest=points.map(p=>({...p,d:Math.abs(p.x-n)})).sort((a,b)=>a.d-b.d||a.x-b.x).slice(0,3);
    const high=nearest.filter(x=>x.label==="High").length;
    return {prompt:"Classify a new observation using the three nearest labeled points (k = 3).",visual:bars(points.map(p=>["x="+p.x,p.x]),8,"#1CA29A"),result:"Query x = "+n+". Nearest points: "+nearest.map(x=>x.x+" ("+x.label+")").join(", ")+". Majority vote: "+(high>=2?"High":"Low")+".",unit:"Query position",value:n};
  }
  if(kind==="ohm"){const voltage=n*2,resistance=4,current=voltage/resistance;return {prompt:"Ohm's law: change voltage while resistance stays at 4 Ω.",visual:bars([["Voltage",voltage],["Current",current]],20,"#1CA29A"),result:"I = V / R = "+voltage+" / 4 = "+current.toFixed(1)+" A. Doubling voltage doubles current when resistance remains constant.",unit:"Voltage",value:voltage}}
  if(kind==="motion"){const t=n,acc=2,velocity=t*acc,distance=.5*acc*t*t;return {prompt:"Motion from rest with constant acceleration a = 2 m/s².",visual:graph(Array.from({length:7},(_,i)=>[i,i*acc])),result:"At t = "+t+" s, v = at = "+velocity+" m/s and s = ½at² = "+distance+" m.",unit:"Time",value:t}}
  if(kind==="mean"){const set=[4,6,8,10,12],data=set.map((v,i)=>v+(i===4?n:0)),avg=data.reduce((a,b)=>a+b,0)/data.length;return {prompt:"Change the last observation and watch the mean.",visual:bars(data.map((x,i)=>["x"+(i+1),x]),25,"#1CA29A"),result:"Mean = ("+data.join(" + ")+") / 5 = "+avg.toFixed(1)+".",unit:"Added value",value:n}}
  if(kind==="linear"){const slope=n/2,points=Array.from({length:8},(_,i)=>[i,slope*i+2]);return {prompt:"Explore the slope of y = mx + 2.",visual:graph(points),result:"Slope m = "+slope.toFixed(1)+". At x = 4, y = "+(slope*4+2).toFixed(1)+".",unit:"Slope × 2",value:n}}
  if(kind==="demand"){const price=n*2,quantity=100-5*price;return {prompt:"Illustrative demand schedule with other factors held constant.",visual:bars([["Price",price],["Quantity",quantity]],100,"#1CA29A"),result:"Price = "+price+", quantity demanded = "+quantity+". In this simplified example, a higher price means lower quantity demanded.",unit:"Price step",value:n}}
  if(kind==="data"){const source=[3,7,11,17,23,28],threshold=3*n,count=source.filter(x=>x>=threshold).length;return {prompt:"Move a threshold and observe which sample readings are retained.",visual:bars(source.map((v,i)=>["S"+(i+1),v]),30,"#1CA29A"),result:"Filter: value ≥ "+threshold+" → "+count+" of "+source.length+" readings remain.",unit:"Threshold step",value:n}}
  return {prompt:"Explore a simple sentence pattern.",visual:'<div class="ntss-viz-sentence"><span>Subject</span><span>Verb</span><span>Object / complement</span></div>',result:"Identify the function of each element in the current lesson. This is a general language pattern; not every sentence uses all three elements.",unit:"Step",value:n};
 }

 function display(kind,n){
  const v=visualization(kind,n);
  return '<p class="ntss-viz-prompt">'+escape(v.prompt)+'</p>'+v.visual+'<p class="ntss-viz-result" aria-live="polite">'+escape(v.result)+'</p>';
 }
 function choose(id,n){
  const val=Math.min(8,Math.max(1,Number(n)||1));values.set(id,val);
  const host=document.getElementById(id);
  if(!host)return;
  const dynamic=host.querySelector(".ntss-viz-display");
  if(dynamic)dynamic.innerHTML=display(host.dataset.kind,val);
  const label=host.querySelector(".ntss-viz-slider strong");
  if(label)label.textContent=String(visualization(host.dataset.kind,val).value);
 }
 function expand(id,open){if(open)opened.add(id);else opened.delete(id)}
 function inside(kind,id){
  const n=values.get(id)??3,v=visualization(kind,n);
  return '<div class="ntss-viz-display">'+display(kind,n)+'</div>'+
   (kind==="sentence"||kind.startsWith("arabic-")||kind==="english-past"?'':("<label class=\"ntss-viz-slider\">"+(escape(v.unit))+" <strong>"+(v.value)+"</strong><input type=\"range\" min=\"1\" max=\"8\" step=\"1\" value=\""+(n)+"\" "+window.NTSS_EVENTS.bind("input",function(event){NTSS_CONCEPTS.choose((id),this.value)},"NTSS_CONCEPTS.choose")+" aria-label=\""+(escape(v.unit))+"\"></label>"))+
   '<small>Illustrative synthetic values for practice · Does not alter your answer or certificate.</small>';
 }
 function attach(root,mode,title){
  const kind=type(mode,title);
  if(!kind||!root||root.querySelector(".ntss-concept"))return;
  const isArabic=/arabic|economics|civics|social/i.test(mode),isGerman=/german/i.test(mode);
  const heading=isArabic?"استكشف المفهوم بصريًا":isGerman?"Konzept visualisieren":"Interactive Concept Visualizer";
  const subtitle=isArabic?"اختياري · جرّب وراقب":isGerman?"Optional · ausprobieren":"Optional · experiment and observe";
  const id="ntss-concept-"+mode+"-"+kind,html=("<details class=\"ntss-concept\" "+(opened.has(id)?"open":"")+" "+window.NTSS_EVENTS.bind("toggle",function(event){NTSS_CONCEPTS.expand((id),this.open)},"NTSS_CONCEPTS.expand")+"><summary><span>▥ "+(heading)+"</span><small>"+(subtitle)+"</small></summary><div class=\"ntss-concept-inner\" id=\""+(id)+"\" data-kind=\""+(kind)+"\">"+(inside(kind,id))+"</div></details>");
  root.insertAdjacentHTML("beforeend",html);
 }
 return {type,visualization,attach,choose,expand};
})();