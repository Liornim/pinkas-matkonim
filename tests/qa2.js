/* QA — הרצה על קוד האפליקציה האמיתי */
const fs=require("fs");
const html=fs.readFileSync("/mnt/user-data/outputs/recipe-book.html","utf8");
const code=html.match(/<script>([\s\S]*)<\/script>/)[1];

let PASS=0,FAIL=0,fails=[];
function ok(name,cond,detail){
  if(cond){PASS++;console.log("  ✓ "+name)}
  else{FAIL++;console.log("  ✗ "+name+(detail!==undefined?"  → "+detail:""));fails.push(name+(detail!==undefined?": "+detail:""))}
}
function sec(t){console.log("\n══ "+t)}

const store={};
const mkEl=()=>new Proxy({classList:{toggle(){},add(){},remove(){}},style:{},dataset:{},
  value:"",textContent:"",checked:false,innerHTML:"",files:[]},
  {get:(t,k)=>k in t?t[k]:(()=>{}),set:(t,k,v)=>{t[k]=v;return true}});
global.window={scrollTo(){}};
global.document={getElementById:mkEl,addEventListener(){},createElement:mkEl,head:{appendChild(){}}};
global.localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=v}};
global.FileReader=function(){};global.Blob=function(){};global.Image=function(){};
global.alert=()=>{};global.confirm=()=>true;

let ROUTES={};
global.fetch=(url,opts)=>{
  const key=Object.keys(ROUTES).find(k=>url.includes(k));
  const r=key?ROUTES[key]:{status:404,body:{status:0}};
  return Promise.resolve({ok:r.status<400,status:r.status,
    text:()=>Promise.resolve(JSON.stringify(r.body))});
};

const X={};
new Function("X",code+`;Object.assign(X,{parseRecipe,parseIngLine,parseQty,unitGrams,aliasFood,convText,
 ingTotals,recipeTotals,amountLabel,matchFood,sanitizeRecipe,offNorm,offSearch,applyOff,
 esc,r1,r0,num,foods,DB,blank,recipeBytes,hasHebrew,needsTranslation,translateSteps,VOL_G,
 setIng:v=>{ingEdit=v},getIng:()=>ingEdit,setKey:k=>{apiKey=k},saveIng:saveIngredient,
 setEditing:v=>{editing=v},getEditing:()=>editing,safeUrl,shortUrl,recipeNumbers,suggestServings,parseMacros,grabMacros,plausibleMacros});`)(X);

/* ============================================================
   ארבעת הכיתובים האמיתיים
   ============================================================ */
const R1=`Reels
סרטוני
drewkleiman
High-Protein Cheesy Beef Rollups
Comment "Doug Tevis" for my low calorie high protein honey chipotle aioli to make this recipe taste insane
Ingredients
* 6 Mission Carb Balance burrito tortillas
* 2 lbs 96/4 lean ground beef
* 1 small onion, finely diced
* 1 small bell pepper, finely diced
* 3 tbsp fresh parsley, chopped
* 1½ cups reduced-fat shredded mozzarella
* 2 tsp salt
* 1 tsp garlic powder
* 1 tsp onion powder
* ¼ tsp paprika
* Zero-calorie cooking spray
How To
1. Preheat oven to 420°F and lightly coat a baking dish with zero-calorie cooking spray.
2. In a large bowl, combine the ground beef, onion, bell pepper, parsley, 1 cup mozzarella, salt, garlic powder, onion powder, and paprika.
3. Divide the mixture evenly between the 6 tortillas and spread it into a thin layer, getting close to the edges.
4. Roll each tortilla tightly and slice into roughly 2½-inch rolls.
5. Place the rolls cut-side up in the baking dish and lightly spray the tops with cooking spray.
6. Bake for 20-25 minutes, or until the beef is fully cooked
7. Top with the remaining ½ cup mozzarella and bake until melted. Broil for 2 minutes at the end for an extra crispy top.
Original Creator : @hungry.happens amazing recipe thank you so much! Def making these again
Macros
1 serving = 3 rolls
370 Calories
44g Protein
22g Carbs
12g Fat
#weightloss #fatloss #recipe #recipes #fyp`;

const R2=`drewkleiman
Crispy Chicken Rice Paper Nuggets
Comment "Soy" for my low calorie and insanely delicious chili garlic dipping sauce
Ingredients:
* 1 lb lean ground chicken
* 1 cup shredded carrots
* 3 green onions, chopped
* 1 tsp chicken bouillon powder
* 1 tsp garlic powder
* 1 tsp onion powder
* ½ tsp salt
* ½ tsp black pepper
* 1 tsp sesame oil
* 1 large egg
* 1 tsp chili garlic oil
* Rice paper wrappers
* Zero-calorie cooking spray
How to make them:
1. Mix the chicken, carrots, green onions, seasonings, sesame oil, egg, and chili garlic oil in a bowl.
2. Dip each rice paper wrapper in water for 5 seconds to soften.
3. Add the chicken mixture, fold in the sides, and roll tightly.
4. Cut each roll into 4-5 nugget-sized pieces.
5. Lightly coat with zero cal cooking spray.
6. Air fry at 390°F for 12-15 minutes, flipping halfway through, until crispy and the chicken reaches 165°F internally.
7. Let cool for a couple minutes and enjoy with that insanely delicious dipping sauce
Original Creator @recipejournal101 thank you so much for this one! Tasted unreal
Macros:
Per nugget: 30 cal | 3g protein | 3g carbs | 1g fat
15 nuggets: 450 cal | 45g protein | 35g carbs | 12g fat
#weightloss #nutrition #fatloss #recipe #fyp`;

