/* Six-step learning journey: optional, non-scored formative checks for AI specialization. */
window.NTSS_JOURNEY=(function(){
 const states=new Map();
 const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const Q=(q,options,correct,explain)=>({q,options,correct,explain});
 const bank={
 programming:{
 quick:[Q("What does a variable hold?",["A value","Only a file","A website"],0,"Variables reference values."),Q("Which loop repeats a block?",["if","for","return"],1,"A for loop iterates."),Q("What is a function?",["Reusable logic","A filename","A password"],0,"Functions package reusable operations."),Q("What does len([2,4,6]) return?",["6","3","2"],1,"There are three elements."),Q("What does range(3) produce?",["0,1,2","1,2,3","0,1,2,3"],0,"The upper bound is excluded.")],
 master:[Q("What is the value of x after x=2; x+=4?",["4","6","8"],1,"The += operation adds to the current value."),Q("How many times does for i in range(5) repeat?",["4","5","6"],1,"range(5) has five elements."),Q("Which data structure stores an ordered sequence?",["list","bool","int"],0,"A Python list holds ordered elements."),Q("Which keyword creates a function?",["def","func","method"],0,"Python defines functions with def."),Q("What does 9 % 4 evaluate to?",["1","2","4"],0,"Remainder after division by four is one.")]},
 sql:{
 quick:[Q("What does SELECT do?",["Reads rows","Deletes rows","Creates users"],0,"SELECT retrieves records."),Q("What does WHERE do?",["Filters rows","Sorts randomly","Deletes tables"],0,"WHERE restricts which rows qualify."),Q("What does COUNT(*) count?",["Rows","Table names","Column types"],0,"COUNT(*) counts records."),Q("What is a primary key?",["A row identifier","A password","A chart"],0,"A primary key identifies a record."),Q("What combines related tables?",["JOIN","DROP","VACUUM"],0,"JOIN connects tables by conditions.")],
 master:[Q("Which query counts records?",["SELECT COUNT(*) FROM students","DELETE students","DROP TABLE students"],0,"COUNT(*) aggregates matching rows."),Q("Which clause groups categories?",["GROUP BY","ORDER BY","LIMIT"],0,"GROUP BY groups rows for aggregation."),Q("Which JOIN keeps only matched rows?",["INNER JOIN","CROSS JOIN","FULL JOIN"],0,"INNER JOIN returns matching combinations."),Q("Which clause sorts results?",["ORDER BY","HAVING","VALUES"],0,"ORDER BY controls ordering."),Q("Which query is read-only?",["SELECT city FROM students","UPDATE students SET city='X'","DELETE FROM students"],0,"SELECT retrieves without changing data.")]},
 stats:{
 quick:[Q("What is a mean?",["Sum divided by count","Maximum value","Smallest value"],0,"The arithmetic mean is the sum divided by number of values."),Q("Which chart compares category counts?",["Bar chart","Random line","Unlabeled image"],0,"Bars compare discrete categories."),Q("What is a missing value?",["Unknown observation","Always zero","Always negative"],0,"Missing is not automatically zero."),Q("Which measure is resistant to outliers?",["Median","Maximum","Range"],0,"The median is less sensitive to extremes."),Q("What is sample size?",["Count of observations","Sum of all values","Largest value"],0,"Sample size counts observations.")],
 master:[Q("Mean of 2, 4, 6?",["4","6","12"],0,"(2+4+6)/3=4."),Q("Median of 1, 8, 9?",["8","6","9"],0,"The sorted middle value is eight."),Q("Range of 3, 7, 11?",["8","11","3"],0,"11−3=8."),Q("How many values in 5, 5, 6, 7?",["4","3","23"],0,"Sample size is four."),Q("One invalid row out of ten: valid rows?",["9","10","11"],0,"Ten minus one is nine.")]},
 ml:{
 quick:[Q("What is a training dataset?",["Examples used to fit a model","Only its final report","A PDF certificate"],0,"Training data helps fit model parameters."),Q("What tests generalization?",["Held-out examples","Only training score","More labels copied"],0,"Unseen data measures generalization."),Q("What is overfitting?",["Learning noise rather than general patterns","Lower memory usage","Shorter code"],0,"Overfit models can fail on unseen data."),Q("What is a feature?",["An input variable","Always a prediction","A monitor"],0,"Features describe inputs."),Q("What is classification?",["Predicting categories","Sorting folders","Calculating only averages"],0,"Classification predicts class labels.")],
 master:[Q("Which score helps test a classifier on unseen cases?",["Test accuracy","Training score alone","Source file size"],0,"A held-out test score evaluates new examples."),Q("Which task predicts a continuous number?",["Regression","Classification","Tokenization"],0,"Regression predicts numeric values."),Q("A model performs well in training but poorly in testing. Why?",["Possible overfitting","Guaranteed success","No issue"],0,"Training and test performance diverge under overfitting."),Q("What is label leakage?",["Using future/target information in features","Removing duplicate rows","Using a train/test split"],0,"Leakage contaminates evaluation."),Q("What should be minimized in student datasets?",["Unnecessary personal identifiers","Validation samples","Model documentation"],0,"Data minimization reduces privacy risk.")]}
 };
 const families=["programming","stats","stats","ml","ml","programming"];
 function family(g,u){const f=g===1?families[u]:(window.EBDAA_PERFORMANCE?.[g+"-"+(u+1)]?.engine||"stats");return /sql|database/.test(f)?"sql":/ml|agriculture|ai/.test(f)?"ml":/python|program|algorithms/.test(f)?"programming":"stats"}
 function id(g,u,i){return g+":"+u+":"+i}
 function get(g,u,i){const k=id(g,u,i);if(!states.has(k))states.set(k,{quick:[],master:[],stage:"quick"});return states.get(k)}
 function choose(g,u,i,type,choice){
  if(!["quick","master"].includes(type))return;
  const st=get(g,u,i),questions=bank[family(g,u)][type],arr=st[type];
  if(arr.length>=5)return;
  arr.push({choice:Number(choice),correct:Number(choice)===questions[arr.length].correct});
  const host=document.getElementById("ntss-journey-content");if(host)host.innerHTML=inside(g,u,i);
 }
 function stage(g,u,i,name){get(g,u,i).stage=name;const host=document.getElementById("ntss-journey-content");if(host)host.innerHTML=inside(g,u,i)}
 function reset(g,u,i){states.delete(id(g,u,i))}
 function inside(g,u,i){
  const st=get(g,u,i),type=st.stage,questions=bank[family(g,u)][type],arr=st[type];
  const items=[["quick","1. Quick Check"],["explore","2. Learn & Explore"],["practice","3. Practice"],["review","4. Review"],["master","5. Mastery Check"],["later","6. Continue Later"]];
  const nav='<nav class="ntss-journey-nav">'+items.map(x=>'<button class="'+(x[0]===type?"active":"")+'" onclick="NTSS_JOURNEY.stage('+g+','+u+','+i+',\''+x[0]+'\')">'+x[1]+'</button>').join("")+'</nav>';
  let main="";
  if(questions){
    if(arr.length>=5){
     const correct=arr.filter(x=>x.correct).length;
     main='<div class="ntss-journey-result"><b>'+correct+' / 5</b><p>Practice insight only. This score does not affect the 50 assessed questions or certificates.</p></div>'+
      questions.map((q,j)=>'<p>'+esc(j+1)+'. '+esc(q.q)+' — '+(arr[j].correct?"✓": "Review: "+esc(q.explain))+'</p>').join("");
    }else{
     const q=questions[arr.length];
     main='<div class="ntss-journey-test"><small>Question '+(arr.length+1)+' of 5 · formative only</small><h3>'+esc(q.q)+'</h3>'+q.options.map((option,j)=>'<button onclick="NTSS_JOURNEY.choose('+g+','+u+','+i+',\''+type+'\','+j+')">'+esc(option)+'</button>').join("")+'</div>';
    }
  }else if(type==="explore")main='<p>Read the lesson explanation, then open Interactive Concept Visualizer from Learning Tools when available. Predict the result before moving a parameter.</p>';
  else if(type==="practice")main='<p>Return to the main question above. Complete ten questions at a time. The AI specialization uses recent performance to prioritize the next unanswered group.</p>';
  else if(type==="review")main='<p>Check missed questions in Learning Tools. Read the reasoning and try a similar question before continuing.</p>';
  else main='<p>Save an opt-in checkpoint with the Continue Later control below. On shared school devices, clear the saved session when finished.</p><button onclick="EBDAA_PRACTICE.saveCheckpoint()">Save my progress on this device</button><button onclick="EBDAA_PRACTICE.clearCheckpoint()">Clear saved checkpoint</button>';
  return nav+main;
 }
 function panel(g,u,i){return '<details class="ntss-journey"><summary>Learning Journey · Quick Check → Mastery</summary><div id="ntss-journey-content">'+inside(g,u,i)+'</div></details>'}
 return {panel,choose,stage,reset,family,bank};
})();