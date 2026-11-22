(function(){
const rules={
"Present Simple; workplace vocabulary":[["She ___ the safety rules every day.",["follows","follow","following","is follow"]],["An ___ provides jobs to workers.",["employer","employee","workplace","schedule"]]],
"There is / There are; prepositions of place":[["There ___ three computers in the laboratory.",["are","is","am","be"]],["The tools are ___ the shelf.",["on","to","at","from"]]],
"Singular/plural nouns; tool locations and safety":[["The plural of 'tool' is ___.",["tools","tooles","tool's","toolies"]],["A ___ measures electrical voltage.",["multimeter","hammer","wrench","drill"]]],
"Present continuous active and passive":[["They ___ a bridge right now.",["are building","is building","builded","has built"]],["A new bridge ___ now.",["is being built","is building","has build","are built"]]],
"Past perfect active and passive":[["She ___ the job before the meeting.",["had finished","has finish","have finished","had finish"]],["The task ___ before noon.",["had been completed","had complete","has completing","have completed"]]],
"Adjectives and adverbs":[["The team worked ___.",["carefully","careful","care","more carefuler"]],["Which is an adjective?",["sustainable","sustainably","sustain","sustainablyness"]]],
"Comparatives and superlatives":[["This room is ___ than that one.",["larger","largest","more larger","large"]],["The superlative of good is ___.",["best","better","goodest","more better"]]],
"Tag questions":[["She is a journalist, ___?",["isn't she","is she","does she","didn't she"]],["They don't agree, ___?",["do they","don't they","are they","did they"]]],
"Defining and non-defining relative clauses":[["The engineer ___ repaired the machine is here.",["who","which","where","when"]],["A non-defining relative clause is usually separated by ___.",["commas","full stops","question marks","colons"]]],
"Zero, first, second and third conditionals":[["If it rains tomorrow, we ___ inside.",["will stay","would stayed","had stayed","staying"]],["If I had studied, I ___ passed.",["would have","will have","had","am"]]],
"Modals of obligation and imperatives":[["You ___ wear a helmet in the workshop.",["must","must to","musting","musts"]],["Which is an imperative?",["Please recycle the paper.","He recycles paper.","They recycled paper.","She is recycling."]]],
"Stative and action verbs":[["Which is a stative verb?",["believe","run","jump","dance"]],["I ___ the answer.",["know","am knowing","knowing","have knowing"]]],
"Semi-modals: supposed to, meant to, seem to":[["You are ___ arrive on time.",["supposed to","suppose to","supposed","supposing to"]],["He seems ___ enjoy the activity.",["to","for","from","by"]]],
"Past habits: used to and would":[["I ___ walk to school when I was younger.",["used to","use to","am used","used"]],["She didn't ___ smoke.",["use to","used to","using to","uses to"]]],
"Future perfect":[["By Monday, we ___ the project.",["will have finished","will finished","have finish","will finishing"]],["She will have ___ the task.",["completed","complete","completing","completes"]]],
"Present perfect simple and continuous":[["She ___ all morning.",["has been working","have working","is been work","has working"]],["They ___ the project already.",["have completed","has completed","have complete","are completed"]]],
"Reported statements and commands":[["He told me ___ outside.",["to wait","waiting","waited","wait"]],["She said that she ___ tired.",["was","am","be","were"]]],
"Modals of deduction, regret and blame":[["He ___ forgotten the meeting.",["must have","must has","must had to","musting"]],["I ___ studied harder for the test.",["should have","should","should has","shoulding"]]],
"Adjectives and compound adjectives":[["She is a ___ scientist.",["well-known","well-knowing","well-knows","well-know"]],["It is a ___ break.",["five-minute","five-minutes","five-minute's","five minutes"]]],
"Causative have and get":[["I had my computer ___.",["repaired","repair","repairing","to repaired"]],["She got her hair ___.",["cut","cutting","cuts","to cut"]]],
"Reported questions":[["She asked where I ___.",["lived","did live","do live","living"]],["He asked if I ___ ready.",["was","am I","were I","be"]]]
};
const vocabulary=[[["employee","worker at a company"],["employer","provider of jobs"],["supervisor","manager guiding workers"],["teamwork","working together"],["schedule","plan for working hours"]],[["laboratory","place for experiments"],["cabinet","storage unit"],["workplace","place for jobs"],["printer","device for paper documents"],["equipment","tools used for work"]],[["caliper","precision measuring tool"],["wrench","tool for turning bolts"],["multimeter","electric measuring device"],["drill","tool for making holes"],["toolbox","container for tools"]],[["gateway","point of entry"],["partnership","cooperative relationship"],["infrastructure","basic physical systems"],["trade","exchange of goods"],["mutual","shared by both sides"]],[["entrepreneur","person starting a business"],["startup","new business"],["investment","money committed to a project"],["pitch","brief business presentation"],["funding","financial support"]],[["sustainable","able to continue without exhausting resources"],["development","progress or growth"],["equality","equal rights"],["poverty","lack of essential money"],["healthcare","medical services"]],[["earthquake","shaking of the ground"],["flood","water covering dry land"],["evacuation","moving from danger"],["emergency","situation requiring urgent help"],["risk","possibility of harm"]],[["misinformation","incorrect information"],["headline","title of a news report"],["source","origin of information"],["verify","check accuracy"],["evidence","facts supporting a claim"]],[["communication","exchange of information"],["collaboration","working jointly"],["adaptability","ability to adjust"],["empathy","understanding others feelings"],["reliability","dependability"]],[["inclusive","welcoming everyone"],["diversity","human differences"],["fairness","just treatment"],["cooperation","working together"],["gratitude","thankfulness"]],[["volunteer","person offering unpaid service"],["initiative","new plan for action"],["campaign","organized effort"],["recycle","reuse materials through processing"],["community","connected group of people"]],[["mural","large artwork on a wall"],["portrait","picture of a person"],["gallery","place exhibiting art"],["creative","original in ideas"],["heritage","culture passed between generations"]],[["passion","strong enthusiasm"],["hobby","activity in free time"],["motivation","desire to act"],["practice","repeated training"],["achievement","successful result"]],[["hydration","having enough water"],["nutrition","nourishment from food"],["habit","regular action"],["well-being","health and comfort"],["prevention","stopping harm before it happens"]],[["punctuality","being on time"],["deadline","last permitted date"],["priority","important task placed first"],["appointment","scheduled meeting"],["apology","expression of regret"]],[["patient","person receiving care"],["medication","medicine used in treatment"],["shift","period of work"],["emergency","urgent situation"],["recovery","return to health"]],[["automation","machines carrying out tasks"],["robot","programmable machine"],["efficiency","less waste for an output"],["innovation","useful new idea"],["machine","device performing work"]],[["climate","long-term weather patterns"],["pollution","environmental contamination"],["conservation","protection of nature"],["emissions","released gases and particles"],["activism","organized advocacy"]],[["marine","related to the sea"],["habitat","natural home of a species"],["ecosystem","interacting organisms and surroundings"],["species","type of organism"],["coral","small marine animal forming reefs"]],[["mindset","way of thinking"],["workforce","working population"],["resilience","recovery from setbacks"],["adaptability","adjustment to change"],["training","learning professional skills"]],[["invitation","request to attend"],["socialize","spend time with people"],["friendship","supportive relationship"],["confidence","belief in abilities"],["conversation","spoken exchange"]]];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function build(g,u,i){
 const unit=window.EBDAA_ENGLISH_UNITS[g][u],pool=rules[unit.focus].concat(window.EBDAA_ENGLISH_GRAMMAR_EXT[unit.focus]||[]),words=vocabulary[(g===1?0:g===2?3:15)+u],arr=[],lesson=unit.sessions[i];
 function add(question,options,explanation,type,passage){
  if(options.length!==4||new Set(options).size!==4)throw Error("Invalid distractors: "+question);
  const shift=(arr.length*3+i)%4;
  arr.push({id:g+"-"+u+"-"+i+"-"+arr.length,question,options:options.slice(shift).concat(options.slice(0,shift)),answer:(4-shift)%4,explanation,type,passage:passage||""});
 }
 const wordsAt=n=>words[(n+i)%words.length];
 // Grammar questions target the exact language focus listed in the supplied guide.
 for(let k=0;k<6;k++){const v=pool[(k+i)%pool.length];add(v[0],v[1],"The correct form is: "+v[1][0]+". Review "+unit.focus+".","Grammar")}
 // Three distinct vocabulary task types per word; avoid 25 near-identical definitions.
 for(let k=0;k<15;k++){
  const j=k%5,w=wordsAt(j),other=[1,2,3].map(d=>wordsAt((j+d)%5));
  if(k<5)add("What does '"+w[0]+"' mean?",[w[1],...other.map(v=>v[1])],w[0]+": "+w[1]+".","Vocabulary");
  else if(k<10)add("Which word means '"+w[1]+"'?",[w[0],...other.map(v=>v[0])],"The word is "+w[0]+".","Vocabulary");
  else add("Select the best term for this clue: "+w[1]+".",[w[0],...other.map(v=>v[0])],"The target term is "+w[0]+".","Word in Context");
 }
 // Three original short reading scenarios, linked to the chosen lesson title.
 for(let j=0;j<3;j++){
  const x=wordsAt(j),y=wordsAt(j+1),z=wordsAt(j+2);
  const lead=["During a practical workshop","While preparing a class presentation","For a community learning activity"][j];
  const place=["the school library","a technical classroom","the project hall"][j];
  // Reading passages are original assessment scenarios, not a reproduction of the textbook.
  const day=["Tuesday","Thursday","Saturday"][j];
  const passage=lead+" about "+lesson+", students met in "+place+". Their task was to explain "+x[0]+" ("+x[1]+") and compare it with "+y[0]+" ("+y[1]+"). The group also included "+z[0]+" ("+z[1]+") in its summary. They checked their ideas with their teacher before sharing their conclusions on "+day+".";
  add("Where did the activity take place?",[place,"the sports stadium","a train station","a restaurant"],"The first sentence names "+place+".","Reading",passage);
  add("Which concept did the students explain?",[x[0],y[0],z[0],"a travel ticket"],"The task focused on "+x[0]+".","Reading",passage);
  add("What was "+x[0]+" compared with?",[y[0],x[0],z[0],"the weather forecast"],"The passage explicitly compares "+x[0]+" with "+y[0]+".","Reading",passage);
  add("Who checked the students' ideas?",["Their teacher","A taxi driver","A shop assistant","A doctor"],"They checked their ideas with their teacher.","Reading",passage);
  add("When were the conclusions shared?",[day,...["Monday","Wednesday","Friday","Sunday"].filter(v=>v!==day).slice(0,3)],"The presentation happened on "+day+".","Reading",passage);
 }
 // Listening is browser speech synthesis; audio text is original, not an official textbook recording.
 const a=wordsAt(0),b=wordsAt(1),c=wordsAt(2);
 const audio="Hello! This is a short update about "+lesson+". Our class met in the science room on Wednesday. We discussed "+a[0]+" and "+b[0]+". We chose "+c[0]+" for our final presentation. Three students presented the results to the teacher.";
 add("Where did the class meet?",["the science room","the library","the playground","the gym"],"The recording says science room.","Listening",audio);
 add("On which day did the class meet?",["Wednesday","Monday","Thursday","Saturday"],"The recording names Wednesday.","Listening",audio);
 add("Which topic was mentioned first?",[a[0],b[0],c[0],wordsAt(3)[0]],"The first topic was "+a[0]+".","Listening",audio);
 add("Which topic was selected for the final presentation?",[c[0],b[0],a[0],wordsAt(4)[0]],"The class selected "+c[0]+".","Listening",audio);
 add("How many students presented?",["Three","Two","Four","Five"],"Three students presented.","Listening",audio);
 add("Who received the presentation?",["The teacher","The head chef","A driver","A shopkeeper"],"The results were presented to the teacher.","Listening",audio);
 // Writing and speaking tasks combine a free-response practice prompt with an answerable model-choice item.
 const topic=lesson.toLowerCase();
 const writing=[
  ["Choose the clearest opening sentence for a paragraph about "+topic+".",["This paragraph explains key ideas about "+topic+".","About this and that stuff.","Because yes everything there.","Thing in this world topic."]],
  ["Which sentence makes an appropriate concluding statement?",["In summary, these ideas can help us understand "+topic+".","And that was it things.","Because they and then.","The end but anyway and."]],
  ["Choose the best formal sentence for a school report.",["The class completed the activity and recorded the results.","We done stuff and it was cool.","They was did a report.","Results is make yesterday."]],
  ["Which sentence uses a clear supporting reason?",["This method is useful because it helps students organize their work.","This method because because.","Useful is method it.","Method useful without explain."]]
 ];
 for(let k=0;k<4;k++)add(writing[k][0],writing[k][1],"Model response: "+writing[k][1][0]+".","Writing");
 const speaking=[
  ["How should you politely ask a classmate to explain "+a[0]+"?",["Could you explain "+a[0]+" to me, please?","Explain it, now!","You explain because.","What you meaning this?"]],
  ["Which response agrees politely during a discussion?",["I agree, and I would like to add another example.","You are wrong, stop.","That's stupid.","No talking allowed."]],
  ["How can you ask for clarification?",["Could you repeat that more slowly, please?","Speak right!","Repeat is you.","I do not hear because." ]],
  ["How should you close a brief class presentation?",["Thank you for listening. Do you have any questions?","Okay bye whatever.","You all leave now.","Done presentation thanks not."]]
 ];
 for(let k=0;k<4;k++)add(speaking[k][0],speaking[k][1],"A suitable response is: "+speaking[k][1][0]+".","Speaking");
 if(arr.length!==50)throw Error("Expected 50 questions, got "+arr.length);
 return arr;
}
let transcriptOpen=false,drafts={};
window.EBDAA_ENGLISH_PRACTICE=window.EBDA_PRACTICE_FRAMEWORK.create({
 name:"EBDAA_ENGLISH_PRACTICE",subject:"en",gameKey:"en",learningMode:"englishPractice",appliedKey:"en",contextGames:true,
 locale:"en",inputId:"practice-answer",checkId:"english-check",back:()=>englishBackToUnit(),
 buildItems:(g,u,i)=>build(g,u,i).map(q=>({...q,mode:"choice"})),
 title:(g,u,i)=>window.EBDAA_ENGLISH_UNITS[g][u].sessions[i],
 header:g=>({exitLabel:"← All English lessons",exit:()=>englishBackToUnit(),yearLabel:"YEAR "+g+" · ADVANCED ENGLISH",disclaimer:"Original formative practice aligned to unit themes: grammar, vocabulary, reading, synthesized listening, guided writing and speaking. Writing drafts and spoken pronunciation are not automatically graded. Some question structures recur, and teacher review remains necessary."}),
 eyebrow:(q,{g,u})=>esc(q.type)+" · "+esc(window.EBDAA_ENGLISH_UNITS[g][u].focus),
 beforeControls:q=>{
  const reading=q.type==="Reading"?'<div class="hint"><strong>Read the passage</strong><p>'+esc(q.passage)+'</p></div>':"";
  const listening=q.type==="Listening"?("<div class=\"hint\"><strong>Listening task</strong><p>Listen to the original short audio, then answer. The transcript can be opened for accessibility.</p><div class=\"actions\"><button type=\"button\" class=\"btn light\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_ENGLISH_PRACTICE.playAudio()},"EBDAA_ENGLISH_PRACTICE.playAudio")+">▶ Play / replay</button><button type=\"button\" class=\"btn light\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_ENGLISH_PRACTICE.showTranscript()},"EBDAA_ENGLISH_PRACTICE.showTranscript")+">"+(transcriptOpen?'Hide transcript':'Show transcript')+"</button></div>"+(transcriptOpen?'<p>'+esc(q.passage)+'</p>':'')+"</div>"):"";
  const practice=q.type==="Writing"?("<div class=\"hint\"><label for=\"english-draft\"><strong>Optional writing practice</strong></label><p>Write your own short sentence. Compare it with the model after checking; your draft is not automatically graded.</p><textarea id=\"english-draft\" style=\"width:100%;min-height:90px;padding:12px;border:1px solid #ddd;border-radius:10px\" "+window.NTSS_EVENTS.bind("input",function(event){EBDAA_ENGLISH_PRACTICE.draft(this.value)},"EBDAA_ENGLISH_PRACTICE.draft")+">"+(esc(drafts[window.EBDAA_ENGLISH_PRACTICE._state().cursor]||""))+"</textarea></div>"):q.type==="Speaking"?'<div class="hint"><strong>Speaking practice</strong><p>Say your response aloud before selecting the most appropriate answer. Voice pronunciation is not scored.</p></div>':"";
  return reading+listening+practice;
 },
 afterControls:(q,{g,u,i,cursor,items})=>window.EBDAA_CONTEXT_GAMES.matching("en",[g,u,i].join("-"),cursor,items,false)+window.NTSS_APPLIED.render("en",[g,u,i].join("-"),cursor,window.EBDAA_ENGLISH_UNITS[g][u].sessions[i]),
 hooks:{onMove:()=>{transcriptOpen=false}},
 methods:api=>({
  playAudio(){
   const q=api._state().items[api._state().cursor];if(q?.type!=="Listening")return;
   if(typeof window.speechSynthesis==="undefined"){transcriptOpen=true;api._refresh();return}
   try{window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(q.passage);utterance.lang="en-US";utterance.rate=.88;window.speechSynthesis.speak(utterance)}catch(e){transcriptOpen=true;api._refresh()}
  },
  showTranscript(){transcriptOpen=!transcriptOpen;api._refresh()},
  draft(value){drafts[api._state().cursor]=String(value)}
 })
});

})();
