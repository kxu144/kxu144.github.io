from flask import Flask, request
import requests
import numpy as np
import cv2 as cv
import pytesseract as pyt
import json

app = Flask(__name__)

@app.route('/parse', methods=['POST'])
def parse(request):
  url = request.form('imageUrl')
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

    return parse_str
  return response.status_code

if __name__ == '__main__':
  app.run(debug=True)