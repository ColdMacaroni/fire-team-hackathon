from flask import Flask, Response
import sqlite3
import json


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
    tags = []
    with sqlite3.connect("data/fire.db") as db:
        c = db.cursor()
        c.execute("SELECT TagId, TagName FROM Tags")
        for (tag_id, tag_name) in c.fetchall():
            tags.append({"name": tag_name, "id": tag_id})

    return Response(json.dumps(tags), content_type="application/json")

@app.get("/api/v1/tag/by-id/<tag_id>")
def get_tag_by_id(tag_id):
    with sqlite3.connect("data/fire.db") as db:
        print(tag_id)
        c = db.cursor()
        c.execute("SELECT TagId, TagName FROM Tags WHERE TagId = ?", (tag_id,))
        (tag_id, tag_name) = c.fetchone()
        tag = ({"name": tag_name, "id": tag_id})

    return Response(json.dumps(tag), content_type="application/json")
