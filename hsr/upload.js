// get relic database
var relics = JSON.parse(localStorage.getItem("user_relics") || "[]");
renderList(relics, "relic-list"); 

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

$(document).ready(function() {
    // Handle the form submission
    $("#upload-form").submit(function(event) {
      event.preventDefault();

      // Get the selected image file
      var file = $("#image-input")[0].files[0];
      
      Tesseract.recognize(
        file.path,
        'eng',
        { logger: m => console.log(m) }
      ).then(({ data: { text } }) => {
        text = text.replace("[^a-zA-Z0-9 .+%\n]", "").toLowerCase()
          .replace("crit rate", "critRate")
          .replace('crit dmg', 'critDMG')
          .replace('outgoing healing boost', 'outgoing_healing_boost')
          .replace('effect hit rate', 'effect_hit_rate')
          .replace('effect res', 'effect_res')
          .replace('break effect', 'break_effect');
        console.log(text);

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
        for (const set in relic_sets) {
          if (text.includes(set)) {
            relic["setKey"] = toTitleCase(set).replace(" ", "");
            break;
          }
        }
        relics.push(relic);
        localStorage.setItem("user_relics", relics);
        renderList(relics, "relic-list");
      })
    });
});
  