const R3=`drewkleiman
High-Protein Crispy Breakfast Bagel
Ingredients:
* 1 rice paper sheet
* 1 whole egg
* 2 tbsp liquid egg whites
* 3-4 tbsp cooked 93/7 lean ground turkey
* 1 tbsp bacon bits
* 2 tbsp reduced-fat shredded cheese
* Everything Bagel seasoning
How To:
1. Whisk together the egg and egg whites.
2. Dip the rice paper into the egg mixture until fully coated.
3. Add the ground turkey, bacon bits, and shredded cheese to the center.
4. Roll it up, then shape it into a bagel.
5. Sprinkle Everything Bagel seasoning on top.
6. Air fry at 400°F for 9-10 minutes, until golden and crispy.
Original Creator : @majasrecipes this one was amazing thank you so much!
Macros
210 Calories
25g Protein
8g Carbs
10g Fat
#recipe #fyp #weightloss #nutrition #fatloss`;

const R4=`Smoked Salmon Veggie Wrap
Ingredients:
* 1 cup shredded hash browns
* 1 cup shredded zucchini
* 1 cup shredded carrots
* 2 eggs
* ½ cup shredded mozzarella cheese
* 3 tbsp reduced-fat garden veggie cream cheese
* 4 oz smoked salmon
* Handful of arugula
* Everything Bagel Seasoning
Directions:
1. Mix the hash browns, zucchini, carrots, eggs, mozzarella,
2. Spread into a thin rectangle on a parchment-lined baking sheet.
3. Bake at 390°F for 20 minutes, or until golden and set.
4. Let cool for 2-3 minutes, then spread on the reduced-fat garden veggie cream cheese.
5. Add the smoked salmon and arugula.
6. Roll it up, slice, and destroy
Original Creator : @stefanozarrella amazing recipe man thank you so much!
Macros Full Wrap
780 Calories
58g Protein
42g Carbs
40g Fat
#weightloss #nutrition #recipes #fatloss #fyp`;

const P1=X.parseRecipe(R1),P2=X.parseRecipe(R2),P3=X.parseRecipe(R3),P4=X.parseRecipe(R4);
const find=(P,n)=>P.ingredients.find(i=>i.name.indexOf(n)===0);
const zeros=P=>P.ingredients.filter(i=>{const v=X.ingTotals(i);
  return v.k===0&&v.p===0&&v.c===0&&v.f===0&&!/מלח|ספריי|תבלינים/.test(i.name)});

sec("מתכון 1 — Beef Rollups");
ok("כותרת",P1.title==="High-Protein Cheesy Beef Rollups",P1.title);
ok("יוצר",P1.source==="hungry.happens",P1.source);
ok("תפוקה",/3 rolls/.test(P1.yield),P1.yield);
ok("11 מרכיבים",P1.ingredients.length===11,P1.ingredients.length);
ok("2 lbs בקר = 907 גר'",Math.abs(find(P1,"בקר טחון רזה").qty-907.2)<1,find(P1,"בקר טחון רזה").qty);
ok("1½ cups מוצרלה = 168 גר'",Math.abs(find(P1,"מוצרלה דלת שומן").qty-168)<1,find(P1,"מוצרלה דלת שומן").qty);
ok("3 tbsp פטרוזיליה = 12 גר'",Math.abs(find(P1,"פטרוזיליה").qty-12)<1,find(P1,"פטרוזיליה").qty);
ok("טורטיות זוהו",!!find(P1,"טורטיית חיטה"));
ok("420°F → 216°C",/216°C/.test(P1.steps),(P1.steps.match(/\d+°C/)||[])[0]);
ok("2½-inch → 6.4 ס\"מ",/6\.4 ס"מ/.test(P1.steps),(P1.steps.match(/[\d.]+ ס"מ/)||[])[0]);
ok("מאקרו 370/44/22/12 למנה",P1.stated.k===370&&P1.stated.p===44&&P1.stated.c===22&&P1.stated.f===12,JSON.stringify(P1.stated));
ok("בסיס: למנה",P1.statedBasis==="serving",P1.statedBasis);
ok("מספר מנות לא ידוע",P1.svKnown===false);
ok("אין מרכיבים מאופסים",zeros(P1).length===0,zeros(P1).map(i=>i.name).join(", "));
ok("סה\"כ קלוריות סביר",X.recipeTotals(P1).k>2000&&X.recipeTotals(P1).k<3200,Math.round(X.recipeTotals(P1).k));

sec("מתכון 2 — Rice Paper Nuggets");
ok("כותרת",P2.title==="Crispy Chicken Rice Paper Nuggets",P2.title);
ok("יוצר",P2.source==="recipejournal101",P2.source);
ok("תפוקה",/15 nuggets|nugget/.test(P2.yield),P2.yield);
ok("1 lb עוף טחון = 453.6 גר'",Math.abs(find(P2,"עוף טחון רזה").qty-453.6)<1,find(P2,"עוף טחון רזה").qty);
ok("עוף טחון עם ערכים (הבאג שדווח)",X.ingTotals(find(P2,"עוף טחון רזה")).k>600,Math.round(X.ingTotals(find(P2,"עוף טחון רזה")).k));
ok("1 cup גזר = 110 גר'",Math.abs(find(P2,"גזר").qty-110)<1,find(P2,"גזר").qty);
ok("3 בצל ירוק = 45 גר'",Math.abs(find(P2,"בצל ירוק").qty-45)<1,find(P2,"בצל ירוק").qty);
ok("שמן שומשום עם ערכים",X.ingTotals(find(P2,"שמן שומשום")).k>0,X.ingTotals(find(P2,"שמן שומשום")).k);
ok("ביצה = 50 גר'",Math.abs(find(P2,"ביצה").qty-50)<1,find(P2,"ביצה").qty);
ok("אבקת מרק עוף זוהתה",!!find(P2,"אבקת מרק עוף"));
ok("שמן צ'ילי זוהה",!!find(P2,"שמן צ'ילי"));
ok("דף אורז זוהה",!!find(P2,"דף אורז"));
ok("390°F → 199°C",/199°C/.test(P2.steps));
ok("אין מרכיבים מאופסים",zeros(P2).length===0,zeros(P2).map(i=>i.name).join(", "));

