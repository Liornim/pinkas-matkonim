/* QA4 — רגרסיה על פלט OCR אמיתי מצילומי מסך */
const fs=require("fs"),path=require("path");
const code=fs.readFileSync("/mnt/user-data/outputs/recipe-book.html","utf8").match(/<script>([\s\S]*)<\/script>/)[1];
const FX=path.join(__dirname,"ocr_fixtures");

let PASS=0,FAIL=0,fails=[];
function ok(n,c,d){if(c){PASS++;console.log("  ✓ "+n)}else{FAIL++;console.log("  ✗ "+n+(d!==undefined?"  → "+d:""));fails.push(n)}}
function sec(t){console.log("\n══ "+t)}

const mkEl=()=>new Proxy({classList:{toggle(){},add(){},remove(){}},style:{},dataset:{},
  value:"",textContent:"",checked:false,innerHTML:"",files:[]},
  {get:(t,k)=>k in t?t[k]:(()=>{}),set:(t,k,v)=>{t[k]=v;return true}});
global.window={scrollTo(){}};
global.document={getElementById:mkEl,addEventListener(){},createElement:mkEl,head:{appendChild(){}}};
global.localStorage={s:{},getItem(k){return this.s[k]||null},setItem(k,v){this.s[k]=v}};
global.fetch=()=>Promise.reject(new Error("x"));
global.FileReader=function(){};global.Blob=function(){};global.Image=function(){};global.alert=()=>{};

const X={};
new Function("X",code+";Object.assign(X,{parseRecipe,recipeNumbers,ingTotals,amountLabel,recipeTotals});")(X);

const load=f=>fs.readFileSync(path.join(FX,f),"utf8");
const has=(P,n)=>P.ingredients.some(i=>i.name.indexOf(n)===0);
const get=(P,n)=>P.ingredients.find(i=>i.name.indexOf(n)===0);

sec("פיצה בעברית — OCR אמיתי (eng+heb)");
const PZ=X.parseRecipe(load("pizza_he.txt")),NZ=X.recipeNumbers(PZ);
ok("כותרת נכונה",/מתכון לפיצת/.test(PZ.title),PZ.title);
ok("לא נבחרה שכבת הווידאו ככותרת",!/כתובים|בהיר|חיטה/.test(PZ.title),PZ.title);
ok("9 מרכיבים",PZ.ingredients.length===9,PZ.ingredients.length);
ok("ביצה זוהתה",has(PZ,"ביצה"));
ok("ביצה 50 גרם",get(PZ,"ביצה").qty===50,get(PZ,"ביצה").qty);
ok("קמח 40 גרם",get(PZ,"קמח").qty===40,get(PZ,"קמח").qty);
ok("גבינה צהובה זוהתה",has(PZ,"גבינה צהובה"));
ok("גבינה 100 גרם ולא 25",get(PZ,"גבינה צהובה").qty===100,get(PZ,"גבינה צהובה").qty);
ok("אבקת אפייה זוהתה",has(PZ,"אבקת אפייה"));
ok("רסק עגבניות זוהה",has(PZ,"רסק עגבניות"));
ok("איכות מעל 50%",PZ.quality>0.5,Math.round(PZ.quality*100)+"%");
ok("כל הכמויות חיוביות",PZ.ingredients.every(i=>i.qty>0));
ok("סה\"כ סביר",X.recipeTotals(PZ).k>400&&X.recipeTotals(PZ).k<900,Math.round(X.recipeTotals(PZ).k));
ok("שלבי הכנה לא נכנסו כמרכיבים",!PZ.ingredients.some(i=>/מערבבים|מורחים|לתנור/.test(i.name)));

sec("פיצה — קריאה באנגלית בלבד נכשלת כצפוי");
const PE=X.parseRecipe(load("pizza_engonly.txt"));
ok("כמעט בלי מרכיבים",PE.ingredients.length<=3,PE.ingredients.length);
ok("שום מרכיב לא זוהה במאגר",PE.ingredients.every(i=>i.src!=="db"));
ok("איכות אפס",PE.quality===0,PE.quality);
ok("המשתמש יקבל אזהרה",PE.ingredients.length===0||PE.quality<0.34);

sec("שווארמה בעברית — OCR אמיתי");
const SH=X.parseRecipe(load("shawarma_he.txt"));
ok("כותרת נכונה",/שווארמה חזה עוף/.test(SH.title),SH.title);
ok("4 מרכיבים",SH.ingredients.length===4,SH.ingredients.length);
ok("חצי קילו = 500 גרם",get(SH,"חזה עוף").qty===500,get(SH,"חזה עוף").qty);
ok("בצל זוהה",has(SH,"בצל"));
ok("כף שמן זית = 14 גרם",get(SH,"שמן זית").qty===14,get(SH,"שמן זית").qty);
ok("תבנית לא נספרה",!SH.ingredients.some(i=>/תבנית|אינגליש/.test(i.name)));
ok("איכות 75%",SH.quality>=0.75,Math.round(SH.quality*100)+"%");

sec("Beef Rollups באנגלית — OCR אמיתי");
const RU=X.parseRecipe(load("rollups_en.txt")),NR=X.recipeNumbers(RU);
ok("כותרת נכונה",/Beef Rollups/.test(RU.title),RU.title);
ok("11 מרכיבים",RU.ingredients.length===11,RU.ingredients.length);
ok("בקר טחון זוהה",has(RU,"בקר טחון רזה"));
ok("2 lbs = 907 גרם",Math.abs(get(RU,"בקר טחון רזה").qty-907.2)<2,get(RU,"בקר טחון רזה").qty);
ok("מוצרלה זוהתה",has(RU,"מוצרלה דלת שומן"));
ok("ערכים מהמתכון נקלטו",RU.stated&&RU.stated.k===370,JSON.stringify(RU.stated));
ok("מוצג לפי המתכון",NR.fromRecipe===true);
ok("איכות מעל 60%",RU.quality>0.6,Math.round(RU.quality*100)+"%");

