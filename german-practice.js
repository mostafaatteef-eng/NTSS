(function(){
/* Original A1 German formative practice. 50 generated prompts per lesson, with reusable
   grammar, vocabulary and short reading templates. Teacher review required. */
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
let speechMessage="",transcriptVisible=false;
window.EBDAA_GERMAN_PRACTICE=window.EBDA_PRACTICE_FRAMEWORK.create({
 name:"EBDAA_GERMAN_PRACTICE",subject:"de",gameKey:"de",learningMode:"germanPractice",appliedKey:"de",contextGames:true,
 locale:"de",inputId:"practice-answer",checkId:"german-check",back:()=>germanBackToUnit(),
 buildItems:(g,u,i)=>build(g,u,i).map(q=>({...q,mode:"choice"})),
 title:(g,u,i)=>window.EBDAA_GERMAN_UNITS[g][u].sessions[i],
 header:g=>({lang:"de",exitLabel:"← Alle Lektionen",exit:()=>germanBackToUnit(),yearLabel:"JAHRGANG "+g+" · DEUTSCH",disclaimer:"Originale A1-Übungen: Grammatik, Wortschatz, Lesen, Hören, Sprechen und Dialog. Das Audio wird durch die Browser-Sprachausgabe erzeugt (keine Buchaufnahme). Die Spracherkennung zeigt nur erkannten Text, bewertet aber keine Aussprache. Die Aufgaben nutzen wiederkehrende Vorlagen und benötigen Lehrkraft-Review."}),
 eyebrow:(q,{g,u})=>esc(q.type)+" · Dabei! "+esc(window.EBDAA_GERMAN_UNITS[g][u].series),
 beforeControls:q=>{
  const reading=q.reading?'<div class="hint"><strong>Lesetext</strong><p>'+esc(q.reading)+'</p></div>':"";
  const isAudio=q.type==="Hören"||q.type==="Sprechen"||q.type==="Dialog";
  const hearing=isAudio?("<div class=\"hint\" role=\"group\" aria-label=\"Audio practice\"><p>"+(q.type==="Hören"?"Hör genau zu und wähle die Antwort.":q.type==="Dialog"?"Hör die Frage und wähle eine passende Antwort.":"Hör zu, sprich die Antwort nach und wähle die passende Antwort.")+"</p><div class=\"actions\"><button type=\"button\" class=\"btn light\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_GERMAN_PRACTICE.play()},"EBDAA_GERMAN_PRACTICE.play")+">▶ Anhören</button><button type=\"button\" class=\"btn light\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_GERMAN_PRACTICE.reveal()},"EBDAA_GERMAN_PRACTICE.reveal")+">"+(transcriptVisible?"Transkript verbergen":"Transkript anzeigen")+"</button>"+(q.speech?("<button type=\"button\" class=\"btn light\" "+window.NTSS_EVENTS.bind("click",function(event){EBDAA_GERMAN_PRACTICE.record()},"EBDAA_GERMAN_PRACTICE.record")+">🎙 Nachsprechen</button>"):'')+"</div>"+(transcriptVisible?'<p>'+esc(q.audio||"")+(q.speech?" — "+esc(q.speech):"")+'</p>':'')+(speechMessage?'<p role="status">'+esc(speechMessage)+'</p>':'')+"</div>"):"";
  return reading+hearing;
 },
 afterControls:(q,{g,u,i,cursor,items})=>window.EBDAA_CONTEXT_GAMES.matching("de",[g,u,i].join("-"),cursor,items,false)+window.NTSS_APPLIED.render("de",[g,u,i].join("-"),cursor,window.EBDAA_GERMAN_UNITS[g][u].sessions[i]),
 hooks:{onStart:()=>{window.EBDAA_GERMAN_AUDIO?.stop();speechMessage="";transcriptVisible=false},onMove:()=>{window.EBDAA_GERMAN_AUDIO?.stop();speechMessage="";transcriptVisible=false}},
 methods:api=>({
  play(){
   const q=api._state().items[api._state().cursor],text=q.audio||q.speech||q.question;
   if(!window.EBDAA_GERMAN_AUDIO.speak(text)){speechMessage="Keine Sprachausgabe verfügbar. Nutze das Transkript.";transcriptVisible=true;api._refresh()}
  },
  reveal(){transcriptVisible=!transcriptVisible;api._refresh()},
  record(){
   const q=api._state().items[api._state().cursor];if(!q.speech)return;
   const ok=window.EBDAA_GERMAN_AUDIO.listen(transcript=>{
    speechMessage="Erkannt: "+transcript+" — Vergleiche mit dem Beispielsatz: "+q.speech;
    api._refresh();
   },err=>{speechMessage="Spracherkennung nicht verfügbar ("+err+"). Du kannst den Satz laut üben.";api._refresh()});
   if(!ok){speechMessage="Mikrofon-Spracherkennung nicht unterstützt. Sprich den Satz laut nach.";api._refresh()}
  }
 })
});

})();
