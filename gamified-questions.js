/* NTSS unified question game system, v2.
   Formative rewards are ephemeral, per-session; no personal information is stored. */
window.EBDAA_GAME=(function(){
 const typed=new Map(),arranged=new Map(),removed=new Set(),usedHelp=new Map();
 const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const js=x=>esc(JSON.stringify(x));
 const norm=x=>String(x).normalize("NFKC").toLocaleLowerCase().replace(/[أإآٱ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/[\u064B-\u065F\u0670\u0640]/g,"").replace(/[.,!?؟،؛:«»"'()[\]]/g,"").replace(/\s+/g," ").trim();
 const key=(subject,lesson,idx)=>subject+":"+lesson+":"+idx;
 const choices=q=>q.options.map(v=>typeof v==="object"&&v!==null?String(v.label??v.value??""):String(v));
 const answerIndex=q=>Number.isInteger(q.answer)?q.answer:q.options.findIndex(v=>v?.correct===true);
 const LOCALES={
  en:{choice:"🎯 Quick decision",type:"⌨️ Recall challenge",build:"🧩 Phrase builder",truefalse:"⚡ Fact check",left:n=>n+" left",tf:"Is this statement correct?",yes:"True",no:"False",typeHint:"Recall the answer without seeing options.",typeAria:"Type your answer",submit:"Submit",buildHint:"Tap the tiles in the right order.",buildPh:"Build your phrase…",reset:"Reset",keyReview:"This question needs an answer-key review."},
  ar:{choice:"🎯 اختر الإجابة",type:"⌨️ اكتب الإجابة",build:"🧩 ركّب العبارة",truefalse:"⚡ صح أم خطأ",left:n=>"متبقي "+n,tf:"هل العبارة صحيحة؟",yes:"صح",no:"خطأ",typeHint:"استرجع الإجابة بدون اختيارات.",typeAria:"اكتب الإجابة",submit:"تحقق",buildHint:"رتّب البطاقات لتكوين الإجابة.",buildPh:"كوّن العبارة هنا",reset:"إعادة",keyReview:"هذا السؤال يحتاج مراجعة لمفتاح الإجابة."},
  de:{choice:"🎯 Schnell entscheiden",type:"⌨️ Abruf-Challenge",build:"🧩 Satzbausteine",truefalse:"⚡ Faktencheck",left:n=>"noch "+n,tf:"Ist diese Aussage richtig?",yes:"Richtig",no:"Falsch",typeHint:"Erinnere dich an die Antwort ohne Auswahlmöglichkeiten.",typeAria:"Antwort eingeben",submit:"Prüfen",buildHint:"Tippe die Kärtchen in der richtigen Reihenfolge.",buildPh:"Bilde hier die Phrase…",reset:"Zurücksetzen",keyReview:"Diese Frage braucht eine Überprüfung des Antwortschlüssels."}
 };
 function mode(q,n){
  if(!Array.isArray(q.options)||q.options.length!==4)return "choice";
  if(q.type==="Listening"||q.type==="Hören"||q.type==="Writing"||q.type==="Speaking"||q.type==="Sprechen"||q.type==="Dialog")return "choice";
  if(q.mode==="number")return "choice";
  // Avoid turning a distractor into a misleading true/false fact.
  const m=["choice","type","build","choice","choice"][n%5],v=choices(q)[answerIndex(q)]||"";
  if(m==="build"&&(v.trim().split(/\s+/).length<2||v.length>100))return "type";
  if(m==="type"&&v.length>100)return "choice";
  return m;
 }
 function call(name,v){const fn=name.split(".").reduce((a,b)=>a&&a[b],window);if(typeof fn==="function")fn(v)}
 function input(k,v){typed.set(k,String(v).slice(0,250))}
 function submit(k,answer,j,name){const v=typed.get(k)||"";if(!norm(v))return;call(name,norm(v)===norm(answer)?j:(j+1)%4)}
 function tile(k,j){const list=arranged.get(k)||[];if(!list.includes(j)){arranged.set(k,list.concat(j));window.EBDA_APP_RENDER?.()}}
 function clear(k){arranged.delete(k);window.EBDA_APP_RENDER?.()}
 function submitTiles(k,words,j,name){const list=arranged.get(k)||[];if(list.length!==words.length)return;call(name,list.map(i=>words[i]).join(" ")===words.join(" ")?j:(j+1)%4)}
 function help(k,correct){const prefix=k.split(":").slice(0,2).join(":");const used=usedHelp.get(prefix)||new Set();if(used.size>=3||used.has(k))return;used.add(k);usedHelp.set(prefix,used);removed.add(k);window.EBDA_APP_RENDER?.()}
 function resetLesson(subject,lesson){const prefix=subject+":"+lesson+":";for(const m of [typed,arranged])for(const k of m.keys())if(k.startsWith(prefix))m.delete(k);for(const k of [...removed])if(k.startsWith(prefix))removed.delete(k);usedHelp.delete(subject+":"+lesson)}
 function render(q,n,selected,checked,subject,lesson,name,locale){
  const opts=choices(q),correct=answerIndex(q),m=mode(q,n),k=key(subject,lesson,n),answer=opts[correct]||"",dis=checked?"disabled":"";
  const L=LOCALES[window.EBDA_I18N?.current?.()||locale]||LOCALES[subject==="ar"?"ar":"en"],labels=L;
  const top='<div class="game-label">'+labels[m]+'</div>';
  if(correct<0||correct>3)return '<p class="feedback error">'+L.keyReview+'</p>';
  if(m==="choice"){
   const used=usedHelp.get(subject+":"+lesson)||new Set(),remaining=3-used.size,hidden=removed.has(k)?[0,1,2,3].filter(j=>j!==correct).slice(0,2):[];
   return top+'<div class="choices">'+opts.map((v,j)=>'<button class="choice '+(selected===j?'chosen ':'')+(checked&&j===correct?'correct':'')+'" '+(hidden.includes(j)?'disabled aria-hidden="true" style="opacity:.18"':dis)+' onclick="'+name+'('+j+')">'+(hidden.includes(j)?"—":esc(v))+'</button>').join("")+'</div>'+(checked?"":'<button class="game-lifeline" '+(remaining<=0||removed.has(k)?"disabled":"")+' onclick="EBDAA_GAME.help('+js(k)+','+correct+')">💡 50:50 <span>'+L.left(remaining)+'</span></button>');
  }
  if(m==="truefalse"){
   const probe=n%2?(correct+1)%4:correct,yes=probe===correct;
   return top+'<p class="game-instruction">'+L.tf+'</p><div class="game-statement">'+esc(opts[probe])+'</div><div class="game-binary"><button class="choice" '+dis+' onclick="'+name+'('+(yes?correct:(correct+1)%4)+')">✓ '+L.yes+'</button><button class="choice" '+dis+' onclick="'+name+'('+(yes?(correct+1)%4:correct)+')">✕ '+L.no+'</button></div>';
  }
  if(m==="type")return top+'<p class="game-instruction">'+L.typeHint+'</p><div class="game-entry"><input class="game-input" aria-label="'+L.typeAria+'" autocomplete="off" spellcheck="false" value="'+esc(typed.get(k)||"")+'" '+dis+' oninput="EBDAA_GAME.input('+js(k)+',this.value)" onkeydown="if(event.key===\'Enter\'){event.preventDefault();EBDAA_GAME.submit('+js(k)+','+js(answer)+','+correct+','+js(name)+')}"><button class="btn teal" '+dis+' onclick="EBDAA_GAME.submit('+js(k)+','+js(answer)+','+correct+','+js(name)+')">'+L.submit+'</button></div>';
  const words=answer.trim().split(/\s+/),picked=arranged.get(k)||[];
  const order=words.map((word,id)=>({word,id})).sort((a,b)=>((a.id*17+7*n)% (words.length+1))-((b.id*17+7*n)%(words.length+1))||b.id-a.id);
  return top+'<p class="game-instruction">'+L.buildHint+'</p><div class="game-built" aria-live="polite">'+(picked.length?picked.map(j=>'<span class="game-token">'+esc(words[j])+'</span>').join(" "):'<span class="game-placeholder">'+L.buildPh+'</span>')+'</div><div class="game-tiles">'+order.map(({word,id})=>'<button class="game-tile" '+(checked||picked.includes(id)?"disabled":"")+' onclick="EBDAA_GAME.tile('+js(k)+','+id+')">'+esc(word)+'</button>').join("")+'</div><div class="game-entry"><button class="btn light" '+dis+' onclick="EBDAA_GAME.clear('+js(k)+')">'+L.reset+'</button><button class="btn teal" '+dis+' onclick="EBDAA_GAME.submitTiles('+js(k)+','+js(words)+','+correct+','+js(name)+')">'+L.submit+'</button></div>';
 }
 function score(answers,total,ar=false){
  const keys=Object.keys(answers).map(Number).sort((a,b)=>a-b),complete=keys.filter(k=>answers[k]?.checked),correct=complete.filter(k=>answers[k].correct).length,answered=complete.length;
  let streak=0;for(let k=answered-1;k>=0;k--){const x=answers[complete[k]];if(x.correct)streak++;else break}
  const xp=correct*10+Math.min(streak,5)*5,level=xp>=400?4:xp>=200?3:xp>=80?2:1,checkpoints=Math.min(5,Math.floor(answered/10));
  return {xp,streak,correct,answered,level,checkpoints,total};
 }
 function stats(answers,total,ar){
  const s=score(answers,total,ar),pct=Math.round(s.answered/Math.max(1,total)*100),mission=Math.min(5,Math.floor(s.answered/10)+1),checkpoint=s.answered>0&&s.answered%10===0;
  return '<section class="game-hud" aria-label="Game progress"><div class="game-hud-top"><span>⭐ <b>'+s.xp+' XP</b></span><span>🔥 '+s.streak+' '+(ar?"متتالية":"streak")+'</span><span>🏅 '+(ar?"المستوى":"Level")+' '+s.level+'</span></div><div class="game-quest"><span>'+(ar?"المهمة":"Quest")+' '+mission+' / 5'+(checkpoint?" · "+(ar?"نقطة إنجاز!":"Checkpoint reached!"):"")+'</span><span>'+s.answered+' / '+total+'</span></div><div class="game-hud-track" role="progressbar" aria-label="Mission progress" aria-valuemin="0" aria-valuemax="'+total+'" aria-valuenow="'+s.answered+'"><span style="width:'+pct+'%"></span></div></section>';
 }
 function results(answers,total,ar){
  const s=score(answers,total,ar),medal=s.correct/Math.max(1,total)>=.9?"🥇":s.correct/Math.max(1,total)>=.7?"🥈":"🥉";
  return '<div class="game-reward" role="status"><div class="game-reward-medal">'+medal+'</div><h3>'+(ar?"نتيجة المهمة":"Quest rewards")+'</h3><p>⭐ '+s.xp+' XP · '+s.correct+'/'+total+' '+(ar?"إجابة صحيحة":"correct")+'</p><p>'+(s.correct/Math.max(1,total)>=.8?(ar?"إنجاز ممتاز!":"Great mastery!"):ar?"راجع الإجابات وحاول مرة أخرى":"Review missed questions and try again")+'</p></div>';
 }
 return {render,stats,results,score,mode,help,resetLesson,input,submit,tile,clear,submitTiles};
})();