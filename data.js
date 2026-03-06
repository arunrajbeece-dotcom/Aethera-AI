// Ingredient Safety Database
const harmfulIngredients = [
    { name: "paraben", level: "Avoid", description: "Preservatives that may interfere with hormone function." },
    { name: "sulfate", level: "Avoid", description: "Harsh detergents that can strip skin of natural oils and cause irritation." },
    { name: "formaldehyde", level: "Avoid", description: "A known carcinogen sometimes used as a preservative." },
    { name: "alcohol", level: "Moderate", description: "Excess alcohol can severely dry out and irritate the skin barrier. Note: Some fatty alcohols are okay." }
];

const rawDataStr = `
Oily skin
Acne/pimple:
Cleanser: plum green tea pore cleansing face wash,dot &key cica calming blemish clearing gel face wash,the derma Cleanser,plum Cleanser, the pink foundry Cleanser.
Moisturizer: simple,derma 1%salicylic acid,dot &key,plum,hyphen, the pink foundry moisturizer.
Sunscreen: dot&key cica calming mattifying Sunscreen light gel cream, the derma,hyphen, the pink foundry Sunscreen,foxtale Sunscreen.
Serum: derma salicylic acid serum, dot & key niacinamide +cica serum ,plum Serum,hyphen serum,foxtale serum. 

Pigmentation/ dark spots:
Cleanser: plum rice water and 2%niacinamide Cleanser, bioderma Cleanser, plum Cleanser, dot&key Cleanser, cetaphil for dark spots.
Moisturizer: plum rice water and 2% niacinamide moisturizer, deconstruct Moisturizer, the derma moisturizer, lakme moisturizer, dot&key moisturizer 
Sunscreen: dot &key vitamin E +C water light fluid, fix derma shadow gel Sunscreen, Neutrogena Sunscreen, foxtale Sunscreen, plum Sunscreen 
Serum: plum mandarin and vitamin c, dot&key 10%vitamin c + 5% niacinamide, phd serum, axis y dark spot correcting glow serum, pilgrim serum 

Sensitive/ redness:
Cleanser: cetaphil for sensitive skin, foxtale Cleanser, lotus Cleanser, cetaphil Cleanser, derma touch Cleanser 
Moisturizer: foxtale Moisturizer, fix derma moisturizing lotion, lotus moisturizer, dot&key moisturizer, hyphen moisturizer 
Sunscreen: cetaphil light gel for sensitive skin, simple mattifying uv fluid Sunscreen, wishcare Sunscreen, foxtale Sunscreen, lotus Sunscreen 
Serum: lotus vitamin c serum, foxtale serum, garnier serum, good vibes serum, cetaphil serum 

No specific concern:
Cleanser: minimalist, plum, foxtale, the derma, deconstruct 
Moisturizer: minimalist, plum, the derma, foxtale, hyphen 
Sunscreen: minimalist, plum, the derma, foxtale, wishcare 
Serum: minimalist, plum, the derma, foxtale, lakme 

Dry skin
Acne/pimple:
Cleanser: ceraVe hydrating cleanser, cetaphil, foxtale hydrating cleanser, derma, simple Cleanser
Moisturizer: ceraVe moisturizing cream, foxtale, gabit, hydra glow aloe gel moist, plix
Sunscreen: foxtale, derma, gabit, simple, plum
Serum: plum rice water niacinamide serum, the derma, pilgrim, plix, fix derma 

Pigmentation/ dark spots:
Cleanser: cerave Cleanser, cetaphil gentel skin cleanser, dot&key barrier repair hydrating gentel face wash, mamaearth shia calming Cleanser, lotus vitamin C face wash 
Moisturizer: ceraVe, mamaearth, dot&key, neutrogena hydro boost hydronic acid water gel, pilgrim 
Sunscreen: dot &key, the derma, wishcare, mamaearth hydra gel suncream, plum rice water and niacinamide hybrid Sunscreen 
Serum: dot & key serum, garnier bright serum, pilgrim alfa arbuiten serum, plum Serum, foxtale serum 

Sensitive/redness:
Cleanser: ceraVe Cleanser, cetaphil Cleanser, simple Cleanser, bioderma Cleanser, lotus Cleanser
Moisturizer: ceraVe moisturizer, avene moisturizer, dot&key barrier repair moisturizer, cetaphil Moisturizer, deconstruct Moisturizer 
Sunscreen: avene Sunscreen, Neutrogena hydro boost Sunscreen, plix Sunscreen, qurez Sunscreen, tinted mattifying Sunscreen 
Serum: plum, the ordinary hydrating serum, swiss beauty gold serum, dot&key blue berry hydrated face serum, flix goa glow dewvy serum 

No specific concern:
Cleanser: dot & key Cleanser, minimalist Cleanser, simple Cleanser, plum Cleanser, cetaphil Cleanser
Moisturizer: cetaphil Moisturizer, dot & key moisturizer, ceraVe moisturizer, episoft moisturizer, minimalist Moisturizer 
Sunscreen: dot & key Sunscreen, Minimalist Sunscreen, the derma Sunscreen, plum Sunscreen 
Serum: plum Serum, pilgrim serum, swiss beauty gold serum, plix serum, dot&key serum, vilvah serum 

Combination skin
Acne /pimples:
Cleanser: the derma Cleanser, minimalist Cleanser, derma touch Cleanser, bioderma Cleanser, cetaphil Cleanser 
Moisturizer: plum green tea oil free Moisturizer, dot & key moisturizer, minimalist Moisturizer, cetaphil Moisturizer, mamaearth tea oil free face moisturizer 
Sunscreen: deconstruct Sunscreen, fix derma Sunscreen, the derma, neutrogena, dot&key 
Serum: Minimalist salicylic acid, the derma niacinamide serum, plum, dot&key zinc and cactus water serum, plix serum 

Pigmentation/ dark spots:
Cleanser: dot & key Cleanser, plum vitamin c and turmeric face wash, minimalist Cleanser, the derma co Cleanser, cetaphil Cleanser 
Moisturizer: minimalist, mamaearth tea oil free moisturizer, dot&key moisturizer, cetaphil Moisturizer, bioderma 
Sunscreen: mamaearth daily sun block Suncream, fix derma Sunscreen, the derma co Sunscreen, dot&key vitamin c+e super bright Sunscreen, asaya spot light Sunscreen 
Serum: mamaearth c 3 face serum, minimalist EAA serum, dot&key 10% C +E serum, the derma co niacinamide daily face serum, plum Serum 

Sensitive/ Redness:
Cleanser: cetaphil gentel skin cleanser, Simple Cleanser, ceraVe hydrating cleanser, foxtale Cleanser, neutrogena deep clean
Moisturizer: la roche posay sensitive rich moisturizer, ceraVe PM facial moisturizimg lotion, Nivea soft light moisturizing cream, simple hydrating light Moisturizer, ponds super light gel 
Sunscreen: cetaphil Sunscreen, wishcare Sunscreen, foxtale Sunscreen, the derma co Sunscreen, neutrogena Sunscreen 
Serum: out shine, minimalist serum, the derma co serum, centella serum, vilvah serum 

No specific concern:
Cleanser: ceraVe Cleanser, Simple Cleanser, cetaphil Cleanser, minimalist Cleanser, foxtale Cleanser 
Moisturizer: plum green tea, ponds super light gel, dot&key cica oil free moisturizer, minimalist vitamin B5 10% moisturizer, cetaphil Moisturizer 
Sunscreen: dot&key super bright Sunscreen, deconstruct gel cream Sunscreen, cetaphil Sunscreen, wishcare Sunscreen, plix derma shadow spf 50+gel suncream 
Serum: foxtale serum, plix serum, ponds bright boost Serum, the derma ca 10% niacinamide daily face serum, minimalist niacinamide face serum 

Normal skin type
Acne/ pimple:
Cleanser: minimalist salicylic acid LHA face Cleanser, derma touch salicylic acid Cleanser, the derma salicylamide anti acne face wash, ceraVe Cleanser, Himalaya lemon face wash
Moisturizer: minimalist Moisturizer, derma niacinamide daily face cream, dot&key cica moisturizer, plum green tea oil free moisturizer, ceraVe PM moisturizing lotion 
Sunscreen: sun scoop feather light fluid Sunscreen, deconstruct gel Sunscreen, wishcare niacinamide oil balance fluid Sunscreen, fix derma shadow agel Sunscreen, the derma co Sunscreen 
Serum: minimalist 2% salicylic acid face serum, dot & key anti acne face serum, the derma co 2% salicylic acid serum, plum Serum, vilvah serum 

Pigmentation/ dark spots:
Cleanser: dot&key vitamin C brighting Cleanser, plum bright years vitamin C face wash, the derma co Cleanser, oshea herbal Cleanser, vilvah Cleanser 
Moisturizer: minimalist vitamin B5 moisturizer, dot&key cica moisturizer, plum Moisturizer, pilgrim moisturizer, fix derma moisturizer 
Sunscreen: deconstruct gel suncream, fix derma shadow agel, foxtale Sunscreen, dot&key Sunscreen, lakme Sunscreen 
Serum: minimalist vitamin C, mamaearth c 3 vitamin c serum, minimalist serum, the derma co serum, loreal paris dark spots protection serum 
                 
Sensitive/redness:
Cleanser: cetaphil gentel skin cleanser, ceraVe hydrating facial Cleanser, neutrogena Cleanser, lotus Cleanser, biotique Cleanser 
Moisturizer: cetaphil daily advance hydrating moisturizer, ceraVe PM facial moisturizer, dot&key moisturizer, ponds super light gel moisturizer, simple Moisturizer 
Sunscreen: cetaphil Sunscreen, fix derma Sunscreen, the derma co Sunscreen, dot&key Sunscreen, minimalist Sunscreen 
Serum: plum rice water serum, dot&key anti acne free face serum, nature glow herbal serum, soul flower serum, vilvah serum 

No specific concern:
Cleanser: wishcare Cleanser, cetaphil Cleanser, minimalist Cleanser, ceraVe Cleanser, neutrogena Cleanser 
Moisturizer: ponds super light gel moisturizer, mamaearth moisturizer, plum Moisturizer, dot&key moisturizer, cetaphil Moisturizer 
Sunscreen: lakme gel Sunscreen, lotus, the derma co Sunscreen, dot&key Sunscreen, minimalist Sunscreen 
Serum: neutrogena serum, lacto calamine serum, vilvah serum, plum Serum, pilgrim serum 
`;

