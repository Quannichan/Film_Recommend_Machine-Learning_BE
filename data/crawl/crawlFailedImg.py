
import requests
import json
from os.path import dirname, join
from PIL import Image
from io import BytesIO
from lxml import html

file_path = join(dirname(__name__),"data", "log.log")       
with open(file_path, "r", encoding="utf-8") as file_:
    d = file_.read()
    
d = d.splitlines()
new = []

i = 7012
for f in d:

    res = requests.get(f"https://rophimapi.net/v1/movie/filterV2?q={f.strip()}&countries=&genres=&years=&custom_year=&quality=&type=&status=&exclude_status=&versions=&rating=&networks=&productions=&sort=release_date&page=1")
    name = f'_films_{i}.jpg'
    save_path = join(dirname(__name__),"images", name)
    
    if res.status_code == 200:
        res = res.json()
        ri = res["result"]["items"][0]
        pos = ri["images"]["posters"]
        if len(pos) > 1:
            # https://image.tmdb.org/t/p/w500/
            if len(pos[0]["path"].split("/")) < 3:
                img = "https://image.tmdb.org/t/p/w500"+pos[0]["path"]
            else:
                img = "https://static.nutscdn.com/vimg/300-0/"+"/".join(pos[0]["path"].split("/")[2:])
        else:
            if len(pos[0]["path"].split("/")) < 3:
                img = "https://image.tmdb.org/t/p/w500"+pos[0]["path"]
            else:
                img = "https://static.nutscdn.com/vimg/300-0/"+"/".join(pos[0]["path"].split("/")[2:])
                
        r = requests.get(img)
                    
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
                new.append(f)
            else:
                with open(save_path, "wb") as fil:
                    fil.write(r.content)
                print("Saved:", save_path)
                
                new.append(f)
                
            save_film_path = join(dirname(__name__),"data", "save.json")
            with open(save_film_path, 'w',encoding="utf-8") as fi:
                json.dump(new, fi,ensure_ascii=False, indent=4)
        else:
            print("Download failed:", r.status_code)
            save_log_path = join(dirname(__name__),"data", "log2.log")
            with open(save_log_path, 'a',encoding="utf-8") as fi:
                fi.write(f"=== {f} FAILED ===") 
    else:
        print(f"Cannot get IMG of {f}: {r.status_code}")
        save_log_path = join(dirname(__name__),"data", "log2.log")
        with open(save_log_path, 'a',encoding="utf-8") as fi:
            fi.write(f"=== {f} FAILED ===") 
    i+=1