(function(){
/* STEM Physics interactive, parameterized conceptual simulations.
   Formula models are idealized educational examples, not measurements or publisher exercises. */
const models={
 measurement:["Measured length","m",1,0,"Length readings must include a unit."],
 units:["Area of a rectangle","m²",2,0,"Area = length × width."],
 weight:["Weight on Earth","N",9.8,0,"Weight = mass × gravitational acceleration (g = 9.8 m/s²)."],
 error:["Absolute measurement error","cm",1,0,"Absolute error is the magnitude of measured minus reference value."],
 motion:["Distance at constant speed","m",2,0,"Distance = speed × time."],
 vectors:["Net displacement in one direction","m",1,0,"Displacement includes direction."],
 speed:["Speed","m/s",1,0,"Speed = distance ÷ time."],
 acceleration:["Acceleration","m/s²",1,0,"Acceleration = change in velocity ÷ time."],
 motionEq:["Displacement from rest","m",.5,2,"For initial velocity zero: displacement = ½at²."],
 newton:["Resultant force","N",1,1,"Newton's second law: F = ma. A zero net force means zero acceleration."],
 force:["Resultant force","N",1,1,"Force = mass × acceleration."],
 work:["Mechanical work","J",1,1,"For force parallel to displacement, W = Fd."],
 energy:["Kinetic energy","J",.5,2,"Kinetic energy = ½mv²."],
 power:["Power","W",1,0,"Power = work ÷ time."],
 wave:["Wave speed","m/s",1,1,"Wave speed = frequency × wavelength."],
 light:["Frequency × wavelength","m/s",1,1,"In vacuum electromagnetic waves travel at approximately 3 × 10⁸ m/s."],
 refraction:["Refractive index","",1,0,"For light passing from vacuum into a medium: n = c/v."],
 gravity:["Gravitational force factor","relative",1,1,"For fixed distance, gravitational force is proportional to both masses."],
 centripetal:["Centripetal acceleration","m/s²",1,2,"Centripetal acceleration = speed² ÷ radius."],
 friction:["Maximum static friction","N",1,1,"A simplified model: maximum static friction = μ × normal force."],
 heat:["Final temperature after heating","°C",1,0,"Final temperature = initial temperature + temperature rise."],
 temperature:["Kelvin temperature","K",1,0,"Kelvin = Celsius + 273.15."],
 heatCapacity:["Thermal energy","J",1,1,"Q = mcΔT when there is no phase change."],
 charge:["Electric charge","C",1,1,"Charge Q = current × time."],
 coulomb:["Electrostatic force factor","relative",1,1,"Magnitude of Coulomb force scales with q₁q₂/r²."],
 field:["Electric field intensity","N/C",1,0,"E = electric force ÷ test charge."],
 capacitance:["Stored charge","C",1,1,"Q = capacitance × voltage."],
 current:["Electric charge","C",1,1,"Charge = current × time."],
 ohm:["Voltage","V",1,1,"Ohm's law V = IR."],
 resistors:["Series resistance","Ω",1,0,"Series equivalent resistance equals the sum of component resistances."],
 magnetic:["Magnetic flux","Wb",1,1,"For a field perpendicular to a surface, magnetic flux = BA."],
 wire:["Magnetic field proportionality","relative",1,0,"For a long straight wire, B is proportional to current / distance."],
 coil:["Coil field proportionality","relative",1,0,"At a circular coil center, B is proportional to turns × current / radius."],
 solenoid:["Solenoid field proportionality","relative",1,0,"For a long solenoid, B is proportional to turns per length × current."],
 magforce:["Magnetic force","N",1,1,"For a perpendicular wire in a uniform magnetic field, F = BIL."],
 torque:["Coil torque (sin 90°)","N·m",1,1,"At maximum angle, torque = NBIA."],
 faraday:["Induced emf magnitude","V",1,0,"For constant rate of flux change, |emf| = turns × |ΔΦ| / Δt."],
 transformer:["Secondary voltage","V",1,1,"Ideal transformer Vs / Vp = Ns / Np."],
 photon:["Photon energy (scaled)","relative",1,0,"Photon energy E = hf, proportional to frequency."],
 photoelectric:["Maximum photoelectron energy","eV",1,0,"Kmax = photon energy − work function when positive."],
 semiconductor:["Relative conductivity model","relative",1,0,"This is a conceptual scaling activity, not a calibrated semiconductor device."],
 diode:["Current allowed? (1 = yes)","",1,0,"An ideal diode conducts under forward bias; actual diodes have nonideal behavior."],
 transistor:["Collector current","mA",1,1,"In a simplified active-region transistor model Ic ≈ βIb."],
 logic:["AND gate output (1/0)","",1,1,"An AND gate outputs 1 only when both inputs are 1."]
};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function round(n){return Math.round(n*1000)/1000}
function task(topic,n){
 const a=2+(n%7),b=2+(Math.floor(n/7)%6),model=models[topic]||models.force;
 let out,formula="";switch(topic){
 case "units":out=a*b;formula="A = "+a+" × "+b;break;
 case "weight":out=a*9.8;formula="W = "+a+" × 9.8";break;
 case "error":out=Math.abs(a-b);formula="|"+a+" − "+b+"|";break;
 case "speed":case "acceleration":case "power":case "field":out=a/b;formula=a+" ÷ "+b;break;
 case "centripetal":out=a*a/b;formula=a+"² ÷ "+b;break;
 case "energy":out=.5*a*b*b;formula="½ × "+a+" × "+b+"²";break;
 case "motionEq":out=.5*a*b*b;formula="½ × "+a+" × "+b+"²";break;
 case "temperature":out=a+273.15;formula=a+" + 273.15";break;
 case "photoelectric":out=Math.max(0,a-b);formula="max(0, "+a+" − "+b+")";break;
 case "diode":out=n%2;formula="Forward bias: "+(out?"yes":"no");break;
 case "logic":out=(a%2)*(b%2);formula=(a%2)+" AND "+(b%2);break;
 case "resistors":case "heat":out=a+b;formula=a+" + "+b;break;
 case "faraday":case "wire":case "coil":case "solenoid":case "photon":case "semiconductor":out=a/b;formula=a+" ÷ "+b+" (scaled model)";break;
 case "gravity":case "coulomb":out=a*b/(2*2);formula=a+" × "+b+" ÷ 2² (relative)";break;
 case "refraction":out=3/a;formula="3 ÷ "+a+" (speed in 10⁸ m/s)";break;
 case "transformer":out=a*b;formula=a+" × "+b+" (Vp × Ns/Np)";break;
 default:out=a*b;formula=a+" × "+b;break;
 }
 return {a,b,value:round(out),formula,model};
}
function build(g,u,i){
 const unit=window.EBDAA_PHYSICS_UNITS[g][u],topic=unit.topics[i],out=[];
 for(let n=0;n<50;n++){
  const t=task(topic,n),mod=n%5;
  const q=mod===0?"Calculate the result using the displayed model.":mod===1?"Predict the output before revealing the calculation.":mod===2?"Test the model: what result do these parameters produce?":mod===3?"Physics mission: solve the numerical challenge.":"Complete the model by calculating its result.";
  const distract=[t.value+1,t.value-1,t.value+2].map(round);
  const options=[t.value,...distract];
  const sh=n%4,ordered=options.slice(sh).concat(options.slice(0,sh));
  out.push({topic,question:q,mode:["numeric","predict","multiple","numeric","predict"][mod],a:t.a,b:t.b,value:t.value,formula:t.formula,model:t.model,options:ordered,answer:(4-sh)%4});
 }
 return out;
}
window.EBDAA_PHYSICS_PRACTICE=window.EBDA_PRACTICE_FRAMEWORK.create({
 name:"EBDAA_PHYSICS_PRACTICE",subject:"physics",gameKey:"physics",learningMode:"physicsPractice",appliedKey:"physics",contextGames:true,
 locale:"en",inputId:"practice-answer",checkId:"physics-check",back:()=>physicsBack(),
 tolerance:q=>Math.max(.011,Math.abs(Number(q.answer))*.001),
 buildItems:(g,u,i)=>build(g,u,i).map(q=>{
  const base={...q,pmode:q.mode,explanation:"Result: "+q.value+" "+(q.model[1]||"")+" · "+q.formula,focus:1};
  if(q.mode==="multiple")return {...base,mode:"choice",options:q.options.map(v=>v+" "+q.model[1])};
  if(q.mode==="predict")return {...base,mode:"slider",answer:q.value};
  return {...base,mode:"number",answer:q.value};
 }),
 title:(g,u,i)=>window.EBDAA_PHYSICS_UNITS[g][u].sessions[i],
 header:g=>({exitLabel:"← Physics lessons",exit:()=>physicsBack(),yearLabel:"YEAR "+g+" · PHYSICS",disclaimer:"These 50 practice prompts are generated variations of simplified models; not 50 independent textbook questions. Models are illustrative, especially for semiconductors and magnetic proportionality. Teacher validation is required."}),
 eyebrow:q=>"PHYSICS LAB · "+esc((q.pmode||"").toUpperCase()),
 beforeControls:q=>'<div class="hint" style="margin-bottom:16px"><strong>'+esc(q.model[0])+'</strong><p>Input A = '+q.a+' · Input B = '+q.b+' · Unit: '+esc(q.model[1]||"dimensionless")+'</p><p>'+esc(q.model[4])+'</p></div>',
 sliderLabel:(q,v)=>"Experiment prediction: "+esc(v||"select a value"),
 afterControls:(q,{g,u,i,cursor,items})=>(window.EBDAA_CONTEXT_GAMES.physics([g,u,i].join("-"),cursor,q.topic)||window.EBDAA_CONTEXT_GAMES.physicsModel([g,u,i].join("-"),cursor,q))+window.EBDAA_CONTEXT_GAMES.report("physics",[g,u,i].join("-"),false)+window.NTSS_APPLIED.render("physics",[g,u,i].join("-"),cursor,window.EBDAA_PHYSICS_UNITS[g][u].sessions[i])+(window.EBDAA_PHYSICS_SPECIAL.render(q.topic)||window.EBDAA_PHYSICS_VISUAL.render(q.topic)),
 hooks:{onStart:()=>window.EBDAA_PHYSICS_SPECIAL?.stop(),onMove:()=>window.EBDAA_PHYSICS_SPECIAL?.stop()}
});

})();
