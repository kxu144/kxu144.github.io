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

var openImage = function(file) {
  var input = file.target;
  var reader = new FileReader();
  reader.onload = function(){
    var dataURL = reader.result;
    var output = document.getElementById('output');
    output.src = dataURL;

    Tesseract.recognize(
      dataURL,
      'eng',
      { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
      text = text.replaceAll("[^a-zA-Z0-9 .+%\n]", "").toLowerCase()
        .replaceAll("crit rate", "critRate")
        .replaceAll('crit dmg', 'critDMG')
        .replaceAll('outgoing healing boost', 'outgoing_healing_boost')
        .replaceAll('effect hit rate', 'effect_hit_rate')
        .replaceAll('effect res', 'effect_res')
        .replaceAll('break effect', 'break_effect');
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
      for (const set of relic_sets) {
        if (text.includes(set)) {
          relic["setKey"] = toTitleCase(set).replaceAll(" ", "");
          break;
        }
      }
      for (const stat of stats) {
        let m = text.match(stat + " *([0-9]+.?[0-9]*)%");
        if (m && relic["mainStatKey"] != stat + '_') {
          relic["substats"][stat + '_'] = parseFloat(m[1]);
        }
        m = text.match(stat + " *([0-9]+)\s");
        if (m && relic["mainStatKey"] != stat) {
          relic["substats"][stat] = parseInt(m[1]);
        }
      }

      relics.push(relic);
      localStorage.setItem("user_relics", JSON.stringify(relics));
      renderList(relics, "relic-list");
    })
  };
  reader.readAsDataURL(input.files[0]);
};

// $(document).ready(function() {
//     // Handle the form submission
//     $("#upload-form").submit(function(event) {
//       event.preventDefault();

//       // Get the selected image file
//       var file = $("#image-input")[0].files[0];
//       if (!file) return;

//       console.log("Path: " + file.path);
      
      
//     });
// });
  