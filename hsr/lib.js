function compareRelics(relic1, relic2) {
    console.log("Relic1: " + relic1);
    console.log("Relic2: " + relic2);
    if (!relic1 || !relic2) {
        console.log("At least 1 relic is null");
        return !relic1 && !relic2;
    }
    const sub1 = relic1.substats;
    const sub2 = relic2.substats;
    if ((!sub1 && sub2) || (sub1 && !sub2)) {
        console.log("1 relic has null subs");
        return false;
    }
    if (sub1 && sub2) {
        console.log("Both have subs");
        const key1 = Object.keys(sub1);
        const key2 = Object.keys(sub2);
        if (key1.length != key2.length) {
            console.log("Differet number of subs");
            return false;
        }
        for (let key of key1) {
            if (!key2.includes(key) || sub1[key] !== sub2[key]) {
                console.log("Different keys/values");
                return false;
            }
        }
    }
    if (relic1.setKey !== relic2.setKey || relic1.slotKey !== relic2.slotKey || relic1.level !== relic2.level || relic1.rarity !== relic2.rarity || relic1.mainStatKey !== relic2.mainStatKey) {
        console.log("Different metadata");
        return false;
    }
    console.log("Same relics");
    return true;
}