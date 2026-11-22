/* Real numerical specialty exercises for source-aligned sessions. All values are explicitly synthetic. */
window.EBDAA_SPECIAL=function(g,u,i,v){
const f=n=>Number(n).toFixed(3);const slider=(label,max=10)=>("<label for=\"studio-slider\"><b>"+(label)+": "+(v)+"</b></label><input id=\"studio-slider\" class=\"range\" type=\"range\" min=\"1\" max=\""+(max)+"\" value=\""+(v)+"\" "+window.NTSS_EVENTS.bind("input",function(event){EBDAA_STUDIO.value(this.value)},"EBDAA_STUDIO.value")+">");
const cell=(x)=>'<span class="visual-cell" style="font-size:15px">'+x+'</span>';let heading="",result="",method="",values="";
if(g===3&&u===0){
 if(i===0){const a=[4,5,6,v],mean=a.reduce((x,y)=>x+y)/4;heading="Descriptive statistics";result="Sample mean = "+f(mean)+", median = "+f([...a].sort((x,y)=>x-y).reduce((x,y,idx,arr)=>idx===1?y:idx===2?x+y:x)/2);method="The mean describes the observed sample. Inferring population properties requires sampling assumptions.";}
 if(i===1){heading="Probability distributions";const p=v/10;result="P(success) = "+f(p)+"; P(failure) = "+f(1-p)+"; expected successes in 10 trials = "+f(10*p);method="Illustrative Bernoulli event with probability p; expectations do not guarantee an observed count.";}
 if(i===3){heading="Pearson correlation";const x=[1,2,3,4],y=[2,4,v,8],mx=2.5,my=y.reduce((a,b)=>a+b)/4,cov=x.reduce((a,z,j)=>a+(z-mx)*(y[j]-my),0),sx=x.reduce((a,z)=>a+(z-mx)**2,0),sy=y.reduce((a,z)=>a+(z-my)**2,0);result="Pearson r = "+f(cov/Math.sqrt(sx*sy));method="A correlation measures linear association, not causal effect.";}
 if(i===4){heading="Bayes theorem";const sens=0.9,prev=v/100,fp=0.1,post=(sens*prev)/(sens*prev+fp*(1-prev));result="Prevalence "+v+"%, sensitivity 90%, false-positive rate 10% → P(condition|positive) = "+f(post*100)+"%";method="Bayes: sensitivity×prevalence / (sensitivity×prevalence + false-positive-rate×(1−prevalence)).";}
}
if(g===2&&u===4){
 if(i===2){heading="Mean imputation";const data=[2,null,4,v,10],known=data.filter(x=>x!==null),mean=known.reduce((a,b)=>a+b)/known.length;result="Imputed missing value = "+f(mean)+"; complete series = "+data.map(x=>x===null?f(mean):x).join(", ");method="Mean imputation is a baseline and can underestimate variance; use training-only estimates.";}
 if(i===3){heading="Class imbalance analysis";const minority=v,majority=30;result="Class A = "+majority+"; class B = "+minority+"; minority share = "+f(100*minority/(minority+majority))+"%";method="Review precision, recall and class support, not raw accuracy alone.";}
 if(i===4){heading="Min–max and Z-score";const nums=[2,5,8,v],avg=nums.reduce((a,b)=>a+b)/4,sigma=Math.sqrt(nums.reduce((a,b)=>a+(b-avg)**2,0)/4),minimum=Math.min(...nums),maximum=Math.max(...nums);result="Scaled final value = "+f((v-minimum)/(maximum-minimum||1))+"; Z-score = "+f((v-avg)/(sigma||1));method="Compute scaling parameters from the training set to prevent leakage.";}
}
if(g===2&&u===5){
 if(i===3){heading="Classification confusion matrix";const tp=v,fp=2,fn=3,tn=12;result="Precision = "+f(tp/(tp+fp))+"; Recall = "+f(tp/(tp+fn))+"; F1 = "+f(2*tp/(2*tp+fp+fn));method="TP, FP, FN and TN are synthetic counts. Compare metrics in the context of missed defects.";}
 if(i===4){heading="Single-neuron activation";const x=v/10,w=1.5,b=-0.5,z=x*w+b,prob=1/(1+Math.exp(-z));result="z = "+f(z)+"; sigmoid(z) = "+f(prob);method="An illustrative neuron; it is not a trained deep-learning network.";}
}
if(g===3&&u===5){
 if(i===1||i===2){heading="Soil moisture irrigation decision";const moisture=v*5,threshold=30,needed=Math.max(0,threshold-moisture);result="Measured moisture = "+moisture+"%; target = 30%; simplified moisture gap = "+needed+" percentage points";method="An educational threshold model, not a calibrated irrigation quantity or validated crop recommendation.";}
 if(i===3){heading="Pollution alert threshold";const readings=[20,24,25,27,v*6,31];result="Readings above 30 (synthetic units) = "+readings.filter(x=>x>30).length+" of "+readings.length;method="Threshold alert count is not a trained predictor. Sensor calibration and context are required.";}
}
if(!heading)return null;return '<section class="interactive"><div class="eyebrow">SESSION-SPECIFIC CALCULATOR</div><h3>'+heading+'</h3><p>Change the supplied value, recalculate and explain the effect.</p>'+slider("Input")+'<div class="feedback"><b>Computed result</b><p>'+result+'</p></div><p class="muted">'+method+'</p></section>';
};