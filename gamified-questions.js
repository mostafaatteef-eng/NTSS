window.EBDAA_GAME=(function(){
 const typed=new Map(),arranged=new Map();
 const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const norm=x=>String(x).normalize("NFKC").toLowerCase().replace(/[\u064B-\u065F\u0670]/g,"").replace(/[.,!?؟،؛:«»"'()[\]]/g,"").replace(/\s+/g," ").trim();
 const key=(subject,lesson,idx)=>subject+":"+lesson+":"+idx;
 function mode(q,n){if(!q.options||q.options.length!==4)return "choice";if(q.type==="Listening"||q.type==="Hören")return "choice";const m=["choice","type","build","truefalse","choice"][n%5],v=String(q.options[q.answer]);return m==="build"&&v.trim().split(/\s+/).length<2?"type":m}
 function call(name,v){const fn=name.split(".").reduce((a,b)=>a&&a[b],window);if(typeof fn==="function")fn(v)}
 function input(k,v){typed.set(k,v)}
 function submit(k,answer,j,name){const v=typed.get(k)||"";if(!norm(v))return;call(name,norm(v)===norm(answer)?j:(j+1)%4)}
 function tile(k,j){const list=arranged.get(k)||[];if(!list.includes(j)){arranged.set(k,list.concat(j));window.EBDA_APP_RENDER?.()}}
 function clear(k){arranged.delete(k);window.EBDA_APP_RENDER?.()}
 function submitTiles(k,words,j,name){const list=arranged.get(k)||[];if(list.length!==words.length)return;call(name,list.map(i=>words[i]).join(" ")===words.join(" ")?j:(j+1)%4)}
 function render(q,n,selected,checked,subject,lesson,name){
  const m=mode(q,n),k=key(subject,lesson,n),correct=q.answer,answer=String(q.options[correct]),dis=checked?"disabled":"";
  const label={choice:"🎯 Choose",type:"⌨️ Type the answer",build:"🧩 Build the phrase",truefalse:"⚡ True or false"}[m];
  const tag='<div class="game-label">'+label+'</div>';
  if(m==="choice")return tag+'<div class="choices">'+q.options.map((v,j)=>'<button class="choice '+(selected===j?'chosen ':'')+(checked&&j===correct?'correct':'')+'" '+dis+' onclick="'+name+'('+j+')">'+esc(v)+'</button>').join("")+'</div>';
  if(m==="truefalse"){
   const probe=n%2?((correct+1)%4):correct,statement=q.options[probe],yes=probe===correct;
   return tag+'<div class="game-statement">'+esc(statement)+'</div><div class="game-binary"><button class="choice" '+dis+' onclick="'+name+'('+(yes?correct:(correct+1)%4)+')">✓ '+(subject==="ar"?"صح":"True")+'</button><button class="choice" '+dis+' onclick="'+name+'('+(yes?(correct+1)%4:correct)+')">✕ '+(subject==="ar"?"خطأ":"False")+'</button></div>';
  }
  if(m==="type")return tag+'<p class="game-instruction">'+(subject==="ar"?"اكتب إجابتك ثم اعتمدها":"Enter your answer without options")+'</p><div class="game-entry"><input class="game-input" autocomplete="off" spellcheck="false" value="'+esc(typed.get(k)||"")+'" '+dis+' oninput="EBDAA_GAME.input('+JSON.stringify(k)+',this.value)"><button class="btn teal" '+dis+' onclick="EBDAA_GAME.submit('+JSON.stringify(k)+','+JSON.stringify(answer)+','+correct+','+JSON.stringify(name)+')">Submit</button></div>';
  const words=answer.trim().split(/\s+/),picked=arranged.get(k)||[],order=words.map((word,id)=>({word,id})).sort((a,b)=>((a.id*7+n*3)%words.length)-((b.id*7+n*3)%words.length));
  return tag+'<p class="game-instruction">Tap the tiles to arrange the answer</p><div class="game-built">'+(picked.length?picked.map(j=>'<span class="game-token">'+esc(words[j])+'</span>').join(" "):'<span class="game-placeholder">Your phrase…</span>')+'</div><div class="game-tiles">'+order.map(({word,id})=>'<button class="game-tile" '+(checked||picked.includes(id)?"disabled":"")+' onclick="EBDAA_GAME.tile('+JSON.stringify(k)+','+id+')">'+esc(word)+'</button>').join("")+'</div><div class="game-entry"><button class="btn light" '+dis+' onclick="EBDAA_GAME.clear('+JSON.stringify(k)+')">Reset</button><button class="btn teal" '+dis+' onclick="EBDAA_GAME.submitTiles('+JSON.stringify(k)+','+JSON.stringify(words)+','+correct+','+JSON.stringify(name)+')">Submit phrase</button></div>';
 }
 function stats(answers,total,ar){
  const keys=Object.keys(answers).map(Number).sort((a,b)=>a-b),correct=keys.filter(k=>answers[k].checked&&answers[k].correct).length,answered=keys.filter(k=>answers[k].checked).length;let streak=0;for(let i=keys.length-1;i>=0;i--){const a=answers[keys[i]];if(a.checked&&a.correct)streak++;else break}
  return '<div class="game-stats"><span>⭐ '+(correct*10+Math.min(streak,5)*5)+' XP</span><span>🔥 '+streak+' '+(ar?"متتالية":"streak")+'</span><span>🏁 '+answered+'/'+total+'</span></div>';
 }
 return {render,stats,input,submit,tile,clear,submitTiles,mode};
})();