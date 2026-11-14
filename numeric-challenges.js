/* Auto-check numerical or operational evidence in every Year 2–3 session. */
window.EBDAA_NUMERIC=function(g,u,i,v){
const kind=window.EBDAA_PERFORMANCE[g+"-"+(u+1)].engine;
const obj=(question,answer,explanation)=>({question,answer:Number(answer),explanation,tolerance:0.02});
if(kind==="python"){const n=i+3;return obj("A loop sums integers from 1 to "+n+" (inclusive). What is the sum?",n*(n+1)/2,"sum(1..n) = n(n+1)/2. Verify by executing a Python loop.")}
if(kind==="sql"){const regions=[["Cairo",8],["Giza",12],["Alexandria",10]],p=regions[i%3];return obj("Run SQL against the provided production table: What is SUM(qty) for region '"+p[0]+"'?",p[1],"Use SELECT SUM(qty) FROM production WHERE region = '"+p[0]+"';")}
if(kind==="statistics"){const nums=[3,5,7,8,10,13,v],avg=nums.reduce((a,b)=>a+b,0)/7;return obj("What is the sample mean of 3, 5, 7, 8, 10, 13, "+v+"? Round to two decimal places.",Number(avg.toFixed(2)),"Sum all seven observations, then divide by 7.")}
if(kind==="preprocess"){const nums=[3,4,4,7,10,v],count=new Set(nums).size;return obj("After removing the missing entry, invalid negative entry and duplicate numeric values, how many distinct nonnegative numbers remain?",count,"Count unique entries in [3,4,4,7,10,"+v+"].")}
if(kind==="annotation"){const agreement=v%2===0?6:5;return obj("Two annotators label 6 examples in the simulated dataset. How many annotations agree?",agreement,"Compare the two annotator label lists item by item.")}
if(kind==="monitor"){const series=[110,130,145,180,210,v*45];return obj("In the monitoring dataset, how many latency values strictly exceed 200 ms?",series.filter(x=>x>200).length,"Count latency readings >200. A reading of exactly 200 is not above threshold.")}
if(kind==="pipeline"){return obj("After removing the repeated ID, what is the East region's total quantity in the illustrated data?",4+v,"First record quantity 4 plus the unique East record quantity "+v+".")}
if(kind==="fairness"){return obj("What is the absolute approval-rate difference, in percentage points, between 8/10 and "+v+"/10?",Math.abs(80-10*v),"Convert each group rate to a percentage and take the absolute difference.")}
if(kind==="ml"||kind==="agriculture"){const pts=[{x:1,y:2,c:0},{x:2,y:2,c:0},{x:4,y:4,c:0},{x:6,y:6,c:1},{x:8,y:8,c:1},{x:9,y:7,c:1}];const n=pts.map(p=>({c:p.c,d:Math.hypot(p.x-v,p.y-5)})).sort((a,b)=>a.d-b.d).slice(0,3);const label=n.filter(x=>x.c===1).length>=2?1:0;return obj("For the displayed 2D KNN example (k=3), enter the predicted numeric class: 0=Low, 1=High.",label,"Find the 3 nearest examples by Euclidean distance and take a majority vote.")}
return obj("How many observations appear in this example?",7,"Count the observations.");
};