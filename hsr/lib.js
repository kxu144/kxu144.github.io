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

function renderList(list, container) {
    let listContainer = document.getElementById(container);
    listContainer.innerHTML = ''; // Clear the existing list items

    list.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.textContent = JSON.stringify(item);
        listContainer.appendChild(listItem);
    });
}