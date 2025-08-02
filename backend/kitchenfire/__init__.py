from flask import Flask


app = Flask(__name__)

@app.get("/api/v1/recipe/by-id/<recipe_id>")
def get_recipe_by_id(recipe_id):
    return "todo!recipe_id"

@app.get("/api/v1/recipe/trending/<offset>")
def get_trending_recipe_by_offset(offset):
    return "todo!recipe_trending"

@app.get("/api/v1/recipe/filter/ingredient/<without>/<with_>")
def get_recipe_filtered_by_ingredient(without, with_="-"):
    return "todo!ingredient"

@app.get("/api/v1/recipe/filter/tag/<without>/<with_>")
def get_recipe_filtered_by_tag(without, with_="-"):
    return "todo!tag"

@app.get("/api/v1/tag/all")
def get_all_tags():
    return "todo!all_tags"

@app.get("/api/v1/tag/by-id/<tag_id>")
def get_tag_by_id(tag_id):
    return "todo!tag_id"
