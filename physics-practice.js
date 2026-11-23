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
// Supplementary parameterized practice aligned to the two user-supplied Year 1 guides.
// Source page numbers are printed PDF pages, not an asserted publication year.
function guideBank(g,u,i){
 if(g!==1||!((u===0&&(i===0||i===2))||(u===3&&i>=3&&i<=5)))return null;
 const bank=u===0?(i===0?"measurement":"length-time"):["light","refraction","tir"][i-3],out=[];
 const fmt=x=>String(Math.round(x*1000)/1000),deg=x=>x*180/Math.PI;
 for(let n=0;n<50;n++){
  const family=n%5,k=Math.floor(n/5),a=k+2;let question,answer,explanation,options,unit="",tag,params={};
  if(bank==="measurement"){
   if(family===0){tag="cm-to-m";params={cm:125+25*k};question=`Convert a measured length of ${params.cm} cm to metres.`;answer=params.cm/100;unit="m";explanation=`100 cm = 1 m; divide by 100.`;}
   if(family===1){tag="kg-to-g";params={kg:0.25+0.25*k};question=`Convert a measured mass of ${fmt(params.kg)} kg to grams.`;answer=params.kg*1000;unit="g";explanation=`1 kg = 1000 g; multiply by 1000.`;}
   if(family===2){tag="minutes-to-seconds";params={minutes:a};question=`An event lasts ${a} minutes. Express this time in seconds.`;answer=a*60;unit="s";explanation=`1 minute = 60 seconds.`;}
   if(family===3){tag="same-unit-length";params={m:a,cm:15+5*k};question=`Two lengths are ${a} m and ${params.cm} cm. Find their total length in metres.`;answer=a+params.cm/100;unit="m";explanation=`Convert centimetres to metres before adding lengths.`;}
   if(family===4){tag="quantity-unit";const qs=[['length','metre','kilogram','second'],['mass','kilogram','metre','second'],['time','second','metre','kilogram']][k%3];question=`Measurement record ${k+1}: which SI unit belongs with ${qs[0]}?`;options=[qs[1],qs[2],qs[3]];answer=0;explanation=`The SI base unit for ${qs[0]} is the ${qs[1]}. A measured value needs a quantity and a unit.`;}
  }else if(bank==="length-time"){
   if(family===0){tag="caliper-reading";params={mainMm:12+k,divisions:k%9+1,leastCountMm:0.1};question=`A caliper main-scale reading is ${params.mainMm} mm. Vernier division ${params.divisions} aligns; the stated least count is 0.1 mm. Find the total reading in mm.`;answer=params.mainMm+params.divisions*0.1;unit="mm";explanation=`Add main scale + aligned division × stated least count.`;}
   if(family===1){tag="micrometer-reading";params={mainMm:2+0.5*k,divisions:12+3*k,leastCountMm:0.01};question=`A micrometer main-scale reading is ${fmt(params.mainMm)} mm and its thimble reads ${params.divisions} divisions. Each division is 0.01 mm. Find the total reading in mm.`;answer=params.mainMm+params.divisions*0.01;unit="mm";explanation=`Add main-scale reading to thimble divisions × 0.01 mm.`;}
   if(family===2){tag="zero-correction";params={observedMm:5+k*0.25,errorMm:k%2===0?0.03:-0.04};question=`A micrometer shows ${fmt(params.observedMm)} mm with a signed zero error of ${params.errorMm>0?'+':''}${params.errorMm} mm. Find the corrected length in mm.`;answer=params.observedMm-params.errorMm;unit="mm";explanation=`Corrected reading = observed reading − signed zero error.`;}
   if(family===3){tag="stopwatch-reading";params={minutes:a,seconds:5+3*k};question=`A stopwatch displays ${a} minutes ${params.seconds} seconds. Express the elapsed time in seconds.`;answer=a*60+params.seconds;unit="s";explanation=`Convert the complete minutes to seconds, then add the remaining seconds.`;}
   if(family===4){tag="instrument-choice";const thin=k%2===0;question=`Task ${k+1}: choose the appropriate instrument to measure ${thin?'the thickness of a thin metal sheet, requiring 0.01 mm resolution':'a garden fence several metres long'}.`;options=thin?['Micrometer','Wall clock','Measuring tape']:['Measuring tape','Micrometer','Stopwatch'];answer=0;explanation=`Choose the instrument for the quantity, size and stated resolution.`;}
  }else if(bank==="light"){
   if(family===0){tag="vacuum-wavelength";params={frequencyTHz:400+25*k};question=`Light in vacuum has frequency ${params.frequencyTHz} THz. Use c = 3 × 10^8 m/s and 1 THz = 10^12 Hz. Find wavelength in nm (1 nm = 10^-9 m). Round to 3 decimal places.`;answer=300000/params.frequencyTHz;unit="nm";explanation=`λ = c/f; convert the result from metres to nanometres.`;}
   if(family===1){tag="vacuum-frequency";params={wavelengthNm:400+25*k};question=`Light in vacuum has wavelength ${params.wavelengthNm} nm. Use c = 3 × 10^8 m/s, 1 nm = 10^-9 m and 1 THz = 10^12 Hz. Find frequency in THz. Round to 3 decimal places.`;answer=300000/params.wavelengthNm;unit="THz";explanation=`f = c/λ. Convert nm to m and Hz to THz.`;}
   if(family===2){tag="vacuum-speed";params={frequencyTHz:400+25*k};question=`An electromagnetic wave in vacuum has frequency ${params.frequencyTHz} THz. State its speed in units of 10^8 m/s, using c = 3 × 10^8 m/s.`;answer=3;unit="× 10^8 m/s";explanation=`All electromagnetic frequencies have the same vacuum speed c.`;}
   if(family===3){tag="medium-wavelength";params={frequencyTHz:400+20*k,speedScale:2};question=`In a transparent medium, a light wave has speed 2 × 10^8 m/s and frequency ${params.frequencyTHz} THz (1 THz = 10^12 Hz). Find wavelength in nm (1 nm = 10^-9 m). Round to 3 decimal places.`;answer=200000/params.frequencyTHz;unit="nm";explanation=`Use λ = v/f in the medium. Frequency remains unchanged on crossing the boundary.`;}
   if(family===4){tag="boundary-frequency";question=`Boundary case ${k+1}: light passes from vacuum into glass. Which quantity remains unchanged?`;options=['Frequency','Speed','Wavelength'];answer=0;explanation=`Frequency is unchanged; speed and wavelength decrease in the ordinary glass model.`;}
  }else if(bank==="refraction"){
   if(family===0){tag="absolute-index";params={speedScale:1.5+0.1*k};question=`Light speed in an ordinary transparent medium is ${fmt(params.speedScale)} × 10^8 m/s. With c = 3 × 10^8 m/s, find its absolute refractive index. Round to 3 decimal places.`;answer=3/params.speedScale;explanation=`n = c/v. Here v < c, so the absolute index is greater than 1.`;}
   if(family===1){tag="medium-speed";params={index:1.2+0.1*k};question=`An ordinary transparent medium has absolute refractive index ${fmt(params.index)}. With c = 3 × 10^8 m/s, find its light speed in units of 10^8 m/s. Round to 3 decimal places.`;answer=3/params.index;unit="× 10^8 m/s";explanation=`Rearrange n = c/v to v = c/n.`;}
   if(family===2){tag="reflection-angle";params={incidence:15+5*k};question=`A ray meets a plane mirror at ${params.incidence}° to the normal. Find the angle of reflection, measured from the normal.`;answer=params.incidence;unit="degrees";explanation=`Angle of reflection equals angle of incidence, both measured from the normal.`;}
   if(family===3){tag="snell-angle";params={n1:1,n2:1.5,incidence:15+4*k};question=`Light passes from n1 = 1 into n2 = 1.5 at incidence ${params.incidence}° to the normal. Use n1 sin θ1 = n2 sin θ2. Find θ2 in degrees using inverse sine. Round to 3 decimal places.`;answer=deg(Math.asin(Math.sin(params.incidence*Math.PI/180)/1.5));unit="degrees";explanation=`θ2 = sin^-1[(1/1.5) sin θ1], in degree mode. The ray bends toward the normal.`;}
   if(family===4){tag="bending-direction";const denser=k%2===0;params={n1:denser?1:1.5,n2:denser?1.5:1,incidence:20};question=`Case ${k+1}: a ray at 20° to the normal passes from n1 = ${params.n1} into n2 = ${params.n2}. Which way does the transmitted ray bend?`;options=denser?['Toward the normal','Away from the normal','No bending']:['Away from the normal','Toward the normal','No bending'];answer=0;explanation=`At this angle transmission occurs. The higher-index medium has the smaller angle to the normal.`;}
  }else{
   if(family===0){tag="critical-angle";params={n1:1.4+0.1*k,n2:1};question=`Light goes from n1 = ${fmt(params.n1)} to n2 = 1. Calculate the critical angle θc = sin^-1(n2/n1) in degrees. Round to 3 decimal places.`;answer=deg(Math.asin(1/params.n1));unit="degrees";explanation=`Use inverse sine in degree mode. A critical angle exists because n1 > n2.`;}
   if(family===1){tag="critical-index";params={n2:1,criticalDeg:30+2*k};question=`For light passing from an unknown n1 into n2 = 1, the critical angle is ${params.criticalDeg}°. Use n1 sin θc = n2. Find n1. Round to 3 decimal places.`;answer=1/Math.sin(params.criticalDeg*Math.PI/180);explanation=`Rearrange to n1 = n2/sin θc. The result must exceed n2.`;}
   if(family===2){tag="critical-sine";params={n1:1.5+0.1*k,n2:1};question=`Light passes from n1 = ${fmt(params.n1)} to n2 = 1. Calculate sin θc using n1 sin θc = n2. Round to 3 decimal places.`;answer=1/params.n1;explanation=`sin θc = n2/n1; the ratio is between 0 and 1.`;}
   if(family===3){tag="tir-threshold";params={criticalDeg:35+k,offsetDeg:k%2===0?5:-5};question=`Light travels from higher to lower refractive index with critical angle ${params.criticalDeg}°. Its incidence is ${params.criticalDeg+params.offsetDeg}° to the normal. Enter 1 if total internal reflection occurs, otherwise 0.`;answer=params.offsetDeg>0?1:0;explanation=`TIR requires incidence strictly greater than θc as well as n1 > n2.`;}
   if(family===4){tag="tir-boundary";const boundary=k%2===0;params={boundary};question=`Case ${k+1}: ${boundary?'light goes from higher to lower index at incidence exactly equal to its critical angle':'light goes from n1 = 1 into n2 = 1.5 at incidence 50°'}. Select the correct statement.`;options=boundary?['Critical boundary: refracted ray at 90°, not TIR','Total internal reflection','Critical angle is zero']:['No TIR: light is entering the higher-index medium','Total internal reflection','Every interface produces TIR'];answer=0;explanation=boundary?'At θc the transmitted ray is along the interface. TIR requires a larger incidence angle.':'TIR requires propagation from higher to lower refractive index.';}
  }
  if(options){const shift=k%options.length;options=options.slice(shift).concat(options.slice(0,shift));answer=(options.length-shift)%options.length;}
  else answer=Number(fmt(answer));
  const source=bank==="measurement"?"Supplied Year 1 guide, Units 1-2, pp. 4-6":bank==="length-time"?"Supplied Year 1 guide, Units 1-2, pp. 9-12":bank==="light"?"Supplied Year 1 guide, Units 3-4, pp. 25-26":bank==="refraction"?"Supplied Year 1 guide, Units 3-4, pp. 29-31":"Supplied Year 1 guide, Units 3-4, pp. 32-34";
  out.push({id:[g,u,i,"guide1",n].join("-"),guideAligned:true,topic:bank==="tir"?"refraction":bank==="length-time"?"measurement":bank,question,answer,mode:options?"choice":"number",...(options?{options}:{}),family:tag,params,unit,focus:family+1,source,explanation:explanation+(options?"":` Result: ${fmt(answer)} ${unit}.`)});
 }
 return out;
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
 locale:"en",inputId:"practice-answer",checkId:"physics-check",sliderStep:0.001,sliderExact:true,back:()=>physicsBack(),
 tolerance:q=>Math.max(.011,Math.abs(Number(q.answer))*.001),
 buildItems:(g,u,i)=>guideBank(g,u,i)||build(g,u,i).map(q=>{
  const base={...q,pmode:q.mode,explanation:"Result: "+q.value+" "+(q.model[1]||"")+" · "+q.formula,focus:1};
  if(q.mode==="multiple")return {...base,mode:"choice",options:q.options.map(v=>v+" "+q.model[1])};
  if(q.mode==="predict")return {...base,mode:"slider",answer:q.value};
  return {...base,mode:"number",answer:q.value};
 }),
 title:(g,u,i)=>window.EBDAA_PHYSICS_UNITS[g][u].sessions[i],
 header:g=>({exitLabel:"← Physics lessons",exit:()=>physicsBack(),yearLabel:"YEAR "+g+" · PHYSICS",disclaimer:"These 50 practice prompts are generated variations of simplified models; not 50 independent textbook questions. Models are illustrative, especially for semiconductors and magnetic proportionality. Teacher validation is required."}),
 eyebrow:q=>"PHYSICS LAB · "+esc((q.pmode||"").toUpperCase()),
 beforeControls:q=>q.guideAligned?'<div class="hint" dir="ltr"><p>Answer unit: '+esc(q.unit||"dimensionless")+'</p><p>'+esc(q.source)+' · Newly authored supplementary practice, not copied guide exercises.</p></div>':'<div class="hint" style="margin-bottom:16px"><strong>'+esc(q.model[0])+'</strong><p>Input A = '+q.a+' · Input B = '+q.b+' · Unit: '+esc(q.model[1]||"dimensionless")+'</p><p>'+esc(q.model[4])+'</p></div>',
 sliderLabel:(q,v)=>"Experiment prediction: "+esc(v||"select a value"),
 afterControls:(q,{g,u,i,cursor,items})=>(window.EBDAA_CONTEXT_GAMES.physics([g,u,i].join("-"),cursor,q.topic)||window.EBDAA_CONTEXT_GAMES.physicsModel([g,u,i].join("-"),cursor,q))+window.EBDAA_CONTEXT_GAMES.report("physics",[g,u,i].join("-"),false)+window.NTSS_APPLIED.render("physics",[g,u,i].join("-"),cursor,window.EBDAA_PHYSICS_UNITS[g][u].sessions[i])+(window.EBDAA_PHYSICS_SPECIAL.render(q.topic)||window.EBDAA_PHYSICS_VISUAL.render(q.topic)),
 hooks:{onStart:()=>window.EBDAA_PHYSICS_SPECIAL?.stop(),onMove:()=>window.EBDAA_PHYSICS_SPECIAL?.stop()}
});

})();
