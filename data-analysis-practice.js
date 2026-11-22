/* Source-aligned formative questions for the four supplied Data Analysis slide decks.
   40 contextualized concept questions + 10 numerical applications per lesson.
   Formats repeat concepts for retrieval practice; NOT 50 independent textbook questions.
*/
(function(){
 const decks={
 1:[
 ["What does statistics primarily help us do?","Collect, organize, analyze and interpret data","Replace observations with guesses","Avoid using evidence","Make data impossible to compare","Statistics supports evidence-based decisions."],
 ["Which example is raw data rather than summarized information?","18, 25, 31, 22","The mean age is 24","The class improved overall","Attendance is higher this term","Data are raw facts; information summarizes their meaning."],
 ["What turns raw data into useful information?","Processing and summarizing","Ignoring missing values","Removing every observation","Inventing values","Processing includes organizing and calculating."],
 ["Which is qualitative data?","Favorite school subject","Number of pupils","Height in centimeters","Average test score","Favorite subject identifies a category."],
 ["Which is quantitative data?","Number of students in a class","Favorite color","Home city","Type of transport","Counts are quantitative observations."],
 ["Which variable is discrete?","Number of students","Student height","Daily temperature","Time taken to finish a test","Discrete values are counts."],
 ["Which variable is continuous?","Student height","Number of classes","Number of siblings","Number of books","Height is measured on a continuum."],
 ["Which variable is nominal?","Favorite color","Class ranking","Education level","A satisfaction level from low to high","Nominal categories have no intrinsic order."],
 ["Which variable is ordinal?","Satisfaction rated low, medium or high","Student identification number","Favorite color","Name of a city","Ordinal categories have a meaningful order."],
 ["A student interviews classmates for a new project. The responses are what kind of source?","Primary data","Secondary data","A published archive","A government report reused later","The researcher gathers primary data directly."],
 ["Which is a secondary source for a new project?","An existing government report","A new interview conducted by the researcher","Fresh classroom observation","Newly collected survey responses","The report was collected previously by another source."],
 ["Why would an analyst prefer primary data?","To collect information tailored to the question","Because it is always free","Because no design is needed","Because published sources are always wrong","Primary collection can fit the particular research problem."],
 ["Which example uses statistics in education?","Reviewing student grades and progress","Deleting all test results","Avoiding any measurement","Guessing which class succeeds","Statistical summaries help describe learning progress."],
 ["Which example uses statistics in business?","Tracking sales and customer patterns","Ignoring purchase records","Guessing prices without evidence","Discarding sales data","Businesses use data to study trends and decisions."],
 ["Why is data collection important?","It supplies observations to answer a question","It guarantees every result is correct","It removes the need for analysis","It makes sampling irrelevant","Analysis depends on usable observations."],
 ["What should be checked before classifying a phone number?","Whether it is an identifier rather than a quantity","How many digits it has only","Whether it looks large","Whether it has a decimal point","Numeric-looking identifiers are labels, not measured quantities."],
 ["Which method collects primary data?","Direct observation","Reading an existing research paper","Using a previously published table","Copying a government bulletin","A new observation is collected directly."],
 ["Which field may use statistics to examine trends?","Healthcare","Only mathematics classrooms","Only software development","No practical field","The slides illustrate healthcare, sports, business and education."],
 ["Which is an example of information?","The class mean score is 80","70, 80, 90","A list of unprocessed responses","Raw attendance entries","A calculated mean summarizes observations."],
 ["What is the role of data in decision-making?","Provide evidence to evaluate alternatives","Replace all reasoning","Guarantee causation","Make interpretation unnecessary","Relevant data informs decisions, but does not automatically prove causes."]
 ],
 2:[
 ["What is the statistical population?","The full group we want to study","Only five selected volunteers","The final calculated average","A single survey question","The population is the entire group of interest."],
 ["What is a statistical sample?","A selected subset of the population","Every member of the population","A questionnaire title","A distribution chart","A sample is the smaller group actually studied."],
 ["Why is sampling often used?","To save time and cost while learning about a population","To guarantee zero error","To avoid choosing participants","To replace all measurement","Sampling is useful when studying everyone is impractical."],
 ["Which method gives each member an equal selection chance?","Simple random sampling","Convenience sampling","Choosing friends only","Selecting the nearest desks","Simple random sampling uses equal selection chances."],
 ["Selecting every fifth person from a list is which method?","Systematic sampling","Cluster sampling","Convenience sampling","Stratified sampling","Systematic sampling selects at a fixed interval."],
 ["Selecting some students from every grade is which method?","Stratified sampling","Cluster sampling","Choosing only one class","Convenience sampling","Strata are represented separately."],
 ["Selecting entire classrooms as groups is which method?","Cluster sampling","Systematic sampling","Selecting every fifth person","Single-person observation","Cluster sampling selects whole groups."],
 ["Asking only friends standing nearby is an example of what?","Convenience sampling","Simple random sampling","Stratified sampling","A full census","Convenience selection may be unrepresentative."],
 ["What is a risk when the sample does not represent the population?","Sampling bias","Perfect generalization","Certain causality","Guaranteed validity","An unrepresentative sample can distort conclusions."],
 ["What improves the usefulness of a sample?","Suitable size and representativeness","Selecting only easy-to-contact people","Ignoring population differences","Always surveying exactly one person","Representativeness matters alongside size."],
 ["A statistic describes what?","A characteristic calculated from a sample","A guaranteed population value","The title of a project","A survey platform","A sample statistic can estimate a population parameter."],
 ["Which activity comes first when identifying a research problem?","Observe the real-life situation","Publish final conclusions","Delete possible sources","Choose charts before a question","Problem identification begins with observation."],
 ["What should a research problem be?","Clearly defined and focused","As vague as possible","Unrelated to the population","Impossible to investigate","A clear problem guides the investigation."],
 ["Which is a measurable research objective?","Calculate the school attendance rate","Make the school better","Understand everything","Improve something somehow","A measurable objective specifies a quantity or clear evidence."],
 ["Which research objective begins with a clear action?","Identify reasons for student absence","Good attendance","Better school","Nice environment","Research objectives use action verbs such as identify and measure."],
 ["What is a non-probability selection example?","Choosing available volunteers","Random selection from all eligible students","Drawing names fairly","Using a random number generator","Volunteer/convenience selection is non-probability."],
 ["Which method is especially suitable when different grades must be represented?","Stratified sampling","Selecting only Grade 1","Selecting only class A","Convenience sampling","Stratification can represent distinct population groups."],
 ["What comes after defining the problem in the slide sequence?","Determine the study population","Report results immediately","Delete original observations","Make assumptions the conclusions","The sequence identifies the relevant study population."],
 ["Which research question connects directly to school attendance?","What factors contribute to absence?","Which cartoon is most popular globally?","How old is a nearby building?","Who invented the keyboard?","The study question should match the problem."],
 ["Why should sampling choices be explained?","To assess possible bias and representativeness","To prove data are always perfect","To avoid checking the sample","To replace a research objective","Sampling methods affect how conclusions can be interpreted."]
 ],
 3:[
 ["What is a questionnaire?","A structured set of questions for collecting research data","A chart that cannot collect responses","A sample statistic","A program for deleting answers","A questionnaire collects answers relevant to research."],
 ["Which component usually introduces the purpose of a questionnaire?","Introduction","Results chart","Statistical conclusion","Data deletion","The introduction explains why the survey is being conducted."],
 ["Which part contains questions addressing the research problem?","Main questions","Closing signature only","Chart legend","File name","Main questions collect the substantive responses."],
 ["What is the first step in designing a questionnaire?","Define the research objective","Publish before testing","Pick random questions","Calculate correlation before collecting data","Objectives guide what the survey asks."],
 ["What follows identifying the research objective?","Identify the target population","Publish the results","Delete the draft","Choose a final conclusion","Target respondents should match the study."],
 ["Which question invites an answer in the respondent's own words?","Open-ended question","Yes/no item","Fixed multiple-choice item","Single numeric rating","Open-ended questions allow free text."],
 ["Which question is closed-ended?","Choose one of five satisfaction ratings","Describe your experience in your own words","Write any suggestions","Explain your opinion freely","Closed-ended questions provide fixed answers."],
 ["What does a yes/no item offer?","Two possible answers","Unlimited free-text answers","A chart without responses","A sample frame","Yes/no is a closed-ended format."],
 ["How should a rating scale be interpreted?","As ordered response options","As free-text paragraphs","As an automatic causal test","As a sampling method","Rating scales order levels of a response."],
 ["Which wording avoids a leading question?","How satisfied are you with the canteen?","Don't you agree the canteen is excellent?","The canteen is amazing, isn't it?","Everyone likes the canteen, right?","Neutral phrasing avoids suggesting the desired answer."],
 ["Why should numerical survey questions name their units?","To avoid ambiguity in reported amounts","To make the survey longer","To hide the measurement","To bias respondents","Specify hours, days or other units where relevant."],
 ["Why pilot a questionnaire with a few respondents?","To detect confusing wording before distribution","To guarantee scientific accuracy forever","To replace all later answers","To prove the hypothesis is correct","Pilot testing exposes unclear questions."],
 ["What does validity mean in a questionnaire?","It measures the intended concept","Every respondent always agrees","Questions are always short","The software is free","Validity concerns measuring what the questionnaire intends."],
 ["What does reliability mean?","Results are reasonably consistent under comparable conditions","It measures every possible topic","It ensures no respondent changes opinion","It means all questions are yes/no","Reliability concerns consistency of measurement."],
 ["What does Cronbach's alpha generally assess?","Internal consistency of a set of scale items","Whether a sample was random","How many respondents were absent","Whether Excel can draw charts","The slide names alpha as an internal-consistency check."],
 ["Which tool can create and share digital questionnaires?","Google Forms","Excel's Remove Duplicates button","A frequency histogram","Python's print function","Google Forms is a digital form tool in the lesson."],
 ["Which other online survey platform is mentioned?","QuestionPro","The Windows taskbar","A text editor only","An image viewer","QuestionPro is listed as a survey platform."],
 ["What matters when distributing a questionnaire?","Confidentiality and clear instructions","Pressuring respondents","Keeping the purpose secret","Ignoring accessibility","The lesson highlights clarity, confidentiality and suitable time."],
 ["What should respondents be given?","Sufficient time without pressure","No explanation at all","An intended answer","A compulsory personal profile","Allow suitable time and encourage honest responses."],
 ["Why is a short survey often preferable?","It reduces unnecessary respondent burden","It always produces more reliable results","It automatically eliminates bias","It proves validity","Keep only questions relevant to research objectives."]
 ],
 4:[
 [
  "What does KPI stand for?",
  "Key Performance Indicator",
  "Knowledge Process Index",
  "Key Project Instruction",
  "Known Performance Input",
  "A KPI is a measurable indicator of progress toward a goal."
 ],
 [
  "Which KPI measures how often learners attend school?",
  "Student Attendance Rate",
  "Sales Growth Rate",
  "Website Click Rate",
  "Customer Retention Rate",
  "The attendance rate tracks school attendance."
 ],
 [
  "Which indicator measures the percentage of students who pass examinations?",
  "Student Success Rate",
  "Customer Satisfaction Rate",
  "Annual Sales Growth",
  "Task Completion Rate",
  "The success/pass rate counts students passing a defined exam."
 ],
 [
  "What is a satisfaction rate?",
  "Percentage of respondents who report satisfaction",
  "Number of questions in the questionnaire",
  "The total number of classes",
  "The number of teachers present",
  "Satisfaction rate uses the proportion of satisfied respondents."
 ],
 [
  "What does the S in SMART stand for?",
  "Specific",
  "Statistical",
  "Short",
  "Standard",
  "A specific objective is clear about what will be accomplished."
 ],
 [
  "What does M in SMART mean?",
  "Measurable",
  "Memorable",
  "Manual",
  "Moderate",
  "A measurable objective can be tracked quantitatively."
 ],
 [
  "What does A in SMART mean?",
  "Achievable",
  "Automatic",
  "Accidental",
  "Abstract",
  "An achievable target is realistic with available resources."
 ],
 [
  "What does R in SMART mean?",
  "Relevant",
  "Random",
  "Repeated",
  "Rapid",
  "A relevant objective directly supports a goal."
 ],
 [
  "What does T in SMART mean?",
  "Time-bound",
  "Technical",
  "Temporary",
  "Tested",
  "A time-bound objective specifies a deadline."
 ],
 [
  "Which objective best follows SMART in the slide example?",
  "Increase attendance from 85% to 95% within three months",
  "Make attendance better",
  "All students must like the school",
  "Try to improve something someday",
  "The slide example specifies a baseline, target, metric and deadline."
 ],
 [
  "What does Student Attendance Rate typically report?",
  "Percentage of students attending",
  "Average student height",
  "Number of available classrooms",
  "Number of teachers hired",
  "Attendance rate expresses attendance as a proportion."
 ],
 [
  "Which KPI relates to sales performance?",
  "Sales Growth Rate",
  "Student Pass Rate",
  "Survey Question Count",
  "Number of classrooms",
  "Growth rate compares sales levels across periods."
 ],
 [
  "Which KPI relates to finished assignments?",
  "Task Completion Rate",
  "Canteen Satisfaction Rate",
  "Student Registration Code",
  "Number of forms created",
  "Task completion measures the fraction of planned tasks finished."
 ],
 [
  "What is the first step in selecting KPIs?",
  "Define strategic objectives",
  "Choose chart colors",
  "Publish results before collecting data",
  "Delete previous metrics",
  "An indicator should support a clearly defined objective."
 ],
 [
  "What follows setting strategic objectives when designing KPIs?",
  "Identify aspects to measure",
  "Conclude the project is complete",
  "Replace collected data with guesses",
  "Make every indicator identical",
  "Identify which parts of the objective need measurement."
 ],
 [
  "Which data source might measure satisfaction with school facilities?",
  "Responses to a relevant student questionnaire",
  "A list of keyboard shortcuts",
  "An unrelated restaurant receipt",
  "A computer wallpaper",
  "A satisfaction questionnaire gathers relevant perceptions."
 ],
 [
  "Why should a KPI be reviewed over time?",
  "To verify it remains useful and accurate",
  "To avoid measuring performance",
  "To hide any change",
  "To make the objective less clear",
  "The slide emphasizes testing and updating KPIs periodically."
 ],
 [
  "Which is an educational KPI named in the slides?",
  "Test Pass Rate",
  "Daily Sunlight Duration",
  "Distance Between Cities",
  "Volume of Rainfall",
  "The lesson lists test pass rate in educational institutions."
 ],
 [
  "What can a KPI not establish by itself?",
  "The complete cause of a performance change",
  "A value to track",
  "Progress toward an objective",
  "Whether a target was reached",
  "A measurement alone does not prove what caused the result."
 ],
 [
  "What is the lesson's group project output?",
  "A digital satisfaction survey, three KPIs and one SMART objective",
  "A Python game only",
  "A report with no data",
  "A chart without a research question",
  "The teacher notes specify a survey, three KPIs and one SMART objective."
 ]
],
 5:[
 [
  "Where do you begin creating a Google Form according to the slides?",
  "forms.google.com",
  "Excel Data Analysis",
  "A printed questionnaire",
  "A drawing canvas",
  "The slides begin by opening Google Forms."
 ],
 [
  "What should be added near the top of a new Google Form?",
  "Survey title and description",
  "Only the researcher's exam grade",
  "Only a histogram",
  "Only a scatter chart",
  "The form header identifies its purpose."
 ],
 [
  "Which Google Forms tab is used to edit questions?",
  "Questions",
  "Responses",
  "Settings",
  "Charts",
  "The Questions tab contains the question editor."
 ],
 [
  "Which Google Forms tab lets you inspect submitted answers?",
  "Responses",
  "Questions",
  "Settings",
  "Images",
  "The Responses tab provides collected answers."
 ],
 [
  "Which tab controls options such as quiz mode or response settings?",
  "Settings",
  "Questions",
  "Responses",
  "File Explorer",
  "The Settings tab contains configurable form behavior."
 ],
 [
  "What does the Required control mean?",
  "The respondent must answer the item before submitting",
  "The question is hidden permanently",
  "Answers are automatically correct",
  "The survey is deleted",
  "Required marks an answer as mandatory."
 ],
 [
  "Which Google Forms control adds a new question?",
  "The add-question plus button",
  "The Undo button",
  "The color theme only",
  "The preview eye only",
  "The plus icon inserts a question card."
 ],
 [
  "Which question type allows a long text response?",
  "Paragraph",
  "Multiple choice",
  "Dropdown",
  "Linear scale",
  "Paragraph questions are suited to extended text."
 ],
 [
  "Which question type allows one selected option among several?",
  "Multiple choice",
  "Checkboxes with multiple selections",
  "Paragraph",
  "File upload",
  "Multiple-choice questions select one answer."
 ],
 [
  "Which question type supports selecting several answers?",
  "Checkboxes",
  "Short answer",
  "Single-option dropdown",
  "Date picker",
  "Checkboxes can accept multiple selections."
 ],
 [
  "Which format lets respondents choose an ordered score like 1 to 5?",
  "Linear scale",
  "Paragraph",
  "Short answer",
  "File upload",
  "The lesson gives a linear scale as a rating example."
 ],
 [
  "Which response format is designed for picking a date?",
  "Date",
  "Paragraph",
  "Multiple choice grid",
  "Short answer",
  "Date fields collect calendar dates."
 ],
 [
  "What can QuestionPro's Analytics area be used for?",
  "Reviewing charts and reports",
  "Deleting the research objective",
  "Measuring a classroom's temperature directly",
  "Writing a programming language",
  "The lesson introduces QuestionPro analytics and reports."
 ],
 [
  "What feature is shared by Google Forms and QuestionPro?",
  "Creating and distributing online questionnaires",
  "Operating as a spreadsheet formula",
  "Replacing survey objectives",
  "Automatically guaranteeing unbiased samples",
  "Both services support questionnaire creation and sharing."
 ],
 [
  "Which QuestionPro format is described as a recommendation-likelihood question?",
  "NPS",
  "Mean",
  "Histogram",
  "Sampling frame",
  "NPS asks about likelihood to recommend."
 ],
 [
  "Which QuestionPro question format arranges items into rows and columns?",
  "Matrix",
  "Paragraph",
  "File upload",
  "Short answer",
  "Matrix questions use structured rows and columns."
 ],
 [
  "Which QuestionPro format asks respondents to order choices?",
  "Ranking",
  "Date",
  "Text box",
  "Constant sum only",
  "Ranking orders alternatives by preference."
 ],
 [
  "When should researchers enable collecting personal emails?",
  "Only if necessary, with appropriate consent and privacy safeguards",
  "Always, regardless of study goal",
  "Because every survey needs addresses",
  "To make the question more biased",
  "Collect only information needed for the task, especially with students."
 ],
 [
  "What is the final Google Forms workflow step shown in the slides?",
  "Review settings, share the form and inspect responses",
  "Remove the survey title",
  "Erase submitted data",
  "Choose a random answer key",
  "The slides finish with sharing and examining results."
 ],
 [
  "What is important about screenshots marked Paste your real screenshot here?",
  "They are placeholders, not confirmed interface documentation",
  "They prove the interface never changes",
  "They are actual live screenshots",
  "They are required student answers",
  "The provided teaching file contains screenshot placeholders."
 ]
],
 6:[
 ["Why clean a dataset before analysis?","Errors can distort statistics and decisions","To maximize duplicate records","To erase all evidence","To make charts deliberately misleading","Cleaning improves consistency and quality."],
 ["Which Excel action converts a range to a structured table?","Insert → Table","File → Print","Data → Correlation","Insert → SmartArt","Use Insert > Table and confirm headers."],
 ["Which command removes duplicate rows?","Data → Remove Duplicates","Insert → Chart","Home → Format Painter","Review → Translate","Remove Duplicates checks selected columns for repeats."],
 ["What is data validation used for?","Restricting allowable cell inputs","Calculating a correlation coefficient","Adding a histogram","Copying formulas across sheets","Excel Data Validation can enforce permitted values."],
 ["What is descriptive statistics for?","Organizing and summarizing observed data","Proving causation automatically","Ignoring unusual values","Generating interview responses","Descriptive statistics describes a dataset."],
 ["Which measure is the sum divided by the number of values?","Mean","Median","Mode","Range","The arithmetic mean equals sum/count."],
 ["Which measure is the middle value after sorting?","Median","Range","Variance","Maximum","Median depends on order."],
 ["Which measure identifies the most frequent value?","Mode","Mean","Minimum","Correlation","Mode is the most common observation."],
 ["What is the range of a dataset?","Maximum minus minimum","Sum divided by count","Square root of mean","Most frequent value","Range = max - min."],
 ["Which measure is the square root of variance?","Standard deviation","Mode","Median","Count","Standard deviation is the square root of variance."],
 ["What describes variation around the mean?","Variance and standard deviation","Data labels only","File names","Survey platform","Dispersion measures summarize spread."],
 ["Which feature shows a long right tail?","Positive skewness","Negative skewness","No observations","A perfect rectangle","A longer right tail is positive skew."],
 ["Which feature shows a long left tail?","Negative skewness","Positive skewness","A sorted list","A mean of zero","A longer left tail is negative skew."],
 ["Which Excel function calculates the average?","AVERAGE","COUNT","CORREL","MODE.SNGL","AVERAGE calculates the arithmetic mean."],
 ["Which Excel function counts cells containing numbers?","COUNT","MEDIAN","CORREL","VAR.S","COUNT counts numeric cells."],
 ["Which function calculates a correlation coefficient?","CORREL","MAX","COUNT","MODE.SNGL","CORREL calculates Pearson linear correlation."],
 ["Which Excel tool quickly summarizes data with mean and standard deviation?","Analysis ToolPak → Descriptive Statistics","Remove Duplicates only","Text to Columns only","Conditional Formatting only","Use the Descriptive Statistics tool under Data Analysis."],
 ["Where can you enable the Analysis ToolPak on Windows Excel?","File → Options → Add-ins","View → Zoom","Insert → Symbols","Review → Thesaurus","Enable Analysis ToolPak under Excel Add-ins."],
 ["Which feature summarizes categories with drag-and-drop fields?","PivotTable","Data Validation","Spell Check","Freeze Panes","Pivot Tables can summarize and group records."],
 ["What does a histogram display?","Frequencies across numeric intervals","A student's name","Only file sizes","Only individual paragraphs","Histogram groups quantitative values into bins."]
 ]
 };
 const contexts=[
  ["In a school data project", "For a classroom investigation"],
  ["In an attendance study", "While planning a student survey"],
  ["When collecting feedback", "In a digital questionnaire exercise"],
  ["When measuring school performance", "For a SMART objective task"],
  ["When building an online survey", "During a digital questionnaire activity"],
  ["In a spreadsheet-based analysis", "When preparing an Excel report"]
 ];
 const numerical={
 1:(j)=>{
  const values=[18+j,24+j,30+j,36+j],answer=27+j;
  return {question:"A class records four values: "+values.join(", ")+". What is their arithmetic mean?",mode:"number",answer,explanation:"Add the four values and divide by 4. The mean is "+answer+"."};
 },
 2:(j)=>{
  const population=120+j*10,chosen=30+j*2;
  return {question:"A school has "+population+" students; "+chosen+" are selected for a study. How many students are in the sample?",mode:"number",answer:chosen,explanation:"The sample is the selected group of "+chosen+" students; the population has "+population+"."};
 },
 3:(j)=>{
  const yes=12+j,no=6+j*2;
  return {question:"A pilot survey receives "+yes+" Yes responses and "+no+" No responses. How many responses were collected?",mode:"number",answer:yes+no,explanation:"Total responses = Yes + No = "+(yes+no)+"."};
 },
 4:(j)=>{const total=40+j*5,attending=total-(8+j);const pct=100*attending/total;return {question:"A class has "+total+" students and "+attending+" attend today. What percentage is attending? Round to one decimal place.",mode:"number",answer:Math.round(pct*10)/10,explanation:"Attendance percentage = "+attending+" / "+total+" × 100 = "+pct.toFixed(1)+"%.",tolerance:0.051};},
 5:(j)=>{const asked=20+j*3,responded=asked-3-j;return {question:"An online form was shared with "+asked+" students and "+responded+" submitted responses. How many students did not respond?",mode:"number",answer:asked-responded,explanation:"No response = students invited minus responses received = "+(asked-responded)+"."};},
 6:(j)=>{
  const vals=[10+j,14+j,18+j,22+j],answer=j%2===0?16+j:12;
  return j%2===0?{question:"In Excel, the values are "+vals.join(", ")+". What is their mean?",mode:"number",answer,explanation:"AVERAGE = sum of values / 4 = "+answer+"."}:
  {question:"In Excel, the values are "+vals.join(", ")+". What is the range?",mode:"number",answer,explanation:"Range = maximum - minimum = 12."};
 }
 };
 function build(g,u,i){
  if(![1,2,3].includes(g)||u!==0||!Number.isInteger(i)||i<0||i>(g===3?4:5))throw Error("Unknown Data Analysis lesson");
  const lesson=(g===3?[1,3,4,5,6]:[1,2,3,4,5,6])[i],seeds=decks[lesson],contextIndex=(g===3?[0,2,3,4,5]:[0,1,2,3,4,5])[i],result=[];
  // Revisit definitions in two scenario phrasings, deliberately labelled formative practice.
  for(let k=0;k<40;k++){
   const seed=seeds[k%seeds.length],pass=Math.floor(k/seeds.length);
   const prompt=(contexts[contextIndex][pass%2]+": ")+seed[0];
   const choices=[seed[1],seed[2],seed[3],seed[4]];
   const shift=(k*3+g+i)%4,rotated=choices.slice(shift).concat(choices.slice(0,shift));
   result.push({mode:"choice",question:prompt,options:rotated,answer:(4-shift)%4,explanation:seed[5],sourceStatus:"Supplementary practice aligned to uploaded topic "+lesson+" · Grade "+g+" lesson "+(i+1)+" · teacher approval pending",focus:1+k%seeds.length,focusLabel:seed[0]});
  }
  for(let j=0;j<10;j++){
   const q=numerical[lesson](j);
   result.push({...q,focus:seeds.length+1+(lesson===6&&j%2?1:0),focusLabel:lesson===6&&j%2?"Calculate the range":({1:"Calculate the arithmetic mean",2:"Identify the sample size",3:"Count survey responses",4:"Calculate attendance percentage",5:"Calculate non-response",6:"Calculate the arithmetic mean"})[lesson],sourceStatus:"Original numerical exercise applying concepts from uploaded lesson "+lesson+" · teacher approval pending"});
  }
  return result;
 }
 window.EBDAA_DATA_ANALYSIS_PRACTICE=window.EBDA_PRACTICE_FRAMEWORK.create({
  name:"EBDAA_DATA_ANALYSIS_PRACTICE",subject:"da",gameKey:"da",learningMode:"dataAnalysisPractice",progressKey:"da",
  locale:"en",inputId:"da-answer",checkId:"da-check",back:()=>dataAnalysisBackToUnit(),completionArabic:false,
  buildItems:build,title:(g,u,i)=>window.EBDAA_DATA_ANALYSIS_UNITS[g][u].sessions[i].title,
  header:(g,u,i)=>({dir:"ltr",lang:"en",exitLabel:"← Data Analysis lessons",exit:()=>dataAnalysisBackToUnit(),
    yearLabel:"YEAR "+g+" · DATA ANALYSIS",
    disclaimer:"Based on Ms. Asmaa Ahmed Abd El-Hadi's uploaded grade-specific slide decks. 40 repeated-concept scenarios and 10 numerical applications; not 50 independent textbook items. Formative practice; teacher verification pending."}),
  eyebrow:(q,{cursor})=>["📊 Core concept","🔎 Analyze","🧠 Decide","🧮 Work with data","🎯 Check understanding"][cursor%5],
  beforeControls:q=>"",
 });
})();
