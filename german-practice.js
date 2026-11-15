/* Original A1 German formative practice. 50 generated prompts per lesson, with reusable
   grammar, vocabulary and short reading templates. Teacher review required. */
window.EBDAA_GERMAN_PRACTICE=(function(){
let s={grade:1,unit:0,lesson:0,items:[],cursor:0,answers:{},done:false};
const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const index=(g,u)=>g===1?u:g===2?u+3:u+6;
function build(g,u,i){
 const unit=window.EBDAA_GERMAN_UNITS[g][u],bank=window.EBDAA_GERMAN_BANKS[index(g,u)];
 const words=bank.words,items=[];
 function add(question,options,explanation,type,reading=""){
  if(options.length!==4||new Set(options).size!==4)throw Error("Duplicate German answer options");
  const shift=(items.length+i)%4;
  items.push({question,options:options.slice(shift).concat(options.slice(0,shift)),answer:(4-shift)%4,explanation,type,reading});
 }
 for(let n=0;n<10;n++){
  const q=bank.grammar[(n+i)%bank.grammar.length];
  add(q[0],q[1],"Richtig: "+q[1][0]+".","Grammatik");
 }
 for(let n=0;n<25;n++){
  const j=(n+i)%words.length,w=words[j],others=[1,2,3].map(d=>words[(j+d)%words.length]);
  if(n%2===0)add("Was bedeutet „"+w[0]+"“ auf Arabisch?",[w[1],...others.map(o=>o[1])],"„"+w[0]+"“ bedeutet „"+w[1]+"“.","Wortschatz");
  else add("Welches deutsche Wort bedeutet „"+w[1]+"“?",[w[0],...others.map(o=>o[0])],"Richtig ist „"+w[0]+"“.","Wortschatz");
 }
 for(let n=0;n<3;n++){
  const a=words[(n+i)%words.length],b=words[(n+i+1)%words.length],c=words[(n+i+2)%words.length];
  const p="Mira lernt Deutsch in der Schule. Heute wiederholt sie drei Wörter für das Thema „"+unit.title+"“: "+a[0]+", "+b[0]+" und "+c[0]+". Sie schreibt die Wörter in ihr Heft. Am Freitag zeigt sie die Wörter ihrem Lehrer.";
  add("Wo lernt Mira Deutsch?",["in der Schule","im Bahnhof","im Hotel","im Supermarkt"],"Im Text steht: in der Schule.","Lesen",p);
  add("Welche Wörter wiederholt Mira?",[a[0]+", "+b[0]+" und "+c[0],a[0]+" und Bahnhof",b[0]+" und Montag","nur ein Wort"],"Der Text nennt alle drei Wörter.","Lesen",p);
  add("Was schreibt Mira in ihr Heft?",["die Wörter","eine Telefonnummer","eine Adresse","einen Fahrplan"],"Sie schreibt die Wörter in ihr Heft.","Lesen",p);
  add("Wann zeigt Mira die Wörter?",["am Freitag","am Montag","am Dienstag","am Sonntag"],"Am Freitag.","Lesen",p);
  add("Wem zeigt Mira die Wörter?",["ihrem Lehrer","ihrem Bruder","einem Arzt","einem Fahrer"],"Sie zeigt sie ihrem Lehrer.","Lesen",p);
 }
 if(items.length!==50)throw Error("German build count "+items.length);
 return items;
}
function redraw(){window.EBDA_APP_RENDER?.()}
function start(g,u,i){s={grade:g,unit:u,lesson:i,items:build(g,u,i),cursor:0,answers:{},done:false};redraw()}
function choose(v){if(s.answers[s.cursor]?.checked)return;s.answers[s.cursor]={value:v};redraw()}
function check(){const a=s.answers[s.cursor];if(!a||a.checked)return;a.checked=true;a.correct=a.value===s.items[s.cursor].answer;redraw()}
function next(){if(!s.answers[s.cursor]?.checked)return;if(s.cursor===s.items.length-1)s.done=true;else s.cursor++;redraw()}
function previous(){if(s.cursor>0)s.cursor--;redraw()}
function restart(){start(s.grade,s.unit,s.lesson)}
function render(){
 const unit=window.EBDAA_GERMAN_UNITS[s.grade][s.unit],q=s.items[s.cursor],a=s.answers[s.cursor],
 answered=Object.values(s.answers).filter(v=>v.checked).length,correct=Object.values(s.answers).filter(v=>v.correct).length;
 const content=s.done?'<div class="feedback"><h2>Übung abgeschlossen!</h2><p>Richtige Antworten: '+correct+' / 50</p><button class="btn teal" onclick="EBDAA_GERMAN_PRACTICE.restart()">Noch einmal üben</button></div>':
 '<div class="eyebrow">'+esc(q.type)+' · Dabei! '+esc(unit.series)+'</div>'+(q.reading?'<div class="hint"><strong>Lesetext</strong><p>'+esc(q.reading)+'</p></div>':'')+'<h2 class="practice-question">'+esc(q.question)+'</h2><div class="choices">'+q.options.map((o,j)=>'<button class="choice '+(a?.value===j?'chosen ':'')+(a?.checked&&q.answer===j?'correct':'')+'" '+(a?.checked?'disabled':'')+' onclick="EBDAA_GERMAN_PRACTICE.choose('+j+')">'+esc(o)+'</button>').join('')+'</div>'+(a?.checked?'<div class="feedback '+(a.correct?'':'error')+'"><strong>'+(a.correct?'✓ Richtig!':'Noch einmal ansehen')+'</strong><p>'+esc(q.explanation)+'</p></div>':'')+'<div class="stepfooter"><button class="btn light" '+(s.cursor===0?'disabled':'')+' onclick="EBDAA_GERMAN_PRACTICE.previous()">← Zurück</button><button class="btn teal" '+(!a?'disabled':'')+' onclick="EBDAA_GERMAN_PRACTICE.'+(a?.checked?'next':'check')+'()">'+(a?.checked?'Weiter →':'Antwort prüfen')+'</button></div>';
 return '<section class="practice-focus" lang="de"><header class="practice-focus__header"><div class="practice-focus__header-row"><button class="practice-focus__exit" onclick="germanBackToUnit()">← Alle Lektionen</button><span class="practice-focus__year">JAHRGANG '+s.grade+' · DEUTSCH</span></div><div class="practice-focus__info"><h1 class="practice-focus__lesson">'+esc(unit.sessions[s.lesson])+'</h1><span class="practice-focus__counter">Frage '+(s.done?50:s.cursor+1)+' / 50</span></div><div class="practice-focus__track" role="progressbar" aria-valuemin="0" aria-valuemax="50" aria-valuenow="'+answered+'"><i style="width:'+(answered*2)+'%"></i></div></header><div class="practice-focus__content"><div class="guided-question">'+content+'<p class="muted" style="font-size:12px">50 automatisch zusammengestellte A1-Übungen zu Wortschatz, Grammatik und Lesen. Manche Fragetypen wiederholen sich. Keine offiziellen Aufgaben aus dem Buch; die Lehrkraft muss die Inhalte prüfen. Hörverstehen und freie Sprachproduktion sind noch nicht bewertet.</p></div></div></section>';
}
return {build,start,choose,check,next,previous,restart,render};
})();