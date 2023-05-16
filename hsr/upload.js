$(document).ready(function() {
    // Get your Imgur client ID
    var clientId = "eeb9050c7d377e7";

    // Get and display the relics stored locally
    let relics = JSON.parse(localStorage.getItem("user_relics") || "[]");
    renderList(relics, "relic-list");  
  
    // Handle the form submission
    $("#upload-form").submit(function(event) {
      event.preventDefault();
  
      // Get the selected image file
      var file = $("#image-input")[0].files[0];
  
      // Create a new FormData object and append the file to it
      var formData = new FormData();
      formData.append("image", file);
      
      // Disable the form submit button
      $("#upload-form input[type=submit]").prop("disabled", true);
  
      // Send the upload request to the Imgur API
      $.ajax({
        url: "https://api.imgur.com/3/image",
        type: "POST",
        headers: {
          Authorization: "Client-ID " + clientId
        },
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(response) {
          // Get the URL of the uploaded image
          var imageUrl = response.data.link;

          // Send the image URL to your Python script
          $.ajax({
            url: "https://kxu144.pythonanywhere.com/parse",
            type: 'POST',
            data: JSON.stringify({ imageUrl: imageUrl }),
            contentType: 'application/json',
            success: function(response_flask) {
                console.log(response_flask);

                // Enable the form submit button
                $("#upload-form input[type=submit]").prop("disabled", false);
                
                // Add to existing database
                const new_relic = response_flask;
                if (relics.some(relic => compareRelics(relic, new_relic))) {
                    alert("Relic already present in database");
                } else {
                    console.log("Adding relic to database");
                    relics.push(new_relic);
                    localStorage.setItem("user_relics", JSON.stringify(relics));
                    renderList(relics, "relic-list");
                }
            },
            error: function(xhr) {
                console.log('Error: ' + xhr.responseText);
            }
        });
  
          // Display the uploaded image
          $("#image-container").html("<img src='" + imageUrl + "' />");
        },
        error: function(xhr) {
          // Enable the form submit button
          $("#upload-form input[type=submit]").prop("disabled", false);

          // Handle upload errors
          alert("Upload failed: " + xhr.responseText);
        }
      });
    });
  });
  