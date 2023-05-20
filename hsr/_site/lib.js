function compareRelics(relic1, relic2) {
    if (!relic1 || !relic2) {
        return !relic1 && !relic2;
    }
    const sub1 = relic1.substats;
    const sub2 = relic2.substats;
    if ((!sub1 && sub2) || (sub1 && !sub2)) {
        return false;
    }
    if (sub1 && sub2) {
        const key1 = Object.keys(sub1);
        const key2 = Object.keys(sub2);
        if (key1.length != key2.length) {
            return false;
        }
        for (let key of key1) {
            if (!key2.includes(key) || sub1[key] !== sub2[key]) {
                return false;
            }
        }
    }
    if (relic1.setKey !== relic2.setKey || relic1.slotKey !== relic2.slotKey || relic1.level !== relic2.level || relic1.rarity !== relic2.rarity || relic1.mainStatKey !== relic2.mainStatKey) {
        return false;
    }
    return true;
}

function renderRelics() {
    var grid = document.getElementById("relic-list");
    grid.innerHTML = '';
    const relics = JSON.parse(localStorage.getItem("user-relics") || "[]");
    relics.forEach((relic) => {
        var gridItem = document.createElement("div");
        gridItem.className = "grid-item";

        // set
        var setp = document.createElement("div");
        setp.className = "p-setkey";
        setp.innerText = toNormalCase(relic.setKey);
        gridItem.appendChild(setp);

        // slot
        var slotp = document.createElement("div");
        slotp.className = "p-slotkey";
        slotp.innerText = toTitleCase(relic.slotKey);
        gridItem.appendChild(slotp);

        // level
        var levelp = document.createElement("div");
        levelp.className = "p-level";
        levelp.innerText = "+" + relic.level;
        gridItem.appendChild(levelp);

        // substats
        for (const [stat, value] of Object.entries(relic.substats)) {
            var statp = document.createElement("div");
            if (stat == relic.mainStatKey) {
                statp.className = "p-mainstat";
            } else {
                statp.className = "p-substat";
            }
            statp.innerText = stat + "\t" + value;
            gridItem.appendChild(statp);
        }

        grid.appendChild(gridItem);
    });

    //document.getElementById("relic-list").innerHTML = grid.innerHTML;
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
function toNormalCase(str) {
    return str.replace(/([A-Z])/g, " $1");
}

// API
relic_sets = [
    'band of sizzling thunder',
    'belobog of the architects',
    'celestial differentiator',
    'champion of streetwise boxing',
    'eagle of twilight line',
    'firesmith of lavaforging',
    'fleet of the ageless',
    'genius of the brilliant stars',
    'guard of wuthering snow',
    'hunter of glacial forest',
    'inert salsotto',
    'knight of purity palace',
    'musketeer of wild wheat',
    'pangalactic commercial enterprise',
    'passerby of wandering cloud',
    'space sealing station',
    'sprightly vonwacq',
    'talia kingdom of banditry',
    'thief of shooting meteor',
    'wastelander of banditry desert',
];
relic_types = [
    'head',
    'hands',
    'body',
    'feet',
    'planar sphere',
    'link rope',
];
stats = [
    'hp',
    'atk',
    'def',
    'critRate',
    'critDMG',
    'outgoing_healing_boost',
    'effect_hit_rate',
    'effect_res',
    'break_effect',
    'spd',
];

function parse(str, str_alt) {
    var text = str.toLowerCase()
            .replaceAll("crit rate", "critRate")
            .replaceAll('crit dmg', 'critDMG')
            .replaceAll('outgoing healing boost', 'outgoing_healing_boost')
            .replaceAll('effect hit rate', 'effect_hit_rate')
            .replaceAll('effect res', 'effect_res')
            .replaceAll('break effect', 'break_effect');
    var text_alt = str_alt.toLowerCase();
    var relic = {
        "setKey": "",
        "slotKey": "",
        "level": 15,
        "rarity": 5,
        "mainStatKey": "",
        "location": "",
        "lock": false,
        "substats": {},
    };

    // set
    for (const set of relic_sets) {
        if (text.includes(set)) {
            relic["setKey"] = toTitleCase(set).replaceAll(" ", "");
            break;
        }
    }

    // slot
    for (const type of relic_types) {
        if (text_alt.includes(type)) {
            relic["slotKey"] = type;
            break;
        }
    }

    // level
    var level = text_alt.match("[+]([0-9]+)");
    if (level) {
        relic["level"] = parseInt(level[1]);
    }

    // mainstat
    var pos = text.length;
    for (const stat of stats) {
        let m = text.search(stat + " *[0-9]+.?[0-9]*%");
        if (m >= 0 && m < pos) {
            relic["mainStatKey"] = stat + '_';
            pos = m;
        }
        m = text.search(stat + " *[0-9]+\\s");
        if (m >= 0 && m < pos) {
            relic["mainStatKey"] = stat;
            pos = m;
        }
    }
    for (const stat of stats) {
        let m = text.match(stat + " *([0-9]+.?[0-9]*)%");
        if (m) {
            relic["substats"][stat + '_'] = parseFloat(m[1]);
        }
        m = text.match(stat + " *([0-9]+)\\s");
        if (m) {
            relic["substats"][stat] = parseInt(m[1]);
        }
    }

    return relic;
}
  