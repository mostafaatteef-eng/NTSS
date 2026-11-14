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
 if(!await page.title().then(x=>x.includes("EBDA Learning")))throw Error("EBDA brand title missing");
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
 if(!await page.getByText("PRACTICAL BRIEF").count())throw Error("Year 2 practical brief missing");
 if(!await page.getByText(/50 QUESTIONS/).count())throw Error("50-question panel missing");
 await page.getByRole("button",{name:/Begin 50-question workshop/i}).click();
 if(!await page.getByText("QUESTION 1 / 50").count())throw Error("Question 1 missing");
 const options=page.locator("#ebdaa-practice-stage .choice");
 if(await options.count()>0){await options.first().click()}else{await page.locator("#ebdaa-answer").fill("1")}
 await page.getByRole("button",{name:"Check answer",exact:true}).last().click();
 if(!await page.getByText(/Review the method|Correct answer/).count())throw Error("Practice feedback missing");
 await page.getByRole("button",{name:/Next question/i}).click();
 if(!await page.getByText("QUESTION 2 / 50").count())throw Error("Next question failed");
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
 console.log("Browser smoke PASS: EBDA brand, search, grade navigation, practice, feedback, Year 3 labs, mobile width.");
} finally {await browser.close();await new Promise(ok=>server.close(ok))}
