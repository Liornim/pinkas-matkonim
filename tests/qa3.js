/* QA3 — בדיקות עוינות: קלט שבור, אשפה, ומקרי קצה */
const fs=require("fs");
const html=fs.readFileSync("/mnt/user-data/outputs/recipe-book.html","utf8");
const code=html.match(/<script>([\s\S]*)<\/script>/)[1];

let PASS=0,FAIL=0,fails=[];
function ok(n,c,d){if(c){PASS++;console.log("  ✓ "+n)}else{FAIL++;console.log("  ✗ "+n+(d!==undefined?"  → "+d:""));fails.push(n)}}
function sec(t){console.log("\n══ "+t)}

const store={};
const mkEl=()=>new Proxy({classList:{toggle(){},add(){},remove(){}},style:{},dataset:{},
  value:"",textContent:"",checked:false,innerHTML:"",files:[]},
  {get:(t,k)=>k in t?t[k]:(()=>{}),set:(t,k,v)=>{t[k]=v;return true}});
global.window={scrollTo(){}};
global.document={getElementById:mkEl,addEventListener(){},createElement:mkEl,head:{appendChild(){}}};
global.localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=v}};
global.fetch=()=>Promise.reject(new Error("offline"));
global.FileReader=function(){};global.Blob=function(){};global.Image=function(){};
global.alert=()=>{};global.confirm=()=>true;

const X={};
new Function("X",code+`;Object.assign(X,{parseRecipe,parseIngLine,recipeNumbers,ingTotals,
 sanitizeRecipe,isGarbageLine,looksLikeInstruction,esc,safeUrl,recipeTotals,blank,
 grabMacros,parseMacros,plausibleMacros,titleScore,unbidiLine,parseQty,offNorm});`)(X);

/* ============================================================ */
sec("1. צילום של האפליקציה עצמה (הבאג שדווח)");
const SELF=`מרכיבים
לחיצה על מרכיב פותחת עריכה מלאה שלו
הערכים הם לכמות המלאה במתכון
חלבון 0 · פחמימות 0 · שומן 0 · רווי 0 · סיבים 0
© 0 יחידה
1.1. 0 יחידה
חלבון 0 - פחמימות 0 - שומן 0 : רווי 0 : סיבים 0
< 1. 0 יחידה
1 יחידה
סה"כ המתכון · 24 מרכיבים`;
const PS=X.parseRecipe(SELF);
ok("לא מייצר מרכיבי אשפה",PS.ingredients.length===0,PS.ingredients.length+": "+PS.ingredients.map(i=>i.name).join(" | "));
ok("שורת ערכים נחסמת",X.isGarbageLine("חלבון 0 · פחמימות 0 · שומן 0 · רווי 0 · סיבים 0"));
ok("טקסט ממשק נחסם",X.isGarbageLine("הערכים הם לכמות המלאה במתכון"));
ok("'© 0 יחידה' נחסם",X.isGarbageLine("© 0 יחידה"));
ok("'1.1. 0 יחידה' נחסם",X.isGarbageLine("1.1. 0 יחידה"));
ok("'< 1. 0 יחידה' נחסם",X.isGarbageLine("< 1. 0 יחידה"));
ok("ציון איכות אפס",PS.quality===0,PS.quality);

sec("2. קלט ריק ומנוון");
[["מחרוזת ריקה",""],["רווחים בלבד","    \n\n   "],["שורה אחת ריקה","\n"],
 ["נקודות","...."],["מקפים","-----"],["כוכביות","* * * *"],
 ["ספרות בלבד","123\n456\n789"],["סימנים","!@#$%^&*()"],
 ["אימוג'י בלבד","🍕🔥💖"],["תו יחיד","x"],["ירידות שורה","\n\n\n\n\n"]]
.forEach(([name,txt])=>{
  let r=null,crashed=false;
  try{r=X.parseRecipe(txt)}catch(e){crashed=true}
  ok(name+" — לא קורס",!crashed&&r&&Array.isArray(r.ingredients));
  if(r)ok(name+" — בלי מרכיבים",r.ingredients.length===0,r.ingredients.length);
});

