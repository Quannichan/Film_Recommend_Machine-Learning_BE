import requests
import json
from os.path import dirname, join
from PIL import Image
from io import BytesIO

file_path = join(dirname(__name__),"data", "films.json")       
with open(file_path, "r", encoding="utf-8") as file_:
    d = file_.read()
    
d = json.loads(d)
new = []

i = 1
for f in d:

    img = str(f["img"])
    
    r = requests.get(f"https://static.nutscdn.com/vimg/300-0/{img}")
    name = f'_films_{i}.jpg'
    save_path = join(dirname(__name__),"images", name)
    
    if r.status_code == 200:
        if img.endswith(".webp"):
            img_ = Image.open(BytesIO(r.content))

            if img_.mode in ("RGBA", "LA"):
                background = Image.new("RGB", img_.size, (255, 255, 255))
                background.paste(img_, mask=img_.split()[3])
                img_ = background
            else:
                img_ = img_.convert("RGB")

            img_.save(save_path, "JPEG")
            print("Saved WEBP:", save_path)
            f["img"] = name
            new.append(f)
        else:
            with open(save_path, "wb") as fil:
                fil.write(r.content)
            print("Saved:", save_path)
            f["img"] = name
            new.append(f)
            
        save_film_path = join(dirname(__name__),"data", "films_new.json")
        with open(save_film_path, 'w',encoding="utf-8") as fi:
            json.dump(new, fi,ensure_ascii=False, indent=4)
    else:
        print("Download failed:", r.status_code)
        save_log_path = join(dirname(__name__),"data", "log.log")
        with open(save_log_path, 'a',encoding="utf-8") as fi:
            fi.write(f"=== {f["title"]} FAILED {f["img"]} ===")
        
    i+=1