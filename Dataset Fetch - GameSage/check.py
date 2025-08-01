import os
import json
import requests
import time

STEAM_API_KEY = "C96335942A46CB9CC253FA44A7F364C3"
STEAM_API_URL = "https://api.steampowered.com/ISteamApps/GetAppList/v2/"
DETAILS_API_URL = "https://store.steampowered.com/api/appdetails"
REVIEWS_API_URL = "https://store.steampowered.com/appreviews/{}?json=1"
LAST_SAVED_FILE = "last_saved_id_2.txt"
BACKUP_FILE = "steam_games_backup.json"
BATCH_SIZE = 100  
SLEEP_TIME = 1  

REVIEW_CATEGORIES = {
    "Overwhelmingly Positive": 8,
    "Very Positive": 7,
    "Positive": 6,
    "Mostly Positive": 5,
    "Mixed": 4,
    "Mostly Negative": 3,
    "Negative": 2,
    "Very Negative": 1,
    None: 0
}

if os.path.exists(BACKUP_FILE):
    with open(BACKUP_FILE, "r", encoding="utf-8") as f:
        backup_dataset = json.load(f)
else:
    backup_dataset = {}

def checkGame(target_appID, dataset, api_key):
    appID_str = str(target_appID)


    if appID_str in dataset:
        print(f"Game '{dataset[appID_str].get('name', 'N/A')}' (AppID: {target_appID}) already exists.")
        return False

    print(f"Fetch details...")

    # 2. Fetch game details from Steam API
    details_response = requests.get(
        DETAILS_API_URL, params={"appids": target_appID, "key": api_key}
    )
    time.sleep(SLEEP_TIME) # Add a small delay

    if details_response.status_code != 200:
        print(f"Status {details_response.status_code}")
        return False

    game_data = details_response.json().get(appID_str, {}).get("data", {})

    # 3. Validate fetched data
    if not game_data:
        print('Failed.')
        return False

    if game_data.get("type", "") != "game":
        print('Failed.')
        return False

    review_count = game_data.get("recommendations", {}).get("total", 0)
    if review_count == 0:
        print('Failed.')
        return False

    # 4. Fetch review score
    review_response = requests.get(REVIEWS_API_URL.format(target_appID))
    time.sleep(SLEEP_TIME) # Add a small delay
    if review_response.status_code == 200:
        review_data = review_response.json().get("query_summary", {})
        review_score_text = review_data.get("review_score_desc", "Unknown")
    else:
        review_score_text = "Unknown"
        print('Failed.')

    review_score = REVIEW_CATEGORIES.get(review_score_text, 0)
    if review_score == 0:
        print('Failed.')
        return False

    tags_combined = game_data.get("categories", []) + game_data.get("genres", [])
    tag_list = [t["description"] for t in tags_combined if "description" in t]
    genres_list = [g["description"] for g in game_data.get("genres", []) if "description" in g]

    game_entry = {
        "name": game_data.get("name", "Unknown Game"),
        "release_date": game_data.get("release_date", {}).get("date", "Unknown"),
        "price": game_data.get("price_overview", {}).get("initial", 0) / 100.0,
        "short_description": game_data.get("short_description", ""),
        "header_image": game_data.get("header_image", ""),
        "genres": genres_list,
        "tags": tag_list,
                "screenshots": [s["path_thumbnail"] for s in game_data.get("screenshots", [])[:3]],  
                "movies": [m["webm"]["480"] for m in game_data.get("movies", [])[:1] if "webm" in m], 
        "review_count": review_count,
        "review_score_text": review_score_text,
        "review_score": review_score,
        "platforms": list(game_data.get("platforms", {}).keys()),
        "developers": game_data.get("developers", []),
        "publishers": game_data.get("publishers", []),
    }

    dataset[appID_str] = game_entry
    print(f"Added game: {game_entry['name']} (AppID: {target_appID})")

    with open(BACKUP_FILE, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=4)
    return True

target_id = 578080
checkGame(target_id, backup_dataset, STEAM_API_KEY)