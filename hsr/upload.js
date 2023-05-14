$(document).ready(function() {
    // Get your Imgur client ID
    var clientId = "eeb9050c7d377e7";
  
    // Handle the form submission
    $("#upload-form").submit(function(event) {
      event.preventDefault();
  
      // Get the selected image file
      var file = $("#image-input")[0].files[0];
  
      // Create a new FormData object and append the file to it
      var formData = new FormData();
      formData.append("image", file);
  
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
  
          // Display the uploaded image
          $("#image-container").html("<img src='" + imageUrl + "' />");
        },
        error: function(xhr) {
          // Handle upload errors
          alert("Upload failed: " + xhr.responseText);
        }
      });
    });
  });
  