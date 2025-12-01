import requests
from os.path import dirname, join
import json

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
    print ("===== START CRAWL COUNTRY OF FILMS =====")
    try:
        file_path = join(dirname(__name__),"..", "films_new.json")       
        with open(file_path, "r", encoding="utf-8") as file_:
            d = file_.read()
         
        d = json.loads(d)
        
        films = []
        save_path = join(dirname(__name__),"..", "films_news_2.json")
        for u in d:
            # print(f" === START {u["name"]} ===")
            res = requests.get(f"https://rophimapi.net/v1/movie/filterV2?q={u["name"]}&countries=&genres=&years=&custom_year=&quality=&type=&status=&exclude_status=&versions=&rating=&networks=&productions=&sort=release_date&page=1")
            if res.status_code == 200:
                res = res.json()
                res = res["result"]["items"][0]
                country = res["origin_country"]
                new_country = []
                for c in country:
                    if c in code:
                        new_country.append(c)
                
                new_f = u
                new_f["country"] = new_country
                films.append(new_f)
                # print(f" === DONE {u["name"]} ===")
                with open(save_path, 'w',encoding="utf-8") as f:
                    json.dump(films, f,ensure_ascii=False, indent=4)
            else:
                print(f" === FAILED {u["name"]} ===")
        
    except Exception as e:
        print(e)
        print("=== ERROR CANNOT CRAWL API ===")
        
    print("=== DONE CRAWL GENRE FILMS ===")
    
crawl_film()