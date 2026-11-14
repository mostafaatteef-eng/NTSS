/* 50 generated formative practice variants per each of the 116 specialization lessons.
   Ten distinct unit-family reasoning targets, each with five controlled data variants.
   These are parameterized practice ITEMS, not 50 independently authored/checklist-verified questions.
   No student tracking. */
window.EBDAA_QUESTION_FACTORY=(function(){
const A=(stem,answer,why,mode="number",choices)=>({stem,answer,why,mode,choices});
const F={
programming:[
v=>A("What does print("+v+" + 2 * 3) output?",v+6,"Multiplication precedes addition."),
v=>A("How many iterations does range("+v+") produce?",v,"range(n) generates n iterations."),
v=>A("For x="+v+", what does x % 2 return?",v%2,"Modulo returns the remainder after integer division."),
v=>A("How many items are in ["+Array.from({length:v},(_,i)=>i+1).join(",")+"]?",v,"len() counts list elements."),
v=>A("A function computes double("+v+"). What is returned?",2*v,"double(n) returns 2*n."),
v=>A("Starting with x="+v+", what is x after x += 3?",v+3,"The += operator adds to the existing value."),
v=>A("How many numbers appear in range(1,"+(v+1)+")?",v,"The upper bound of range is excluded."),
v=>A("For x="+v+", evaluate int(x / 2) using positive inputs.",Math.floor(v/2),"Positive integer truncation yields the whole-number part."),
v=>A("How many times does a while loop run if count starts at 0 and continues while count < "+v+", incrementing count each time?",v,"The loop executes for 0 through n-1."),
v=>A("What does sum(range(1,"+(v+1)+")) evaluate to?",v*(v+1)/2,"The arithmetic sum is n(n+1)/2.")
],
math:[
v=>A("What is the mean of "+v+", "+(v+2)+", "+(v+4)+"?",v+2,"The middle value of three equally spaced numbers is the mean."),
v=>A("What is the range of "+v+", "+(v+2)+", "+(v+5)+"?",5,"Range = maximum − minimum."),
v=>A("A bag has "+v+" red tokens and 2 blue tokens. Probability of blue? Enter a decimal to 3 places.",Number((2/(v+2)).toFixed(3)),"Favorable outcomes divided by all tokens."),
v=>A("What is "+v+" squared?",v*v,"Multiply the number by itself."),
v=>A("Derivative of f(x)=x² at x="+v+"?",2*v,"Derivative is 2x."),
v=>A("What is the magnitude of vector ("+v+",0)?",v,"Magnitude √(x²+0²) for positive x."),
v=>A("For y=3x+2, what is y when x="+v+"?",3*v+2,"Substitute x into the linear expression."),
v=>A("If "+v+" out of 10 tests succeed, what is the success percentage?",10*v,"Percentage = successes / total ×100."),
v=>A("The set A contains 1 through "+v+". How many elements are in A?",v,"Each integer in the inclusive interval contributes one element."),
v=>A("For f(w)=w² and w="+v+", calculate gradient 2w.",2*v,"Derivative of w² is 2w.")
],
charts:[
v=>A("A graph shows A="+v+" and B="+(v+3)+". By how many units is B larger?",3,"Subtract A from B."),
v=>A("A factory produced "+v+" units Monday and "+(v+4)+" Tuesday. What is the increase?",4,"Tuesday minus Monday."),
v=>A("Values are ["+v+","+(v+2)+","+(v+4)+"]. What is their mean?",v+2,"Sum and divide by 3."),
v=>A("A bar represents "+v+" out of 10. What percentage is it?",v*10,"Divide by 10 and multiply by 100."),
v=>A("The x-axis has "+v+" monthly marks and 2 are missing. How many observed marks remain?",v-2,"Count available time points."),
v=>A("Revenue grows from "+v+" to "+(v+5)+". What is absolute growth?",5,"New minus old."),
v=>A("There are "+v+" categories with two measures each. How many bars in a grouped bar chart?",2*v,"Two bars per category."),
v=>A("A dataset has "+v+" observations and 1 invalid row. How many valid rows remain?",v-1,"Remove only the invalid observation in this hypothetical example."),
v=>A("The maximum is "+(v+5)+" and minimum "+v+". What axis span covers both?",5,"max−min."),
v=>A("A plot labels the first "+v+" observations of a 10-row table. How many are unlabeled?",10-v,"Total minus labeled.")
],
ai:[
v=>A("A simulated classifier flags "+v+" of 10 items. What is its flagged percentage?",10*v,"Flag rate = flagged / 10 ×100."),
v=>A("A rule uses threshold "+v+". What class label is returned for score "+(v+1)+" if score >= threshold means label 1?",1,"Score exceeds threshold."),
v=>A("A rule uses threshold "+v+". What class label is returned for score "+(v-1)+" if score >= threshold means label 1?",0,"Score falls below threshold."),
v=>A("Of "+(v+3)+" sensor alerts, 3 are false positives. How many are not false positives?",v,"Subtract false positives."),
v=>A("A model processes "+v+" images per second. How many after 4 seconds?",4*v,"Rate times duration."),
v=>A("A dataset has "+v+" invalid observations and 5 valid observations. How many total?",v+5,"Add both groups."),
v=>A("A vision model recognizes "+v+" of 10 objects. Calculate recall percentage, assuming all ten are actual positives.",10*v,"Recall=TP/(TP+FN)."),
v=>A("A crop sensor reports "+v+"% moisture; target is 30%. What is the shortfall in percentage points?",30-v,"Target minus measured moisture."),
v=>A("An AI process takes "+v+" ms and is optimized by 2 ms. What is new latency?",v-2,"Subtract the saved time."),
v=>A("There are "+v+" monitoring zones with 3 sensors each. How many sensors?",3*v,"Multiply zones by sensors.")
],
ml:[
v=>A("A model predicts "+v+" of 10 observations correctly. Accuracy percentage?",10*v,"Accuracy=correct/total×100."),
v=>A("Confusion matrix TP="+v+", FP=2. What is precision to 3 decimal places?",Number((v/(v+2)).toFixed(3)),"Precision=TP/(TP+FP)."),
v=>A("With TP="+v+" and FN=2, recall to 3 decimal places?",Number((v/(v+2)).toFixed(3)),"Recall=TP/(TP+FN)."),
v=>A("A one-dimensional query is at "+v+" and training points at "+(v-1)+" and "+(v+3)+". What is nearest distance?",1,"Use absolute difference."),
v=>A("A K-Means cluster contains "+v+" and "+(v+2)+". What is its mean centroid?",v+1,"Centroid is the arithmetic mean."),
v=>A("A neuron has input="+v+", weight=2 and bias=1. What is preactivation z?",2*v+1,"z=wx+b."),
v=>A("How many samples are in a train/test split with "+v+" training and 3 test cases?",v+3,"Add training and test counts."),
v=>A("A model makes "+v+" true positives and 1 false negative. How many actual positives?",v+1,"Actual positives=TP+FN."),
v=>A("A dataset has "+v+" features and a model adds two. New feature count?",v+2,"Count original plus engineered features."),
v=>A("Validation loss drops from "+(v+3)+" to "+v+". What is absolute reduction?",3,"Subtract final from initial.")
],
algorithms:[
v=>A("A stack contains "+v+" items. After 2 pops, how many remain?",v-2,"Each pop removes the current top."),
v=>A("A queue has "+v+" waiting jobs and receives 3. How many total?",v+3,"Add arriving jobs."),
v=>A("A tree has "+v+" leaves and 2 non-leaf nodes. Total nodes?",v+2,"Add leaves and non-leaf nodes."),
v=>A("An undirected chain with "+v+" vertices has how many edges?",v-1,"Each new vertex after the first adds an edge."),
v=>A("A full binary tree with "+v+" filled levels has how many nodes?",Math.pow(2,v)-1,"The number of nodes is 2^levels − 1."),
v=>A("What is the last element after sorting ["+v+","+(v+2)+","+(v-1)+"] ascending?",v+2,"The maximum ends the list."),
v=>A("A loop visits "+v+" graph nodes once. How many node visits occur?",v,"Each node is visited exactly once."),
v=>A("In a connected undirected tree with "+v+" vertices, how many edges?",v-1,"Any tree has |V|-1 edges."),
v=>A("A stack has "+v+" elements and receives one push and one pop. Final count?",v,"The operations cancel."),
v=>A("In a zero-indexed array of length "+v+", what is the last valid index?",v-1,"Indexes run 0 through n-1.")
],
sql:[
v=>A("A query returns "+v+" Cairo rows and 3 Giza rows. How many rows total?",v+3,"Add rows from each region."),
v=>A("A group has quantities "+v+" and "+(v+2)+". What does SUM(qty) return?",2*v+2,"SQL SUM adds numeric values."),
v=>A("A group has quantities "+v+" and "+(v+2)+". What does AVG(qty) return?",v+1,"AVG is sum divided by count."),
v=>A("A table has "+(v+2)+" rows and WHERE excludes 2. Remaining rows?",v,"Filtering reduces rows by the excluded count."),
v=>A("An INNER JOIN matches "+v+" distinct foreign keys once each. How many matched rows, assuming one matching row per key?",v,"One-to-one matches yield one result per key."),
v=>A("A table has "+v+" unique primary keys. How many distinct IDs?",v,"Primary keys cannot repeat."),
v=>A("COUNT(*) sees "+v+" rows including two null values. What does it return?",v,"COUNT(*) counts all rows, regardless of null columns."),
v=>A("COUNT(column) sees "+v+" rows with two NULL entries. What does it return?",v-2,"COUNT(column) ignores NULL."),
v=>A("A transaction inserts "+v+" rows and rolls back fully. How many inserted rows remain?",0,"Rollback cancels the uncommitted transaction."),
v=>A("Rows have qty="+v+" and qty="+(v+1)+". How many pass WHERE qty > "+v+"?",1,"Only the second quantity exceeds the strict threshold.")
],
preprocess:[
v=>A("There are "+v+" rows and 2 duplicates. Unique rows?",v-2,"Assume precisely two duplicate extra rows."),
v=>A("A column has "+v+" entries and 1 missing value. Completeness percentage?",Number(((v-1)/v*100).toFixed(3)),"Completeness = observed/total ×100."),
v=>A("Values "+v+" and "+(v+4)+" have range?",4,"Max minus min."),
v=>A("Scale x="+(v+1)+" from min="+v+" max="+(v+2)+" by min-max. Result?",0.5,"(x-min)/(max-min)."),
v=>A("A dataset has "+v+" minority cases and 2 majority cases. Total?",v+2,"Sum class supports."),
v=>A("A text document has "+v+" words and removes 2 stopwords. Remaining?",v-2,"Subtract only removed tokens."),
v=>A("A dataset starts with "+v+" features and engineers 3 new features. Total?",v+3,"Engineered features add columns."),
v=>A("A time series has "+v+" rows. One lag-1 feature creates how many rows with observed lag?",v-1,"The first record has no previous observation."),
v=>A("A cleaned dataset has "+v+" rows and 2 invalid rows to remove. How many remain?",v-2,"Subtract invalid records."),
v=>A("A label encoder has "+v+" distinct categories. Number of distinct codes?",v,"One code per category.")
],
annotation:[
v=>A("Two annotators agree on "+v+" of 10 labels. Agreement percentage?",v*10,"Agreed/total×100."),
v=>A("There are "+v+" images and each requires two bounding boxes. Total boxes?",v*2,"Two boxes per image."),
v=>A("A reviewer corrects 2 labels in a batch of "+v+". How many remain unchanged?",v-2,"Batch size minus corrections."),
v=>A("Of "+v+" images, 1 lacks annotation. How many are annotated?",v-1,"Subtract the unannotated image."),
v=>A("An audit samples "+v+" images from each of 3 categories. Total sampled?",3*v,"Three equally sampled categories."),
v=>A("Two labels cover "+v+" and 2 examples. Total annotated examples?",v+2,"Add class counts."),
v=>A("A dataset has "+v+" mislabeled images. After correcting 2, how many mislabeled remain?",v-2,"Assume only these two were fixed."),
v=>A("One annotator labels "+v+" images per hour. How many in 3 hours?",3*v,"Rate×duration."),
v=>A("A class has "+v+" bounding boxes, each with four corner coordinates in this hypothetical format. Total coordinates?",4*v,"Four scalar coordinates per box."),
v=>A("A consensus audit checks "+v+" labels and finds 1 mismatch. Agreement count?",v-1,"Total minus mismatches.")
],
monitor:[
v=>A("A service receives "+v+" requests per minute. Total in 3 minutes?",3*v,"Rate times time."),
v=>A("Response times are "+v+" and "+(v+4)+" ms. Average?",v+2,"Arithmetic mean of two samples."),
v=>A("An alert threshold is "+v+" ms. How many of ["+(v-1)+","+v+","+(v+1)+"] strictly exceed it?",1,"Only v+1 exceeds the threshold."),
v=>A("A monitor recorded "+v+" successes and 2 errors. Total requests?",v+2,"Add both outcomes."),
v=>A("A server has "+v+" requests, 2 fail. Successful requests?",v-2,"Subtract failures."),
v=>A("A monitor polls every minute for "+v+" minutes, beginning at minute 1. How many polls?",v,"One poll each minute."),
v=>A("Two services have latencies "+v+" and "+(v+5)+" ms. How many ms slower is the second?",5,"Subtract latency values."),
v=>A("A recovery plan has "+v+" actions, and 2 are complete. Remaining?",v-2,"Actions not yet completed."),
v=>A("A rolling window contains "+v+" datapoints. Adding 1 and evicting 1 leaves how many?",v,"Window size stays constant."),
v=>A("A log contains "+v+" entries and 1 duplicate. Unique entries?",v-1,"Subtract duplicate copy.")
],
pipeline:[
v=>A("An ETL pipeline extracts "+v+" records and removes 2 duplicates. Loaded records?",v-2,"Subtract duplicate records."),
v=>A("Three sources each deliver "+v+" rows. Total raw rows?",3*v,"Three source sizes added."),
v=>A("A dataset has "+v+" valid rows and 2 invalid. Completeness of valid share (%)?",Number((100*v/(v+2)).toFixed(3)),"Valid / total ×100."),
v=>A("The first batch has "+v+" records, second batch 4. Combined?",v+4,"Add batch sizes."),
v=>A("After removing 1 invalid row from "+v+" rows, what remains?",v-1,"Remove the invalid row."),
v=>A("An integration job loads "+v+" rows per minute for 3 minutes. Total?",3*v,"Rate × minutes."),
v=>A("A schema has "+v+" required fields. One is missing. How many provided?",v-1,"Required minus missing."),
v=>A("A pipeline reads "+v+" files. One fails validation. Files accepted?",v-1,"Reject the invalid file."),
v=>A("Data travels through "+v+" systems, with a check at each. How many checks?",v,"One check per system."),
v=>A("Two partitions contain "+v+" and "+(v+1)+" rows. Total?",2*v+1,"Add partition sizes.")
],
fairness:[
v=>A("Group A approves "+v+" of 10 cases. Approval rate (%)?",10*v,"Approved / total ×100."),
v=>A("Group A approves 8/10, group B "+v+"/10. Absolute rate gap (percentage points)?",Math.abs(80-10*v),"Difference between percentage rates."),
v=>A("A privacy audit checks "+v+" fields and finds 2 sensitive. Nonsensitive count?",v-2,"Subtract sensitive fields."),
v=>A("An access list has "+v+" accounts. Remove 2 excessive permissions. Remaining accounts authorized?",v-2,"Assume the two accounts lose authorization."),
v=>A("A review checks "+v+" group predictions and finds 1 invalid label. Valid labels?",v-1,"Subtract invalid label."),
v=>A("A model has "+v+" false positives and 2 true negatives. Total predicted positive count can't be derived from these alone. Enter 1 if statement is true.",1,"Without true positives, the total predicted-positive count is not determined."),
v=>A("A dataset includes "+v+" personal fields. Mask 2. Unmasked personal fields?",v-2,"Subtract masked fields."),
v=>A("Two groups have error rates "+v+"% and "+(v+2)+"%. Difference in percentage points?",2,"Subtract rates."),
v=>A("A permission review needs "+v+" approvals. One approval pending. Confirmed approvals?",v-1,"Subtract pending approval."),
v=>A("A risk matrix has "+v+" risk items and closes 2. Open items?",v-2,"Subtract closed risks.")
]
};
F.agriculture=[...F.ml.slice(0,5),...F.ai.slice(5,10)];
const workflow={
programming:["Read input","Validate value","Process logic","Print output"],
math:["Identify variables","Select formula","Calculate result","Interpret result"],
charts:["Inspect data","Choose chart","Label axes","Interpret pattern"],
ai:["Collect inputs","Prepare examples","Apply model","Evaluate output"],
ml:["Split data","Train model","Validate settings","Test on held-out set"],
algorithms:["Initialize data","Execute steps","Check stopping condition","Return result"],
sql:["Inspect schema","Write SELECT","Execute query","Interpret rows"],
preprocess:["Profile input","Identify problems","Apply justified cleaning","Validate changes"],
annotation:["Define label rules","Label samples","Review disagreement","Adjudicate errors"],
monitor:["Collect telemetry","Detect anomaly","Investigate cause","Apply and verify fix"],
pipeline:["Extract records","Transform fields","Validate outputs","Load approved data"],
fairness:["Define groups","Calculate group metrics","Compare outcomes","Investigate disparities"],
agriculture:["Collect field readings","Prepare sensor data","Generate recommendation","Validate with agronomist"]
};
const fam=(g,u)=>g===1?["programming","math","charts","ai","ml","algorithms"][u]:window.EBDAA_PERFORMANCE[g+"-"+(u+1)].engine;
function all(g,u,i){
 const grade=window.EBDAA_GRADES.grades[g-1],unitName=g===1?window.EBDAA_DATA.names[u]:grade.subjects[0].units[u].title;
 const title=g===1?window.EBDAA_DATA.sessions.filter(x=>x.unit===u+1)[i]?.title:grade.subjects[0].units[u].sessions[i];
 if(!title)return [];
 let family=fam(g,u);const rules=F[family]||F.ai,questions=[];
 for(let variant=0;variant<5;variant++)for(let skill=0;skill<10;skill++){
  const value=4+variant+((i+skill)%3);
  const item=rules[skill](value);const no=variant*10+skill+1;
  const heading=["Mini case","Data calculation","Code / logic check","Reasoning challenge","Review sprint"][variant];
  const mode=skill%5===0?"choice":skill%5===1?"number":skill%5===2?"truefalse":skill%5===3?"choice":"number";
  let options=null,correct=mode==="truefalse"?(variant%2===0):item.answer,renderMode=mode;
  const claim=Number(item.answer)+(variant%2===0?0:1);
  const stem=mode==="truefalse"?item.stem+" Claim: the numerical answer is "+claim+".":item.stem;
  if(mode==="choice"){
   const base=Number(item.answer);const candidates=[base,base+1,base-1,base+2];
   options=[...new Set(candidates.map(String))];
   if(options.length!==4)renderMode="number";
  }
  if(skill===4){
    const steps=workflow[family]||workflow.ai;
    const shuffled=[steps[2],steps[0],steps[3],steps[1]];
    questions.push({id:g+"-"+(u+1)+"-"+(i+1)+"-"+no,number:no,title,unit:unitName,heading,
      question:"In the "+["factory data center","production control room","field research station","quality-control lab","operations team"][variant]+", arrange the four steps of '"+title+"' into a sensible workflow.",
      answer:steps.join("|"),mode:"order",options:shuffled,
      explanation:"Start with: "+steps.join(" → ")+"; adapt the workflow to the practical task.",
      sourceStatus:"Author-developed conceptual workflow; not a verbatim official assessment.",parameter:value,focus:skill+1});
    continue;
  }
  questions.push({id:g+"-"+(u+1)+"-"+(i+1)+"-"+no,number:no,title,unit:unitName,heading,
    question:stem,answer:correct,mode:renderMode,options,
    explanation:item.why,sourceStatus:"Authored parameterized practice, associated with unit topic; requires lesson-level instructor review.",parameter:value,focus:skill+1});
 }
 return questions;
}
return {all,templates:F};
})();