sec("3. קלט זדוני");
const EVIL=`<script>alert(1)</script>
<img src=x onerror=alert(2)>
Ingredients:
<svg onload=alert(3)> 100g flour
"><iframe src=javascript:alert(4)>
' OR 1=1 --`;
let evilCrash=false,PE=null;
try{PE=X.parseRecipe(EVIL)}catch(e){evilCrash=true}
ok("לא קורס על HTML",!evilCrash);
ok("פלט עובר escaping",PE&&PE.ingredients.every(i=>!/[<>]/.test(X.esc(i.name))));
ok("כותרת בטוחה",!/<script/.test(X.esc(PE.title||"")));

sec("4. מספרים קיצוניים");
[["מספר ענק","Ingredients:\n999999999g flour"],
 ["מספר שלילי","Ingredients:\n-500g flour"],
 ["אפס","Ingredients:\n0g flour"],
 ["עשרוני ארוך","Ingredients:\n1.23456789g flour"],
 ["מדעי","Ingredients:\n1e10 g flour"],
 ["פסיקים","Ingredients:\n1,000,000g flour"]]
.forEach(([name,txt])=>{
  const r=X.parseRecipe(txt),t=X.recipeTotals(r);
  ok(name+" — ערכים סופיים",[t.k,t.p,t.c,t.f,t.s,t.b].every(v=>isFinite(v)),JSON.stringify(t.k));
  ok(name+" — סה\"כ לא אבסורדי",t.k<200000,Math.round(t.k));
});

sec("5. שורות ארוכות וחזרתיות");
const LONG="Ingredients:\n"+Array(200).fill("100g flour").join("\n");
const PL=X.parseRecipe(LONG);
ok("200 שורות זהות → מרכיב אחד",PL.ingredients.length===1,PL.ingredients.length);
const HUGE="Ingredients:\n"+"x".repeat(50000);
let hugeCrash=false;try{X.parseRecipe(HUGE)}catch(e){hugeCrash=true}
ok("שורה של 50 אלף תווים לא קורסת",!hugeCrash);
const MANY="Ingredients:\n"+Array(500).fill(0).map((_,i)=>(i+1)+"g flour").join("\n");
const PM=X.parseRecipe(MANY);
ok("500 מרכיבים שונים לא קורס",PM.ingredients.length>0);
ok("ניקוי מגביל ל-80 מרכיבים",
   X.sanitizeRecipe({id:"a",ingredients:PM.ingredients}).ingredients.length<=80);

sec("6. ערכי מאקרו אבסורדיים");
ok("9999g חלבון על 100 קל מתוקן",X.plausibleMacros({k:100,p:9999,c:0,f:0}).p<100,
   X.plausibleMacros({k:100,p:9999,c:0,f:0}).p);
ok("מאקרו שלילי לא מפיל",isFinite(X.plausibleMacros({k:100,p:-50,c:0,f:0}).p));
ok("k שלילי לא מפיל",isFinite(X.plausibleMacros({k:-100,p:10,c:0,f:0}).p));
ok("NaN מנוטרל בניקוי",X.sanitizeRecipe({id:"b",stated:{k:NaN,p:NaN,c:NaN,f:NaN}}).stated.k===0);
ok("Infinity מנוטרל",X.sanitizeRecipe({id:"c",stated:{k:Infinity,p:1,c:1,f:1}}).stated.k===0);

sec("7. חישוב מנות");
[[0,1],[-5,1],[1.7,2],[99999,999],["8",8],[null,1],[undefined,1],[NaN,1]]
.forEach(([inp,exp])=>{
  const s=X.sanitizeRecipe({id:"s",servings:inp}).servings;
  ok("מנות "+JSON.stringify(inp)+" → "+exp,s===exp,s);
});
ok("חלוקה במנות לא מייצרת אינסוף",
   isFinite(X.recipeNumbers({servings:0,stated:{k:100},ingredients:[]}).per.k));

