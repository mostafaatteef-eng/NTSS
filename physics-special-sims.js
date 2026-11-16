/* Physics STEM interactive demonstrations. Pure browser SVG, no dependency or tracking.
   Models: projectile (no drag), Ohm series circuit, Snell refraction, Boolean logic. */
window.EBDAA_PHYSICS_SPECIAL=(function(){
const states={
 projectile:{speed:16,angle:45,g:9.8},
 circuit:{voltage:12,r1:4,r2:2,series:true},
 optics:{n1:1,n2:1.5,angle:35},
 logic:{gate:"AND",a:1,b:0}
};
let frame=0,playing=false,started=0,elapsed=0;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num=n=>Number(n.toFixed(2));
const topics={motion:"projectile",motionEq:"projectile",speed:"projectile",ohm:"circuit",resistors:"circuit",current:"circuit",light:"optics",refraction:"optics",logic:"logic"};
function kind(topic){return topics[topic]||null}
function stop(){playing=false;cancelAnimationFrame(frame);frame=0;elapsed=0}
function calculate(type){
 const s=states[type];
 if(type==="projectile"){let th=s.angle*Math.PI/180,t=2*s.speed*Math.sin(th)/s.g;return {flight:t,range:s.speed*Math.cos(th)*t,height:s.speed*s.speed*Math.sin(th)**2/(2*s.g)}}
 if(type==="circuit"){let R=s.series?s.r1+s.r2:1/(1/s.r1+1/s.r2);return {R,I:s.voltage/R,P:s.voltage*s.voltage/R}}
 if(type==="optics"){let si=s.n1*Math.sin(s.angle*Math.PI/180)/s.n2;return {critical:si>1,theta:si>1?null:Math.asin(si)*180/Math.PI}}
 const v=s.gate==="NOT"?!s.a:s.gate==="AND"?s.a&&s.b:s.gate==="OR"?s.a||s.b:s.gate==="NAND"?!(s.a&&s.b):!(s.a||s.b);return {output:Number(Boolean(v))}
}
function set(type,key,value){if(!(type in states)||!(key in states[type]))return;const o=states[type];if(key==="gate"){if(!["AND","OR","NOT","NAND","NOR"].includes(value))return;o.gate=value}else if(key==="series")o.series=value==="series";else {let v=Number(value);if(!Number.isFinite(v))return;o[key]=v}stop();update(type)}
function track(type,key,min,max,step,unit){let s=states[type];return '<label class="phy-control"><span>'+esc(key)+' <output data-val="'+esc(key)+'">'+s[key]+' '+unit+'</output></span><input type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+s[key]+'" oninput="EBDAA_PHYSICS_SPECIAL.set(\''+type+'\',\''+key+'\',this.value)"></label>'}
function svg(type){
 const s=states[type],d=calculate(type);
 if(type==="projectile"){
  const width=520,height=240,base=207,dx=Math.max(1,d.range),scale=435/dx;
  let pts=[];for(let i=0;i<=60;i++){let t=d.flight*i/60,x=45+s.speed*Math.cos(s.angle*Math.PI/180)*t*scale,y=base-(s.speed*Math.sin(s.angle*Math.PI/180)*t-.5*s.g*t*t)*Math.min(150/Math.max(1,d.height),scale);pts.push(x.toFixed(1)+','+Math.max(10,y).toFixed(1))}
  return '<svg viewBox="0 0 520 240" role="img" aria-label="Projectile trajectory with gravity" class="phy-svg"><defs><linearGradient id="phy-air" x2="0" y2="1"><stop stop-color="#e9f8fa"/><stop offset="1" stop-color="#f5fbf8"/></linearGradient></defs><rect width="520" height="240" fill="url(#phy-air)"/><path d="M0 207H520" stroke="#95b5aa" stroke-width="2"/><path d="M45 207 L'+pts.join(" ")+'" fill="none" stroke="#0c8b83" stroke-width="3" stroke-dasharray="6 4"/><circle id="phy-projectile-ball" cx="45" cy="207" r="9" fill="#f5a64a" stroke="#a96e25" stroke-width="2"/><text x="20" y="22" font-size="13" fill="#37645b">Ideal trajectory · no air resistance</text><text x="35" y="225" font-size="12" fill="#52766e">Launch</text><text x="455" y="225" font-size="12" fill="#52766e">Range</text></svg>';
 }
 if(type==="circuit"){
 let branches=s.series?'<path d="M165 52H215 M305 52H365" stroke="#476c67" stroke-width="4"/><rect x="215" y="39" width="90" height="26" rx="7" fill="#fff" stroke="#0a8178" stroke-width="3"/><text x="260" y="56" text-anchor="middle" font-size="13">R₁</text><rect x="366" y="39" width="88" height="26" rx="7" fill="#fff" stroke="#0a8178" stroke-width="3"/><text x="410" y="56" text-anchor="middle" font-size="13">R₂</text>':'<path d="M170 52V25H360V52 M170 52V95H360V52" stroke="#476c67" stroke-width="3" fill="none"/><rect x="227" y="13" width="80" height="25" rx="6" fill="#fff" stroke="#0a8178" stroke-width="2"/><text x="267" y="30" text-anchor="middle" font-size="12">R₁</text><rect x="227" y="83" width="80" height="25" rx="6" fill="#fff" stroke="#0a8178" stroke-width="2"/><text x="267" y="100" text-anchor="middle" font-size="12">R₂</text>';
 return '<svg viewBox="0 0 520 180" role="img" aria-label="Battery and resistor circuit" class="phy-svg"><path d="M80 52H170 M455 52H480V147H80V104" stroke="#476c67" stroke-width="4" fill="none"/><path d="M55 52V104 M45 104H65 M49 115H61 M55 115V147H80" stroke="#476c67" stroke-width="3"/><text x="13" y="78" font-size="13">'+s.voltage+' V</text>'+branches+'<circle id="phy-circuit-charge" r="6" cx="80" cy="52" fill="#efa544"/><text x="180" y="157" font-size="13" fill="#32675f">Current = '+num(d.I)+' A</text></svg>';
 }
 if(type==="optics"){
 let a=s.angle*Math.PI/180,angle2=d.theta===null?null:d.theta*Math.PI/180,x1=260-145*Math.sin(a),y1=130-145*Math.cos(a);
 let refract=d.critical?'':('<path d="M260 130 L'+(260+145*Math.sin(angle2))+' '+(130+110*Math.cos(angle2))+'" stroke="#0c8b83" stroke-width="4"/><path d="M'+(260+145*Math.sin(angle2))+' '+(130+110*Math.cos(angle2))+'" stroke="#0c8b83"/>');
 return '<svg viewBox="0 0 520 260" role="img" aria-label="Light ray refracting at a surface according to Snell law" class="phy-svg"><rect width="520" height="130" fill="#f1faf7"/><rect y="130" width="520" height="130" fill="#dcecf9"/><path d="M0 130H520" stroke="#729da9" stroke-width="3"/><path d="M260 10V250" stroke="#809ca2" stroke-dasharray="5 6" stroke-width="1.5"/><path d="M'+x1+' '+y1+' L260 130" stroke="#f3a13f" stroke-width="4"/>'+refract+(d.critical?'<path d="M260 130 L'+(260+145*Math.sin(a))+' '+(130-145*Math.cos(a))+'" stroke="#f3a13f" stroke-width="4"/>':'')+'<circle cx="260" cy="130" r="5" fill="#174e4e"/><text x="25" y="24" font-size="13" fill="#285b57">Medium 1: n = '+s.n1+'</text><text x="25" y="151" font-size="13" fill="#285b57">Medium 2: n = '+s.n2+'</text></svg>';
 }
 return '<svg viewBox="0 0 520 190" role="img" aria-label="Logic gate showing two digital inputs and output" class="phy-svg"><path d="M60 57H186 M60 127H186" stroke="#328a87" stroke-width="5"/><rect x="186" y="36" width="140" height="112" rx="25" fill="#ecf8f5" stroke="#0b8176" stroke-width="3"/><text x="256" y="101" text-anchor="middle" font-size="25" font-weight="700" fill="#125d56">'+esc(s.gate)+'</text><path d="M326 92H465" stroke="#328a87" stroke-width="5"/><circle cx="465" cy="92" r="17" fill="'+(d.output?"#24a47e":"#dce6e3")+'" stroke="#2a7068"/><text x="48" y="45" font-size="17">A: '+s.a+'</text><text x="48" y="119" font-size="17">B: '+s.b+'</text><text x="455" y="56" font-size="16">Output '+d.output+'</text></svg>';
}
function explanation(type){let d=calculate(type),s=states[type];if(type==="projectile")return 'Flight time: '+num(d.flight)+' s · Horizontal range: '+num(d.range)+' m · Maximum height: '+num(d.height)+' m';
 if(type==="circuit")return 'Equivalent resistance: '+num(d.R)+' Ω · Current: '+num(d.I)+' A · Power: '+num(d.P)+' W';
 if(type==="optics")return d.critical?'Total internal reflection (idealized) — the ray remains in medium 1.':'Refracted angle: '+num(d.theta)+'° · Snell: n₁ sin θ₁ = n₂ sin θ₂';
 return 'Digital output: '+d.output+' · '+s.gate+' truth table rule';
}
function update(type){
 let root=document.getElementById("phy-special-"+type);if(!root)return;
 let image=root.querySelector("[data-simulation]");if(image)image.innerHTML=svg(type);
 let result=root.querySelector("[data-explanation]");if(result)result.textContent=explanation(type);
 for(const el of root.querySelectorAll("[data-val]")){let k=el.dataset.val;el.textContent=states[type][k]+(k==="angle"?"°":"")}
}
function animate(t){
 if(!playing)return;
 const d=calculate("projectile"),s=states.projectile;
 if(!started)started=t;elapsed=(t-started)/1000;
 const ball=document.getElementById("phy-projectile-ball");
 if(!ball){stop();return}
 const phase=Math.min(1,elapsed/Math.max(.01,d.flight));
 const x=45+435*phase,y=207-(s.speed*Math.sin(s.angle*Math.PI/180)*(d.flight*phase)-.5*s.g*(d.flight*phase)**2)*Math.min(150/Math.max(1,d.height),435/Math.max(1,d.range));
 ball.setAttribute("cx",x);ball.setAttribute("cy",Math.max(10,y));
 if(phase>=1){playing=false;started=0;return}
 frame=requestAnimationFrame(animate);
}
function play(){stop();playing=true;started=0;frame=requestAnimationFrame(animate)}
function render(topic){
 const type=kind(topic);if(!type)return "";
 const s=states[type];
 const ranges=type==="projectile"?track(type,"speed",5,30,1,"m/s")+track(type,"angle",10,80,1,"°")+track(type,"g",2,15,.1,"m/s²"):
 type==="circuit"?track(type,"voltage",1,24,1,"V")+track(type,"r1",1,20,1,"Ω")+track(type,"r2",1,20,1,"Ω")+'<label class="phy-control">Connection <select onchange="EBDAA_PHYSICS_SPECIAL.set(\'circuit\',\'series\',this.value)"><option value="series" '+(s.series?"selected":"")+'>Series</option><option value="parallel" '+(!s.series?"selected":"")+'>Parallel</option></select></label>':
 type==="optics"?track(type,"n1",1,2,.05,"")+track(type,"n2",1,2,.05,"")+track(type,"angle",0,80,1,"°"):
 '<label class="phy-control">Logic gate<select onchange="EBDAA_PHYSICS_SPECIAL.set(\'logic\',\'gate\',this.value)">'+["AND","OR","NOT","NAND","NOR"].map(x=>'<option '+(x===s.gate?"selected":"")+'>'+x+'</option>').join("")+'</select></label>'+["a","b"].map(k=>'<label class="phy-control">Input '+k.toUpperCase()+'<select onchange="EBDAA_PHYSICS_SPECIAL.set(\'logic\',\''+k+'\',this.value)"><option value="0" '+(!s[k]?"selected":"")+'>0 · OFF</option><option value="1" '+(s[k]?"selected":"")+'>1 · ON</option></select></label>').join("");
 const title={projectile:"🚀 Projectile Motion Studio",circuit:"⚡ Circuit Builder",optics:"🌈 Refraction Explorer",logic:"🧠 Digital Logic Playground"}[type];
 return '<section class="phy-sim" id="phy-special-'+type+'"><div class="phy-top"><div><span class="eyebrow">INTERACTIVE EXPERIMENT</span><h3>'+title+'</h3></div><span class="phy-chip">Change → Observe → Explain</span></div><div class="phy-image" data-simulation>'+svg(type)+'</div><div class="phy-controls">'+ranges+'</div><div class="phy-output" data-explanation role="status">'+explanation(type)+'</div>'+(type==="projectile"?'<button type="button" class="btn teal" onclick="EBDAA_PHYSICS_SPECIAL.play()">▶ Launch projectile</button>':'')+'<p class="muted" style="font-size:12px">Idealized classroom simulation. '+(type==="circuit"?"Resistors are ideal; circuit wires have zero resistance.":type==="optics"?"Ray diagram uses Snell’s law and does not simulate absorption.":type==="projectile"?"Constant gravitational acceleration; no air resistance.":"Logic states are ideal binary values.")+'</p></section>';
}
return {render,set,play,stop,calculate,kind};
})();