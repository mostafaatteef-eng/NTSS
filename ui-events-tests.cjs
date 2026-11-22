'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function fixture(){
 const nodes=[],tasks=[];
 const document={querySelectorAll(selector){const attr=selector.slice(1,-1);return nodes.filter(n=>n.hasAttribute(attr))}};
 const window={};vm.runInNewContext(fs.readFileSync('ui-events.js','utf8'),{window,document,queueMicrotask(fn){tasks.push(fn)}});
 function element(attributes={}){const attrs=new Map(Object.entries(attributes)),listeners=new Map();const el={nodeType:1,value:'',open:false,hasAttribute:k=>attrs.has(k),getAttribute:k=>attrs.get(k),setAttribute:(k,v)=>attrs.set(k,v),querySelectorAll(){return []},addEventListener(type,fn){assert.ok(!listeners.has(type),'No duplicate listener');listeners.set(type,fn)},removeEventListener(type,fn){assert.equal(listeners.get(type),fn);listeners.delete(type)},fire(type,event={}){listeners.get(type)?.call(el,event)}};nodes.push(el);return el}
 function attach(attribute){const attrs={};for(const m of attribute.matchAll(/([\w-]+)="([^"]*)"/g))attrs[m[1]]=m[2];return element(attrs)}
 return {api:window.NTSS_EVENTS,attach,element,flush(){while(tasks.length)tasks.shift()()}};
}
test('Opaque bindings never serialize or evaluate caller content',()=>{
 const f=fixture(),untrusted='<img src=x onerror=alert(1)>',seen=[];
 const attr=f.api.bind('click',function(event){seen.push([untrusted,this.value,event.detail])},'safeAction');
 assert.doesNotMatch(attr,/onclick|onerror|img|alert/);assert.match(attr,/data-ntss-click="ui\d+"/);
 const el=f.attach(attr);el.value='draft';f.flush();el.fire('click',{detail:7});
 assert.equal(seen.length,1);assert.deepEqual(seen[0],[untrusted,'draft',7]);
});
test('Native event, this, return-false cancellation and remounting remain correct',()=>{
 const f=fixture();let count=0,cancelled=false;
 const el=f.attach(f.api.bind('submit',function(event){assert.equal(this,el);count++;return false}));
 f.flush();f.api.mount();f.api.mount();el.fire('submit',{preventDefault(){cancelled=true}});
 assert.equal(count,1);assert.equal(cancelled,true);
 const next=f.api.bind('submit',()=>{count+=10});el.setAttribute('data-ntss-submit',next.match(/="([^"]*)"/)[1]);f.flush();el.fire('submit',{});assert.equal(count,11);
});
test('Toggle and input listeners preserve live element state without string code',()=>{
 const f=fixture();let current;
 const el=f.attach(f.api.bind('toggle',function(){current=this.open}));f.flush();el.open=true;el.fire('toggle');assert.equal(current,true);
 const input=f.attach(f.api.bind('input',function(){current=this.value}));f.flush();input.value='a"&<b';input.fire('input');assert.equal(current,'a"&<b');
 assert.throws(()=>f.api.bind('error',()=>{}),/supported UI event/);
 assert.throws(()=>f.api.bind('click','alert(1)'),/callback/);
});
test('Strict script CSP covers every root runtime template, not only index.html',()=>{
 const html=fs.readFileSync('index.html','utf8'),scriptPolicy=html.match(/script-src ([^;]+)/)[1];
 assert.doesNotMatch(scriptPolicy,/'unsafe-inline'|'unsafe-eval'/);
 assert.doesNotMatch(html,/\son(?:click|input|change|toggle|keydown|submit)=/i);
 assert.ok(html.indexOf('ui-events.js')<html.indexOf('lesson-completion.js'),'Binder loads before every template renderer');
 for(const name of fs.readdirSync('.').filter(n=>n.endsWith('.js'))){
  const src=fs.readFileSync(name,'utf8');
  assert.doesNotMatch(src,/\bon(?:click|input|change|toggle|keydown|submit)\s*=/i,name+' must not render executable attributes');
  assert.doesNotMatch(src,/setAttribute\(\s*["']on(?:click|input|change|toggle|keydown|submit)["']/i,name+' must not install string handlers');
 }
 assert.doesNotMatch(fs.readFileSync('ui-events.js','utf8'),/\beval\s*\(|\bnew\s+Function\s*\(/);
});
