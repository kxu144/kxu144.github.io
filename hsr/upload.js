const worker = await Tesseract.createWorker({
  corePath: 'node_modules/tesseract.js-core',
  workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/worker.min.js",
  logger: function(m){console.log(m);}
});

await worker.loadLanguage('eng');
await worker.initialize('eng');

const getImageSize = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

const recognize = async function(evt){
  const files = evt.target.files;

  if (!files[0]) return;

  const imageSize = await getImageSize(files[0]);
  console.log('Image Size:', imageSize);

  const ret = await worker.recognize(files[0]);
  console.log(ret.data.text);

  const ret_alt = await worker.recognize(files[0], {
      rectangle: { top: imageSize.height / 5, left: 0, width: imageSize.width / 2, height: 2 * imageSize.height / 5 },
  });
  console.log(ret_alt.data.text);

  const relic = parse(ret.data.text, ret_alt.data.text);

  // display relic on popup
  document.getElementById("popup-relic").textContent = JSON.stringify(relic);

  // relic preview
  const preview = renderRelic(relic);
  preview.id = "relic-preview";
  preview.style.width = "30%";
  document.getElementById("popup-content").appendChild(preview);

  var relics = JSON.parse(localStorage.getItem("user-relics") || "[]");
  if (relics.some(r => compareRelics(relic, r))) {
      document.getElementById("popup-errno").textContent = "Relic already present in database";
      console.log("Relic already present in database");
  } else {
      // relics.push(relic);
      // localStorage.setItem("user-relics", JSON.stringify(relics));
      // renderList(relics, "relic-list");
  }
  sessionStorage.setItem("new-relic", JSON.stringify(relic));
  document.getElementById("upload-button").disabled = false;
  
  elm.value = '';
}
const elm = document.getElementById('uploader');
elm.addEventListener('change', recognize);