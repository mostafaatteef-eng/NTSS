/* Original A1 German formative practice. 50 generated prompts per lesson, with reusable
   grammar, vocabulary and short reading templates. Teacher review required. */
window.EBDAA_GERMAN_PRACTICE=(function(){
let s={grade:1,unit:0,lesson:0,items:[],cursor:0,answers:{},done:false};let speechMessage="",transcriptVisible=false;
const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const index=(g,u)=>g===1?u:g===2?u+3:u+6;
function build(g,u,i){
 const unit=window.EBDAA_GERMAN_UNITS[g][u],bank=window.EBDAA_GERMAN_BANKS[index(g,u)];
 const words=bank.words,items=[],dialogs=window.EBDAA_GERMAN_DIALOGUES[index(g,u)];
 function add(question,options,explanation,type,extra={}){
  if(options.length!==4||new Set(options).size!==4)throw Error("Duplicate German answer options");
  const shift=(items.length+i)%4;
  items.push({question,options:options.slice(shift).concat(options.slice(0,shift)),answer:(4-shift)%4,explanation,type,...extra});
 }
 for(let n=0;n<10;n++){
  const q=bank.grammar[(n+i)%bank.grammar.length];
  add(q[0],q[1],"Richtig: "+q[1][0]+".","Grammatik");
 }
 for(let n=0;n<15;n++){
  const j=(n+i)%words.length,w=words[j],others=[1,2,3].map(d=>words[(j+d)%words.length]);
  if(n%2===0)add("Was bedeutet „"+w[0]+"“ auf Arabisch?",[w[1],...others.map(o=>o[1])],"„"+w[0]+"“ bedeutet „"+w[1]+"“.","Wortschatz");
  else add("Welches deutsche Wort bedeutet „"+w[1]+"“?",[w[0],...others.map(o=>o[0])],"Richtig ist „"+w[0]+"“.","Wortschatz");
 }
 for(let n=0;n<2;n++){
  const a=words[(n+i)%words.length],b=words[(n+i+1)%words.length],c=words[(n+i+2)%words.length];
  const reading="Mira lernt Deutsch in der Schule. Heute wiederholt sie drei Wörter zum Thema "+unit.title+": "+a[0]+", "+b[0]+" und "+c[0]+". Sie schreibt die Wörter in ihr Heft. Am Freitag zeigt sie die Wörter ihrem Lehrer.";
  add("Wo lernt Mira Deutsch?",["in der Schule","im Bahnhof","im Hotel","im Supermarkt"],"Im Text steht: in der Schule.","Lesen",{reading});
  add("Welche Wörter wiederholt Mira?",[a[0]+", "+b[0]+" und "+c[0],a[0]+" und Bahnhof",b[0]+" und Montag","nur ein Wort"],"Der Text nennt alle drei Wörter.","Lesen",{reading});
  add("Was schreibt Mira in ihr Heft?",["die Wörter","eine Telefonnummer","eine Adresse","einen Fahrplan"],"Sie schreibt die Wörter in ihr Heft.","Lesen",{reading});
  add("Wann zeigt Mira die Wörter?",["am Freitag","am Montag","am Dienstag","am Sonntag"],"Am Freitag.","Lesen",{reading});
  add("Wem zeigt Mira die Wörter?",["ihrem Lehrer","ihrem Bruder","einem Arzt","einem Fahrer"],"Sie zeigt sie ihrem Lehrer.","Lesen",{reading});
 }
 for(let n=0;n<5;n++){
  const w=words[(n+i)%words.length],others=[1,2,3].map(d=>words[(n+i+d)%words.length]);
  const audio="Guten Tag! Heute lernen wir das Wort "+w[0]+". Wiederhole bitte: "+w[0]+".";
  add("Welches neue Wort hörst du?",[w[0],...others.map(x=>x[0])],"Du hörst: "+w[0]+".","Hören",{audio});
 }
 for(let n=0;n<5;n++){
  const pair=dialogs[(n+i)%dialogs.length];
  const alternatives=dialogs.filter((x,k)=>k!==(n+i)%dialogs.length).slice(0,3).map(x=>x[1]);
  add("Welche Antwort passt zu dieser Frage?",[pair[1],...alternatives],"Passende Antwort: "+pair[1],"Sprechen",{speech:pair[1],audio:pair[0]});
 }
 for(let n=0;n<5;n++){
  const pair=dialogs[(n+i)%dialogs.length];
  const alternatives=dialogs.filter((x,k)=>k!==(n+i)%dialogs.length).slice(0,3).map(x=>x[1]);
  add(pair[0],[pair[1],...alternatives],"Gespräch: "+pair[0]+" — "+pair[1],"Dialog",{speech:pair[1],audio:pair[0]});
 }
 if(items.length!==50)throw Error("German build count "+items.length);
 return items;
}
function redraw(){window.EBDA_APP_RENDER?.()}
function start(g,u,i){window.EBDAA_CONTEXT_GAMES.reset("de",[g,u,i].join("-"));window.EBDAA_GERMAN_AUDIO?.stop();window.EBDAA_GAME.resetLesson('de',[g,u,i].join('-'));s={grade:g,unit:u,lesson:i,items:build(g,u,i),cursor:0,answers:{},done:false};speechMessage="";transcriptVisible=false;redraw()}
function choose(v){if(s.answers[s.cursor]?.checked)return;s.answers[s.cursor]={value:v};redraw()}
function check(){const a=s.answers[s.cursor];if(!a||a.checked)return;a.checked=true;a.correct=a.value===s.items[s.cursor].answer;redraw()}
function next(){if(!s.answers[s.cursor]?.checked)return;window.EBDAA_GERMAN_AUDIO?.stop();speechMessage="";transcriptVisible=false;if(s.cursor===s.items.length-1)s.done=true;else s.cursor++;redraw()}
function previous(){window.EBDAA_GERMAN_AUDIO?.stop();speechMessage="";transcriptVisible=false;if(s.cursor>0)s.cursor--;redraw()}
function restart(){start(s.grade,s.unit,s.lesson)}
function play(){
 const q=s.items[s.cursor],text=q.audio||q.speech||q.question;
 if(!window.EBDAA_GERMAN_AUDIO.speak(text)){speechMessage="Keine Sprachausgabe verfügbar. Nutze das Transkript.";transcriptVisible=true;redraw()}
}
function reveal(){transcriptVisible=!transcriptVisible;redraw()}
function record(){
 const q=s.items[s.cursor];if(!q.speech)return;
 const ok=window.EBDAA_GERMAN_AUDIO.listen(transcript=>{
  // Recognition transcribes speech; it does not assess pronunciation or fluency.
  speechMessage="Erkannt: "+transcript+" — Vergleiche mit dem Beispielsatz: "+q.speech;
  redraw();
 },err=>{speechMessage="Spracherkennung nicht verfügbar ("+err+"). Du kannst den Satz laut üben.";redraw()});
 if(!ok){speechMessage="Mikrofon-Spracherkennung nicht unterstützt. Sprich den Satz laut nach.";redraw()}
}
function render(){
 if(s.done)return window.EBDA_COMPLETION.render({subject:"de",grade:s.grade,unit:s.unit,index:s.lesson,lesson:window.EBDAA_GERMAN_UNITS[s.grade][s.unit].sessions[s.lesson],correct:Object.values(s.answers).filter(v=>v.checked&&v.correct).length,answers:s.answers,retry:"EBDAA_GERMAN_PRACTICE.restart()",back:"germanBackToUnit()"});

 const unit=window.EBDAA_GERMAN_UNITS[s.grade][s.unit],q=s.items[s.cursor],a=s.answers[s.cursor],
 answered=Object.values(s.answers).filter(v=>v.checked).length,correct=Object.values(s.answers).filter(v=>v.correct).length;
 const isAudio=q.type==="Hören"||q.type==="Sprechen"||q.type==="Dialog";
 const hearing=isAudio?'<div class="hint" role="group" aria-label="Audio practice"><p>'+(q.type==="Hören"?"Hör genau zu und wähle die Antwort.":q.type==="Dialog"?"Hör die Frage und wähle eine passende Antwort.":"Hör zu, sprich die Antwort nach und wähle die passende Antwort.")+'</p><div class="actions"><button type="button" class="btn light" onclick="EBDAA_GERMAN_PRACTICE.play()">▶ Anhören</button><button type="button" class="btn light" onclick="EBDAA_GERMAN_PRACTICE.reveal()">'+(transcriptVisible?"Transkript verbergen":"Transkript anzeigen")+'</button>'+(q.speech?'<button type="button" class="btn light" onclick="EBDAA_GERMAN_PRACTICE.record()">🎙 Nachsprechen</button>':'')+'</div>'+(transcriptVisible?'<p>'+esc(q.audio||"")+(q.speech?" — "+esc(q.speech):"")+'</p>':'')+(speechMessage?'<p role="status">'+esc(speechMessage)+'</p>':'')+'</div>':'';
 const content=s.done?window.EBDAA_CONTEXT_GAMES.report('de',[s.grade,s.unit,s.lesson].join('-'),false)+window.EBDAA_GAME.results(s.answers,s.items.length,false)+'<div class="feedback"><h2>Übung abgeschlossen!</h2><p>Richtige Antworten: '+correct+' / 50</p><button class="btn teal" onclick="EBDAA_GERMAN_PRACTICE.restart()">Noch einmal üben</button></div>':
 window.EBDAA_GAME.stats(s.answers,s.items.length,false)+'<div class="eyebrow">'+esc(q.type)+' · Dabei! '+esc(unit.series)+'</div>'+(q.reading?'<div class="hint"><strong>Lesetext</strong><p>'+esc(q.reading)+'</p></div>':'')+hearing+'<h2 class="practice-question">'+esc(q.question)+'</h2>'+window.EBDAA_GAME.render(q,s.cursor,a?.value,a?.checked,"de",[s.grade,s.unit,s.lesson].join("-"),"EBDAA_GERMAN_PRACTICE.choose")+window.EBDAA_CONTEXT_GAMES.matching('de',[s.grade,s.unit,s.lesson].join('-'),s.cursor,s.items,false)+(a?.checked?'<div class="feedback '+(a.correct?'':'error')+'"><strong>'+(a.correct?'✓ Richtig!':'Noch einmal ansehen')+'</strong><p>'+esc(q.explanation)+'</p></div>':'')+'<div class="stepfooter"><button class="btn light" '+(s.cursor===0?'disabled':'')+' onclick="EBDAA_GERMAN_PRACTICE.previous()">← Zurück</button><button class="btn teal" '+(!a?'disabled':'')+' onclick="EBDAA_GERMAN_PRACTICE.'+(a?.checked?'next':'check')+'()">'+(a?.checked?'Weiter →':'Antwort prüfen')+'</button></div>';
 return '<section class="practice-focus" lang="de"><header class="practice-focus__header"><div class="practice-focus__header-row"><button class="practice-focus__exit" onclick="germanBackToUnit()">← Alle Lektionen</button><span class="practice-focus__year">JAHRGANG '+s.grade+' · DEUTSCH</span></div><div class="practice-focus__info"><h1 class="practice-focus__lesson">'+esc(unit.sessions[s.lesson])+'</h1><span class="practice-focus__counter">Frage '+(s.done?50:s.cursor+1)+' / 50</span></div><div class="practice-focus__track" role="progressbar" aria-valuemin="0" aria-valuemax="50" aria-valuenow="'+answered+'"><i style="width:'+(answered*2)+'%"></i></div></header><div class="practice-focus__content"><div class="guided-question">'+content+'<p class="muted" style="font-size:12px">Originale A1-Übungen: Grammatik, Wortschatz, Lesen, Hören, Sprechen und Dialog. Das Audio wird durch die Browser-Sprachausgabe erzeugt (keine Buchaufnahme). Die Spracherkennung zeigt nur erkannten Text, bewertet aber keine Aussprache. Die Aufgaben nutzen wiederkehrende Vorlagen und benötigen Lehrkraft-Review.</p></div></div></section>';
}
return {build,start,choose,check,next,previous,restart,render,play,reveal,record};
})();