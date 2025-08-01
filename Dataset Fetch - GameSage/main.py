import requests
import json
import os
import time

STEAM_API_KEY = "C96335942A46CB9CC253FA44A7F364C3"
STEAM_API_URL = "https://api.steampowered.com/ISteamApps/GetAppList/v2/"
DETAILS_API_URL = "https://store.steampowered.com/api/appdetails"
REVIEWS_API_URL = "https://store.steampowered.com/appreviews/{}?json=1"
LAST_SAVED_FILE = "last_saved_id.txt"
JSON_FILE = "steam_games.json"
BATCH_SIZE = 100  
SLEEP_TIME = 1  

# Review Score Mapping
REVIEW_CATEGORIES = {
    "Overwhelmingly Positive": 8,
    "Very Positive": 7,
    "Positive": 6,
    "Mostly Positive": 5,
    "Mixed": 4,
    "Mostly Negative": 3,
    "Negative": 2,
    "Very Negative": 1,
    None: 0  # Default if missing
}

# Load last saved AppID
if os.path.exists(LAST_SAVED_FILE):
    with open(LAST_SAVED_FILE, "r") as f:
        last_saved_appid = int(f.read().strip())
else:
    last_saved_appid = 0

# Load existing JSON data if available
if os.path.exists(JSON_FILE):
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        dataset = json.load(f)
else:
    dataset = {}

# Step 1: Get the list of all Steam games
response = requests.get(STEAM_API_URL)
if response.status_code != 200:
    exit()

app_list = response.json()["applist"]["apps"]
app_list = sorted(app_list, key=lambda x: x["appid"])
app_list = [app for app in app_list if app["appid"] > last_saved_appid]

# Step 2: Fetch game details in batches
for i in range(0, len(app_list), BATCH_SIZE):
    batch = app_list[i:i + BATCH_SIZE]

    for app in batch:
        appID = app["appid"]
        name = app["name"]

        # Fetch game details with API key
        details_response = requests.get(
            DETAILS_API_URL, params={"appids": appID, "key": STEAM_API_KEY}
        )

        if details_response.status_code != 200:
            continue

        game_data = details_response.json().get(str(appID), {}).get("data", {})

        if game_data:
            if game_data.get("type", "") != "game":
                continue

            # Extract total number of reviews
            review_count = game_data.get("recommendations", {}).get("total", 0)
            if review_count == 0:
                continue  

            # Fetch review score description from the correct API
            review_response = requests.get(REVIEWS_API_URL.format(appID))
            if review_response.status_code == 200:
                review_data = review_response.json().get("query_summary", {})
                review_score_text = review_data.get("review_score_desc", "Unknown")
            else:
                review_score_text = "Unknown"

            # Convert review score text to numeric category
            review_score = REVIEW_CATEGORIES.get(review_score_text, 0)

            if review_score == 0:
                continue

            dataset[appID] = {
                "name": name,
                "release_date": game_data.get("release_date", {}).get("date", "Unknown"),
                "price": game_data.get("price_overview", {}).get("initial", 0) / 100.0,
                "short_description": game_data.get("short_description", ""),
                "header_image": game_data.get("header_image", ""),
                "genres": [g["description"] for g in game_data.get("genres", [])],
                "tags": [t["description"] for t in game_data.get("categories", [])],
                "screenshots": [s["path_thumbnail"] for s in game_data.get("screenshots", [])[:3]],  
                "movies": [m["webm"]["480"] for m in game_data.get("movies", [])[:1] if "webm" in m],  
                "review_count": review_count,  
                "review_score_text": review_score_text,
                "review_score": review_score,  
                "platforms": list(game_data.get("platforms", {}).keys()),
                "developers": game_data.get("developers", []),
                "publishers": game_data.get("publishers", []),
            }

        # Save last processed AppID
        with open(LAST_SAVED_FILE, "w") as f:
            f.write(str(appID))

    # Save progress every batch (JSON)
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=4)

    print(f"Saved batch {i // BATCH_SIZE + 1}, last AppID: {appID}")
    time.sleep(SLEEP_TIME)

print("All games fetched and saved successfully!")