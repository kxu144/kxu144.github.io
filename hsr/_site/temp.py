import json
import os
import requests

json_dir = "./data/relics"
relic_dir = "./lib/relic/art"

def getIMG(id):
    url = "https://starrailstation.com/assets/" + id + ".webp"
    response = requests.get(url)
    if response.status_code != 200:
        print("Error IMG", response.status_code)
        return
    
    with open(relic_dir + "/" + id + ".webp", "wb") as file:
        file.write(response.content)

def main():
    # delete files in lib folders
    for filename in os.listdir(relic_dir):
        file_path = os.path.join(relic_dir, filename)
        
        # Check if the file is a regular file (not a directory)
        if os.path.isfile(file_path):
            try:
                os.remove(file_path)  # Delete the file
                print(f"Deleted file: {file_path}")
            except OSError as e:
                print(f"Error deleting file: {file_path} - {e}")
                return

    for filename in os.listdir(json_dir):
        with open(os.path.join(json_dir, filename), "r") as json_file:
            data = json.load(json_file)
            for piece in data["pieces"]:
                getIMG(data["pieces"][piece]["iconPath"])

main()