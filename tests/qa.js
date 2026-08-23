/* QA harness — loads the real app code and exercises it */
const fs=require("fs");
const html=fs.readFileSync("/mnt/user-data/outputs/recipe-book.html","utf8");
const code=html.match(/<script>([\s\S]*)<\/script>/)[1];

let PASS=0,FAIL=0,notes=[];
function ok(name,cond,detail){
  if(cond){PASS++;console.log("  PASS  "+name)}
  else{FAIL++;console.log("  FAIL  "+name+(detail?"  → "+detail:""));notes.push(name+(detail?": "+detail:""))}
}
function section(t){console.log("\n=== "+t+" ===")}

/* ---- stub browser ---- */
const store={};
function mkEl(){return new Proxy({classList:{toggle(){},add(){},remove(){}},style:{},dataset:{},
  value:"",textContent:"",checked:false,innerHTML:"",files:[]},
  {get:(t,k)=>k in t?t[k]:(()=>{}),set:(t,k,v)=>{t[k]=v;return true}})}
global.window={scrollTo(){}};
global.document={getElementById:mkEl,addEventListener(){},createElement:mkEl,head:{appendChild(){}}};
global.localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=v},removeItem:k=>{delete store[k]}};
global.FileReader=function(){};global.Blob=function(){};global.Image=function(){};
global.alert=()=>{};global.confirm=()=>true;global.prompt=()=>null;

/* capture outbound requests instead of hitting the network */
let sent=[];
global.fetch=(url,opts)=>{
  sent.push({url,opts});
  const h=global.__nextResponse||{status:200,body:{}};
  return Promise.resolve({ok:h.status<400,status:h.status,
    text:()=>Promise.resolve(JSON.stringify(h.body)),json:()=>Promise.resolve(h.body)});
};

const X={};
const exports_line=`;Object.assign(X,{parseRecipe,parseIngLine,parseQty,unitGrams,aliasFood,convText,
 ingTotals,recipeTotals,amountLabel,matchFood,buildIngredient,sanitizeRecipe,offNorm,offSearch,
 esc,r1,r0,num,foods,DB,allCats,BASE_CATS,recipeBytes,blank,cloudPut,recipes,customFoods,
 setRecipes:(v)=>{recipes=v},setCloud:(p,k)=>{projectId=p;fbKey=k},
 getModel:()=>model,factor});`;
new Function("X",code+exports_line)(X);

