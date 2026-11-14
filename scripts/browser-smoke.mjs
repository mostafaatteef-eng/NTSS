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
 if(await years.count()!==3)throw Error("Need 3 grade entries");
 await years.nth(1).click(); // Year 2
 await page.getByRole("button",{name:/Explore subject/i}).click();
 await page.getByRole("button",{name:/View session index/i}).first().click();
 await page.getByRole("button",{name:/HANDS-ON LAB/i}).first().click();
 if(await page.locator(".lab-module").count()!==5)throw Error("Expected five learning stages");
 if(await page.locator(".lab-module[open]").count()!==1)throw Error("More than one stage open");
 if(await page.locator(".theory-spark").count()!==1)throw Error("Focused Discover prompt absent");
 if(await page.locator(".theory-path").count())throw Error("Old overcrowded theory pathway remains");
 if(await page.locator(".theory-more[open]").count())throw Error("Detailed guidance should be collapsed by default");
 await page.locator(".lab-module").first().getByRole("button",{name:/Continue to Experiment/i}).click();
 if(!(await page.locator(".lab-module").nth(1).evaluate(el=>el.open)))throw Error("Continue button did not open Experiment");
 if(await page.getByText(/PRACTICAL BRIEF|Your learning mission/).count())throw Error("Removed practical brief still visible");
 if(await page.locator("#task-progress").count())throw Error("Removed checklist still rendered");
 if(!await page.getByText("PRACTICAL RUBRIC").count())throw Error("Practical rubric not rendered");
 if(!await page.getByText("VISUAL DATA PLAYGROUND").count())throw Error("Visual data playground not rendered");
 if(await page.locator(".lab-workspace__editor").count()!==1)throw Error("Unified code workspace missing");
 if(await page.locator("#studio-shortcut").count()!==1)throw Error("Keyboard shortcut guidance missing");
 const originalSource=await page.locator("#studio-editor").inputValue();
 await page.locator("#studio-editor").fill("print(123)");
 await page.getByRole("button",{name:/Restore example/i}).click();
 if(await page.locator("#studio-editor").inputValue()!==originalSource)throw Error("Restore example did not reset Python editor");
 await page.locator("#studio-editor").fill("print('student draft stays')");
 await page.locator(".lab-module").nth(2).locator("summary").first().click();
 await page.locator(".lab-module").nth(1).locator("summary").first().click();
 if(await page.locator("#studio-editor").inputValue()!=="print('student draft stays')")throw Error("Student code disappeared when switching lab stages");
 await page.getByRole("button",{name:/Restore example/i}).click();

 await page.locator(".lab-module").nth(2).locator("summary").first().click();
 await page.locator(".lab-module").nth(2).locator("details.lab-support > summary").click();
 const guided=page.locator("#data-playground");
 if(!await guided.getByText("GUIDED DATA CHALLENGE").count())throw Error("Guided challenge panel missing");
 await guided.locator("#play-challenge").selectOption("missing");
 await guided.locator("#play-site").selectOption("Damietta");
 await guided.getByRole("button",{name:/Check my transformation/i}).click();
 if(!await guided.getByText(/Challenge complete!/).count())throw Error("Missing-data challenge failed");
 await guided.locator("#play-challenge").selectOption("clean");
 await guided.locator("#play-site").selectOption("All");

 await page.locator("#data-playground").getByRole("button",{name:"Impute missing"}).click();
 if(!await page.locator("#data-playground").getByText("Missing: 0").count())throw Error("Imputation did not recompute records");
 const initialRubric=await page.locator("#rubric-progress").textContent();
 if(!initialRubric.includes("0 / 65"))throw Error("Python execution must not be credited by unrelated visual data manipulation");
 await page.locator(".lab-module").nth(1).locator("summary").first().click();
 await page.locator("#numeric-input").fill("6");
 await page.getByRole("button",{name:/Check calculated answer/i}).click();
 if(!await page.locator("#rubric-progress").getByText(/Automatically verified: 35 \/ 65/).count())throw Error("Numerical evidence was not scored independently of actual Python execution");

 await page.locator(".lab-module").nth(3).locator("summary").first().click();
 if(!await page.getByText(/50 QUESTIONS/).count())throw Error("50-question panel missing");
 if(await page.getByRole("button",{name:/Begin 50-question workshop/i}).count())throw Error("Separate workshop launch button remains");
 if(!await page.getByText("QUESTION 1 / 50").count())throw Error("Questions are not integrated directly in the lesson");
 const attemptA=await page.evaluate(()=>window.EBDAA_PRACTICE.questionOrder());
 await page.evaluate(()=>window.EBDAA_PRACTICE.begin(2,0,0));
 const attemptB=await page.evaluate(()=>window.EBDAA_PRACTICE.questionOrder());
 if(attemptA.length!==50||new Set(attemptA).size!==50)throw Error("Invalid 50-question bank");
 if(attemptA.join("|")===attemptB.join("|"))throw Error("New attempt repeated the old question order");
 if([...attemptA].sort().join("|")!==[...attemptB].sort().join("|"))throw Error("Shuffling changed the actual question set");

 if(!await page.getByText("QUESTION 1 / 50").count())throw Error("Question 1 missing");
 const q=await page.evaluate(()=>window.EBDAA_PRACTICE.currentQuestion());
 if(q.mode==="order"){
   for(const step of q.answer.split("|"))await page.locator("#ebdaa-practice-stage button.choice").filter({hasText:step}).click();
 }else if(q.mode==="number"){
   await page.locator("#ebdaa-answer").fill(String(q.answer));
 }else{
   const choice=q.mode==="truefalse"?String(q.answer):String(q.answer);
   await page.locator("#ebdaa-practice-stage button.choice").filter({hasText:choice}).first().click();
 }
 await page.getByRole("button",{name:"Check answer",exact:true}).last().click();
 if(!await page.locator("#ebdaa-practice-stage").getByText(/Correct!|Not quite yet/).count())throw Error("Practice feedback missing");
 await page.getByRole("button",{name:/Next question/i}).click();
 if(!await page.getByText("QUESTION 2 / 50").count())throw Error("Next question failed");
 await page.locator("#ebdaa-practice-stage").getByRole("button",{name:/Previous/i}).click();
 if(!await page.locator("#ebdaa-practice-stage").getByText("QUESTION 1 / 50").count())throw Error("Previous question lost its place");
 if(!await page.locator("#ebdaa-practice-stage").getByText(/Correct!|Not quite yet/).count())throw Error("Reviewed answer feedback was lost");

 await goHome();
 await page.getByRole("button",{name:/View subjects/i}).nth(2).click();
 await page.getByRole("button",{name:/Explore subject/i}).click();
 await page.getByRole("button",{name:/View session index/i}).last().click();
 await page.getByRole("button",{name:/HANDS-ON LAB/i}).first().click();
 if(!await page.getByText(/EVIDENCE CHECK/).count())throw Error("Year 3 evidence check missing");
 await page.setViewportSize({width:390,height:844});
 await page.reload({waitUntil:"load"});
 if(await page.locator("body").evaluate(el=>el.scrollWidth)>410)throw Error("Mobile horizontal overflow");
 if(errors.length)throw Error("JS errors: "+errors.join("; "));
 console.log("Browser smoke PASS: minimal UI, five collapsible stages, search, rubric, data transforms, guided practice, mobile width.");
} finally {await browser.close();await new Promise(ok=>server.close(ok))}
