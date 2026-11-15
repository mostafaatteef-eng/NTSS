import { chromium } from "playwright";
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";

const root=process.cwd();
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8"};
const server=createServer((req,res)=>{
  const parsed=new URL(req.url,"http://localhost");
  const name=parsed.pathname==="/"?"/index.html":parsed.pathname;
  const full=path.resolve(root,"."+name);
  if(!full.startsWith(root+path.sep)||!existsSync(full)||!statSync(full).isFile()){res.writeHead(404);res.end("Not found");return;}
  res.writeHead(200,{"Content-Type":mime[path.extname(full)]||"application/octet-stream","Cache-Control":"no-store"});
  createReadStream(full).pipe(res);
});
await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
const address=server.address(),url="http://127.0.0.1:"+address.port+"/";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];
page.on("pageerror",e=>errors.push(e.message));
const goHome=async()=>{await page.goto(url,{waitUntil:"load"});await page.waitForSelector("#app");};
try{
 await goHome();
 if(!await page.getByText("Choose your academic year").count())throw Error("Grade landing missing");
 if(await page.getByText("FOUR WAYS TO LEARN").count())throw Error("Removed feature section reappeared");
 if(await page.locator(".feature-tile").count())throw Error("Removed feature cards remain");
 if(!await page.title().then(x=>x.includes("EBDA Learning")))throw Error("EBDA brand title missing");
 const uiStyle=await page.evaluate(()=>({linked:[...document.styleSheets].some(s=>s.href?.includes("ebda-ui.css")),hero:getComputedStyle(document.querySelector(".hero-art")).backgroundImage}));
 if(!uiStyle.linked||!uiStyle.hero.includes("gradient"))throw Error("Student-friendly EBDA stylesheet missing or not applied");
 if(await page.locator("a.skip-link").count()!==1)throw Error("Accessibility skip link missing");
 await page.locator("#lesson-search").fill("Python");
 if(await page.locator("#search-results .search-result").count()<1)throw Error("Cross-grade lesson search failed");
 await page.locator("#lesson-search").fill("");

 const years=page.getByRole("button",{name:/View subjects/i});
 if(await years.count()!==3)throw Error("Three academic years missing");
 await years.nth(1).click();
 await page.getByRole("button",{name:/Explore subject/i}).click();
 await page.getByRole("button",{name:/View session index/i}).first().click();
 await page.getByRole("button",{name:/HANDS-ON LAB/i}).first().click();
 if(await page.locator(".lab-module").count())throw Error("Old multi-accordion layout remains");
 if(await page.locator(".lesson-steps .lesson-step").count()!==5)throw Error("Five learning stages missing");
 if(!await page.locator(".side-list button").count())throw Error("Lesson sidebar missing");
 if(!await page.locator(".theory-spark").count())throw Error("Discover learning prompt missing");
 const next=()=>page.locator(".stage .stepfooter .btn.teal").click();
 const back=()=>page.locator(".stage .stepfooter .btn.light").click();
 await next();
 if(!await page.locator(".advanced-stage-content[data-stage='1']").count())throw Error("Experiment not opened");
 const code=page.locator("#studio-editor");
 if(!await code.count())throw Error("Python editor missing");
 const initial=await code.inputValue();
 await code.fill("print(123)");
 await page.getByRole("button",{name:/Restore example/i}).click();
 if(await code.inputValue()!==initial)throw Error("Restore example failed");
 await code.fill("print('student draft stays')");
 await next();
 if(!await page.locator(".ebda-puzzle").count())throw Error("Visible mini-game missing in Understand");
 for(let r=0;r<3;r++){
   const answer=await page.evaluate(round=>window.EBDA_PUZZLES.task(2,0,0,round).answerIndex,r);
   await page.locator(".ebda-puzzle .puzzle-choice").nth(answer).click();
   await page.locator(".ebda-puzzle").getByRole("button",{name:/Next puzzle|Complete mission/i}).click();
 }
 if(!await page.locator(".ebda-puzzle").getByText(/Mission solved/i).count())throw Error("Python concept game cannot be completed");
 await page.locator(".advanced-stage-content details.lab-support > summary").filter({hasText:/visual explanation/i}).click();
 if(!await page.getByText("INTERACTIVE CONCEPT VISUALIZER").count())throw Error("Visualizer is not accessible");
 await back();
 if(await code.inputValue()!=="print('student draft stays')")throw Error("Code draft lost when navigating");
 await page.getByRole("button",{name:/Restore example/i}).click();
 await page.locator(".advanced-stage-content details.lab-support > summary").first().click();
 await page.locator("#numeric-input").fill("6");
 await page.getByRole("button",{name:/Check calculated answer/i}).click();
 await next();
 await page.locator(".advanced-stage-content details.lab-support > summary").filter({hasText:/data playground/i}).click();
 const data=page.locator("#data-playground");
 if(!await data.getByText("GUIDED DATA CHALLENGE").count())throw Error("Data playground missing");
 await data.locator("#play-challenge").selectOption("missing");
 await data.locator("#play-site").selectOption("Damietta");
 await data.getByRole("button",{name:/Check my transformation/i}).click();
 if(!await data.getByText(/Challenge complete!/).count())throw Error("Missing-data challenge failed");
 await next();
 if(!await page.getByText("EMBEDDED FORMATIVE CHALLENGE").count())throw Error("Check stage missing");
 const correct=await page.evaluate(()=>window.EBDAA_MISSIONS.find(m=>m.g===2&&m.u===0).steps[0][2]);
 await page.locator(".advanced-stage-content button.choice").nth(correct).click();
 await page.getByRole("button",{name:"Check answer",exact:true}).click();
 if(!await page.locator(".advanced-stage-content").getByText(/Correct/).count())throw Error("Concept feedback missing");
 await next();
 if(!await page.locator(".practice-focus").count())throw Error("Focus Practice view missing");
 if(await page.locator(".side-list, .lesson-steps, .lab-support").count())throw Error("Distractions still visible during practice");
 if(await page.locator(".practice-focus").getByText(/PRACTICAL RUBRIC|UNIT CASEFILE/).count())throw Error("Extraneous modules in Focus Practice");
 if((await page.locator("#focus-counter").textContent())!=="Question 1 / 50")throw Error("Question counter missing");
 if(!await page.locator("#ebdaa-practice-stage").count())throw Error("Question panel missing");
 if(await page.evaluate(()=>window.EBDA_RUBRIC.score(2,0,0).earned)!==35)throw Error("Numeric evidence state was not preserved");
 const prior=await page.evaluate(()=>window.EBDAA_PRACTICE.questionOrder());
 await page.evaluate(()=>window.EBDAA_PRACTICE.restart());
 const current=await page.evaluate(()=>window.EBDAA_PRACTICE.questionOrder());
 if(prior.length!==50||new Set(prior).size!==50||prior.join("|")===current.join("|"))throw Error("New attempt did not reshuffle its 50 unique questions");
 const q=await page.evaluate(()=>window.EBDAA_PRACTICE.currentQuestion());
 if(q.mode==="order"){
   for(const value of q.answer.split("|"))await page.locator("#ebdaa-practice-stage button.choice").filter({hasText:value}).click();
 }else if(q.mode==="number"){
   await page.locator("#ebdaa-answer").fill(String(q.answer));
 }else{
   await page.locator("#ebdaa-practice-stage button.choice").filter({hasText:String(q.answer)}).first().click();
 }
 await page.locator("#ebdaa-practice-stage").getByRole("button",{name:"Check answer",exact:true}).click();
 if(!await page.locator("#ebdaa-practice-stage").getByText(/Correct!|Not quite yet/).count())throw Error("Practice feedback missing");
 await page.locator("#ebdaa-practice-stage").getByRole("button",{name:/Next question/i}).click();
 if((await page.locator("#focus-counter").textContent())!=="Question 2 / 50")throw Error("Next practice question missing");
 await page.locator("#ebdaa-practice-stage").getByRole("button",{name:/Previous/i}).click();
 if((await page.locator("#focus-counter").textContent())!=="Question 1 / 50")throw Error("Practice question history missing");
 // Verify the SQL game that now appears in the screenshot's Year 2 modeling unit.
 await page.evaluate(()=>{chooseGrade(2);chooseSubject();chooseGradeUnit(1);openAdvancedSession(0);goAdvancedStep(2)});
 if(!await page.locator(".ebda-puzzle").getByText("SQL Key Detective").count())throw Error("SQL key-matching game missing");
 if(!await page.locator(".ebda-puzzle").getByText(/INNER JOIN/i).count())throw Error("SQL game prompt missing");
 const sqlAnswer=await page.evaluate(()=>window.EBDA_PUZZLES.task(2,1,0,0).answerIndex);
 await page.locator(".ebda-puzzle .puzzle-choice").nth(sqlAnswer).click();
 if(!await page.locator(".ebda-puzzle").getByText(/Evidence confirmed|Correct reasoning/i).count())throw Error("SQL game answer did not grade");
 if(!await page.locator(".advanced-stage-content details.lab-support > summary").filter({hasText:/factory mystery/i}).count())throw Error("Factory mystery route missing");
 await goHome();
 await page.getByRole("button",{name:/View subjects/i}).nth(2).click();
 await page.getByRole("button",{name:/Explore subject/i}).click();
 await page.getByRole("button",{name:/View session index/i}).last().click();
 await page.getByRole("button",{name:/HANDS-ON LAB/i}).first().click();
 if(await page.locator(".lesson-steps .lesson-step").count()!==5)throw Error("Year 3 learning stages missing");
 await page.locator(".stage .stepfooter .btn.teal").click();
 if(!await page.getByText(/EVIDENCE CHECK/).count())throw Error("Year 3 experiment missing");
 await page.locator(".stage .stepfooter .btn.teal").click();
 if(!await page.locator(".ebda-puzzle .puzzle-choice").count())throw Error("Year 3 interactive game missing");
 if(!await page.getByText("INTERACTIVE CONCEPT VISUALIZER").count())throw Error("Year 3 Understand missing");
 await page.locator(".stage .stepfooter .btn.teal").click();
 const yearThreeAnswer=await page.evaluate(()=>window.EBDAA_MISSIONS.find(m=>m.g===3&&m.u===5).steps[0][2]);
 await page.locator(".advanced-stage-content button.choice").nth(yearThreeAnswer).click();
 await page.getByRole("button",{name:"Check answer",exact:true}).click();
 await page.locator(".stage .stepfooter .btn.teal").click();
 if((await page.locator("#focus-counter").textContent())!=="Question 1 / 50")throw Error("Year 3 integrated practice missing");
 if(await page.evaluate(()=>window.EBDAA_PRACTICE.questionOrder().length)!==50)throw Error("Year 3 full question bank missing");
 // Verify the actual question-only UI at laptop, tablet and phone widths.
 for(const width of [1366,820,390]){
   await page.setViewportSize({width,height:844});
   const dimensions=await page.evaluate(()=>{
     const footer=document.querySelector(".practice-focus .stepfooter");
     const content=document.querySelector(".practice-focus__content");
     return {overflow:document.documentElement.scrollWidth-innerWidth,
       footer:footer?getComputedStyle(footer).position:null,
       footerRight:footer?.getBoundingClientRect().right,
       contentRight:content?.getBoundingClientRect().right,
       topHidden:getComputedStyle(document.querySelector(".top")).display==="none"};
   });
   if(dimensions.overflow>2||dimensions.footer!=="fixed"||!dimensions.topHidden)throw Error("Focus Practice layout broken at "+width+"px: "+JSON.stringify(dimensions));
   if(dimensions.contentRight>width+2||dimensions.footerRight>width+2)throw Error("Overflowing question controls at "+width+"px");
 }
 await page.locator(".practice-focus__exit").click();
 if(await page.locator(".practice-focus").count())throw Error("Exit practice did not restore the lesson");
 await page.setViewportSize({width:390,height:844});
 await page.reload({waitUntil:"load"});
 if(await page.locator("body").evaluate(el=>el.scrollWidth)>410)throw Error("Mobile horizontal overflow");
 if(errors.length)throw Error("JS errors: "+errors.join("; "));
 console.log("Browser smoke PASS: focused question-only view on laptop, tablet and mobile, 50-question navigation, retained lab evidence and safe exit.");
} finally {await browser.close();await new Promise(ok=>server.close(ok))}