/* ============================================================ */
section("1. פירוק כיתוב אמיתי — Beef Rollups");
const cap1=`High-Protein Cheesy Beef Rollups
Comment "Doug Tevis" for my low calorie high protein honey chipotle aioli
Ingredients
* 6 Mission Carb Balance burrito tortillas
* 2 lbs 96/4 lean ground beef
* 1 small onion, finely diced
* 1 small bell pepper, finely diced
* 3 tbsp fresh parsley, chopped
* 1 1/2 cups reduced-fat shredded mozzarella
* 2 tsp salt
* 1 tsp garlic powder
* 1/4 tsp paprika
* Zero-calorie cooking spray
How To
1. Preheat oven to 420F and lightly coat a baking dish with spray.
2. In a large bowl, combine the ground beef, onion, bell pepper, parsley.
3. Divide the mixture evenly between the 6 tortillas.
4. Roll each tortilla tightly and slice into roughly 2 1/2-inch rolls.
6. Bake for 20-25 minutes, or until the beef is fully cooked
Macros
1 serving = 3 rolls
370 Calories
44g Protein
22g Carbs
12g Fat`;
const r1p=X.parseRecipe(cap1);
ok("כותרת זוהתה",/Beef Rollups/.test(r1p.title),r1p.title);
ok("10 מרכיבים נקלטו",r1p.ingredients.length===10,"נמצאו "+r1p.ingredients.length);
const by=n=>r1p.ingredients.find(i=>i.name.indexOf(n)===0);
ok("2 lbs → 907 גרם",Math.abs(by("בקר טחון רזה").qty-907.2)<1,by("בקר טחון רזה").qty);
ok("1 1/2 cups מוצרלה → 168 גרם",Math.abs(by("מוצרלה דלת שומן").qty-168)<1,by("מוצרלה דלת שומן").qty);
ok("3 tbsp פטרוזיליה → 12 גרם",Math.abs(by("פטרוזיליה").qty-12)<0.5,by("פטרוזיליה").qty);
ok("420F → 216°C",/216°C/.test(r1p.steps),r1p.steps.split("\n")[0]);
ok("2 1/2 inch → ס\"מ",/6\.4 ס"מ|6\.3 ס"מ/.test(r1p.steps),(r1p.steps.match(/[\d.]+ ס"מ/)||["none"])[0]);
ok("מאקרו מהמקור נקלט",r1p.stated&&r1p.stated.k===370&&r1p.stated.p===44,JSON.stringify(r1p.stated));
ok("שורת ה-Comment לא נכנסה כמרכיב",!r1p.ingredients.some(i=>/Doug/.test(i.name)));
ok("האשטגים לא נכנסו לשלבים",!/#/.test(r1p.steps));

section("2. פירוק מתכון שני — Rice Paper Nuggets");
const cap2=`Crispy Chicken Rice Paper Nuggets
Ingredients:
* 1 lb lean ground chicken
* 1 cup shredded carrots
* 3 green onions, chopped
* 1 tsp chicken bouillon powder
* 1/2 tsp black pepper
* 1 tsp sesame oil
* 1 large egg
* Rice paper wrappers
How to make them:
1. Mix the chicken, carrots, green onions in a bowl.
2. Air fry at 390F for 12-15 minutes.
Macros:
Per nugget: 30 cal | 3g protein`;
const r2p=X.parseRecipe(cap2);
ok("כותרת זוהתה",/Nuggets/.test(r2p.title),r2p.title);
ok("1 lb עוף → 453.6 גרם",Math.abs(r2p.ingredients[0].qty-453.6)<1,r2p.ingredients[0].qty);
ok("1 cup גזר → 110 גרם",Math.abs(r2p.ingredients[1].qty-110)<1,r2p.ingredients[1].qty);
ok("3 בצל ירוק → 45 גרם",Math.abs(r2p.ingredients[2].qty-45)<1,r2p.ingredients[2].qty);
ok("ביצה אחת → 50 גרם",!!r2p.ingredients.find(i=>i.name.indexOf("ביצה")===0&&Math.abs(i.qty-50)<1));
ok("390F → 199°C",/199°C/.test(r2p.steps),r2p.steps);
ok("דף אורז בלי כמות לא קורס",r2p.ingredients.every(i=>isFinite(i.qty)&&i.qty>0));

section("3. חישוב תזונתי");
const moz=X.DB.find(f=>f.n==="מוצרלה דלת שומן");
const i168={basis:"100g",qty:168,per:{k:moz.k,p:moz.p,c:moz.c,f:moz.f,s:moz.s,b:moz.b}};
ok("168 גר' מוצרלה = 427 קלוריות",Math.round(X.ingTotals(i168).k)===427,X.ingTotals(i168).k);
const iUnit={basis:"unit",unitName:"טורטייה",qty:6,per:{k:110,p:12,c:16,f:3,s:0.5,b:11}};
ok("6 יחידות × 110 = 660",X.ingTotals(iUnit).k===660);
ok("סיבים מסתכמים נכון",X.ingTotals(iUnit).b===66);
ok("סכום מתכון",Math.round(X.recipeTotals({ingredients:[i168,iUnit]}).k)===1087);
ok("כמות אפס לא מייצרת NaN",isFinite(X.ingTotals({basis:"100g",qty:0,per:{k:100}}).k));
ok("per חסר לא מפיל",isFinite(X.ingTotals({basis:"unit",qty:2}).k));
ok("תווית כמות ליחידות",X.amountLabel(iUnit)==="6 טורטייה",X.amountLabel(iUnit));
ok("תווית כמות לגרמים",X.amountLabel(i168)==="168 גר'",X.amountLabel(i168));

section("4. החלפת מוצר ועריכה");
const tort=X.DB.find(f=>f.n==="טורטייה דלת פחמימות");
const swapped={name:"טורטיית חלבון",basis:"unit",unitName:"טורטייה",qty:6,
  per:{k:110,p:12,c:16,f:3,s:0.5,b:11}};
ok("החלפה ליחידות שומרת כמות",swapped.qty===6);
ok("ערכי המוצר החדש בתוקף",X.ingTotals(swapped).k===660);
ok("יחידת 'כוס מגוררת' נמצאת מ'כוס'",X.unitGrams(moz,"כוס")===112,X.unitGrams(moz,"כוס"));
ok("יחידת 'כף קצוצה' נמצאת מ'כף'",X.unitGrams(X.DB.find(f=>f.n==="פטרוזיליה"),"כף")===4);
ok("יחידה לא קיימת מחזירה 0",X.unitGrams(moz,"שן")===0);
ok("matchFood מוצא לפי הכלה",X.matchFood("מוצרלה דלת שומן — reduced fat").n==="מוצרלה דלת שומן");

section("5. Open Food Facts");
const offRaw={product_name:"Tortillas 3 farines",brands:"Brand A, Brand B",code:"1234567890123",
  serving_size:"42 g",nutriments:{"energy-kcal_100g":260,proteins_100g:12,carbohydrates_100g:38,
  fat_100g:6,"saturated-fat_100g":1.2,fiber_100g:9}};
const norm=X.offNorm(offRaw);
ok("שם מוצר נקרא",norm.name==="Tortillas 3 farines");
ok("מותג ראשון בלבד",norm.brand==="Brand A",norm.brand);
ok("משקל מנה נחלץ",norm.servingG===42);
ok("ערכים ל-100 גרם",norm.per100.k===260&&norm.per100.b===9);
const offKJ=X.offNorm({product_name:"X",nutriments:{energy_100g:1000}});
ok("המרת קילו-ג'אול לקלוריות",Math.round(offKJ.per100.k)===239,offKJ.per100.k);
const offEmpty=X.offNorm({product_name:"Y",nutriments:{}});
ok("מוצר בלי ערכים מסומן null",offEmpty.per100===null);
ok("שדות חסרים לא מפילים",X.offNorm({}).name==="מוצר ללא שם");

section("6. אבטחה — תוכן זדוני מהפנקס המשותף");
const evil=X.sanitizeRecipe({id:"r1",title:'<img src=x onerror=alert(1)>',
  steps:"<script>fetch('http://evil')<\/script>",cat:"<b>x</b>",by:"a".repeat(500),
  link:"javascript:alert(1)",
  ingredients:[{name:"<svg onload=alert(2)>",qty:"NaN",per:{k:"abc"}}],
  stated:{k:"5"},updated:"999"});
ok("סקריפט בכותרת מנוטרל בפלט",!/<img/.test(X.esc(evil.title)),X.esc(evil.title));
ok("תגית בשלבים מנוטרלת",!/<script/.test(X.esc(evil.steps)));
ok("שם משתמש נחתך",evil.by.length<=60,evil.by.length);
ok("קישור javascript: נדחה",evil.link==="",evil.link);
ok("qty לא-מספרי → 0",evil.ingredients[0].qty===0);
ok("ערך תזונתי לא-מספרי → 0",evil.ingredients[0].per.k===0);
ok("stated הומר למספר",evil.stated.k===5);
ok("updated הומר למספר",evil.updated===999);
ok("רשומה בלי id נדחית",X.sanitizeRecipe({title:"x"})===null);
ok("קלט לא-אובייקט נדחה",X.sanitizeRecipe("hello")===null);
ok("מערך מרכיבים ענק נחתך",X.sanitizeRecipe({id:"a",ingredients:new Array(500).fill({name:"x"})}).ingredients.length===80);

section("7. קטגוריות");
X.setRecipes([{id:"a",cat:"קינוח",ingredients:[]},{id:"b",cat:"",ingredients:[]},
  {id:"c",cat:"טבעוני",ingredients:[]},{id:"d",cat:"קינוח",ingredients:[]}]);
const cats=X.allCats();
ok("קטגוריות ברירת מחדל קיימות",cats.indexOf("מנה עיקרית")>=0);
ok("קטגוריה חדשה מהמתכונים נוספה",cats.indexOf("טבעוני")>=0);
ok("אין כפילויות",cats.filter(c=>c==="קינוח").length===1);
ok("קטגוריה ריקה לא נכנסת לרשימה",cats.indexOf("")<0);
const shown=[{cat:"קינוח"},{cat:""},{cat:"טבעוני"}].filter(r=>r.cat==="קינוח");
ok("סינון לפי קטגוריה",shown.length===1);
ok("סינון 'ללא קטגוריה'",[{cat:"קינוח"},{cat:""}].filter(r=>!r.cat).length===1);

section("8. גודל מתכון וחסימת ענן");
const rBig={id:"x",title:"t",ingredients:[],link:"https://instagram.com/reel/abc"};
ok("מתכון עם קישור קטן מאוד",X.recipeBytes(rBig)<1000,X.recipeBytes(rBig)+" bytes");
const filler={name:"x".repeat(150),basis:"100g",unitName:"גרם",qty:1,per:{k:1,p:1,c:1,f:1,s:1,b:1}};
const rHuge={id:"y",ingredients:[],steps:"z".repeat(950000)};
X.setCloud("proj","key");
let rejected=false;
X.cloudPut(rHuge).then(()=>{}).catch(e=>{rejected=/כבד מדי/.test(e.message)}).then(()=>{
  ok("מתכון ענק נחסם לפני שליחה",rejected,X.recipeBytes(rHuge)+" bytes");

  section("9. תאימות לאחור");
  const oldFormat={id:"old",title:"ישן",ingredients:[{name:"בקר",grams:200,k:266,p:42,c:0,f:10}]};
  const clean=X.sanitizeRecipe(oldFormat);
  ok("מבנה ישן לא קורס בניקוי",clean!==null&&clean.ingredients.length===1);
  ok("מתכון בלי קישור מקבל מחרוזת",clean.link==="");
  ok("מתכון בלי cat מקבל מחרוזת",clean.cat==="");
  const fresh=X.blank();
  ok("מתכון חדש כולל cat ו-link",fresh.cat===""&&fresh.link==="");

  section("10. עמידות הפירוק");
  ok("טקסט ריק לא מפיל",X.parseRecipe("").ingredients.length===0);
  ok("ג'יבריש לא מפיל",X.parseRecipe("asdkj @#$ 8888\n\n???").ingredients!==undefined);
  ok("שורה בלי כמות נקלטת",X.parseIngLine("* salt to taste")!==null);
  ok("שורה ריקה מוחזרת null",X.parseIngLine("*  ")===null);
  ok("שבר יוניקוד ½",Math.abs(X.parseQty("½ cup").q-0.5)<0.01);
  ok("שבר מעורב 1 1/2",Math.abs(X.parseQty("1 1/2 cups").q-1.5)<0.01);
  ok("עשרוני עם פסיק 1,5",Math.abs(X.parseQty("1,5 kg").q-1.5)<0.01);
  ok("שורה ארוכה מסוננת",X.parseRecipe("Ingredients\n* "+"x".repeat(120)).ingredients.length===0);

  section("11. חילוץ מטא-דאטה מרעש ממשק (OCR אמיתי)");
  const noisy=`Reels
סרטוני
drewkleiman
High-Protein Cheesy Beef Rollups
Comment "Doug Tevis" for my low calorie high protein honey chipotle aioli
Ingredients
* 6 Mission Carb Balance burrito tortillas
* 2 lbs 96/4 lean ground beef
* 1 1/2 cups reduced-fat shredded mozzarella
How To
1. Preheat oven to 420F and coat a baking dish.
2. Roll each tortilla tightly.
Original Creator : @hungry.happens amazing recipe
Macros
1 serving = 3 rolls
370 Calories
44g Protein
#weightloss #fatloss
2w
View translation`;
  const nz=X.parseRecipe(noisy);
  ok("כותרת נקייה מרעש",nz.title==="High-Protein Cheesy Beef Rollups",nz.title);
  ok("'Reels' לא נבחר ככותרת",!/Reels|סרטוני/.test(nz.title));
  ok("שם המשתמש לא נבחר ככותרת",nz.title!=="drewkleiman");
  ok("שורת Comment לא נבחרה ככותרת",!/Comment/.test(nz.title));
  ok("יוצר זוהה",nz.source==="hungry.happens",nz.source);
  ok("תפוקה זוהתה",/3 rolls/.test(nz.yield),nz.yield);
  ok("מאקרו נקלט",nz.stated&&nz.stated.k===370);
  ok("מרכיבים נקלטו",nz.ingredients.length===3,nz.ingredients.length);
  ok("שלבי מקור מלאים",/Preheat oven/.test(nz.stepsSrc));
  ok("מקור לא כולל את שורת היוצר",!/Original Creator/.test(nz.stepsSrc));
  ok("מקור לא כולל האשטגים",!/#/.test(nz.stepsSrc));
  ok("שדה לעריכה מגיע עם מידות מומרות",/216°C/.test(nz.steps),nz.steps.split("\n")[0]);
  ok("המקור נשאר בשפת המקור",/420F/.test(nz.stepsSrc));

  section("12. חילוץ מכיתוב שני");
  const cap3=`hungry.happens
Crispy Chicken Rice Paper Nuggets
Ingredients:
* 1 lb lean ground chicken
* 1 cup shredded carrots
How to make them:
1. Mix everything in a bowl.
2. Air fry at 390F for 12 minutes.
Macros:
Per nugget: 30 cal | 3g protein
15 nuggets: 450 cal`;
  const c3=X.parseRecipe(cap3);
  ok("כותרת שנייה",/Rice Paper Nuggets/.test(c3.title),c3.title);
  ok("יוצר מזוהה משורת שם",c3.source==="hungry.happens",c3.source);
  ok("תפוקה '15 nuggets'",/15 nuggets/.test(c3.yield),c3.yield);

  section("13. שדות שלבים ושמירה");
  const withSteps=X.sanitizeRecipe({id:"z",steps:"שלב עברי",stepsSrc:"english step"});
  ok("stepsSrc נשמר בניקוי",withSteps.stepsSrc==="english step");
  ok("steps עברי נשמר",withSteps.steps==="שלב עברי");
  ok("מתכון חדש כולל stepsSrc",X.blank().stepsSrc==="");
  const legacy=X.sanitizeRecipe({id:"L",steps:"old only"});
  ok("מתכון ישן בלי stepsSrc לא קורס",legacy.stepsSrc==="");

  console.log("\n================================");
  console.log("PASS "+PASS+"   FAIL "+FAIL);
  if(notes.length){console.log("\nכשלים:");notes.forEach(n=>console.log(" - "+n))}
  process.exit(FAIL?1:0);
});
