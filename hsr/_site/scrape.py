import os
import json
import requests
from bs4 import BeautifulSoup

json_dir = "./data/characters"
art_dir = "./lib/art"

def getIMG(name, id):
    response = requests.get("https://starrailstation.com/en/character/" + name)  # Replace with the desired website URL
    if response.status_code != 200:
        print("Error", response.status_code)
        return
    
    soup = BeautifulSoup(response.content, "html.parser")
    tag = soup.find("img", class_="mobile-only-elem a4f9a")
    if not tag:
        print("Error could not find image tag")
        return
    
    src = tag["src"]
    url = "https://starrailstation.com" + src
    response = requests.get(url)
    if response.status_code != 200:
        print("Error IMG", response.status_code)
    
    with open(art_dir + "/" + id + ".webp", "wb") as file:
        file.write(response.content)

def main():
    # delete files in lib folders
    for filename in os.listdir(art_dir):
        file_path = os.path.join(art_dir, filename)
        
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
            id = data["artPath"]

        getIMG(os.path.splitext(filename)[0], id)

main()