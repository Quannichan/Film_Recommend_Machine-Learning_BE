import requests
from os.path import dirname, join
import json

films_crawled = []
code = [
    "GB",
    "CA",
    "KR",
    "HK",
    "US",
    "JP",
    "FR",
    "TH",
    "CN",
    "AU",
    "TW",
    "DE"
]

def crawl_film():
    print ("===== START CRAWL GENRE FILMS =====")
    try:
        file_path = join(dirname(__name__),"data", "api_genre.json")       
        with open(file_path, "r", encoding="utf-8") as file_:
            d = file_.read()
         
        d = json.loads(d)
        
        genre = []
        films = []
        
        for g in d:
            genre.append(g["type"])
            
        for u in d:
            for i in range(1,31):
                print(f"== START GENRE {u["type_vn"]} page: {i} ==")
                res = requests.get(f"{u["url"]}{i}")
                if res.status_code == 200:
                    res = res.json()
                    res = res["result"]["items"]
                    for r in res:
                        if r["slug"].lower().strip() in films_crawled:
                            continue
                        
                        films_crawled.append(r["slug"].lower().strip())
                        
                        f = {}
                        if "english_title" in r: 
                            f["en_title"] = r["english_title"]
                        else:
                            f["en_title"] = ""
                            
                        f["title"] = r["title"]
                        if "overview" in r:
                            f["overview"] = r["overview"]
                        else:
                            f["overview"] = ""
                        f["release_date"] = r["release_date"]
                        f_g = []
                        for gen in r["genres"]:
                            if gen["slug"].strip() in genre:
                                f_g.append(gen["slug"].strip())
                                
                        f_c = []
                        for coun in r["origin_country"]:
                            if coun.strip() in code:
                                f_c.append(coun)
                                
                        if len(f_c) == 0:
                            print(f"=== Film {r["slug"]} not have need country ===")
                            continue
                        
                        if len(f_g) == 0:
                            print(f"=== Film {r["slug"]} not have need genre ===")
                            continue
                        
                        f["genres"] = " | ".join(f_g)
                        
                        f["img"] = "/".join(r["images"]["posters"][0]["path"].split("/")[2:])
                        
                        films.append(f)
                    print(f"== END GENRE {u["type_vn"]} page: {i} ==\n")
                    
                else:
                    print(f"=== CANNOT GET {u["url"]} ===")     
                    
        save_path = join(dirname(__name__),"data", "films.json")
        with open(save_path, 'w',encoding="utf-8") as f:
            json.dump(films, f,ensure_ascii=False, indent=4)
        
    except Exception as e:
        print(e)
        print("=== ERROR CANNOT CRAWL API ===")
        
    print("=== DONE CRAWL GENRE FILMS ===")
        
def crawl_films_country():
    print ("===== START CRAWL COUNTRY FILMS =====")
    try:
        file_path = join(dirname(__name__),"data", "api_country.json")       
        with open(file_path, "r", encoding="utf-8") as file_:
            d = file_.read()
         
        d = json.loads(d)
        
        genre = []
        films = []
        
        for g in d:
            genre.append(g["type"])
            
        for u in d:
            for i in range(1,31):
                print(f"== START COUNTRY {u["type_vn"]} page: {i} ==")
                res = requests.get(f"{u["url"]}{i}")
                if res.status_code == 200:
                    res = res.json()
                    res = res["result"]["items"]
                    for r in res:
                        
                        if r["slug"].lower().strip() in films_crawled:
                            continue
                        
                        films_crawled.append(r["slug"].lower().strip())
                        
                        f = {}
                        if "english_title" in r: 
                            f["en_title"] = r["english_title"]
                        else:
                            f["en_title"] = ""
                            
                        f["title"] = r["title"]
                        if "overview" in r:
                            f["overview"] = r["overview"]
                        else:
                            f["overview"] = ""
                        f["release_date"] = r["release_date"]
                        f_g = []
                        for gen in r["genres"]:
                            if gen["slug"].strip() in genre:
                                f_g.append(gen["slug"].strip())
                                
                        f_c = []
                        for coun in r["origin_country"]:
                            if coun.strip() in code:
                                f_c.append(coun)
                                
                        if len(f_c) == 0:
                            print(f"=== Film {r["slug"]} not have need country ===")
                            continue
                        
                        if len(f_g) == 0:
                            print(f"=== Film {r["slug"]} not have need genre ===")
                            continue    
                        
                        f["genres"] = " | ".join(f_g)
                        
                        f["img"] = r["images"]["posters"][0]["path"].split("/")[2:]
                        
                        films.append(f)
                    print(f"== END GENRE {u["type_vn"]} page: {i} ==\n")
                    
                else:
                    print(f"=== CANNOT GET {u["url"]} ===")     
                    
        save_path = join(dirname(__name__),"data", "films_country.json")
        with open(save_path, 'w',encoding="utf-8") as f:
            json.dump(films, f,ensure_ascii=False, indent=4)
        
    except Exception as e:
        print(e)
        print("=== ERROR CANNOT CRAWL API ===")
        
    print ("===== DONE CRAWL COUNTRY FILMS =====")
        
        
crawl_film()
crawl_films_country()