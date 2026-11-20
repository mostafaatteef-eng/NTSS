import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const html=readFileSync("index.html","utf8");
const sw=readFileSync("sw.js","utf8");
const scriptTags=[...html.matchAll(/<script\b[^>]*\bsrc="[^"]+"[^>]*><\/script>/gi)].map(m=>m[0]);
assert.ok(scriptTags.length>=45,"Application scripts should still be linked");
assert.ok(scriptTags.every(tag=>/\bdefer\b/.test(tag)),"All classic app scripts should be deferred, not parser blocking");
assert.ok(!scriptTags.some(tag=>/\basync\b/.test(tag)),"Async would break ordered module dependencies");
const lazyModules=["case-labs.js","scenario-labs.js","visual-playground.js","code-challenges.js","concept-visualizer.js","theory-studio.js","lab-studio.js"];
assert.ok(scriptTags.some(tag=>tag.includes("lazy-features.js")),"Lazy feature loader must be present");
for(const name of lazyModules)assert.ok(!scriptTags.some(tag=>tag.includes('src="'+name+'"')),"Optional lab should not block startup: "+name);
assert.ok(html.indexOf("lazy-features.js")<html.indexOf("app-main.js"),"Lazy loader must precede main app");

const subjectModules=["math-practice.js","physics-practice.js","english-practice.js","business-english-practice.js",
 "german-practice.js","arabic-practice.js","social-studies-practice.js","civics-practice.js","economics-practice.js"];
for(const name of subjectModules)assert.ok(!scriptTags.some(tag=>tag.includes('src="'+name)),"Subject practice must load on demand: "+name);

const lazy=readFileSync("lazy-features.js","utf8");
assert.doesNotThrow(()=>new vm.Script(lazy));
assert.ok(lazyModules.every(name=>lazy.includes('"'+name+'"')),"Every optional module must be available on demand");
assert.ok(subjectModules.every(name=>lazy.includes('"'+name+'"')),"Every subject module must be configured for lazy loading");

assert.doesNotThrow(()=>new vm.Script(sw));
assert.ok(!sw.includes("html.matchAll("),"Do not eagerly fetch every linked asset during service worker install");
assert.ok(sw.includes("event.waitUntil(cache.put("),"Cache assets in background after first response");
assert.ok(sw.includes("ntss-static-20261120-speed"),"Cache version must update after optimizing install");
const calls=[];
const fake={};
const doc={
 createElement(){return {async:true,src:"",remove(){}}},
 head:{appendChild(script){calls.push(script.src);Promise.resolve().then(()=>script.onload())}}
};
new Function("window","document",lazy)(fake,doc);
await Promise.all([fake.NTSS_LAZY.ensureStudio(),fake.NTSS_LAZY.ensureStudio()]);
assert.equal(fake.NTSS_LAZY.isReady(),true);
assert.deepEqual(calls,lazyModules,"Exactly seven lazy scripts should load once and in order");
await fake.NTSS_LAZY.ensureStudio();
assert.equal(calls.length,7,"Repeated requests should not load scripts again");
for(const mode of ["mathPractice","physicsPractice","englishPractice","businessPractice","germanPractice",
 "arabicPractice","socialPractice","civicsPractice","economicsPractice"]){
 await fake.NTSS_LAZY.ensureSubject(mode);
 assert.equal(fake.NTSS_LAZY.isSubjectReady(mode),true,"Subject ready: "+mode);
}
assert.equal(calls.length,16,"Seven studio and nine subject scripts loaded once each");

console.log("Speed checks passed: "+scriptTags.length+" nonblocking scripts, sixteen lazy modules, progressive cache.");
