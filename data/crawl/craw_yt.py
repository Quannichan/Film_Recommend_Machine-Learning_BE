from os.path import dirname, join
import mysql.connector
from dotenv import load_dotenv, dotenv_values
import time
from yt_dlp import YoutubeDL    
import pandas as pd
from tqdm import tqdm

DOTENT_PATH = join(dirname(__file__), "..", "..", '.env')
DATA_FILE_PATH = join(dirname(__file__), 'youtube_trailer_id.csv')

load_dotenv()
config = dotenv_values(DOTENT_PATH)
db = mysql.connector.connect(
        host = config.get("DATABASE_HOST"),          
        user = config.get("DATABASE_USER"),
        passwd = config.get("DATABASE_PASSWORD"),
        database = config.get("DATABASE_NAME"),
        port = config.get("DATABASE_PORT")
    )
    
cursorObject = db.cursor(dictionary=True)

def get_db_data():
    
    query = "SELECT id, name_en FROM PostSample WHERE id > 1455;"
    cursorObject.execute(query)

    res = cursorObject.fetchall()
    
    return res
        
def fetch_youtube():
    # with open(DATA_FILE_PATH, "w", encoding="utf-8") as f:
    #     f.write("id,name,trailer_id\n")
        
    films = get_db_data()

    ydl_opts = {
        "quiet": True,
        "extract_flat": True,
        "skip_download": True,
    }

    with YoutubeDL(ydl_opts) as ydl:
        for film in films:
            while True:
                try:
                    query = f"{film['name_en'].replace('~', '').replace(',', '')} official trailer"

                    result = ydl.extract_info(
                        f"ytsearch3:{query}",
                        download=False
                    )
                    
                    if result['entries']:
                        if len(result['entries']) > 0:
                            with open(DATA_FILE_PATH, "a", encoding="utf-8") as f:
                                f.write(f"{int(film['id'])},{film['name_en'].replace('~', '').replace(',', '')},{result['entries'][0]['id']}\n")
                        else:
                            print(f"No results found for: {film['name_en'].replace('~', '').replace(',', '')}")
                    else:
                            print(f"No results found for: {film['name_en'].replace('~', '').replace(',', '')}")
                    
                    time.sleep(1)
                    break
                except Exception as e:
                    print(f"Error fetching trailer for {film['name_en']}: {e}\n\nRetrying in 30s...")
                    time.sleep(30)

# fetch_youtube()

def update_data():
    df = pd.read_csv(DATA_FILE_PATH)
    prev = 0
    for _, row in tqdm(df.iterrows(), total=df.shape[0]):
        try:
            id = int(row['id'])
            trailer_id = row['trailer_id']
            
            sub = id-prev
            if sub == 2:
                print(f"Missing ID for {id-1}")
            elif sub > 2:
                for i in range(prev+1,id):
                    print(f"Missing ID for {i}")
            
            query = f"UPDATE PostSample SET trailer = '{trailer_id}' WHERE id = {id};"
            cursorObject.execute(query)
            db.commit()
            
            prev = id
        except Exception as e:
            print(f"Error updating trailer for {row['name']}: {e}")

update_data()