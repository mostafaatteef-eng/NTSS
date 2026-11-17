/* NTSS concept explorer — deterministic synthetic instructional models, not assessed answers. */
window.NTSS_CONCEPTS=(function(){
 const values=new Map(),opened=new Set();
 const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function type(mode,title){
  const t=String(title||"").toLowerCase();
  if(/physics/i.test(mode)&&/ohm|resistan|electric|current|voltage|circuit/i.test(t))return "ohm";
  if(/physics/i.test(mode)&&/motion|speed|velocity|acceleration|force|newton/i.test(t))return "motion";
  if(/math/i.test(mode)&&/mean|average|statistics|statistical|المتوسط|المتوسط الحسابي/i.test(t))return "mean";
  if(/math/i.test(mode)&&/linear|equation|function|gradient|المعادلة|الدالة/i.test(t))return "linear";
  if(/economics/i.test(mode)&&/الطلب|العرض|السعر|الثمن/i.test(t))return "demand";
  if(/english|german|arabic/i.test(mode)&&/grammar|sentence|tense|past perfect|الجملة|إعراب|نحو|grammatik/i.test(t))return "sentence";
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
 function visualization(kind,n){
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
   (kind==="sentence"?'':'<label class="ntss-viz-slider">'+escape(v.unit)+' <strong>'+v.value+'</strong><input type="range" min="1" max="8" step="1" value="'+n+'" oninput="NTSS_CONCEPTS.choose('+JSON.stringify(id).replace(/"/g,"&quot;")+',this.value)" aria-label="'+escape(v.unit)+'"></label>')+
   '<small>Illustrative synthetic values for practice · Does not alter your answer or certificate.</small>';
 }
 function attach(root,mode,title){
  const kind=type(mode,title);
  if(!kind||!root||root.querySelector(".ntss-concept"))return;
  const id="ntss-concept-"+mode,html='<details class="ntss-concept" '+(opened.has(id)?"open":"")+' ontoggle="NTSS_CONCEPTS.expand('+JSON.stringify(id).replace(/"/g,"&quot;")+',this.open)"><summary><span>▥ Interactive Concept Visualizer</span><small>Optional · experiment and observe</small></summary><div class="ntss-concept-inner" id="'+id+'" data-kind="'+kind+'">'+inside(kind,id)+'</div></details>';
  root.insertAdjacentHTML("beforeend",html);
 }
 return {type,visualization,attach,choose,expand};
})();