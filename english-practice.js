window.EBDAA_ENGLISH_PRACTICE=(function(){
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
let state={g:1,u:0,i:0,cursor:0,answers:{},items:[],done:false};
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
function draw(){window.EBDA_APP_RENDER?.()}
function start(g,u,i){state={g,u,i,cursor:0,answers:{},items:build(g,u,i),done:false};transcriptOpen=false;drafts={};draw()}
function choose(j){if(state.answers[state.cursor]?.checked)return;state.answers[state.cursor]={value:j};draw()}
function check(){let a=state.answers[state.cursor];if(!a||a.checked)return;a.checked=true;a.correct=a.value===state.items[state.cursor].answer;draw()}
function next(){if(!state.answers[state.cursor]?.checked)return;if(state.cursor===state.items.length-1)state.done=true;else state.cursor++;transcriptOpen=false;draw()}
function previous(){if(state.cursor>0){state.cursor--;transcriptOpen=false;draw()}}
function restart(){start(state.g,state.u,state.i)}
let transcriptOpen=false;let drafts={};
function playAudio(){
 const q=state.items[state.cursor];if(q?.type!=="Listening")return;
 if(typeof window.speechSynthesis==="undefined"){transcriptOpen=true;draw();return}
 try{window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(q.passage);utterance.lang="en-US";utterance.rate=.88;window.speechSynthesis.speak(utterance)}catch(e){transcriptOpen=true;draw()}
}
function showTranscript(){transcriptOpen=!transcriptOpen;draw()}
function draft(value){drafts[state.cursor]=String(value)}
function render(){
 const s=state,unit=window.EBDAA_ENGLISH_UNITS[s.g][s.u],q=s.items[s.cursor],a=s.answers[s.cursor],answered=Object.values(s.answers).filter(x=>x.checked).length,correct=Object.values(s.answers).filter(x=>x.correct).length;
 const isAudio=q.type==="Listening";
 const reading=q.type==="Reading"?'<div class="hint"><strong>Read the passage</strong><p>'+esc(q.passage)+'</p></div>':'';
 const listening=isAudio?'<div class="hint"><strong>Listening task</strong><p>Listen to the original short audio, then answer. The transcript can be opened for accessibility.</p><div class="actions"><button class="btn light" onclick="EBDAA_ENGLISH_PRACTICE.playAudio()">▶ Play / replay</button><button class="btn light" onclick="EBDAA_ENGLISH_PRACTICE.showTranscript()">'+(transcriptOpen?'Hide transcript':'Show transcript')+'</button></div>'+(transcriptOpen?'<p>'+esc(q.passage)+'</p>':'')+'</div>':'';
 const practice=q.type==="Writing"?'<div class="hint"><label for="english-draft"><strong>Optional writing practice</strong></label><p>Write your own short sentence. Compare it with the model after checking; your draft is not automatically graded.</p><textarea id="english-draft" style="width:100%;min-height:90px;padding:12px;border:1px solid #ddd;border-radius:10px" oninput="EBDAA_ENGLISH_PRACTICE.draft(this.value)">'+esc(drafts[s.cursor]||"")+'</textarea></div>':q.type==="Speaking"?'<div class="hint"><strong>Speaking practice</strong><p>Say your response aloud before selecting the most appropriate answer. Voice pronunciation is not scored.</p></div>':'';
 const choices='<div class="choices">'+q.options.map((o,j)=>'<button class="choice '+(a?.value===j?'chosen ':'')+(a?.checked&&q.answer===j?'correct':'')+'" '+(a?.checked?'disabled':'')+' onclick="EBDAA_ENGLISH_PRACTICE.choose('+j+')">'+esc(o)+'</button>').join('')+'</div>';
 const body=s.done?'<div class="feedback"><h2>Session complete</h2><p>Correct: '+correct+' / '+s.items.length+'. Activities are formative, not accredited assessments.</p><button class="btn teal" onclick="EBDAA_ENGLISH_PRACTICE.restart()">Try a fresh attempt</button></div>':
 '<div class="eyebrow">'+esc(q.type)+' · '+esc(unit.focus)+'</div>'+reading+listening+'<h2 class="practice-question">'+esc(q.question)+'</h2>'+practice+choices+
 (a?.checked?'<div class="feedback '+(a.correct?'':'error')+'"><strong>'+(a.correct?'✓ Correct':'Review your answer')+'</strong><p>'+esc(q.explanation)+'</p></div>':'')+
 '<div class="stepfooter"><button class="btn light" '+(s.cursor===0?'disabled':'')+' onclick="EBDAA_ENGLISH_PRACTICE.previous()">← Previous</button><button class="btn teal" '+(!a?'disabled':'')+' onclick="EBDAA_ENGLISH_PRACTICE.'+(a?.checked?'next':'check')+'()">'+(a?.checked?(s.cursor===49?'Show result':'Next question →'):'Check answer')+'</button></div>';
 return '<section class="practice-focus"><header class="practice-focus__header"><div class="practice-focus__header-row"><button class="practice-focus__exit" onclick="englishBackToUnit()">← All English lessons</button><span class="practice-focus__year">YEAR '+s.g+' · ADVANCED ENGLISH</span></div><div class="practice-focus__info"><h1 class="practice-focus__lesson">'+esc(unit.sessions[s.i])+'</h1><span class="practice-focus__counter">Question '+(s.done?s.items.length:s.cursor+1)+' / '+s.items.length+'</span></div><div class="practice-focus__track" role="progressbar" aria-label="Questions answered" aria-valuemin="0" aria-valuemax="50" aria-valuenow="'+answered+'"><i style="width:'+(answered*2)+'%"></i></div></header><div class="practice-focus__content"><div class="guided-question">'+body+'<p class="muted" style="font-size:12px">Original formative practice aligned to unit themes: grammar, vocabulary, reading, synthesized listening, guided writing and speaking. Writing drafts and spoken pronunciation are not automatically graded. Some question structures recur, and teacher review remains necessary.</p></div></div></section>';
}
return {start,choose,check,next,previous,restart,render,build,playAudio,showTranscript,draft};
})();