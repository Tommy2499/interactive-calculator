import json

def events(gender):
    f = open("./src/Coefficients2025.json")
    data = json.load(f)
    f.close()
    keys = data[gender].keys()
    for key in keys:
        print(f"\"\" : \"{key}\",")

events("men")