sec("Snack Balls באנגלית — OCR אמיתי");
const BA=X.parseRecipe(load("balls_en.txt")),NB=X.recipeNumbers(BA);
ok("13 מרכיבים",BA.ingredients.length===13,BA.ingredients.length);
ok("8 מנות זוהו",BA.servings===8,BA.servings);
ok("128 קל למנה",NB.per.k===128,NB.per.k);
ok("1024 לכל המתכון",NB.total.k===1024,NB.total.k);
ok("שמן זית 20 גרם ולא 280",get(BA,"שמן זית").qty===20,get(BA,"שמן זית").qty);
ok("עוף טחון זוהה",has(BA,"עוף טחון רזה")||has(BA,"חזה עוף"));
ok("איכות מעל 80%",BA.quality>0.8,Math.round(BA.quality*100)+"%");

sec("Nando's באנגלית — OCR אמיתי");
const ND=X.parseRecipe(load("nandos_en.txt")),NN=X.recipeNumbers(ND);
ok("9 מרכיבים",ND.ingredients.length===9,ND.ingredients.length);
ok("556 קלוריות נקלטו",ND.stated&&ND.stated.k===556,JSON.stringify(ND.stated));
ok("חלבון 50",ND.stated.p===50,ND.stated.p);
ok("מוצג 556 לפי המתכון",NN.total.k===556&&NN.fromRecipe);
ok("תפוח אדמה 350 גרם",get(ND,"תפוח אדמה").qty===350,get(ND,"תפוח אדמה").qty);
ok("שורת הבישול לא נכנסה",!ND.ingredients.some(i=>/45|180|Cook/i.test(i.name)));
ok("איכות מעל 70%",ND.quality>0.7,Math.round(ND.quality*100)+"%");

sec("חסינות כללית על כל הצילומים");
["pizza_he.txt","shawarma_he.txt","rollups_en.txt","balls_en.txt","nandos_en.txt","pizza_engonly.txt"]
.forEach(f=>{
  const P=X.parseRecipe(load(f)),N=X.recipeNumbers(P),t=X.recipeTotals(P);
  ok(f+" — כל הערכים סופיים",[t.k,t.p,t.c,t.f,t.s,t.b,N.total.k,N.per.k].every(v=>isFinite(v)));
  ok(f+" — סה\"כ לא אבסורדי",t.k<20000,Math.round(t.k));
  ok(f+" — אין כמות שלילית",P.ingredients.every(i=>i.qty>=0));
  ok(f+" — אין שורת ערכים כמרכיב",!P.ingredients.some(i=>/חלבון \d|פחמימות \d|Protein: /.test(i.name)));
});


sec("Cheesecake — OCR אמיתי, בלי כותרת Ingredients");
const CK=X.parseRecipe(load("cheesecake_en.txt")),NC=X.recipeNumbers(CK);
ok("כותרת = שם המנה",CK.title==="High-Protein Cheesecake",CK.title);
ok("לא נבחרה שורת דירוג",!/Worth|Hype|Episode/i.test(CK.title),CK.title);
ok("לא נבחר רעש מפריים הווידאו",!/Reels|[\u0590-\u05FF]/.test(CK.title),CK.title);
ok("5 מרכיבים",CK.ingredients.length===5,CK.ingredients.length);
ok("יוגורט יווני זוהה",has(CK,"יוגורט יווני"),CK.ingredients.map(i=>i.name.split(" — ")[0]).join(", "));
ok("כוס יוגורט = 245 גרם",get(CK,"יוגורט יווני 0%").qty===245,get(CK,"יוגורט יווני 0%").qty);
ok("ביצה 50 גרם",get(CK,"ביצה").qty===50);
ok("2 כפות דבש = 42 גרם",get(CK,"דבש").qty===42,get(CK,"דבש").qty);
ok("שורת התיאור לא הפכה למרכיב",!CK.ingredients.some(i=>/Surprisingly|tastes/i.test(i.name)));
ok("גבינה צהובה לא הומצאה",!has(CK,"גבינה צהובה"));
ok("'For 1 serving' → מנה אחת",CK.servings===1,CK.servings);
ok("מספר המנות ידוע",CK.svKnown===true);
ok("302 קלוריות נקלטו",CK.stated&&CK.stated.k===302,JSON.stringify(CK.stated));
ok("שומן 4 ולא 40",CK.stated.f===4,CK.stated.f);
ok("חלבון 30",CK.stated.p===30);
ok("פחמימות 38",CK.stated.c===38);
ok("מוצג 302 לפי המתכון",NC.total.k===302&&NC.fromRecipe);
ok("לא מסומן כלא ידוע",NC.unknown===false);
ok("חישוב המרכיבים קרוב למוצהר",Math.abs(X.recipeTotals(CK).k-302)<60,Math.round(X.recipeTotals(CK).k));

console.log("\n"+"═".repeat(42));
console.log("  עברו: "+PASS+"    נכשלו: "+FAIL);
console.log("═".repeat(42));
if(fails.length){console.log("\nכשלים:");fails.forEach(f=>console.log("  • "+f))}
process.exit(FAIL?1:0);
