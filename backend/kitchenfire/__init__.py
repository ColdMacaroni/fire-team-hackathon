from flask import Flask


app = Flask(__name__)


@app.get("/recipe/<recipe_id>")
def recipe_get(recipe_id):
    return recipe_id
