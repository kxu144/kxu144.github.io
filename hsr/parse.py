from flask import Flask, request
import requests
import numpy as np
import cv2 as cv
import pytesseract as pyt
import json, re

app = Flask(__name__)

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
]
relic_types = [
    'head',
    'hands',
    'body',
    'feet',
    'planar sphere',
    'link rope',
]
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
]

@app.route('/parse', methods=['POST'])
def parse():
  print(request.form)
  url = request.json['imageUrl']
  response = requests.get(url)
  print("RESPONSE CODE", response.status_code)
  if response.status_code == 200:
    print("RESPONSE CONTENT", response.content)
    arr = np.frombuffer(response.content, dtype=np.uint8)
    img = cv.imdecode(arr, cv.IMREAD_COLOR)[...,::-1]

    # masks to preprocess image
    mask_mainstat = cv.inRange(img, np.asarray([241, 162, 60]), np.asarray([255, 200, 112]))
    mask_gray = cv.inRange(img, np.asarray([200, 200, 200]), np.asarray([230, 230, 230]))
    mask_white = cv.inRange(img, np.asarray([250, 250, 250]), np.asarray([255, 255, 255]))
    config = '--psm 6'
    parse_str = pyt.image_to_string(mask_mainstat + mask_gray + mask_white, config=config)

    # preprocess string
    parse_str = re.sub('[^a-z0-9 .+%\n]', '', parse_str.lower())
    parse_str = parse_str.replace('crit rate', 'critRate') \
        .replace('crit dmg', 'critDMG') \
        .replace('outgoing healing boost', 'outgoing_healing_boost') \
        .replace('effect hit rate', 'effect_hit_rate') \
        .replace('effect res', 'effect_res') \
        .replace('break effect', 'break_effect')
    
    # init relic
    relic = {}
    err = ""
    
    # get relic set
    relic['setKey'] = ''
    for s in relic_sets:
        if re.search(s, parse_str):
            relic['setKey'] = s.title().replace(' ', '')
            break
    if not relic['setKey']:
        err += "Error: could not determine relic set\n"

    # get relic type
    relic['slotKey'] = ''
    for s in relic_types:
        if re.search(s, parse_str):
            relic['slotKey'] = s
            break
    if not relic['slotKey']:
        err += "Error: could not determine relic type\n"  
    
    # get level
    relic['level'] = 0
    match_level = re.search('\+([0-9]+)', parse_str)
    if not match_level or not match_level.group(1).isdigit():
        err += "Error: could not determine level\n"
    else:
        relic['level'] = int(match_level.group(1))

    # get rarity
    relic['rarity'] = 5
    
    # get main stat
    relic['mainStatKey'] = ''
    pos_mainstat = float('inf')
    for s in stats:
        match_percent = re.search(s + ' *[0-9]+.?[0-9]*%', parse_str)
        if match_percent and match_percent.span()[0] < pos_mainstat:
            relic['mainStatKey'] = s + '_'
            pos_mainstat = match_percent.span()[0]
        match_mainstat = re.search(s + ' *[0-9]+\s', parse_str)
        if match_mainstat and match_mainstat.span()[0] < pos_mainstat:
            relic['mainStatKey'] = s
            pos_mainstat = match_mainstat.span()[0]
    if not relic['mainStatKey']:
        err += "Error: could not determine main stat\n"
        
    # get location
    relic['location'] = ''
    
    # get lock
    relic['lock'] = False
    
    # get substats
    relic['substats'] = {}
    for s in stats:
        match_percent = re.search(s + ' *([0-9]+.?[0-9]*)%', parse_str)
        if match_percent and relic['mainStatKey'] != s + '_':
            relic['substats'][s + '_'] = float(match_percent.group(1))
        match_stat = re.search(s + " *([0-9]+)\s", parse_str)
        if match_stat and relic['mainStatKey'] != s:
            relic['substats'][s] = int(match_stat.group(1))
    
    if err:
        print(err)
    return relic
  return response.status_code

if __name__ == '__main__':
  app.run(debug=True)