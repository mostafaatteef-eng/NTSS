'use strict';
// Unit-render fixtures load the real event binder without scheduling DOM work.
// Browser QA separately exercises its actual listeners and CSP behavior.
const fs=require('node:fs'),vm=require('node:vm');
module.exports=function loadUiEvents(window,document={querySelectorAll(){return []}}){
 vm.runInNewContext(fs.readFileSync('ui-events.js','utf8'),{window,document,queueMicrotask(){}});
};
