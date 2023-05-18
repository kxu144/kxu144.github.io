// get relic database
var relics = JSON.parse(localStorage.getItem("user_relics") || "[]");
renderList(relics, "relic-list"); 

$(document).ready(function() {
    // Handle the form submission
    $("#upload-form").submit(function(event) {
      event.preventDefault();

      // Get the selected image file
      var file = $("#image-input")[0].files[0];
      
      Tesseract.recognize(
        'https://tesseract.projectnaptha.com/img/eng_bw.png',
        'eng',
        { logger: m => console.log(m) }
      ).then(({ data: { text } }) => {
        console.log(text);
      })
    });
});
  