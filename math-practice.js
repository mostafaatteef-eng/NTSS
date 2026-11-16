window.EBDAA_MATH_FACTS=[["A proportion is an equality of two ratios.","In direct variation y = kx, the ratio y/x is constant.","In inverse variation xy is constant.","Similar polygons have equal corresponding angles and proportional corresponding sides.","Similar triangles have equal corresponding angles and proportional corresponding sides."],["A directed angle distinguishes clockwise from anticlockwise rotation.","180 degrees equals π radians.","Sector area is proportional to the central angle when radius is fixed."],["The imaginary unit i satisfies i² = −1.","To add complex numbers, add real parts together and imaginary parts together.","The conjugate of a + bi is a − bi.","The discriminant b² − 4ac determines the nature of quadratic roots."],["Multiplying an inequality by a negative number reverses its sign.","The solution of two inequalities is the intersection of their solution regions.","Linear programming optimizes a linear objective subject to constraints.","An inverse function reverses a one-to-one function's mapping.","For equal positive bases not equal to 1, aˣ = aʸ implies x = y.","A logarithm expresses the exponent needed to obtain a number from a base.","For positive x and y, log(xy) = log(x) + log(y) for a fixed valid base.","Review the definitions, solve practice problems and check the unit's methods."],["The identity sin²θ + cos²θ = 1 holds for every real θ.","Trigonometric equations find angles satisfying trig relationships.","The sine rule relates each side length to the sine of its opposite angle.","Solving a triangle means finding its unknown angles and/or side lengths.","Triangulation can determine distances that are difficult to measure directly.","sin(A+B) = sinA cosB + cosA sinB.","sin(2A) = 2sinA cosA.","Check trigonometric identities and applications by substitution and reasoning."],["Average rate of change over [a,b] equals (f(b)−f(a))/(b−a).","The derivative of xⁿ is nxⁿ⁻¹.","The product rule is (fg)' = f'g + fg'.","The quotient rule is (f/g)' = (f'g−fg')/g² when g ≠ 0.","The chain rule differentiates composite functions by multiplying derivatives.","Parametric differentiation uses dy/dx = (dy/dt)/(dx/dt) when dx/dt ≠ 0.","Implicit differentiation treats y as a function of x.","Review derivatives and choose the correct differentiation rule."],["Similar polygons have corresponding angles equal and sides in a constant ratio.","A vector has both magnitude and direction.","The dot product of perpendicular vectors is zero.","A straight line can be represented by ax + by + c = 0.","A circle centered at (a,b) with radius r satisfies (x−a)²+(y−b)²=r².","A plane in 3D can have equation ax + by + cz = d.","A sphere centered at (a,b,c) has equation (x−a)²+(y−b)²+(z−c)²=r².","Review vectors and spatial equations through examples."],["The second derivative is the derivative of the first derivative.","An interior critical number occurs where the derivative is zero or undefined (if f is defined).","For a differentiable function, a local maximum can occur when f' changes from positive to negative.","On a closed interval, compare endpoint and critical-point values to find absolute extrema.","Inflection points occur where a function's concavity changes.","Graph tracing uses derivatives and key features to sketch curves.","Optimization uses extrema to solve constrained real-life problems.","Review differentiation, critical points and graph analysis."],["Permutations count ordered selections.","Combinations count selections without regard to order.","The binomial theorem expands powers of (a+b).","A square matrix has a determinant.","Matrix addition is performed on entries in the same position.","An invertible matrix A satisfies AA⁻¹ = I.","For an invertible A, the linear system Ax=b has solution x=A⁻¹b.","Review counting, matrices and inverse-based solutions."],["An indefinite integral is a family of antiderivatives plus C.","∫sin(x)dx = −cos(x)+C.","Integration by parts follows ∫u dv = uv − ∫v du.","Substitution can simplify an integral using u = g(x).","A definite integral evaluates accumulation over specified bounds.","A definite integral can calculate signed area under a curve.","Volumes of revolution can be computed using disk or washer methods.","Review integration rules and applications."],["The arithmetic mean is the sum divided by the number of values.","Standard deviation measures dispersion around the mean.","Probability ranges from 0 to 1.","For mutually exclusive events A and B, P(A∪B)=P(A)+P(B).","A standard normal variable has mean 0 and standard deviation 1.","A normal distribution is symmetric around its mean.","Statistics supports decisions by summarizing and interpreting observed data.","Review descriptive statistics, probability and distributions."]];
/* 50 interactive mathematics formative questions per lesson.
 * Items are parameterized practice variants, not 50 separately authored textbook questions.
 * Where numeric item templates do not cover a lesson yet, transparent concept-check variants
 * are used rather than inventing advanced mathematics formulas.
 */
