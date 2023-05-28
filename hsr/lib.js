// true if relic1 & relic2 are equal (statwise)
// does not check lock, location
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

// display the relic database
function renderRelics() {
    var grid = document.getElementById("relic-list");
    grid.innerHTML = '';
    const relics = JSON.parse(localStorage.getItem("user-relics") || "[]");
    if (relics.length > 0) document.getElementById("no-relic-p").style.display = "none";
    else document.getElementById("no-relic-p").style.display = "block";
    relics.forEach((relic, idx) => {
        var gridItem = renderRelic(relic);

        // assign id
        gridItem.setAttribute("data-id", idx.toString());

        // edit button
        var editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.style.top = "2%";
        editButton.style.right = "2%";
        let editMode = false;
        editButton.onclick = function() {
            editMode = !editMode;
            if (editMode) {
                editRelic(gridItem);
                editButton.textContent = "Save";
            } else {
                dispRelic(gridItem);

                // update database
                var relics = JSON.parse(localStorage.getItem("user-relics") || "[]");
                relics[parseInt(gridItem.getAttribute("data-id"))] = nodeToRelic(gridItem);
                localStorage.setItem("user-relics", JSON.stringify(relics));
                renderRelics();

                editButton.textContent = "Edit";
            }
        };
        gridItem.appendChild(editButton);

        grid.appendChild(gridItem);
    });
}

// convert string to Pascal case
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
// insert space before every capital letter
function toNormalCase(str) {
    return str.replace(/([A-Z])/g, " $1");
}

// convert arti to displayable format (like how it looks ingame)
function artiToDisplay(arti) {
    if (arti == 'hp' || arti == 'atk' || arti == 'def' || arti == 'spd') {
        return arti.toUpperCase();
    }
    if (arti == 'critRate') {
        return 'CRIT Rate';
    }
    if (arti == 'critDMG') {
        return 'CRIT DMG';
    }
    return toTitleCase(arti.replaceAll("_", " "));
}

// render a particular relic, returns a <div> tag with class grid-item
function renderRelic(relic) {
    var gridItem = document.createElement("div");
    gridItem.className = "grid-item";

    // blank image
    var bg = document.createElement("img");
    bg.src = "lib/arti_blank.png";
    gridItem.appendChild(bg);

    // set
    var setp = document.createElement("p");
    setp.style.color = "#f1a23c";
    setp.style.top = "2%";
    setp.innerText = toNormalCase(relic.setKey);
    gridItem.appendChild(setp);

    // slot
    var slotp = document.createElement("p");
    slotp.style.color = "#bbbbbb";
    slotp.style.top = "30%";
    slotp.innerText = toTitleCase(relic.slotKey);
    gridItem.appendChild(slotp);

    // level
    var levelp = document.createElement("p");
    levelp.style.top = "36%";
    levelp.innerText = "+" + relic.level;
    gridItem.appendChild(levelp);

    // substats
    var ofs = 0;
    for (const [stat, value] of Object.entries(relic.substats)) {
        var statp = document.createElement("p");
        var valuep = document.createElement("p");
        valuep.style.left = "auto";
        valuep.style.right = "2%";
        valuep.style.textAlign = "right";
        
        if (stat.slice(-1) == '_') {
            statp.innerText = artiToDisplay(stat.substring(0, stat.length - 1));
            valuep.innerText = value + "%";
        } else {
            statp.innerHTML = artiToDisplay(stat);
            valuep.innerText = value;
        }
        if (stat == relic.mainStatKey) {
            statp.style.top = "54%";
            valuep.style.top = "54%";
            gridItem.insertBefore(valuep, levelp.nextSibling);
            gridItem.insertBefore(statp, levelp.nextSibling);
        } else {
            statp.style.top = 62 + 8 * ofs + "%";
            valuep.style.top = 62 + 8 * ofs + "%";
            ofs += 1;
            gridItem.appendChild(statp);
            gridItem.appendChild(valuep);
        }
    }

    return gridItem;
}

// opposite of renderRelic
function nodeToRelic(relic_node) {
    var stats = relic_node.querySelectorAll("p");
    if (stats.length < 5 || stats.length % 2 == 0) {
        return null;
    }

    stats[3].textContent = stats[3].textContent.toLowerCase()
    var relic = {
        "setKey": toTitleCase(stats[0].textContent).replaceAll(" ", ""),
        "slotKey": stats[1].textContent.toLowerCase(),
        "level": parseInt(stats[2].textContent),
        "rarity": 5,
        "mainStatKey": statGOOD(stats[3].textContent) + (stats[4].textContent[stats[4].textContent.length - 1] == '%' ? '_' : ''),
        "location": "",
        "lock": false,
        "substats": {},
    };
    for (let i = 3; i < stats.length; i+=2) {
        let stat = statGOOD(stats[i].textContent);
        let value = stats[i+1].textContent;
        if (value[value.length - 1] == '%') {
            relic.substats[stat + '_'] = parseFloat(value.slice(0, value.length - 1));
        } else {
            relic.substats[stat] = parseFloat(value);
        }
    }
    return relic;
}

// set relic_node (DOM element) 
function editRelic(relic_node) {
    const stats = relic_node.querySelectorAll("p");
    stats.forEach((stat) => {
        function resizeInput() {
            this.setAttribute("size", this.value.length + 1);
        }
        const inp = document.createElement("input");
        inp.type = "text";
        inp.value = stat.textContent;
        inp.style.color = stat.style.color;
        inp.style.top = (parseFloat(stat.style.top) + 4) + "%";
        if (stat.style.right) {
            inp.style.left = "auto";
            inp.style.right = stat.style.right;
        }
        inp.style.textAlign = stat.style.textAlign;
        inp.style.backgroundColor = "transparent";
        resizeInput.call(inp);
        inp.addEventListener("input", resizeInput);
        relic_node.replaceChild(inp, stat);
    });
}

function dispRelic(relic_node) {
    const stats = relic_node.querySelectorAll("input");
    stats.forEach((inp) => {
        const p = document.createElement("p");
        p.innerText = inp.value;
        p.style.color = inp.style.color;
        p.style.top = (parseFloat(inp.style.top) - 4) + "%";
        if (inp.style.right) {
            p.style.left = "auto";
            p.style.right = inp.style.right;
        }
        p.style.textAlign = inp.style.textAlign;
        relic_node.replaceChild(p, inp);
    });
}

function statGOOD(str) {
    return str.toLowerCase()
        .replaceAll("crit rate", "critRate")
        .replaceAll('crit dmg', 'critDMG')
        .replaceAll('outgoing healing boost', 'outgoing_healing_boost')
        .replaceAll('effect hit rate', 'effect_hit_rate')
        .replaceAll('effect res', 'effect_res')
        .replaceAll('break effect', 'break_effect');
}

function parse(str, str_alt) {
    var text = statGOOD(str);
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
  
function resetPopup() {
    document.getElementById("popup-errno").textContent = "";
    const preview = document.getElementById("relic-preview-container");
    if (preview) {
      document.getElementById("popup-content").removeChild(preview);
    }
    document.getElementById("upload-button").disabled = true;
}