var rawDataStr = `
Oily skin
Acne/pimple:
Cleanser: plum green tea pore cleansing face wash,dot &key cica calming blemish clearing gel face wash,the derma Cleanser,plum Cleanser, the pink foundry Cleanser.
Moisturizer: simple,derma 1%salicylic acid,dot &key,plum,hyphen, the pink foundry moisturizer.
`;

function buildProductsDatabase() {
    var productsDB = {
        "Oily": [],
        "Dry": [],
        "Combination": [],
        "Normal": [],
        "Sensitive": []
    };

    var currentSkin = "";
    var currentConcern = "";

    var lines = rawDataStr.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        line = line.replace(/^\s+|\s+$/g, '');
        if (!line) continue;

        var lowerLine = line.toLowerCase().replace(/[^a-z0-9 ]/g, '');

        if (lowerLine.indexOf("oily skin") !== -1) { currentSkin = "Oily"; continue; }
        if (lowerLine.indexOf("dry skin") !== -1) { currentSkin = "Dry"; continue; }
        if (lowerLine.indexOf("combination skin") !== -1) { currentSkin = "Combination"; continue; }
        if (lowerLine.indexOf("normal skin") !== -1) { currentSkin = "Normal"; continue; }
        if (lowerLine.indexOf("sensitive skin") !== -1) { currentSkin = "Sensitive"; continue; }

        if (lowerLine.indexOf("acne pimp") !== -1 || lowerLine.indexOf("acnepimple") !== -1 || lowerLine.indexOf("acne") !== -1) {
            currentConcern = "Acne Control"; continue;
        }
        if (lowerLine.indexOf("pigmentation") !== -1 || lowerLine.indexOf("dark spot") !== -1) {
            currentConcern = "Pigmentation"; continue;
        }
        if (lowerLine.indexOf("sensitive red") !== -1 || lowerLine.indexOf("sensitiveredness") !== -1) {
            currentConcern = "Sensitive/Redness"; continue;
        }
        if (lowerLine.indexOf("no specific concern") !== -1 || lowerLine.indexOf("general") !== -1) {
            currentConcern = "General"; continue;
        }

        if (line.indexOf(":") !== -1) {
            var parts = line.split(":");
            var type = parts[0].replace(/^\s+|\s+$/g, '');
            // ensure valid type
            if (type !== "Cleanser" && type !== "Moisturizer" && type !== "Sunscreen" && type !== "Serum") continue;

            var itemsStr = parts[1].replace(/^\s+|\s+$/g, '');
            var itemsRaw = itemsStr.split(/[,•]+/);
            var items = [];
            for (var j = 0; j < itemsRaw.length; j++) {
                var s = itemsRaw[j].replace(/^\s+|\s+$/g, '');
                if (s.length > 2) items.push(s);
            }

            for (var j = 0; j < items.length; j++) {
                var item = items[j];
                var brandRaw = item.split(" ")[0] || "";
                var brand = brandRaw.charAt(0).toUpperCase() + brandRaw.slice(1);

                if (currentSkin && productsDB[currentSkin]) {
                    productsDB[currentSkin].push({
                        name: item.charAt(0).toUpperCase() + item.slice(1),
                        brand: brand || "Aethera Recommended",
                        concern: currentConcern,
                        type: type
                    });
                }
            }
        }
    }
    return productsDB;
}

WScript.Echo(buildProductsDatabase()["Oily"].length);