sec("מתכון 3 — Breakfast Bagel");
ok("כותרת",P3.title==="High-Protein Crispy Breakfast Bagel",P3.title);
ok("יוצר",P3.source==="majasrecipes",P3.source);
ok("7 מרכיבים",P3.ingredients.length===7,P3.ingredients.length);
ok("דף אורז אחד = 8 גר'",Math.abs(find(P3,"דף אורז").qty-8)<0.5,find(P3,"דף אורז").qty);
ok("2 tbsp חלבון ביצה = 30 גר'",Math.abs(find(P3,"חלבון ביצה").qty-30)<1,find(P3,"חלבון ביצה").qty);
ok("טווח 3-4 tbsp → 3",Math.abs(find(P3,"הודו טחון רזה").qty-45)<1,find(P3,"הודו טחון רזה").qty);
ok("הודו עם ערכים",X.ingTotals(find(P3,"הודו טחון רזה")).k>0,Math.round(X.ingTotals(find(P3,"הודו טחון רזה")).k));
ok("1 tbsp בייקון = 7 גר'",Math.abs(find(P3,"פירורי בייקון").qty-7)<0.5,find(P3,"פירורי בייקון").qty);
ok("2 tbsp גבינה עם ערכים",X.ingTotals(find(P3,"גבינה צהובה")).k>0,Math.round(X.ingTotals(find(P3,"גבינה צהובה")).k));
ok("400°F → 204°C",/204°C/.test(P3.steps));
ok("אין מרכיבים מאופסים",zeros(P3).length===0,zeros(P3).map(i=>i.name).join(", "));

sec("מתכון 4 — Smoked Salmon Wrap");
ok("כותרת",P4.title==="Smoked Salmon Veggie Wrap",P4.title);
ok("יוצר",P4.source==="stefanozarrella",P4.source);
ok("9 מרכיבים",P4.ingredients.length===9,P4.ingredients.length);
ok("4 oz סלמון = 113 גר'",Math.abs(find(P4,"סלמון מעושן").qty-113.4)<1,find(P4,"סלמון מעושן").qty);
ok("סלמון מעושן זוהה ולא סלמון רגיל",!!find(P4,"סלמון מעושן"));
ok("½ cup מוצרלה = 56 גר'",Math.abs(find(P4,"מוצרלה").qty-56)<1,find(P4,"מוצרלה").qty);
ok("2 ביצים = 100 גר'",Math.abs(find(P4,"ביצה").qty-100)<1,find(P4,"ביצה").qty);
ok("3 tbsp גבינת שמנת = 45 גר'",Math.abs(find(P4,"גבינת שמנת דלת שומן").qty-45)<1,find(P4,"גבינת שמנת דלת שומן").qty);
ok("Handful רוקט זוהה",!!find(P4,"רוקט"),find(P4,"רוקט")&&find(P4,"רוקט").qty);
ok("hash browns זוהו",!!find(P4,"תפוחי אדמה מגוררים"));
ok("קישוא זוהה",!!find(P4,"קישוא"));
ok("מאקרו 780/58/42/40 לכל המתכון",P4.stated.k===780&&P4.stated.p===58,JSON.stringify(P4.stated));
ok("בסיס: כל המתכון",P4.statedBasis==="total",P4.statedBasis);
ok("אין מרכיבים מאופסים",zeros(P4).length===0,zeros(P4).map(i=>i.name).join(", "));