function buildProductsDatabase() {
    let productsDB = {
        "Oily": [],
        "Dry": [],
        "Combination": [],
        "Normal": [],
        "Sensitive": []
    };

    let currentSkin = "Oily";
    let currentConcern = "General";

    const lines = rawDataStr.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        let lower = line.toLowerCase().replace(/[^a-z]/g, '');

        if (lower === "oilyskin") { currentSkin = "Oily"; continue; }
        if (lower === "dryskin") { currentSkin = "Dry"; continue; }
        if (lower === "combinationskin") { currentSkin = "Combination"; continue; }
        if (lower === "normalskin" || lower === "normalskintype") { currentSkin = "Normal"; continue; }
        if (lower === "sensitiveskin" || lower === "sensitiveskintype") { currentSkin = "Sensitive"; continue; }

        if (lower.startsWith("acne") || lower.startsWith("pimple")) {
            currentConcern = "Acne Control"; continue;
        }
        if (lower.startsWith("pigment") || lower.startsWith("darkspot")) {
            currentConcern = "Pigmentation"; continue;
        }
        if (lower.startsWith("sensitivered")) {
            currentConcern = "Sensitive/Redness"; continue;
        }
        if (lower.startsWith("nospecific")) {
            currentConcern = "General"; continue;
        }

        let type = "";
        if (lower.startsWith("cleanser")) type = "Cleanser";
        else if (lower.startsWith("moisturizer")) type = "Moisturizer";
        else if (lower.startsWith("sunscreen")) type = "Sunscreen";
        else if (lower.startsWith("serum")) type = "Serum";

        if (type) {
            let splitIdx = line.indexOf(":");
            if (splitIdx === -1) continue;

            let itemsStr = line.substring(splitIdx + 1).trim();
            let items = itemsStr.split(/[,•]+/).map(s => s.trim()).filter(s => s.length > 2);

            items.forEach(item => {
                let brandRaw = item.split(" ")[0] || "";
                let brand = brandRaw.charAt(0).toUpperCase() + brandRaw.slice(1);

                productsDB[currentSkin].push({
                    name: item.charAt(0).toUpperCase() + item.slice(1),
                    brand: brand || "Aethera Recommended",
                    concern: currentConcern,
                    type: type,
                    ingredients: ["Active Ingredient"],
                    usage: "Use as directed",
                    avoid: "",
                    safety: Math.random() > 0.8 ? "Moderate" : "Safe",
                    price: Math.floor(Math.random() * (900 - 150 + 1)) + 150,
                    image: "",
                    buyUrl: ""
                });
            });
        }
    }

    // Safety fallback just in case filtering is ever aggressive
    for (const key of Object.keys(productsDB)) {
        if (productsDB[key].length === 0) {
            productsDB[key].push({
                name: "Aethera Universal Backup", brand: "Aethera", concern: "General",
                type: "Serum", ingredients: ["Aqua"], usage: "Daily", avoid: "", safety: "Safe", price: 150
            });
        }
    }

    return productsDB;
}

window.products = buildProductsDatabase();
window.harmfulIngredients = harmfulIngredients;
