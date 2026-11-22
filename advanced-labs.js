/* Deeper, fully computed browser-only demonstrations (no remote APIs). */
window.EBDAA_ADVANCED_LAB=function(s,step){
const index=window.EBDAA_DATA.sessions.findIndex(x=>x.id===s.id),id=s.id;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slider=(min,max,value)=>("<label style=\"display:block;margin:18px 0 7px;font-weight:750\" for=\"lab-range\">Explore the parameter: "+(value)+"</label><input id=\"lab-range\" class=\"range\" type=\"range\" min=\""+(min)+"\" max=\""+(max)+"\" value=\""+(value)+"\" "+window.NTSS_EVENTS.bind("input",function(event){setLab(this.value)},"setLab")+">");
const title=(heading,intro)=>'<div class="simlabel">✦ '+heading+'</div><p>'+intro+'</p>';
const cell=(label,color="#ffeab0")=>'<div class="visual-cell" style="background:'+color+';font-size:17px;min-width:58px">'+esc(label)+'</div>';
const note=t=>'<p class="muted">'+esc(t)+'</p>';
let markup="";
if(id==="1-2"){
const v=Math.min(9,step),p=v*4,answer=3+p;
markup=title("Python evaluation trace","Track the order of operations in 3 + n × 4.")
+'<div class="visual-row">'+cell('n = '+v)+cell(v+' × 4 = '+p,'#a7e3d6')+cell('3 + '+p+' = '+answer,'#ffd700')+'</div>'+slider(0,9,v)
+'<pre style="background:#212b31;color:#f7f8f5;padding:18px;border-radius:12px;overflow:auto"><code>n = '+v+'\nprint(3 + n * 4)   # '+answer+'</code></pre>'+note("Python executes multiplication before addition.");
}
else if(id==="2-6"){
const rate=step/20;const w0=4;const grad=2*w0;const w1=w0-rate*grad;const loss=w1*w1;
markup=title("Gradient Descent — one real update","Minimize f(w)=w² by calculating the derivative and applying a chosen learning rate.")
+'<div class="visual-row">'+cell('w₀ = 4')+cell('∇f = 8','#cbc0a3')+cell('w₁ = '+w1.toFixed(2),'#a7e3d6')+'</div>'+slider(1,8,step)+'<p><b>Learning rate:</b> '+rate.toFixed(2)+' · <b>New loss:</b> '+loss.toFixed(3)+'</p>'
+'<div class="meter"><i style="width:'+Math.min(100,loss/16*100)+'%"></i></div>'+note("This is a single calculated optimization step on a simple convex function.");
}
else if(id==="4-3"){
const rows=[["101","23","Cairo"],["102","-5","Giza"],["103","31","cairo"],["103","31","cairo"],["104","","Alexandria"]];
const issues=["Valid example","Invalid age (negative)","Inconsistent city spelling","Potential duplicate","Missing age"];
const j=(Math.max(1,step)-1)%rows.length;const row=rows[j];
markup=title("Data Quality Inspector","Inspect sample records and decide which correction is justified by evidence.")
+'<table style="border-collapse:collapse;width:100%;font-size:14px"><thead><tr>'+["ID","Age","City"].map(x=>'<th style="padding:9px;text-align:left;border-bottom:2px solid #eee">'+x+'</th>').join("")+'</tr></thead><tbody>'+rows.map((r,k)=>'<tr style="background:'+(k===j?'#dff6ef':'transparent')+'">'+r.map(x=>'<td style="padding:9px;border-bottom:1px solid #eee">'+esc(x||"—")+'</td>').join("")+'</tr>').join("")+'</tbody></table>'
+slider(1,5,j+1)+'<div class="feedback '+(j===0?'':'error')+'"><b>'+issues[j]+'</b><p>'+(j===0?'No issue in this row.':'Verify the original source. Do not fabricate missing or invalid values.')+'</p></div>';
}
else if(id==="4-5"||id==="5-3"){
// Authentic one-dimensional two-cluster k-means updates, distance-to-centroid assignment.
const points=[1,2,3,8,9,10];let centroids=[1,10],history=[];
for(let iteration=0;iteration<=6;iteration++){const groups=[[],[]];for(const p of points){const a=Math.abs(p-centroids[0]),b=Math.abs(p-centroids[1]);groups[a<=b?0:1].push(p)}history.push({centroids:[...centroids],groups:groups.map(x=>[...x])});centroids=groups.map((x,j)=>x.length?x.reduce((a,b)=>a+b,0)/x.length:centroids[j]);}
const v=Math.min(6,Math.max(0,step)),state=history[v];
markup=title("K-Means — calculate real centroids","Each point joins the nearest centroid. Then the mean of each group becomes its new centroid.")
+'<div class="dots">'+points.map(p=>'<span class="dot" title="Point '+p+'" style="left:'+(p*8+3)+'%;top:35%;background:'+(state.groups[0].includes(p)?"#1ca29a":"#ffd700")+'"></span>').join("")
+state.centroids.map((c,k)=>'<div title="Centroid '+(k+1)+'" style="position:absolute;top:67%;left:'+(c*8+3)+'%;font-size:25px;color:'+(k===0?"#137c75":"#a97700")+'">◆</div>').join("")+'</div>'
+slider(0,6,v)+'<div class="visual-row">'+cell('C1 = '+state.centroids[0].toFixed(2),'#a5dfd1')+cell('C2 = '+state.centroids[1].toFixed(2),'#ffeab0')+'</div>'
+'<p>Cluster 1: '+state.groups[0].join(", ")+' · Cluster 2: '+state.groups[1].join(", ")+'</p>'
+note("One-dimensional Euclidean distance; initial centroids at 1 and 10. After the first reassignment they converge to 2 and 9.");
}
else if(id==="4-6"||id==="5-2"){
const train=[{x:1,y:1,c:"A"},{x:2,y:2,c:"A"},{x:4,y:3,c:"A"},{x:6,y:6,c:"B"},{x:7,y:7,c:"B"},{x:9,y:8,c:"B"}];
const q={x:Math.max(0,step),y:4};
const distances=train.map(p=>({...p,d:Math.hypot(p.x-q.x,p.y-q.y)})).sort((a,b)=>a.d-b.d);
const nearest=distances.slice(0,3);const countA=nearest.filter(x=>x.c==="A").length;const vote=countA>=2?"A":"B";
markup=title("KNN — Euclidean distances in two dimensions","The three nearest labeled examples vote on the new point.")
+'<div class="dots">'+train.map(p=>'<span class="dot" title="'+p.c+' ('+p.x+','+p.y+')" style="left:'+(p.x*9+3)+'%;top:'+(p.y*9)+'%;background:'+(p.c==="A"?"#1ca29a":"#ffd700")+'"></span>').join("")+'<span style="position:absolute;left:'+(q.x*9+3)+'%;top:36%;color:#be4848;font-size:24px;font-weight:900">✕</span></div>'
+slider(0,10,q.x)+'<p>Query point: ('+q.x+',4) · k=3 · Predicted class: <b>'+vote+'</b></p>'
+'<p>Nearest: '+nearest.map(x=>x.c+' ('+x.x+','+x.y+') distance '+x.d.toFixed(2)).join(" · ")+'</p>'+note("Example uses two numerical features on the same 0–10 scale.");
}
else if(id==="6-4"){
const actions=[["Push 3",[3]],["Push 8",[3,8]],["Push 5",[3,8,5]],["Pop → 5",[3,8]],["Push 2",[3,8,2]],["Pop → 2",[3,8]]];const k=(Math.max(1,step)-1)%6;const state=actions[k];
markup=title("Stack — follow every operation","Each action changes a real LIFO stack; the newest item is removed first.")
+'<div class="visual-row">'+state[1].map(v=>cell(v,"#a5dfd1")).join('<b>→</b>')+'</div>'+slider(1,6,k+1)
+'<p>Step '+(k+1)+': <b>'+state[0]+'</b></p>'+note("The top of the stack is shown on the right.");
}
else if(id==="6-6"){
const graph={A:["B","C"],B:["A","D"],C:["A","D","E"],D:["B","C","E"],E:["C","D"]};const q=["A"],visited=[],seen=new Set(["A"]);
while(q.length){const node=q.shift();visited.push(node);for(const near of graph[node])if(!seen.has(near)){seen.add(near);q.push(near)}}
const n=Math.min(5,Math.max(1,step));
markup=title("Breadth-First Search — visit nodes in order","BFS explores neighbors level by level, starting from node A.")
+'<div class="visual-row">'+visited.map((v,i)=>cell(v,i<n?"#a5dfd1":"#eee9e1")).join('<b>→</b>')+'</div>'+slider(1,5,n)+'<p>Visited so far: <b>'+visited.slice(0,n).join(" → ")+'</b></p>'+note("Adjacency list: A–B, A–C, B–D, C–D, C–E, D–E. Neighbors processed alphabetically.");
}
else return null;
return '<div class="interactive">'+markup+'</div>';
};