sec("8. קישורים");
[["javascript:alert(1)",""],["data:text/html,x",""],["vbscript:x",""],
 ["file:///etc/passwd",""],["  ",""],["http://a.com/x","http://a.com/x"],
 ["a.com/x","https://a.com/x"]]
.forEach(([inp,exp])=>ok("קישור "+JSON.stringify(inp.slice(0,22)),X.safeUrl(inp)===exp,X.safeUrl(inp)));

sec("9. תווים בין-לאומיים");
[["ערבית","المكونات:\n100 غرام دقيق"],["רוסית","Ингредиенты:\n100г мука"],
 ["סינית","配料:\n100克面粉"],["מעורב","Ingredients:\n100g קמח flour"],
 ["RTL מוטמע","Ingredients:\n\u202b100g flour\u202c"]]
.forEach(([name,txt])=>{
  let crashed=false;try{X.parseRecipe(txt)}catch(e){crashed=true}
  ok(name+" לא קורס",!crashed);
});

sec("10. שלמות מבנה הנתונים");
const shapes=[null,undefined,0,"",[],{},{id:1},{id:"x",ingredients:"not array"},
  {id:"x",ingredients:[null,undefined,"str",5]},{id:"x",stated:"bad"},
  {id:"x",photos:"gone"},{id:"x",link:{}},{id:"x",servings:{}}];
shapes.forEach((sh,n)=>{
  let crashed=false,res;
  try{res=X.sanitizeRecipe(sh)}catch(e){crashed=true}
  ok("צורה #"+n+" לא מפילה את הניקוי",!crashed);
});
const cleaned=X.sanitizeRecipe({id:"x",ingredients:[null,undefined,"str",5,{name:"ok"}]});
ok("מרכיבים פגומים מנורמלים",cleaned.ingredients.every(i=>typeof i.name==="string"&&isFinite(i.qty)));
ok("חישוב על מרכיבים פגומים סופי",isFinite(X.recipeTotals(cleaned).k));

sec("11. מתכון תקין עדיין עובד (רגרסיה)");
const GOOD=`Crispy Chicken Nuggets
Ingredients:
* 1 lb lean ground chicken
* 1 cup shredded carrots
* 1 large egg
How to make them:
1. Mix everything.
2. Air fry at 390F for 12 minutes.
Macros:
15 nuggets: 450 cal | 45g protein | 35g carbs | 12g fat`;
const PG=X.parseRecipe(GOOD),NG=X.recipeNumbers(PG);
ok("מתכון תקין: 3 מרכיבים",PG.ingredients.length===3,PG.ingredients.length);
ok("מתכון תקין: ציון איכות מלא",PG.quality===1,PG.quality);
ok("מתכון תקין: 15 מנות",PG.servings===15);
ok("מתכון תקין: 450 קל",NG.total.k===450);
ok("מתכון תקין: 30 למנה",Math.round(NG.per.k)===30);
ok("מתכון תקין: עוף 453.6 גרם",Math.abs(PG.ingredients[0].qty-453.6)<1);

const HE=`שווארמה חזה עוף
מצרכים:
חצי קילו חזה עוף פרוס דק
בצל פרוס לרצועות
כף שמן זית
אופן הכנה:
אופים על 180 מעלות כ 40 דק.`;
const PH=X.parseRecipe(HE);
ok("עברית: 3 מרכיבים",PH.ingredients.length===3,PH.ingredients.length);
ok("עברית: ציון איכות מלא",PH.quality===1,PH.quality);
ok("עברית: חצי קילו = 500",PH.ingredients[0].qty===500);

console.log("\n"+"═".repeat(42));
console.log("  עברו: "+PASS+"    נכשלו: "+FAIL);
console.log("═".repeat(42));
if(fails.length){console.log("\nכשלים:");fails.forEach(f=>console.log("  • "+f))}
process.exit(FAIL?1:0);
