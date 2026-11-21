/* Contextual micro-games, displayed at periodic lesson checkpoints.
 * Bonus practice only; does not alter assessed answers, XP or grades.
 * No accounts, tracking, or stored student identity.
 */
window.EBDAA_CONTEXT_GAMES=(function(){
const state=new Map(), skillResults=new Map(), missed=new Set(), mathDrafts=new Map();
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const attr=x=>esc(JSON.stringify(x));
const norm=x=>String(x).normalize("NFKC").toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g,"").replace(/\s+/g," ").trim();
function record(k){if(!state.has(k))state.set(k,{first:null,matches:[],message:"",done:false,choice:null});return state.get(k)}
function reset(subject,lesson){const pref=subject+":"+lesson+":";for(const k of state.keys())if(k.startsWith(pref))state.delete(k);for(const k of skillResults.keys())if(k.startsWith(pref))skillResults.delete(k);for(const k of missed)if(k.startsWith(pref))missed.delete(k);for(const k of mathDrafts.keys())if(k.startsWith(pref))mathDrafts.delete(k)}
function mark(k,skill,success){if(skillResults.has(k))return;if(success){skillResults.set(k,{skill,success:!missed.has(k)});}else missed.add(k)}
function assess(subject,lesson){const prefix=subject+":"+lesson+":";const entries=[...skillResults.entries()].filter(([k])=>k.startsWith(prefix)).map(([,v])=>v);const correct=entries.filter(x=>x.success).length;return {attempted:entries.length,correct,rate:entries.length?Math.round(correct/entries.length*100):0,skills:[...new Set(entries.map(x=>x.skill))]}}
function report(subject,lesson,arabic=false){const a=assess(subject,lesson);if(!a.attempted)return "";return '<details class="context-report" aria-label="Independent practical skill assessment"><summary>🏅 '+(arabic?"التقييم العملي":"Practical skills")+': '+a.correct+'/'+a.attempted+' · '+a.rate+'%</summary><div class="context-report-body"><strong>🧪 '+(arabic?"تقييم المهارات العملية":"Practical skill assessment")+'</strong><div class="context-report-metrics"><span>🏅 '+a.correct+'/'+a.attempted+'</span><span>'+a.rate+'%</span><span>'+(arabic?"أنشطة مكتملة":"completed mini-games")+'</span></div><p>'+(arabic?"تُحتسب المحاولة الأولى فقط. يمكن إعادة الألعاب للتدرب، ولا تتغير درجة أسئلة الدرس.":"First-attempt performance only. Replay is for practice and does not change the 50-question grade.")+'</p></div></details>'}
function draw(){window.EBDA_APP_RENDER?.()}
const MATCH_LOCALES={
 en:{aria:"Matching mini game",title:"Match & Discover",help:"Tap a prompt, then match it to the correct answer.",done:"🏆 Perfect match!",bonus:"Optional bonus — your lesson score is unchanged.",again:"Play again",pick:i=>"✓ "+(i+1)+" selected — choose the matching answer",pairOk:"✓ Correct pair",pairNo:"Try another answer"},
 ar:{aria:"لعبة توصيل مصغرة",title:"لعبة التوصيل",help:"اختر السؤال ثم وصّله بالإجابة الصحيحة.",done:"🏆 أكملت اللعبة!",bonus:"تحدٍ إضافي اختياري — لا يؤثر على درجة الدرس.",again:"إعادة اللعبة",pick:i=>"✓ "+(i+1)+" محدد — اختر الإجابة المطابقة",pairOk:"✓ زوج صحيح",pairNo:"جرّب إجابة أخرى"},
 de:{aria:"Zuordnungs-Minispiel",title:"Zuordnen & Entdecken",help:"Tippe auf eine Frage und dann auf die passende Antwort.",done:"🏆 Alles richtig zugeordnet!",bonus:"Optionaler Bonus — deine Lektionsnote bleibt unverändert.",again:"Nochmal spielen",pick:i=>"✓ "+(i+1)+" gewählt — tippe auf die passende Antwort",pairOk:"✓ Richtiges Paar",pairNo:"Versuche eine andere Antwort"}
};
const matchLoc=(subject,arFlag)=>arFlag===true||subject==="ar"?"ar":subject==="de"?"de":"en";
function matching(subject,lesson,n,items,ar){
 if(n%10!==4)return "";
 const T=MATCH_LOCALES[matchLoc(subject,ar)];
 const k=subject+":"+lesson+":match:"+n,st=record(k),pool=[];
 for(let j=0;j<items.length&&pool.length<3;j++){
  const q=items[(n+j)%items.length],correct=q?.options?.[q.answer];
  const answer=correct&&typeof correct==="object"?correct.label:correct;
  if(!q?.question||answer===undefined)continue;
  const term=String(q.question).slice(0,140),meaning=String(answer).slice(0,100);
  if(!pool.some(p=>p[0]===term||p[1]===meaning))pool.push([term,meaning]);
 }
 if(pool.length<3)return "";
 const arranged=[2,0,1],completed=st.matches.length;
 const buttons=pool.map((p,i)=>'<button class="context-tile '+(st.matches.includes(i)?"context-matched":"")+'" '+(st.matches.includes(i)||st.done?"disabled":"")+' onclick="EBDAA_CONTEXT_GAMES.pick('+attr(k)+','+i+')">'+esc(p[0])+'</button>').join("");
 const answers=arranged.map(i=>'<button class="context-tile '+(st.matches.includes(i)?"context-matched":"")+'" '+(st.matches.includes(i)||st.done?"disabled":"")+' onclick="EBDAA_CONTEXT_GAMES.pair('+attr(k)+','+i+')">'+esc(pool[i][1])+'</button>').join("");
 return '<section class="context-game" aria-label="'+T.aria+'"><div class="context-head"><strong>🧩 '+T.title+'</strong><span>🎯 '+completed+'/3</span></div><p class="context-help">'+T.help+'</p><div class="context-columns"><div>'+buttons+'</div><div>'+answers+'</div></div><p role="status" class="context-status">'+esc(st.done?T.done:st.message||T.bonus)+'</p><button class="context-reset" onclick="EBDAA_CONTEXT_GAMES.restart('+attr(k)+')">'+T.again+'</button></section>';
}
function pick(k,i){const T=MATCH_LOCALES[matchLoc(k.split(":")[0])];const s=record(k);if(s.done||s.matches.includes(i))return;s.first=i;s.message=T.pick(i);draw()}
function pair(k,i){const T=MATCH_LOCALES[matchLoc(k.split(":")[0])];const s=record(k);if(s.first===null||s.done||s.matches.includes(i))return;if(i===s.first){s.matches.push(i);s.message=T.pairOk;s.done=s.matches.length===3;if(s.done)mark(k,"matching",true)}else {s.message=T.pairNo;mark(k,"matching",false)}s.first=null;draw()}
function restart(k){state.delete(k);mathDrafts.delete(k);draw()}
const missions={
 python:[
 {title:"Debug Python",code:"scores = [70, 80, 90]\nprint(sum(scores) / len(score))",options:["Replace len(score) with len(scores)","Replace sum(scores) with max(scores)","Remove print()"],correct:0,why:"The list variable is named scores, not score."},
 {title:"Fix a Python condition",code:"age = 18\nif age >= 18\n    print('Eligible')",options:["Add : after the if condition","Remove the indentation","Use = in place of >="],correct:0,why:"Python if conditions must end with a colon."},
 {title:"Repair the loop",code:"for i in range(3):\nprint(i)",options:["Indent print(i) inside the loop","Change range(3) to range(0)","Remove the colon"],correct:0,why:"The loop body must be indented."},
 {title:"List indexing",code:"values = [8, 9, 10]\nprint(values[3])",options:["Use values[2] for the last item","Use values[4]","Use values[-4]"],correct:0,why:"Python indices start at zero, so the last item is index 2."}
 ],
 sql:[
 {title:"Build a SQL query",code:"Find students with grade >= 85",tokens:["SELECT name","FROM students","WHERE grade >= 85","ORDER BY grade DESC;"],why:"SQL clauses follow SELECT → FROM → WHERE → ORDER BY."},
 {title:"Aggregate students",code:"Count students by city",tokens:["SELECT city, COUNT(*)","FROM students","GROUP BY city","ORDER BY city;"],why:"GROUP BY groups records; ORDER BY sorts the results."},
 {title:"Join project data",code:"Get student names and project topics",tokens:["SELECT s.name, p.topic","FROM students s","JOIN projects p ON s.id = p.student_id","ORDER BY s.name;"],why:"JOIN connects projects to students through the student ID."},
 {title:"Filter and limit",code:"Show the two best student scores",tokens:["SELECT name, grade","FROM students","ORDER BY grade DESC","LIMIT 2;"],why:"Sort descending first, then take two rows."}
 ]
};

// Further original, curriculum-oriented coding micro-challenges. These are illustrative,
// keyed to the lesson topic, and are not copied from a textbook.
missions.python.push(
 {title:"Fix a missing return",code:"def square(x):\n    x * x\nprint(square(5))",options:["Return x * x from the function","Replace x*x with x+x","Remove the function call"],correct:0,why:"Without return, a Python function returns None."},
 {title:"Fix the dictionary key",code:"person = {'name': 'Mona'}\nprint(person['age'])",options:["Use person['name'] for the available key","Change print into input","Remove the dictionary"],correct:0,why:"Accessing a missing dictionary key raises KeyError."},
 {title:"Repair data types",code:"count = '3'\nprint(count + 2)",options:["Convert count to int(count) before addition","Add another string to count","Rename count to total"],correct:0,why:"A string and an integer cannot be added as numbers directly."},
 {title:"Fix a comparison",code:"score = 80\nif score = 80:\n    print('Match')",options:["Use == when checking equality","Replace if with print","Write score = = 80"],correct:0,why:"== tests equality; = assigns a value."}
);
missions.sql.push(
 {title:"Count records safely",code:"Count all students in the sample table",tokens:["SELECT COUNT(*)","FROM students","WHERE grade >= 0","ORDER BY 1;"],why:"Aggregate records after the table and filter. The final ordering is syntactically valid but unnecessary for one row."},
 {title:"Find unique cities",code:"List distinct student cities",tokens:["SELECT DISTINCT city","FROM students","WHERE city IS NOT NULL","ORDER BY city;"],why:"DISTINCT removes duplicates; IS NOT NULL excludes missing cities."},
 {title:"Sort above threshold",code:"Show top students with grade > 80",tokens:["SELECT name, grade","FROM students","WHERE grade > 80","ORDER BY grade DESC;"],why:"Filtering comes before sorting."},
 {title:"Select matching project",code:"Find students working on AI",tokens:["SELECT s.name","FROM students s","JOIN projects p ON p.student_id = s.id","WHERE p.topic = 'AI';"],why:"JOIN connects tables, and WHERE filters the topic."}
);
function topicHash(t){let h=0;for(const c of String(t))h=(h*31+c.charCodeAt(0))>>>0;return h}
function math(lesson,n,items){
 if(n%10!==4)return "";
 const candidate=items.slice(Math.max(0,n-4),n+1).find(x=>x.mode==="number"&&Number.isFinite(Number(x.answer)));
 if(!candidate){
 const q=items.slice(Math.max(0,n-4),n+1).find(x=>x.mode==="choice"&&x.options?.length>=2&&Number.isInteger(x.answer));
 if(!q)return "";
 const k="math:"+lesson+":concept:"+n,st=record(k);
 const tiles=q.options.map((v,i)=>'<button class="context-tile" '+(st.done?"disabled":"")+' onclick="EBDAA_CONTEXT_GAMES.debug('+attr(k)+','+i+','+q.answer+')">'+esc(typeof v==="object"?v.label:v)+'</button>').join("");
 return '<section class="context-game"><div class="context-head"><strong>🧮 Concept Detective</strong><span>REASONING SKILL</span></div><p>'+esc(q.question)+'</p><p class="context-help">Choose the mathematically valid statement.</p><div class="context-answers">'+tiles+'</div><p class="context-status" role="status">'+esc(st.message||"Concept practice: first attempt counts toward practical skills.")+'</p>'+(st.done?'<p class="context-explain">'+esc(q.explanation||"Review the lesson rule.")+'</p>':'')+'<button class="context-reset" onclick="EBDAA_CONTEXT_GAMES.restart('+attr(k)+')">↺ Try again</button></section>';
}
 const k="math:"+lesson+":numeric:"+n,st=record(k);
 const controls='<label class="context-help" for="context-math-answer">Calculate and type the numerical result.</label><div class="game-entry"><input id="context-math-answer" class="game-input" type="number" step="any" inputmode="decimal" value="'+esc(mathDrafts.get(k)||"")+'" '+(st.done?"disabled":"")+' oninput="EBDAA_CONTEXT_GAMES.mathInput('+attr(k)+',this.value)"><button class="btn teal" '+(st.done?"disabled":"")+' onclick="EBDAA_CONTEXT_GAMES.mathSubmit('+attr(k)+','+Number(candidate.answer)+')">Check</button></div>';
 return '<section class="context-game"><div class="context-head"><strong>🧮 Solve It Yourself</strong><span>NUMERICAL SKILL</span></div><p>'+esc(candidate.question)+'</p>'+controls+'<p role="status" class="context-status">'+esc(st.message||"An independent practice challenge. First attempt counts toward your practical-skill record.")+'</p>'+(st.done?'<p class="context-explain">Model answer: '+esc(candidate.answer)+'</p>':'')+'<button class="context-reset" onclick="EBDAA_CONTEXT_GAMES.restart('+attr(k)+')">↺ Try again</button></section>';
}
function mathInput(k,v){mathDrafts.set(k,String(v).slice(0,50))}
function mathSubmit(k,expected){const s=record(k);if(s.done)return;const raw=mathDrafts.get(k)||"",v=Number(raw);if(!raw.trim()||!Number.isFinite(v))return;const ok=Math.abs(v-expected)<=Math.max(.005,Math.abs(expected)*.0001);s.message=ok?"✓ Correct numerical result!":"Not quite — review your calculation and retry.";s.done=ok;mark(k,"mathematical-calculation",ok);draw()}

function physicsModel(lesson,n,q){if(n%10!==4||!q||!Number.isFinite(q.value))return "";
 const k="physics:"+lesson+":model:"+n,st=record(k),v=q.value,unit=q.model?.[1]||"units";
 const wrong=[v+Math.max(1,Math.abs(v)*.5),v-Math.max(1,Math.abs(v)*.3),v+Math.max(2,Math.abs(v))].map(x=>Number(x.toFixed(3)));
 const vals=[v,...wrong],order=[2,0,3,1];
 const options=order.map(j=>'<button class="context-tile" '+(st.done?"disabled":"")+' onclick="EBDAA_CONTEXT_GAMES.debug('+attr(k)+','+j+',0)">'+esc(vals[j])+' '+esc(unit)+'</button>').join("");
 return '<section class="context-game"><div class="context-head"><strong>🔬 Experimental Prediction</strong><span>TOPIC PRACTICE</span></div><p>'+esc(q.model?.[0]||"Physics model")+' · A='+esc(q.a)+' · B='+esc(q.b)+'</p><p>Predict the computed result before checking the worked formula.</p><div class="context-answers">'+options+'</div><p role="status" class="context-status">'+esc(st.message||"Independent model check — first attempt is scored.")+'</p>'+(st.done?'<p class="context-explain">'+esc(q.formula)+' = '+v+' '+esc(unit)+'</p>':'')+'<button class="context-reset" onclick="EBDAA_CONTEXT_GAMES.restart('+attr(k)+')">↺ Try again</button></section>'
}
function ai(subject,lesson,n,topic,lessonTitle=''){
 if(n%10!==4)return "";
 const inferred=/\bsql\b|database|query|relational|data retrieval/i.test(lessonTitle)?"sql":/python|script|program|algorithm|function|loop|debug/i.test(lessonTitle)?"python":topic;
 const which=inferred==="sql"?"sql":"python",k=subject+":"+lesson+":"+which+":"+n,s=record(k),data=missions[which][(topicHash(lessonTitle||lesson)+Math.floor(n/10))%missions[which].length];
 const content=which==="python"?'<pre class="context-code">'+esc(data.code)+'</pre><p class="context-help">Choose the correct fix:</p><div class="context-answers">'+data.options.map((v,i)=>'<button class="context-tile" '+(s.done?"disabled":"")+' onclick="EBDAA_CONTEXT_GAMES.debug('+attr(k)+','+i+','+data.correct+')">'+esc(v)+'</button>').join("")+'</div>':
 '<pre class="context-code">'+esc(data.code)+'</pre><p class="context-help">Arrange the SQL clauses in executable order.</p><div class="context-built">'+(s.matches.length?s.matches.map(i=>esc(data.tokens[i])).join(" → "):"Build query here…")+'</div><div class="context-answers">'+[2,0,3,1].map(i=>'<button class="context-tile" '+(s.matches.includes(i)||s.done?"disabled":"")+' onclick="EBDAA_CONTEXT_GAMES.sqlPick('+attr(k)+','+i+')">'+esc(data.tokens[i])+'</button>').join("")+'</div>';
 return '<section class="context-game"><div class="context-head"><strong>'+(which==="sql"?"🗄 SQL Query Builder":"🐍 Python Bug Hunt")+'</strong><span>MINI GAME</span></div><h3>'+esc(data.title)+'</h3>'+content+'<p class="context-status" role="status">'+esc(s.message||(s.done?"Challenge complete":"Optional bonus — does not change your quiz grade."))+'</p>'+(s.done?'<p class="context-explain">'+esc(data.why)+'</p>':'')+'<button class="context-reset" onclick="EBDAA_CONTEXT_GAMES.restart('+attr(k)+')">↺ Restart mini game</button></section>';
}
function debug(k,i,correct){let s=record(k);if(s.done)return;s.message=i===correct?"✓ Correct!":"Not quite — inspect the logic again.";s.done=i===correct;mark(k,k.includes("circuit")?"circuit":k.includes(":model:")?"physics-model":k.includes("math")?"mathematical-reasoning":"debugging",i===correct);draw()}
function sqlPick(k,i){let s=record(k);if(s.done||s.matches.includes(i))return;if(i===s.matches.length){s.matches.push(i);s.done=s.matches.length===4;s.message=s.done?"✓ Query assembled in the correct order!":"✓ Correct next clause";if(s.done)mark(k,"sql-building",true)}else {s.message="That clause is not next — try another.";mark(k,"sql-building",false)}draw()}
function physics(lesson,n,topic){
 if(n%10!==4||!["ohm","resistors","current"].includes(topic))return "";
 const k="physics:"+lesson+":circuit:"+n,s=record(k);
 const r1=2+(Math.floor(n/10)%4),r2=4+(Math.floor(n/10)%3),v=12;
 const series=r1+r2,parallel=r1*r2/(r1+r2),choices=[series,parallel,Math.abs(r1-r2),r1*r2];
 const parallelMode=Math.floor(n/10)%2===1,expected=parallelMode?1:0;
 return '<section class="context-game"><div class="context-head"><strong>⚡ Build the Circuit</strong><span>MINI GAME</span></div><p>Resistors: R₁ = '+r1+' Ω, R₂ = '+r2+' Ω. Battery: '+v+' V.</p><p>Choose the equivalent resistance for <b>'+(parallelMode?"parallel":"series")+'</b> wiring.</p><div class="context-circuit"><span>🔋 '+v+' V</span><span>R₁ '+r1+' Ω</span><span>R₂ '+r2+' Ω</span></div><div class="context-answers">'+choices.map((x,i)=>'<button class="context-tile" '+(s.done?"disabled":"")+' onclick="EBDAA_CONTEXT_GAMES.debug('+attr(k)+','+i+','+expected+')">'+Number(x.toFixed(2))+' Ω</button>').join("")+'</div><p role="status" class="context-status">'+esc(s.message||"Choose a circuit result; this bonus does not change your grade.")+'</p>'+(s.done?'<p class="context-explain">'+(parallelMode?"1/R = 1/R₁ + 1/R₂":"R = R₁ + R₂")+' · Equivalent resistance: '+Number((parallelMode?parallel:series).toFixed(2))+' Ω.</p>':'')+'<button class="context-reset" onclick="EBDAA_CONTEXT_GAMES.restart('+attr(k)+')">Play again</button></section>';
}
return {matching,math,mathInput,mathSubmit,physicsModel,ai,physics,pick,pair,restart,debug,sqlPick,reset,assess,report};
})();