from fastapi import FastAPI
import joblib
import pandas as pd

app = FastAPI(title="Movie Recommendation API")

# Load everything ONCE
model = joblib.load("svd_model.pkl")
movie_titles = joblib.load("movie_titles.pkl")
ratings = pd.read_pickle("ratings.pkl")
movies = pd.read_pickle("movies.pkl")

@app.get("/")
def health():
    return {"status": "API running"}

@app.get("/recommend/{user_id}")
def recommend_movies(user_id: int, n: int = 10):
    # Movies user already rated
    rated_movies = ratings[ratings.userId == user_id]["movieId"].tolist()

    # All movies
    all_movies = movies["movieId"].tolist()

    # Unseen movies
    unseen_movies = [m for m in all_movies if m not in rated_movies]

    predictions = []
    for movie_id in unseen_movies:
        pred = model.predict(user_id, movie_id)
        predictions.append((movie_id, pred.est))

    predictions.sort(key=lambda x: x[1], reverse=True)
    top_n = predictions[:n]

    return [
        {
            "movie": movie_titles[movie_id],
            "predicted_rating": round(score, 2)
        }
        for movie_id, score in top_n
    ]
