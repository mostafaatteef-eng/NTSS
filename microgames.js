/* Browser-only hands-on manipulation. No profile, login or persistence. */
window.EBDAA_MICRO_STATE={bits:[0,1,0,1],items:[2,4],stack:[3,8],actions:[]};
window.EBDAA_MICRO_ACTION=function(kind,operation){
const st=window.EBDAA_MICRO_STATE;
if(kind==="bits"){st.bits[operation]=1-st.bits[operation]}
if(kind==="list"){if(operation==="add"&&st.items.length<7)st.items.push(st.items.length+3);if(operation==="remove"&&st.items.length)st.items.pop();if(operation==="reset")st.items=[2,4]}
if(kind==="stack"){if(operation==="push"&&st.stack.length<7){st.stack.push(st.stack.length*2+1);st.actions.push("push")};if(operation==="pop"&&st.stack.length){st.stack.pop();st.actions.push("pop")};if(operation==="reset"){st.stack=[3,8];st.actions=[]}}
if(typeof render==="function")render();
};
window.EBDAA_MICRO_RENDER=function(s){
const state=window.EBDAA_MICRO_STATE;
const button=(txt,action)=>("<button class=\"btn light\" type=\"button\" "+window.NTSS_EVENTS.bind("click",function(event){(action).call(this,event)})+" style=\"margin:4px;min-width:80px\">"+(txt)+"</button>");
if(s.id==="1-1"){
const value=state.bits.reduce((a,b,i)=>a+b*Math.pow(2,3-i),0);
return '<div class="interactive" style="background:#f2faf8;border-color:#b7e5d9"><div class="simlabel">🧩 Binary Switchboard</div><p>Click any bit to turn it ON or OFF. Computers use bits to encode information.</p><div class="visual-row">'+state.bits.map((b,i)=>button(b?'1 ●':'0 ○',()=>window.EBDAA_MICRO_ACTION("bits",i))).join("")+'</div><p style="text-align:center">Binary <b>'+state.bits.join("")+'</b> = Decimal <b>'+value+'</b></p><p class="muted">Place values: 8, 4, 2, 1. Sum only the places with a 1.</p></div>';
}
if(s.id==="1-5"){
return '<div class="interactive" style="background:#f2faf8;border-color:#b7e5d9"><div class="simlabel">🧩 List Builder</div><p>Change a Python-style mutable list. Add items and remove the last item.</p><div class="visual-row">'+state.items.map(x=>'<span class="visual-cell">'+x+'</span>').join("")+'</div><div class="actions" style="justify-content:center">'+button("Append",()=>window.EBDAA_MICRO_ACTION("list","add"))+button("Pop last",()=>window.EBDAA_MICRO_ACTION("list","remove"))+button("Reset",()=>window.EBDAA_MICRO_ACTION("list","reset"))+'</div><p><code>values = ['+state.items.join(", ")+']</code></p></div>';
}
if(s.id==="6-4"){
return '<div class="interactive" style="background:#f2faf8;border-color:#b7e5d9"><div class="simlabel">🧩 Stack Playground</div><p>Push or pop values. The top is the rightmost item.</p><div class="visual-row">'+state.stack.map(x=>'<span class="visual-cell" style="background:#a5dfd1">'+x+'</span>').join("")+'</div><div class="actions" style="justify-content:center">'+button("Push",()=>window.EBDAA_MICRO_ACTION("stack","push"))+button("Pop",()=>window.EBDAA_MICRO_ACTION("stack","pop"))+button("Reset",()=>window.EBDAA_MICRO_ACTION("stack","reset"))+'</div><p>Top = <b>'+(state.stack.length?state.stack[state.stack.length-1]:"Empty")+'</b> · Operations this visit: '+state.actions.length+'</p></div>';
}
return "";
};