sec("ניקיון פלט בכל 4 המתכונים");
[["1",P1],["2",P2],["3",P3],["4",P4]].forEach(([n,P])=>{
  ok("מתכון "+n+": בלי האשטגים בשלבים",!/#\w/.test(P.steps));
  ok("מתכון "+n+": בלי שורת Original Creator",!/Original Creator/.test(P.steps));
  ok("מתכון "+n+": בלי שורת Macros",!/^Macros/m.test(P.steps));
  ok("מתכון "+n+": כל הכמויות חיוביות",P.ingredients.every(i=>i.qty>0));
  ok("מתכון "+n+": שלבי מקור נשמרו",P.stepsSrc.length>40);
  ok("מתכון "+n+": כל הערכים סופיים",P.ingredients.every(i=>{
    const v=X.ingTotals(i);return [v.k,v.p,v.c,v.f,v.s,v.b].every(x=>isFinite(x))}));
});

/* ============================================================
   ברקוד 7296073597230 — לפי צילום המסך של היצרן
   ל-100 גר': 286 קל | 15.2 חלבון | 40 פחמימות | 6 שומן | 1.9 רווי | 5.4 סיבים
   ליחידה:    115 קל | 6.1 חלבון  | 16 פחמימות | 2.4 שומן | 0.7 רווי | 2.1 סיבים
   ============================================================ */
sec("ברקוד 7296073597230 — ערכי היצרן");
const BARCODE="7296073597230";
ROUTES={};
ROUTES["/api/v2/product/"+BARCODE]={status:200,body:{status:1,code:BARCODE,product:{
  code:BARCODE,product_name:"לחמניות פרוטאין",brands:"אחלה",
  serving_size:"40 g",nutriments:{
    "energy-kcal_100g":286,proteins_100g:15.2,carbohydrates_100g:40,
    fat_100g:6,"saturated-fat_100g":1.9,fiber_100g:5.4,
    "energy-kcal_serving":115,proteins_serving:6.1,carbohydrates_serving:16,
    fat_serving:2.4,"saturated-fat_serving":0.7,fiber_serving:2.1}}}};

X.offSearch(BARCODE).then(list=>{
  const p=list[0];
  ok("הברקוד נמצא",list.length===1);
  ok("שם המוצר",p.name==="לחמניות פרוטאין",p.name);
  ok("מותג",p.brand==="אחלה",p.brand);
  ok("משקל יחידה 40 גר'",p.servingG===40,p.servingG);
  ok("hasData אמת",p.hasData===true);
  ok("100גר': 286 קלוריות",p.per100.k===286,p.per100.k);
  ok("100גר': 15.2 חלבון",p.per100.p===15.2,p.per100.p);
  ok("100גר': 40 פחמימות",p.per100.c===40,p.per100.c);
  ok("100גר': 6 שומן",p.per100.f===6,p.per100.f);
  ok("100גר': 1.9 שומן רווי",p.per100.s===1.9,p.per100.s);
  ok("100גר': 5.4 סיבים",p.per100.b===5.4,p.per100.b);
  ok("יחידה: 115 קלוריות",p.perServ.k===115,p.perServ.k);
  ok("יחידה: 6.1 חלבון",p.perServ.p===6.1,p.perServ.p);
  ok("יחידה: 16 פחמימות",p.perServ.c===16,p.perServ.c);
  ok("יחידה: 2.4 שומן",p.perServ.f===2.4,p.perServ.f);
  ok("יחידה: 0.7 שומן רווי",p.perServ.s===0.7,p.perServ.s);
  ok("יחידה: 2.1 סיבים",p.perServ.b===2.1,p.perServ.b);

  sec("הזנת הברקוד לשדות המרכיב");
  X.setIng({index:-1,name:"",basis:"100g",unitName:"יחידה",qty:"",
    per:{k:0,p:0,c:0,f:0,s:0,b:0},src:"manual",toDb:false,units:null});
  X.applyOff(p,"100g");
  let d=X.getIng();
  ok("שם מולא עם המותג",d.name==="אחלה לחמניות פרוטאין",d.name);
  ok("בסיס = 100 גרם",d.basis==="100g");
  ok("קלוריות בשדה",d.per.k===286,d.per.k);
  ok("סיבים בשדה",d.per.b===5.4,d.per.b);
  ok("שומן רווי בשדה",d.per.s===1.9,d.per.s);
  ok("ברקוד נשמר",d.barcode===BARCODE,d.barcode);
  ok("קיצור דרך ליחידה זמין",d.units&&d.units["יחידה"]===40,JSON.stringify(d.units));
  ok("מקור מצוין",/Open Food Facts/.test(d.found)&&d.found.indexOf(BARCODE)>=0,d.found);

  X.setIng({index:-1,name:"",basis:"100g",unitName:"יחידה",qty:"",
    per:{k:0,p:0,c:0,f:0,s:0,b:0},src:"manual",toDb:false,units:null});
  X.applyOff(p,"unit");
  d=X.getIng();
  ok("מצב יחידה: בסיס",d.basis==="unit");
  ok("מצב יחידה: 115 קלוריות",d.per.k===115,d.per.k);
  ok("מצב יחידה: שם היחידה כולל משקל",/40/.test(d.unitName),d.unitName);
  d.qty=3;
  const t3=X.ingTotals(d);
  ok("3 יחידות = 345 קלוריות",Math.round(t3.k)===345,t3.k);
  ok("3 יחידות = 18.3 חלבון",Math.abs(t3.p-18.3)<0.05,t3.p);
  ok("3 יחידות = 6.3 סיבים",Math.abs(t3.b-6.3)<0.05,t3.b);

  sec("עקביות בין שני המצבים");
  const per100={basis:"100g",qty:120,per:p.per100};
  const perUnit={basis:"unit",qty:3,per:p.perServ};
  ok("120 גר' ≈ 3 יחידות (קלוריות)",Math.abs(X.ingTotals(per100).k-X.ingTotals(perUnit).k)<10,
     Math.round(X.ingTotals(per100).k)+" מול "+Math.round(X.ingTotals(perUnit).k));

  sec("ברקוד ללא ערכים תזונתיים");
  ROUTES={};ROUTES["/api/v2/product/1111111111111"]={status:200,body:{status:1,product:{
    code:"1111111111111",product_name:"מוצר בלי נתונים",brands:"",nutriments:{}}}};
  return X.offSearch("1111111111111");
}).then(list=>{
  const p=list[0];
  ok("מוצר בלי ערכים עדיין מוחזר",list.length===1);
  ok("hasData שקר",p.hasData===false);
  X.setIng({index:-1,name:"",basis:"100g",unitName:"יחידה",qty:"",
    per:{k:0,p:0,c:0,f:0,s:0,b:0},src:"manual",toDb:false,units:null});
  X.applyOff(p,"100g");
  ok("שם עדיין מולא",X.getIng().name.indexOf("מוצר בלי נתונים")>=0);
  ok("הודעה ברורה למשתמש",/הזן אותם מהאריזה/.test(X.getIng().foundNote),X.getIng().foundNote);

  sec("ברקוד לא קיים");
  ROUTES={};ROUTES["/api/v2/product/9999999999999"]={status:404,body:{status:0}};
  return X.offSearch("9999999999999").then(()=>{ok("ברקוד לא קיים זורק שגיאה",false)})
    .catch(e=>{ok("ברקוד לא קיים — הודעה ברורה",/לא נמצא/.test(e.message),e.message)});
}).then(()=>{
  sec("המרת קילו-ג'אול וערכים חלקיים");
  const kj=X.offNorm({product_name:"X",nutriments:{energy_100g:1000}});
  ok("kJ → קלוריות",Math.round(kj.per100.k)===239,kj.per100.k);
  const onlyServ=X.offNorm({product_name:"Y",serving_size:"50 g",
    nutriments:{"energy-kcal_serving":100,proteins_serving:5}});
  ok("רק ערכי מנה → נגזר ל-100 גרם",Math.round(onlyServ.per100.k)===200,onlyServ.per100.k);
  ok("חלבון נגזר נכון",Math.round(onlyServ.per100.p)===10,onlyServ.per100.p);
  const only100=X.offNorm({product_name:"Z",serving_size:"25 g",
    nutriments:{"energy-kcal_100g":400}});
  ok("רק ערכי 100 גרם → נגזרת מנה",only100.perServ.k===100,only100.perServ.k);
  ok("serving_quantity מספרי נקרא",X.offNorm({product_name:"W",serving_quantity:30,
    nutriments:{"energy-kcal_100g":100}}).servingG===30);

  sec("זיהוי צורך בתרגום");
  ok("אנגלית → דורש תרגום",X.needsTranslation({steps:"Preheat oven to 216°C and bake"})===true);
  ok("עברית → לא דורש",X.needsTranslation({steps:"חממו תנור ל-216 מעלות"})===false);
  ok("ריק → לא דורש",X.needsTranslation({steps:""})===false);
  ok("מעורב עם עברית → לא דורש",X.needsTranslation({steps:"חממו את התנור ל-216 מעלות ואפו 20 דקות"})===false);
  ok("אנגלית עם יחידה מומרת → עדיין דורש",X.needsTranslation({steps:'Roll each tortilla and slice into 6.4 \u05e1"\u05de rolls, then bake'})===true);
  ok("כל 4 המתכונים מסומנים לתרגום",[P1,P2,P3,P4].every(P=>X.needsTranslation(P)),
     [P1,P2,P3,P4].map((P,i)=>(i+1)+":"+X.needsTranslation(P)).join(" "));

  sec("תרגום — הזרימה");
  X.setKey("test-key");
  ROUTES={};ROUTES["generativelanguage"]={status:200,body:{candidates:[{content:{parts:[{
    text:'{"title":"רולים של בשר וגבינה","yield":"3 רולים למנה","steps":["חממו תנור ל-216 מעלות","ערבבו את הבשר עם הבצל"]}'}]}}]}};
  const e1={title:"High-Protein Cheesy Beef Rollups",yield:"",steps:"Preheat oven",stepsSrc:"Preheat oven to 420F"};
  return X.translateSteps(e1).then(()=>{
    ok("שלבים תורגמו",X.hasHebrew(e1.steps),e1.steps.split("\n")[0]);
    ok("שני שלבים",e1.steps.split("\n").length===2);
    ok("כותרת אנגלית הוחלפה בעברית",e1.title==="רולים של בשר וגבינה",e1.title);
    ok("תפוקה מולאה",e1.yield==="3 רולים למנה",e1.yield);
    ok("המקור נשמר כמו שהיה",e1.stepsSrc==="Preheat oven to 420F");
    ok("אחרי תרגום לא דורש תרגום",X.needsTranslation(e1)===false);
  });
}).then(()=>{
  sec("תרגום — טיפול בכשלים");
  ROUTES={};ROUTES["generativelanguage"]={status:200,body:{candidates:[{content:{parts:[{
    text:'{"steps":["Preheat the oven","Mix everything"]}'}]}}]}};
  const e2={title:"t",steps:"x",stepsSrc:"Preheat"};
  return X.translateSteps(e2).then(()=>{ok("תשובה באנגלית נדחית",false,"התקבלה בלי שגיאה")})
    .catch(err=>{ok("תשובה באנגלית נדחית עם הסבר",/אינו בעברית/.test(err.message),err.message);
      ok("השלבים לא הושחתו",e2.steps==="x")});
}).then(()=>{
  ROUTES={};ROUTES["generativelanguage"]={status:429,body:{error:{message:"quota"}}};
  return X.translateSteps({steps:"x",stepsSrc:"y"}).then(()=>{ok("429 נתפס",false)})
    .catch(e=>ok("429 → הודעה על מכסה",/מכסה/.test(e.message),e.message));
}).then(()=>{
  sec("שמירת מרכיב");
  X.setEditing({ingredients:[]});
  X.setIng({index:-1,name:"טורטיית חלבון",basis:"unit",unitName:"טורטייה",qty:"6",
    per:{k:115,p:6.1,c:16,f:2.4,s:0.7,b:2.1},src:"off",toDb:false,found:"OFF"});
  X.saveIng();
  const ing=X.getEditing().ingredients[0];
  ok("המרכיב נוסף",!!ing);
  ok("כמות מספרית",ing.qty===6);
  ok("6 יחידות = 690 קלוריות",Math.round(X.ingTotals(ing).k)===690,X.ingTotals(ing).k);
  ok("סיבים נשמרו",Math.abs(X.ingTotals(ing).b-12.6)<0.05,X.ingTotals(ing).b);
  ok("שומן רווי נשמר",Math.abs(X.ingTotals(ing).s-4.2)<0.05,X.ingTotals(ing).s);
  ok("תווית כמות",X.amountLabel(ing)==="6 טורטייה",X.amountLabel(ing));

  sec("אבטחה");
  const evil=X.sanitizeRecipe({id:"e",title:'<img src=x onerror=alert(1)>',
    steps:"<script>bad()<\/script>",stepsSrc:"ok",link:"javascript:steal()",
    ingredients:[{name:"<svg onload=x>",qty:"NaN",per:{k:"abc"}}],stated:{k:"5"}});
  ok("HTML בכותרת מנוטרל",!/<img/.test(X.esc(evil.title)));
  ok("קישור זדוני נדחה",evil.link==="",evil.link);
  ok("qty לא-מספרי → 0",evil.ingredients[0].qty===0);
  ok("ערך לא-מספרי → 0",evil.ingredients[0].per.k===0);
  ok("stepsSrc נשמר",evil.stepsSrc==="ok");
  ok("קלט פגום נדחה",X.sanitizeRecipe(null)===null);

  sec("עמידות");
  ok("טקסט ריק",X.parseRecipe("").ingredients.length===0);
  ok("ג'יבריש",Array.isArray(X.parseRecipe("@@@ 123 ???").ingredients));
  ok("½ יוניקוד",Math.abs(X.parseQty("½ cup").q-0.5)<0.01);
  ok("1 1/2 מעורב",Math.abs(X.parseQty("1 1/2 cups").q-1.5)<0.01);
  ok("טווח 3-4",X.parseQty("3-4 tbsp").q===3&&/^tbsp/.test(X.parseQty("3-4 tbsp").rest),X.parseQty("3-4 tbsp").rest);
  ok("טווח עם מקף ארוך",X.parseQty("3–4 tbsp").q===3);
  ok("כמות 0 לא מייצרת NaN",isFinite(X.ingTotals({basis:"100g",qty:0,per:{k:5}}).k));
  ok("per חסר",isFinite(X.ingTotals({basis:"unit",qty:2}).k));
  ok("מתכון חדש תקין",X.blank().stepsSrc===""&&X.blank().link===""&&Array.isArray(X.blank().ingredients));

  sec("קישור למתכון המקורי");
  ok("https תקין",X.safeUrl("https://instagram.com/reel/abc")==="https://instagram.com/reel/abc");
  ok("http תקין",X.safeUrl("http://example.com/x")==="http://example.com/x");
  ok("בלי סכימה → נוסף https",X.safeUrl("instagram.com/reel/abc")==="https://instagram.com/reel/abc",X.safeUrl("instagram.com/reel/abc"));
  ok("www בלי סכימה",X.safeUrl("www.site.co.il/recipe")==="https://www.site.co.il/recipe");
  ok("רווחים בקצוות מנוקים",X.safeUrl("  https://a.com/b  ")==="https://a.com/b");
  ok("javascript: נדחה",X.safeUrl("javascript:alert(1)")==="",X.safeUrl("javascript:alert(1)"));
  ok("data: נדחה",X.safeUrl("data:text/html,<script>x<\/script>")==="");
  ok("file: נדחה",X.safeUrl("file:///etc/passwd")==="");
  ok("ריק מחזיר ריק",X.safeUrl("")===""&&X.safeUrl(null)==="");
  ok("כתובת עם גרשיים נדחית",X.safeUrl('https://a.com/" onmouseover="x')==="");
  ok("כתובת עם סוגר משולש נדחית",X.safeUrl("https://a.com/<script>")==="");
  ok("אורך מוגבל",X.safeUrl("https://a.com/"+"x".repeat(900)).length<=500);
  ok("קיצור לתצוגה",X.shortUrl("https://www.instagram.com/reel/abc")==="instagram.com/reel/abc",X.shortUrl("https://www.instagram.com/reel/abc"));
  ok("קיצור ארוך נחתך",X.shortUrl("https://a.com/"+"y".repeat(200)).length<=45);

  const linked=X.sanitizeRecipe({id:"L1",link:"https://instagram.com/reel/xyz"});
  ok("קישור עובר ניקוי",linked.link==="https://instagram.com/reel/xyz");
  const evilLink=X.sanitizeRecipe({id:"L2",link:"javascript:alert(document.cookie)"});
  ok("קישור זדוני מהפנקס המשותף מסונן",evilLink.link==="",evilLink.link);
  ok("מתכון חדש כולל שדה קישור",X.blank().link==="");
  ok("מתכון ישן בלי קישור לא קורס",X.sanitizeRecipe({id:"L3"}).link==="");
  ok("שדה תמונות הוסר",X.blank().photos===undefined);

  sec("גודל מתכון אחרי הסרת התמונות");
  const typical={id:"t",title:"רולים של בשר וגבינה",source:"hungry.happens",
    link:"https://instagram.com/reel/abcdef",cat:"מנה עיקרית",
    steps:"חממו תנור\\nערבבו הכל\\nאפו 25 דקות",stepsSrc:"Preheat\\nMix\\nBake",
    ingredients:P1.ingredients};
  const kb=X.recipeBytes(typical)/1024;
  ok("מתכון טיפוסי מתחת ל-4KB",kb<4,Math.round(kb*10)/10+"KB");
  ok("100 מתכונים מתחת ל-400KB לסנכרון",kb*100<400,Math.round(kb*100)+"KB");

  sec("קישור בכרטיס ברשימה");
  const cardHtml=(r)=>{
    const u=X.safeUrl(r.link);
    return '<div class="card tap" data-open="'+r.id+'" role="button" tabindex="0">'+
      (u?'<a class="link" href="'+X.esc(u)+'" target="_blank" rel="noopener noreferrer nofollow">'+
        'פתיחת המקור · '+X.esc(X.shortUrl(u))+'</a>':"")+'</div>';
  };
  const withLink=cardHtml({id:"c1",link:"https://www.instagram.com/reel/DbupxdGulgL"});
  ok("הכרטיס אינו button (קישור מקונן חוקי)",withLink.indexOf("<button")<0);
  ok("הכרטיס לחיץ עם data-open",/data-open="c1"/.test(withLink));
  ok("נגישות מקלדת",/tabindex="0"/.test(withLink)&&/role="button"/.test(withLink));
  ok("הקישור מופיע בכרטיס",/<a class="link" href="https:\/\/www\.instagram\.com/.test(withLink));
  ok("נפתח בלשונית חדשה בבטחה",/target="_blank"/.test(withLink)&&/rel="noopener noreferrer nofollow"/.test(withLink));
  ok("הכתובת מקוצרת לתצוגה",/instagram\.com\/reel\/DbupxdGulgL/.test(withLink)&&withLink.indexOf(">https://")<0);
  const noLink=cardHtml({id:"c2",link:""});
  ok("בלי קישור — אין עוגן",noLink.indexOf("<a ")<0);
  const badLink=cardHtml({id:"c3",link:"javascript:alert(1)"});
  ok("קישור זדוני לא מרונדר בכרטיס",badLink.indexOf("<a ")<0,badLink);
  const quoted=cardHtml({id:"c4",link:'https://a.com/x" onclick="steal()'});
  ok("ניסיון בריחה ממרכאות נחסם",quoted.indexOf("onclick")<0);


  sec("הערכים המוצגים — לפי המתכון, לא לפי החישוב");
  const N1=X.recipeNumbers(P1),N2=X.recipeNumbers(P2),N3=X.recipeNumbers(P3),N4=X.recipeNumbers(P4);
  
  ok("מתכון 1: מזוהה כלא ידוע",N1.unknown===true);
  ok("מתכון 1: למנה = 370 שפורסמו",N1.per.k===370,N1.per.k);
  ok("מתכון 1: לא ממציא סך הכל",N1.total.k===370&&N1.unknown,N1.total.k);
  ok("מתכון 1: הצעה סבירה למספר מנות",X.suggestServings(P1)===7,X.suggestServings(P1));
  const P1fixed=Object.assign({},P1,{servings:7,svKnown:true});
  const N1f=X.recipeNumbers(P1fixed);
  ok("מתכון 1: אחרי קביעת 7 מנות → 2590",N1f.total.k===2590,N1f.total.k);
  ok("מתכון 1: למנה נשאר 370",N1f.per.k===370);
  ok("מתכון 1: כבר לא מסומן כלא ידוע",N1f.unknown===false);
  
  ok("מתכון 2: 15 מנות זוהו",N2.servings===15,N2.servings);
  ok("מתכון 2: סך הכל 450 כפי שפורסם",N2.total.k===450,N2.total.k);
  ok("מתכון 2: למנה 30",Math.round(N2.per.k)===30,N2.per.k);
  ok("מתכון 2: חלבון למנה 3",Math.round(N2.per.p)===3,N2.per.p);
  ok("מתכון 2: לא משתמש בחישוב (901)",N2.total.k!==Math.round(N2.computed.k));
  
  ok("מתכון 3: 210 כפי שפורסם",N3.total.k===210,N3.total.k);
  ok("מתכון 3: מנה אחת",N3.servings===1);
  ok("מתכון 4: 780 כפי שפורסם",N4.total.k===780,N4.total.k);
  ok("מתכון 4: לא 706 מהחישוב",N4.total.k!==Math.round(N4.computed.k));
  
  ok("כל הארבעה מסומנים כמגיעים מהמתכון",[N1,N2,N3,N4].every(N=>N.fromRecipe));
  ok("החישוב נשמר להשוואה",[N1,N2,N3,N4].every(N=>N.computed.k>0));
  
  sec("נפילה לחישוב כשאין ערכים מפורסמים");
  const noMacros={id:"nm",servings:4,stated:null,ingredients:P4.ingredients};
  const Nn=X.recipeNumbers(noMacros);
  ok("בלי ערכים → מסומן כחישוב",Nn.fromRecipe===false);
  ok("סך הכל = החישוב",Math.round(Nn.total.k)===Math.round(Nn.computed.k));
  ok("למנה = חלוקה ב-4",Math.abs(Nn.per.k-Nn.computed.k/4)<0.01);
  ok("לא מסומן כלא ידוע",Nn.unknown===false);
  
  sec("עריכה ידנית של הערכים");
  const manual={id:"mn",servings:6,statedBasis:"serving",svKnown:true,
    stated:{k:250,p:20,c:15,f:10},ingredients:[]};
  const Nm=X.recipeNumbers(manual);
  ok("למנה 250 כפי שהוזן",Nm.per.k===250);
  ok("סך הכל 1500 (250×6)",Nm.total.k===1500,Nm.total.k);
  ok("חלבון סך הכל 120",Nm.total.p===120,Nm.total.p);
  const manualTotal=Object.assign({},manual,{statedBasis:"total"});
  const Nmt=X.recipeNumbers(manualTotal);
  ok("מצב 'כל המתכון': סך הכל 250",Nmt.total.k===250);
  ok("מצב 'כל המתכון': למנה 41.7",Math.abs(Nmt.per.k-250/6)<0.01,Nmt.per.k);
  
  sec("עמידות המספרים");
  ok("מנות 0 מטופל כ-1",X.recipeNumbers({servings:0,stated:{k:100},ingredients:[]}).servings===1);
  ok("מנות שליליות",X.recipeNumbers({servings:-5,stated:{k:100},ingredients:[]}).servings===1);
  ok("stated עם k=0 נחשב ריק",X.recipeNumbers({stated:{k:0},ingredients:[]}).fromRecipe===false);
  ok("stated חלקי לא מפיל",isFinite(X.recipeNumbers({stated:{k:100},servings:2,ingredients:[]}).per.p));
  ok("בלי מרכיבים בכלל",isFinite(X.recipeNumbers({stated:{k:100},ingredients:[]}).computed.k));
  const sane=X.sanitizeRecipe({id:"s1",servings:"8",statedBasis:"serving",svKnown:false,stated:{k:"100"}});
  ok("מנות ממחרוזת",sane.servings===8,sane.servings);
  ok("בסיס נשמר",sane.statedBasis==="serving");
  ok("מנות מוגבלות ל-999",X.sanitizeRecipe({id:"s2",servings:99999}).servings===999);
  ok("בסיס לא חוקי → total",X.sanitizeRecipe({id:"s3",statedBasis:"<script>"}).statedBasis==="total");
  
  

  sec("סבירות ערכי מאקרו");
  const bug=X.grabMacros("332 Calories 420g Protein");
  ok("הבאג שדווח: 420 → 42",bug.p===42,bug.p);
  ok("קלוריות לא השתנו",bug.k===332);
  ok("התיקון מסומן",bug.fixed===true);
  const good=X.grabMacros("332 Calories 42g Protein 20g Carbs 8g Fat");
  ok("ערכים תקינים לא משתנים",good.p===42&&good.c===20&&good.f===8);
  ok("ערכים תקינים לא מסומנים כמתוקנים",!good.fixed);
  ok("אבקת חלבון 80 גר' על 380 קל תקין",X.grabMacros("380 Calories 80g Protein").p===80);
  ok("פחמימות 30 על 100 קל תקין",X.grabMacros("100 cal 30g carbs").c===30);
  ok("שומן 40 על 780 קל תקין",X.grabMacros("780 Calories 40g Fat").f===40);
  ok("שומן מנופח 400 → 40",X.grabMacros("780 Calories 400g Fat").f===40);
  ok("מתכון שלם: 259 חלבון על 2563 קל תקין",X.plausibleMacros({k:2563,p:259,c:160,f:94}).p===259);
  ok("מספר בתוך מספר ארוך לא נלכד",X.grabMacros("Recipe 3420 400 Calories 42g Protein").p===42,
     X.grabMacros("Recipe 3420 400 Calories 42g Protein").p);
  ok("קלוריות נמוכות מדי נדחות",X.grabMacros("5 calories 1g protein")===null);
  ok("שורה בלי קלוריות מוחזרת null",X.grabMacros("42g protein 20g carbs")===null);
  ok("ערכים עשרוניים נקראים",X.grabMacros("332 Calories 42.5g Protein").p===42.5);
  ok("kcal מזוהה",X.grabMacros("332 kcal 42g protein").k===332);
  ok("חלבון אפס לא מתחלק",X.plausibleMacros({k:100,p:0,c:0,f:0}).p===0);
  ok("k אפס לא מפיל",X.plausibleMacros({k:0,p:99,c:0,f:0}).p===99);
  
  

  sec("Banana Bread — מאקרו בשורות נפרדות + תווי כיוון");
  const RB=`Protein Banana Bread
  Ingredients:
  \u2022 250g ripe banana
  \u2022 3 eggs
  \u2022 200g oat flour
  \u2022 1 tsp cinnamon
  Directions:
  1. Mash the banana and mix everything.
  2. Bake at 350F for 40 minutes.
  I sliced mine into 10 pieces, so you've got breakfast, a snack or dessert sorted for the week.
  Per Slice (1 of 10):
  143 Calories
  7g Protein
  9g Fat
  8g Carbs`;
  const PB=X.parseRecipe(RB),NB=X.recipeNumbers(PB);
  ok("מאקרו נאסף משורות נפרדות",PB.stated&&PB.stated.k===143,JSON.stringify(PB.stated));
  ok("חלבון 7",PB.stated.p===7,PB.stated.p);
  ok("פחמימות 8",PB.stated.c===8,PB.stated.c);
  ok("שומן 9",PB.stated.f===9,PB.stated.f);
  ok("בסיס: למנה",PB.statedBasis==="serving",PB.statedBasis);
  ok("'1 of 10' → 10 מנות",PB.servings===10,PB.servings);
  ok("מספר המנות ידוע",PB.svKnown===true);
  ok("כל המתכון 1430",NB.total.k===1430,NB.total.k);
  ok("חלבון לכל המתכון 70",NB.total.p===70,NB.total.p);
  ok("למנה נשאר 143",NB.per.k===143,NB.per.k);
  ok("לא מסומן כלא ידוע",NB.unknown===false);
  ok("לא נופל לחישוב המרכיבים",NB.fromRecipe===true);
  const ban=PB.ingredients.find(i=>i.name.indexOf("בננה")===0);
  ok("250g בננה = 250 גרם",ban.qty===250,ban.qty);
  ok("בננה לא קיבלה משקל יחידה (115)",ban.qty!==115);
  ok("3 ביצים = 150 גרם",PB.ingredients.find(i=>i.name.indexOf("ביצה")===0).qty===150);
  ok("200g קמח = 200 גרם",PB.ingredients.find(i=>i.name.indexOf("קמח")===0).qty===200);
  
  sec("תווי כיוון נסתרים");
  const bidiLine=X.parseIngLine("\u200e250g ripe banana\u200f");
  ok("LRM בתחילת שורה לא שובר כמות",bidiLine.qty===250,bidiLine.qty);
  ok("יחידה זוהתה כגרם",bidiLine.unitName==="גרם");
  const rtlEmbed=X.parseIngLine("\u202b\u2022 100g flour\u202c");
  ok("תווי הטמעה דו-כיווניים מנוקים",rtlEmbed.qty===100,rtlEmbed.qty);
  ok("רווח אפס מנוקה",X.parseIngLine("\u200b50g sugar").qty===50);
  ok("תבליט em-dash מנוקה",X.parseIngLine("— 75g oats").qty===75);
  
  sec("וריאציות ניסוח של מנות");
  const mk=(txt)=>X.parseMacros(txt.split("\n"));
  ok("'Per slice' מזוהה כלמנה",mk("Per slice\n100 Calories\n5g Protein").basis==="serving");
  ok("'Makes 12 muffins'",mk("Makes 12 muffins\n200 Calories\n9g Protein").servings===12);
  ok("'Cut into 8 squares'",mk("Cut into 8 squares\n150 Calories\n5g Protein").servings===8);
  ok("'Serves 4'",mk("Serves 4\n300 Calories\n20g Protein").servings===4);
  ok("בלי רמז → מנה אחת",mk("300 Calories\n20g Protein").servings===1);
  ok("בלי רמז → בסיס סך הכל",mk("300 Calories\n20g Protein").basis==="total");
  ok("שורת קלוריות בלי מאקרו אחר נדחית",mk("Bake 350 calories free").stated===null);
  
  
  console.log("\n"+"═".repeat(40));
  console.log("  עברו: "+PASS+"    נכשלו: "+FAIL);
  console.log("═".repeat(40));
  if(fails.length){console.log("\nכשלים:");fails.forEach(f=>console.log("  • "+f))}
  process.exit(FAIL?1:0);
}).catch(e=>{console.log("\nCRASH:",e.message,"\n",e.stack);process.exit(2)});
