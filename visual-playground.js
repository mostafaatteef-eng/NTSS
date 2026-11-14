/* Privacy-preserving interactive data transformations on hypothetical factory readings. */
window.EBDA_PLAYGROUND=(function(){
const source=[{id:101,site:"Badr",sensor:12},{id:102,site:"Badr",sensor:18},{id:103,site:"Damietta",sensor:null},{id:104,site:"Damietta",sensor:27},{id:105,site:"Badr",sensor:8},{id:106,site:"Damietta",sensor:21}];
const state=new Map();let active="";
function key(g,u,i){return g+"-"+u+"-"+i}
function get(g,u,i){const k=key(g,u,i);if(!state.has(k))state.set(k,{op:"raw",site:"All",threshold:10,dirty:false});return state.get(k)}
function compute(g,u,i){const s=get(g,u,i);let rows=source.map(x=>({...x}));if(s.site!=="All")rows=rows.filter(r=>r.site===s.site);
if(s.op==="impute"){const nums=rows.map(r=>r.sensor).filter(x=>x!==null),mean=nums.reduce((a,b)=>a+b,0)/(nums.length||1);rows.forEach(r=>{if(r.sensor===null)r.sensor=Number(mean.toFixed(2))})}
if(s.op==="normalize"){const nums=rows.map(r=>r.sensor).filter(x=>x!==null),mn=Math.min(...nums),mx=Math.max(...nums);rows.forEach(r=>{if(r.sensor!==null)r.sensor=Number(((r.sensor-mn)/(mx-mn||1)).toFixed(3))})}
if(s.op==="sort")rows.sort((a,b)=>(b.sensor??-Infinity)-(a.sensor??-Infinity));
if(s.op==="filter")rows=rows.filter(r=>r.sensor!==null&&r.sensor>=s.threshold);
return rows}
function change(kind,value){const [g,u,i]=active.split("-").map(Number);const s=get(g,u,i);if(kind==="op")s.op=String(value);if(kind==="site")s.site=String(value);if(kind==="threshold")s.threshold=Number(value);s.dirty=true;draw(g,u,i)}
function draw(g,u,i){const node=document.getElementById("data-playground");if(node)node.innerHTML=inside(g,u,i)}
function inside(g,u,i){active=key(g,u,i);const s=get(g,u,i),rows=compute(g,u,i),nums=rows.map(r=>r.sensor).filter(x=>x!==null),mean=nums.length?nums.reduce((a,b)=>a+b,0)/nums.length:0,max=Math.max(1,...nums);
const modes=[["raw","Original"],["impute","Impute missing"],["normalize","Min–max scale"],["sort","Sort descending"],["filter","Threshold filter"]];
const buttons=modes.map(x=>'<button type="button" class="btn light" aria-pressed="'+(s.op===x[0])+'" onclick="EBDA_PLAYGROUND.change(&quot;op&quot;,&quot;'+x[0]+'&quot;)" style="'+(s.op===x[0]?'background:#d8f3eb;border:2px solid #1ca29a':'')+'">'+x[1]+'</button>').join("");
const opts=["All","Badr","Damietta"].map(x=>'<option '+(s.site===x?'selected':'')+'>'+x+'</option>').join("");
const dataRows=rows.map(x=>'<tr><td>'+x.id+'</td><td>'+x.site+'</td><td>'+(x.sensor===null?'Missing':x.sensor)+'</td></tr>').join("");
const bars=rows.map(x=>'<div style="flex:1;min-width:28px;text-align:center"><div style="height:'+Math.max(2,Math.round((x.sensor??0)/max*90))+'px;background:#1ca29a;border-radius:6px 6px 0 0"></div><small>'+x.id+'</small></div>').join("");
return '<div class="eyebrow">VISUAL DATA PLAYGROUND · SYNTHETIC FACTORY DATA</div><h3>Transform the data yourself</h3><p>Manipulate real browser-side rows and observe the recalculated summary, table and bar chart.</p><div class="actions" style="flex-wrap:wrap">'+buttons+'</div><div class="actions"><label for="play-site">Site</label><select id="play-site" onchange="EBDA_PLAYGROUND.change(&quot;site&quot;,this.value)">'+opts+'</select>'+(s.op==="filter"?'<label>Threshold '+s.threshold+'</label><input type="range" min="0" max="30" value="'+s.threshold+'" oninput="EBDA_PLAYGROUND.change(&quot;threshold&quot;,this.value)">':'')+'</div><div class="topmeta"><span class="pill">Rows: '+rows.length+'</span><span class="pill">Mean: '+mean.toFixed(2)+'</span><span class="pill">Missing: '+rows.filter(x=>x.sensor===null).length+'</span></div><div style="overflow:auto"><table style="width:100%;text-align:left;border-collapse:collapse"><thead><tr><th>ID</th><th>Site</th><th>Sensor</th></tr></thead><tbody>'+dataRows+'</tbody></table></div><div role="img" aria-label="Sensor data bar chart" style="display:flex;align-items:end;gap:9px;min-height:125px;padding:12px;border:1px solid #d4e2dc;border-radius:12px">'+bars+'</div><p class="muted">Mean imputation changes the distribution. Scaling changes magnitudes, not ordering. Check whether the transformation is appropriate for your purpose.</p><div class="actions"><button class="btn light" onclick="EBDA_PLAYGROUND.clear()">Reset</button><button class="btn teal" onclick="EBDA_PLAYGROUND.exportCSV()">Download CSV</button></div>'}
function panel(g,u,i){return '<section class="interactive" id="data-playground" style="background:#f6faf8">'+inside(g,u,i)+'</section>'}
function clear(){const [g,u,i]=active.split("-").map(Number);state.delete(active);draw(g,u,i)}
function snapshot(g,u,i){return compute(g,u,i)}
function changed(g,u,i){return get(g,u,i).dirty}
function exportCSV(){const [g,u,i]=active.split("-").map(Number),rows=compute(g,u,i),csv="id,site,sensor\n"+rows.map(x=>x.id+","+x.site+","+(x.sensor??"")).join("\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})),a=document.createElement("a");a.href=url;a.download="EBDA-transformed-data.csv";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}
return {panel,change,clear,snapshot,changed,exportCSV};
})();