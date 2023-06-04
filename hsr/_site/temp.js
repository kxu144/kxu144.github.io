const fs = require('fs');
const path = require('path');

const directoryPath = 'data/relics'; // Replace with your directory path

const jsonData = {};

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    console.log('Error reading directory:', err);
    return;
  }

  files.forEach(function (file) {
    if (path.extname(file) === '.json') {
      const filePath = path.join(directoryPath, file);
      const fileData = fs.readFileSync(filePath, 'utf-8');

      try {
        const jsonObject = JSON.parse(fileData);
        const name = jsonObject.name;

        if (name) {
          jsonData[name] = file;
        }
      } catch (error) {
        console.log('Error parsing JSON file:', file, error);
      }
    }
  });

  console.log(jsonData);
});
