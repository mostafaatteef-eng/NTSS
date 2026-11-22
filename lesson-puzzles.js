/* EBDA Learning: concept-based games, three short locally graded rounds per lesson. */
window.EBDA_PUZZLES=(function(){
"use strict";
const store=new Map();
const escapeHtml=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const key=(g,u,i)=>g+"-"+u+"-"+i;
function state(g,u,i){
 const k=key(g,u,i);
 if(!store.has(k))store.set(k,{round:0,solved:false,done:false,hint:false,wrong:false});
 return store.get(k);
}
function task(g,u,i,round){
 const family=window.EBDA_VISUALIZER.family(g,u),index=i+round;
 let title="",question="",scene="",answer="",wrong=[],reason="",hint="";
 if(family==="join"){
  const target=[1,2,4,3,1,2][index%6],names={1:"Laser-C",2:"Press-A",3:"Vision-B"};
  answer=names[target]||"No match — excluded";
  wrong=["Laser-C","Press-A","Vision-B","No match — excluded"].filter(x=>x!==answer);
  title="SQL Key Detective";
  question="Which machine will INNER JOIN connect to this inspection?";
  scene='<div class="puzzle-evidence"><span>inspections.machine_id = '+target+'</span><span>⇄</span><span>machines.id = ?</span></div>';
  reason=names[target]?"Both tables have key "+target+". The joined row belongs to "+answer+".":"There is no machine with id "+target+". INNER JOIN excludes the unmatched row.";
  hint="INNER JOIN keeps only rows with matching key values in both tables.";
 }else if(family==="loop"){
  const vals=[[1,2,3],[2,4,6],[3,5,7],[1,3,5]][index%4];
  const sum=vals.reduce((a,b)=>a+b,0);answer=String(sum);
  wrong=[sum+1,sum+3,sum-2].map(String);
  title="Python Loop Runner";question="What does this Python program print?";
  scene='<pre class="puzzle-program">total = 0\nfor x in ['+vals.join(", ")+']:\n    total += x\nprint(total)</pre>';
  reason=vals.join(" + ")+" = "+sum+".";
  hint="Follow the value of total after every iteration.";
 }else if(family==="stats"){
  const vals=[[4,6,8],[5,7,12],[3,9,15],[6,10,14]][index%4],sum=vals.reduce((a,b)=>a+b,0);
  const mean=sum/vals.length;answer=String(mean);
  wrong=[mean+1,mean+3,mean-2].map(String);
  title="Data Detective";question="Find the mean of these sensor readings.";
  scene='<div class="puzzle-evidence">'+vals.map(v=>'<span>'+v+'</span>').join("")+'</div>';
  reason="Sum "+sum+" divided by "+vals.length+" readings = "+mean+".";
  hint="Add the readings, then divide by how many readings there are.";
 }else if(family==="knn"){
  const xs=[1,3,5,7,9],query=[2.1,4.1,6.1,8.1][index%4];
  const neighbors=xs.map(x=>({x,label:x<=3?"Low":"High",d:Math.abs(x-query)})).sort((a,b)=>a.d-b.d).slice(0,3);
  const count=neighbors.filter(x=>x.label==="High").length;
  answer=count>=2?"High":"Low";
  wrong=[count>=2?"Low":"High","Tie vote"];
  title="KNN Prediction Quest";question="Which class wins among the three nearest neighbors?";
  scene='<div class="puzzle-evidence"><span>Query x = '+query+'</span><span>1,3: Low</span><span>5,7,9: High</span></div>';
  reason="The nearest points are "+neighbors.map(x=>"x="+x.x+" ("+x.label+")").join(", ")+". Majority = "+answer+".";
  hint="Compare the absolute distances between the query and each observation.";
 }else{
  const readings=[3,5,7,9,11,13],threshold=[4,8,10,12][index%4],alerts=readings.filter(x=>x>threshold).length;
  answer=String(alerts);wrong=[alerts+1,alerts+2,Math.max(0,alerts-1)].map(String);
  title="Sensor Alert Rescue";question="How many values trigger the alert (reading > "+threshold+")?";
  scene='<div class="puzzle-evidence">'+readings.map(x=>'<span class="'+(x>threshold?"puzzle-hot":"")+'">'+x+'</span>').join("")+'</div>';
  reason="Count values strictly greater than "+threshold+". Result = "+alerts+".";
  hint="Reading equal to the threshold does not trigger an alert.";
 }
 const raw=[answer,...wrong],shift=(g+u+i+round)%raw.length;
 const opts=raw.slice(shift).concat(raw.slice(0,shift));
 return {family,title,question,scene,options:opts,answerIndex:opts.indexOf(answer),reason,hint};
}
function view(g,u,i){
 const s=state(g,u,i),p=task(g,u,i,s.round);
 const count=s.done?3:s.round+(s.solved?1:0);
 const heading='<div class="puzzle-heading"><div><span class="puzzle-kicker">🎮 PLAY & LEARN</span><h3>'+escapeHtml(p.title)+'</h3></div><span class="puzzle-number">'+(s.done?"3 / 3":"PUZZLE "+(s.round+1)+" / 3")+'</span></div>'+
 '<div class="puzzle-meter" role="progressbar" aria-label="Puzzles solved" aria-valuemin="0" aria-valuemax="3" aria-valuenow="'+count+'"><i style="width:'+(100*count/3)+'%"></i></div>';
 if(s.done)return ((heading)+"<div class=\"puzzle-result\" role=\"status\"><h4>🏆 Mission solved</h4><p>Three puzzles completed. Explore the explanation or continue to the next learning stage.</p><button class=\"btn light\" "+window.NTSS_EVENTS.bind("click",function(event){EBDA_PUZZLES.restart((g),(u),(i))},"EBDA_PUZZLES.restart")+">Play again ↻</button></div>");
 const buttons='<div class="puzzle-options">'+p.options.map((opt,j)=>
 ("<button class=\"puzzle-choice "+(s.solved&&j===p.answerIndex?"puzzle-choice--correct":"")+"\" type=\"button\" "+(s.solved?"disabled":"")+" "+window.NTSS_EVENTS.bind("click",function(event){EBDA_PUZZLES.choose((g),(u),(i),(j))},"EBDA_PUZZLES.choose")+"><span class=\"puzzle-choice__key\">"+(String.fromCharCode(65+j))+"</span>"+(escapeHtml(opt))+"</button>")).join("")+'</div>';
 let feedback='';
 if(s.solved)feedback=("<div class=\"puzzle-result\" role=\"status\"><strong>✓ Correct reasoning</strong><p>"+(escapeHtml(p.reason))+"</p></div><div class=\"puzzle-controls\"><button class=\"btn teal\" "+window.NTSS_EVENTS.bind("click",function(event){EBDA_PUZZLES.next((g),(u),(i))},"EBDA_PUZZLES.next")+">"+(s.round===2?"Complete mission ✓":"Next puzzle →")+"</button></div>");
 else feedback=(((s.wrong?'<div class="puzzle-try" role="status">Not quite — inspect the evidence and try again.</div>':'')+
 (s.hint?'<p class="puzzle-tip">💡 '+escapeHtml(p.hint)+'</p>':''))+"<div class=\"puzzle-controls\"><button class=\"btn light\" "+window.NTSS_EVENTS.bind("click",function(event){EBDA_PUZZLES.hint((g),(u),(i))},"EBDA_PUZZLES.hint")+" "+(s.hint?"disabled":"")+">💡 "+(s.hint?"Hint shown":"Need a hint?")+"</button></div>");
 return heading+'<p class="puzzle-prompt">'+escapeHtml(p.question)+'</p>'+p.scene+buttons+feedback;
}
function panel(g,u,i){return '<section id="ebda-puzzle-'+key(g,u,i)+'" class="ebda-puzzle" aria-label="Interactive lesson mini-game" aria-live="polite">'+view(g,u,i)+'</section>'}
function update(g,u,i){const el=document.getElementById("ebda-puzzle-"+key(g,u,i));if(el)el.innerHTML=view(g,u,i)}
function choose(g,u,i,j){
 const s=state(g,u,i),q=task(g,u,i,s.round);
 if(s.solved||s.done||!Number.isInteger(j)||j<0||j>=q.options.length)return;
 if(j===q.answerIndex){s.solved=true;s.wrong=false}else{s.wrong=true}
 update(g,u,i);
}
function hint(g,u,i){const s=state(g,u,i);if(!s.done&&!s.solved){s.hint=true;update(g,u,i)}}
function next(g,u,i){const s=state(g,u,i);if(!s.solved||s.done)return;
 if(s.round===2)s.done=true;else{s.round++;s.solved=false;s.wrong=false;s.hint=false}
 update(g,u,i);
}
function restart(g,u,i){store.delete(key(g,u,i));update(g,u,i)}
function reset(){store.clear()}
function progress(g,u,i){const s=state(g,u,i);return {solved:s.done?3:s.round+(s.solved?1:0),total:3,done:s.done}}
return {panel,task,choose,hint,next,restart,progress,reset};
})();