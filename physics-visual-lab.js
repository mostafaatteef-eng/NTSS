/* An independent, interactive physics experiment panel for supported physical models.
 * Student data stays in the browser. This panel is illustrative, not a calibrated laboratory.
 */
window.EBDAA_PHYSICS_VISUAL=(function(){
let a=4,b=3;
const m={
 force:["F = m × a","Mass (kg)","Acceleration (m/s²)","N",(x,y)=>x*y],
 newton:["F = m × a","Mass (kg)","Acceleration (m/s²)","N",(x,y)=>x*y],
 weight:["W = m × g","Mass (kg)","Gravity g (m/s²)","N",(x,y)=>x*y],
 speed:["v = d / t","Distance (m)","Time (s)","m/s",(x,y)=>x/y],
 acceleration:["a = Δv / t","Velocity change (m/s)","Time (s)","m/s²",(x,y)=>x/y],
 work:["W = F × d","Force (N)","Displacement (m)","J",(x,y)=>x*y],
 power:["P = W / t","Work (J)","Time (s)","W",(x,y)=>x/y],
 energy:["KE = ½mv²","Mass (kg)","Speed (m/s)","J",(x,y)=>.5*x*y*y],
 wave:["v = fλ","Frequency (Hz)","Wavelength (m)","m/s",(x,y)=>x*y],
 centripetal:["a = v²/r","Speed (m/s)","Radius (m)","m/s²",(x,y)=>x*x/y],
 heatCapacity:["Q = mcΔT (c=1)","Mass (kg)","Temperature change (°C)","J (model)",(x,y)=>x*y],
 capacitance:["Q = CV","Capacitance (F)","Voltage (V)","C",(x,y)=>x*y],
 ohm:["V = IR","Current (A)","Resistance (Ω)","V",(x,y)=>x*y],
 current:["Q = It","Current (A)","Time (s)","C",(x,y)=>x*y],
 charge:["Q = It","Current (A)","Time (s)","C",(x,y)=>x*y],
 magforce:["F = BIL (L=1, sin θ=1)","B (T)","Current (A)","N (model)",(x,y)=>x*y],
 transformer:["Vs = Vp × Ns/Np","Primary voltage (V)","Turns ratio Ns/Np","V",(x,y)=>x*y],
 transistor:["Ic = βIb","Base current (mA)","Gain β","mA",(x,y)=>x*y],
 resistors:["R = R₁ + R₂","Resistance 1 (Ω)","Resistance 2 (Ω)","Ω",(x,y)=>x+y],
 field:["E = F/q","Force (N)","Charge (C)","N/C",(x,y)=>x/y],
 measurement:["Area = length × width","Length (m)","Width (m)","m²",(x,y)=>x*y]
};
const e=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function change(which,v){if(which==="a")a=Number(v);else b=Number(v);const panel=document.getElementById("physics-live-panel");if(panel){const topic=panel.dataset.topic,model=m[topic];if(model){const value=model[4](a,b);const v=Math.round(value*1000)/1000;const number=panel.querySelector("[data-result]");if(number)number.textContent=v+" "+model[3];for(const bar of panel.querySelectorAll("[data-bar]"))bar.style.width=(bar.dataset.bar==="a"?a*10:bar.dataset.bar==="b"?b*10:Math.min(100,Math.max(2,Math.abs(value)*2)))+"%"}}}
function render(topic){const x=m[topic];if(!x)return '<p class="muted" style="font-size:12px">This topic currently uses numerical practice only. A dedicated simulation is not yet available.</p>';
 const val=Math.round(x[4](a,b)*1000)/1000;
 return '<div id="physics-live-panel" data-topic="'+e(topic)+'" class="hint" style="margin:24px 0;padding:20px"><div class="eyebrow">🔬 EXPLORE · LIVE EXPERIMENT</div><h3 style="margin:8px 0">'+e(x[0])+'</h3><p>Change the parameters to observe how the predicted output responds. This is separate from the scored question.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px">'+[["a",x[1],a],["b",x[2],b]].map(([id,label,v])=>("<label style=\"display:block;font-size:13px\">"+(e(label))+"<input type=\"range\" min=\"1\" max=\"10\" step=\"1\" value=\""+(v)+"\" style=\"display:block;width:100%;margin:12px 0\" "+window.NTSS_EVENTS.bind("input",function(event){EBDAA_PHYSICS_VISUAL.change((id),this.value)},"EBDAA_PHYSICS_VISUAL.change")+"><div style=\"height:8px;background:#dcece5;border-radius:12px;overflow:hidden\"><div data-bar=\""+(id)+"\" style=\"height:100%;width:"+(v*10)+"%;background:#0a8a80;border-radius:12px\"></div></div></label>")).join("")+'</div><div style="margin:18px 0 10px;font-weight:800;font-size:20px" data-result>'+val+' '+e(x[3])+'</div><div style="height:14px;background:#deebe5;border-radius:20px;overflow:hidden"><div data-bar="result" style="background:#0c9c8b;width:'+Math.min(100,Math.max(2,Math.abs(val)*2))+'%;height:100%;transition:width .15s"></div></div><p class="muted" style="font-size:12px;margin-top:8px">Idealized model with fixed assumptions. Not a real-world measurement.</p></div>';
}
return {render,change};
})();