window.EBDAA_MATH_PRACTICE=(function(){
let state={g:1,u:0,i:0,cursor:0,answers:{},done:false,items:[]};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function lesson(){const s=state,u=window.EBDAA_MATH_UNITS[s.g][s.u];return {unit:u,title:u.sessions[s.i]}}
function factFor(g,u,i){const offsets={1:0,2:3,3:7};return window.EBDAA_MATH_FACTS[offsets[g]+u][i]}
function numeric(text,answer,explanation){return {question:text,answer:Number(answer),explanation,mode:"number"}}
function select(text,options,answer,explanation){return {question:text,options,answer,explanation,mode:"choice"}}
function basedOnTopic(title,n){
 const t=title.toLowerCase(),a=2+n%13,b=2+(Math.floor(n/13)%11),c=3+(Math.floor(n/7)%9),which=n%3;
 if(/ratio and proportion/.test(t))return numeric("Simplify the ratio "+(a*3)+":"+(a*5)+". Enter the first term of its simplest form.",3,"Divide both terms by "+a+": 3:5.");
 if(/direct proportion|direct variation/.test(t))return numeric("y varies directly with x. If y="+(a*3)+" when x="+a+", what is y when x="+b+"?",3*b,"The constant y/x is 3, so y=3x.");
 if(/inverse proportion|inverse variation/.test(t))return numeric("y varies inversely with x. If x="+a+" and y="+(b*4)+", find y when x="+(a*2)+".",2*b,"The product xy stays constant. Doubling x halves y.");
 if(/similarity|similar triangles|similarity of polygons/.test(t))return numeric("Two similar shapes have a scale factor of "+a+". A corresponding side is "+b+" cm in the smaller shape. Find its length in the larger shape.",a*b,"Corresponding side lengths are multiplied by the scale factor.");
 if(/degree measure and radian/.test(t))return numeric("Convert "+(a*15)+"° to radians as a multiple of π. Enter the coefficient of π.",a/12,"Degrees × π/180 gives ("+a+"/12)π radians.");
 if(/directed angle/.test(t))return numeric("Find the positive coterminal angle (0° to 360°) for "+(a*30+360)+"°. Enter the angle in degrees.",a*30%360,"Subtract 360° to find an equivalent angle.");
 if(/circular sector/.test(t))return numeric("A sector has radius "+a+" and a central angle of 90°. Find its area as a multiple of π.",a*a/4,"Sector area = (90/360)πr².");
 if(/complex numbers$/.test(t))return numeric("For z="+a+"+"+b+"i, enter the real part.",a,"The real part is the term without i.");
 if(/addition and subtraction of complex/.test(t))return numeric("Find the real part of ("+a+"+"+b+"i)+("+c+"+2i).",a+c,"Add the real components.");
 if(/multiplication of complex/.test(t))return numeric("Find the real part of ("+a+"+i)("+b+"−i).",a*b+1,"Multiply: the real terms are ab and −i²=+1.");
 if(/types of roots of a quadratic/.test(t))return numeric("Find the discriminant of x²−"+(a+b)+"x+"+(a*b)+"=0.",(a-b)*(a-b),"The discriminant is B²−4AC = (a−b)².");
 if(/linear inequalities$/.test(t))return numeric("Solve 2x+"+a+" < "+(a+2*b)+". What is the upper boundary of x?",b,"Subtract "+a+" and divide by 2: x < "+b+".");
 if(/systems of linear inequalities/.test(t))return select("Does the point ("+a+","+b+") satisfy x≥"+(a-1)+" and y≥"+(b-1)+"?",["Yes","No"],0,"Both coordinates satisfy their respective lower bounds.");
 if(/linear programming and optimization/.test(t))return numeric("Maximize z=2x+3y for points (0,0), ("+a+",0), and (0,"+b+"). What is the maximum z?",Math.max(2*a,3*b),"Evaluate the objective function at each given point.");
 if(/inverse function/.test(t))return numeric("If f(x)=2x+"+a+", find f⁻¹("+(a+2*b)+").",b,"Solve y=2x+"+a+" for x: x=(y−"+a+")/2.");
 if(/exponential equations/.test(t))return numeric("Solve 2^x = "+Math.pow(2,1+(n%8))+". Find x.",1+n%8,"Equal powers of the same positive base have equal exponents.");
 if(/logarithm/.test(t))return numeric("Evaluate log₂("+(Math.pow(2,1+n%8))+").",1+n%8,"The logarithm asks for the exponent of 2.");
 if(/trigonometric identities/.test(t))return numeric("If sin²θ="+a+"/"+(a+b)+" and sin²θ+cos²θ=1, find cos²θ as a decimal (3 places).",Number((b/(a+b)).toFixed(3)),"Use the Pythagorean identity and subtract from 1.");
 if(/trigonometric equations/.test(t))return select("For 0°≤θ<360°, which is one solution of sin θ=0?",["180°","90°","45°","60°"],0,"The sine of 180° is zero.");
 if(/sine law and the cosine law|solving triangles|applications on solving triangle/.test(t))return numeric("In a right triangle, the legs are "+(a*3)+" and "+(a*4)+". What is the hypotenuse?",5*a,"Pythagoras gives √(9a²+16a²)=5a.");
 if(/sum and the difference of two angles/.test(t))return numeric("Find sin(30°+60°).",1,"sin(90°)=1.");
 if(/double an angle/.test(t))return numeric("If sin θ=0.6 and cos θ=0.8, find sin(2θ).",0.96,"Use sin(2θ)=2 sinθ cosθ.");
 if(/rate of change/.test(t))return numeric("For f(x)=x², find the average rate of change between x="+a+" and x="+(a+b)+".",2*a+b,"[f(a+b)−f(a)]/b = 2a+b.");
 if(/higher derivatives/.test(t))return numeric("For f(x)="+a+"x³, find f''(x) when x="+b+".",6*a*b,"f'=3ax²; f''=6ax.");
 if(/derivative|differentiation|chain rule/.test(t)&&!/implicit|parametric/.test(t))return numeric("For f(x)="+a+"x²+"+b+"x, calculate f'("+c+").",2*a*c+b,"Differentiate term by term: f'(x)=2ax+b.");
 if(/parametric differentiation/.test(t))return numeric("If x=t and y="+a+"t², find dy/dx at t="+b+".",2*a*b,"(dy/dt)/(dx/dt) = 2at.");
 if(/implicit differentiation/.test(t))return numeric("If x²+y²="+(a*a+b*b)+", find dy/dx at (x,y)=("+a+","+b+"). Enter to 3 decimal places.",Number((-a/b).toFixed(3)),"Differentiating yields 2x+2y y'=0, so y'=−x/y.");
 if(/vectors/.test(t)&&!/product/.test(t))return numeric("Find the magnitude of vector ("+(3*a)+","+(4*a)+").",5*a,"Magnitude = √(x²+y²), using a 3-4-5 triangle.");
 if(/scalar product|vector product/.test(t))return numeric("Find the dot product of vectors ("+a+",0) and ("+b+",0).",a*b,"Dot product = a₁b₁ + a₂b₂.");
 if(/straight line/.test(t))return numeric("For line y="+a+"x+"+b+", find y when x="+c+".",a*c+b,"Substitute x into the line equation.");
 if(/equation of circle/.test(t))return numeric("For the circle x²+y²="+(a*a)+", find its radius.",a,"The radius squared is "+a*a+".");
 if(/equation of plane/.test(t))return numeric("For the plane x+y+z="+(a+b+c)+", find z if x="+a+" and y="+b+".",c,"Rearrange the plane equation.");
 if(/equation of sphere/.test(t))return numeric("For x²+y²+z²="+(a*a)+", find the radius.",a,"The equation of a sphere centered at the origin is x²+y²+z²=r².");
 if(/critical points/.test(t))return numeric("For f(x)=x²−"+(2*a)+"x, find its critical x value.",a,"f'(x)=2x−"+(2*a)+"; set it to zero.");
 if(/local maximum|local minimum|absolute maximum|absolute minimum|maximum and minimum values/.test(t))return numeric("For f(x)=−(x−"+a+")²+"+b+", find its maximum value.",b,"A negative square is at most zero, attained at x="+a+".");
 if(/permutations/.test(t))return numeric("How many ordered ways can you select 2 objects from "+a+" distinct objects?",a*(a-1),"nP2=n(n−1).");
 if(/combinations/.test(t))return numeric("How many unordered ways can you select 2 objects from "+a+" distinct objects?",a*(a-1)/2,"nC2=n(n−1)/2.");
 if(/binomial theorem/.test(t))return numeric("In (x+"+a+")², what is the coefficient of x?",2*a,"(x+a)²=x²+2ax+a².");
 if(/determinants/.test(t))return numeric("Find det [["+a+",0],[0,"+b+"]].",a*b,"A 2×2 determinant is ad−bc.");
 if(/matrices and their operations/.test(t))return numeric("Matrix A has first-row entries "+a+" and "+b+". Matrix B has first-row entries "+c+" and 1. Find the top-left entry of A+B.",a+c,"Matrix addition is entrywise.");
 if(/inverse matrix/.test(t))return numeric("For diagonal matrix A=diag("+a+",1), what is the (1,1) entry of A⁻¹? Enter to 3 decimal places.",Number((1/a).toFixed(3)),"The inverse of a nonzero diagonal entry a is 1/a.");
 if(/linear systems using an inverse|linear equations using inverse/.test(t))return numeric("Solve the system x+y="+(a+b)+" and x−y="+(a-b)+". Find x.",a,"Add the equations and divide by 2.");
 if(/indefinite integral/.test(t))return numeric("If F'(x)="+(2*a)+"x, what is F("+b+")−F(0)?",a*b*b,"An antiderivative is ax²+C; the constant cancels.");
 if(/integration of trigonometric/.test(t))return numeric("For F(x)=−cos(x), find F'(0).",0,"The derivative is sin(x), and sin(0)=0.");
 if(/integration by parts/.test(t))return numeric("Evaluate ∫ from 0 to 1 of "+a+"x dx.",a/2,"An antiderivative is ax²/2, evaluated from 0 to 1.");
 if(/integration by substitution/.test(t))return numeric("Evaluate ∫ from 0 to 1 of 2(x+"+a+") dx.",2*a+1,"The integral is (x+a)² evaluated from 0 to 1.");
 if(/definite integration/.test(t))return numeric("Evaluate ∫ from 0 to "+b+" of "+a+" dx.",a*b,"Integral of a constant equals height × interval width.");
 if(/area in the plane/.test(t))return numeric("Find the area under y="+a+" from x=0 to x="+b+".",a*b,"The region is a rectangle of height a and width b.");
 if(/volume of solids|volume of revolution/.test(t))return numeric("Revolve y="+a+" from x=0 to x="+b+" about the x-axis. Find volume as a multiple of π.",a*a*b,"The solid is a cylinder with volume πr²h.");
 if(/mean|median|mode|central tendency/.test(t))return numeric("Find the mean of "+a+", "+b+" and "+(a+b)+".",(2*a+2*b)/3,"Add all three and divide by 3.");
 if(/variation|variance|standard deviation/.test(t))return numeric("Find the range of "+a+", "+(a+b)+" and "+(a+b+c)+".",b+c,"Range = maximum − minimum.");
 if(/probability/.test(t))return numeric("A bag contains "+a+" red and "+b+" blue balls. Find probability of blue as a decimal rounded to 3 places.",Number((b/(a+b)).toFixed(3)),"Probability = blue / total.");
 if(/normal distribution/.test(t))return numeric("For x="+(a+b)+" and mean μ="+a+" and standard deviation σ="+b+", calculate z=(x−μ)/σ.",1,"Standardize by subtracting the mean and dividing by SD.");
 if(/practical applications/.test(t))return numeric("A dataset has values "+a+" and "+b+". What is their total?",a+b,"Sum the observed data values.");
 return null;
}
const stems=["Read the statement and decide whether it is correct.","Select whether this principle from the lesson is valid.","Does this mathematical rule hold?","Check the accuracy of the following definition.","Consider the key lesson principle.","Is this statement supported by the mathematics guide?","Evaluate the validity of this claim.","Choose whether the following mathematical principle is true.","Classify this lesson statement as true or false.","Verify the mathematical statement."];
function conceptual(title,fact,n){
 const correct=(n%2===0);
 return select(stems[n%10]+" "+(correct?fact:"It is not true that: "+fact),["True","False"],correct?0:1,
 "The reference rule is: "+fact+" The extra negation makes the displayed statement false when present.");
}
function build(g,u,i){
 const unit=window.EBDAA_MATH_UNITS[g][u],title=unit.sessions[i],fact=factFor(g,u,i);
 let items=[];
 for(let n=0;n<50;n++){
   const q=n%5===4?conceptual(title,fact,n):basedOnTopic(title,n);
   items.push(Object.assign({id:g+"-"+u+"-"+i+"-"+n+1,source:unit.source},q||conceptual(title,fact,n)));
 }
 // Shift the start of the question cycle between attempts, without changing correctness.
 return items;
}
function start(g,u,i){state={g,u,i,cursor:0,answers:{},done:false,items:build(g,u,i)};renderInto()}
function current(){return state.items[state.cursor]}
function record(){return state.answers[state.cursor]}
function respond(j){const q=current(),a=record();if(a?.checked)return;state.answers[state.cursor]={value:j,checked:false};if(q.mode==="number"){const button=document.getElementById("math-check");if(button)button.disabled=String(j).trim()==="";return}renderInto()}
function check(){const q=current(),a=record();if(!a||a.checked||String(a.value).trim()==="")return;const correct=q.mode==="number"?Number.isFinite(Number(a.value))&&Math.abs(Number(a.value)-q.answer)<=0.005:Number(a.value)===q.answer;state.answers[state.cursor]={value:a.value,checked:true,correct};renderInto()}
function move(delta){if(delta>0&&!record()?.checked)return;const next=state.cursor+delta;if(next<0||next>=state.items.length){if(next>=state.items.length){state.done=true;renderInto()}return}state.cursor=next;renderInto()}
function restart(){start(state.g,state.u,state.i)}
function escapeAttr(s){return escape(s)}
function render(){
 const {unit,title}=lesson(),q=current(),a=record(),answered=Object.values(state.answers).filter(v=>v.checked).length,correct=Object.values(state.answers).filter(v=>v.checked&&v.correct).length;
 const percentage=Math.round(answered/50*100),s=state;
 const choices=q.mode==="number"?'<label for="math-answer">Your calculated answer</label><input id="math-answer" type="number" step="any" inputmode="decimal" value="'+(a?escapeAttr(a.value):'')+'" '+(a?.checked?'disabled':'')+' oninput="EBDAA_MATH_PRACTICE.respond(this.value)" style="display:block;width:100%;max-width:280px;margin:12px 0;padding:14px;border:1px solid #d6d7d8;border-radius:12px">':window.EBDAA_GAME.render(q,s.cursor,a?.value,a?.checked,"math",[s.g,s.u,s.i].join("-"),"EBDAA_MATH_PRACTICE.respond");
 const content=s.done?'<div class="feedback"><h2>Practice complete</h2><p>Answered: '+answered+' / 50 · Correct: '+correct+' / 50</p><p>This is formative practice, not an accredited assessment.</p><button class="btn teal" onclick="EBDAA_MATH_PRACTICE.restart()">Try again</button></div>':
 window.EBDAA_GAME.stats(s.answers,s.items.length,false)+'<div class="eyebrow">'+escape(unit.title)+'</div><h2 class="practice-question">'+escape(q.question)+'</h2>'+choices+
 (a?.checked?'<div class="feedback '+(a.correct?'':'error')+'" role="status"><strong>'+(a.correct?'✓ Correct':'Review your answer')+'</strong><p>'+escape(q.explanation)+'</p></div>':'')+
 '<div class="stepfooter"><button class="btn light" onclick="EBDAA_MATH_PRACTICE.move(-1)" '+(s.cursor===0?'disabled':'')+'>← Previous</button><button id="math-check" class="btn teal" '+(!a||(!a.checked&&String(a.value).trim()==="")?'disabled':'')+' onclick="'+(a?.checked?'EBDAA_MATH_PRACTICE.move(1)':'EBDAA_MATH_PRACTICE.check()')+'">'+(a?.checked?(s.cursor===49?'Show result':'Next question →'):'Check answer →')+'</button></div>';
 return '<section class="practice-focus math-focus" aria-label="Mathematics questions"><header class="practice-focus__header"><div class="practice-focus__header-row"><button class="practice-focus__exit" onclick="mathBackToUnit()">← All math lessons</button><span class="practice-focus__year">YEAR '+s.g+' · MATHEMATICS</span></div><div class="practice-focus__info"><h1 class="practice-focus__lesson">'+escape(title)+'</h1><span class="practice-focus__counter">'+(s.done?'Completed · 50 / 50':'Question '+(s.cursor+1)+' / 50')+'</span></div><div class="practice-focus__track" role="progressbar" aria-label="Answered questions" aria-valuemin="0" aria-valuemax="50" aria-valuenow="'+answered+'"><i style="width:'+percentage+'%"></i></div></header><div class="practice-focus__content"><div class="guided-question">'+content+'<p class="muted" style="font-size:12px">50 generated formative practice items per lesson, aligned with its supplied curriculum topic. Parameter variants and conceptual checks are not 50 independently authored textbook problems.</p></div></div></section>';
}
function renderInto(){if(window.EBDA_APP_RENDER)window.EBDA_APP_RENDER()}
return {start,render,respond,check,move,restart,build};
})();