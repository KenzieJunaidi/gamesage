# GameSage

**GameSage** is a content-based game recommendation system designed to help users discover new games similar to their interests. The system leverages K-Nearest Neighbors (KNN) and Cosine Similarity to identify and rank games based on feature similarity, using data collected from over 6,000 titles via the Steam API.

---

## 👥 Project Contributors

- Kenzie Junaidi (https://github.com/KenzieJunaidi)
- Rayvel Geraldo Budiyono (https://github.com/RayvelGB)
- Calvin Junaidy (https://github.com/CalvinJ45)

---

## 📌 Project Overview

- Utilizes a content-based filtering approach for game recommendations
- Game dataset fetched programmatically using the Steam API (~6,000 games)
- Web-based interface for user interaction
- Backend powered by Flask for API routing and logic execution

---

## 💼 Tech Stack

- **Python**  
- **Flask**  
- **HTML / CSS**  
- **JavaScript**  
- **Scikit-learn**  
- **NumPy / Pandas**  
- **TensorFlow**

---

## 🧠 Methodology

- Game features (such as genres, tags, and descriptions) are extracted and vectorized
- Cosine Similarity is applied to measure the closeness between game vectors
- K-Nearest Neighbors (KNN) is used to retrieve and rank the most relevant recommendations for a given input
