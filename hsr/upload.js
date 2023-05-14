const CLIENT_ID = 'eeb9050c7d377e7';

const form = document.getElementById('upload-form');
const imageInput = document.getElementById('image-input');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('image', imageInput.files[0]);

  const response = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: {
      Authorization: `Client-ID ${CLIENT_ID}`
    },
    body: formData
  });

  const data = await response.json();

  if (data.success) {
    const imageUrl = data.data.link;
    // Display the uploaded image on the page
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    document.body.appendChild(imageElement);
  } else {
    console.error('Failed to upload image:', data.status);
  }
});
