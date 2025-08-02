from flask import Flask, Response
import sqlite3
import json

from .Ingredient import Ingredient
from .post import Post
from .recipe import Recipe


app = Flask(__name__)


def tags_by_recipe_id(recipe_id: int) -> list[str]:
    with sqlite3.connect("data/fire.db") as db:
        c = db.cursor()
        tags = c.execute(
            """
            SELECT TagName
            FROM Tags NATURAL JOIN (
                SELECT TagId
                FROM HasTag
                WHERE RecipeId = ?
            ) AS AssociatedTags;
            """,
            (recipe_id,),
        ).fetchall()
    return [t[0] for t in tags]


def ingredients_by_recipe_id(recipe_id: int) -> list[Ingredient]:
    with sqlite3.connect("data/fire.db") as db:
        c = db.cursor()
        ingredients = c.execute(
            """
            SELECT IngredientId, IngredientName, TypeName, Amount, AmountUnit
            FROM Ingredients NATURAL JOIN (
                SELECT IngredientId, Amount, AmountUnit
                FROM Requires
                WHERE RecipeId = ?
            )
            NATURAL JOIN IngredientTypes
            AS RequiredIngredients;
            """,
            (recipe_id,),
        ).fetchall()
        print(ingredients)

    # TODO: Ask ryan about ingredient types in the database......
    return [Ingredient(*t) for t in ingredients]  # wip


def create_post_by_row(post_id: int) -> Post:
    with sqlite3.connect("data/fire.db") as db:
        c = db.cursor()
        c.execute(
            "SELECT NumberOfLikes, Rating, Reviews FROM Posts WHERE RecipeId = ?",
            (post_id,),
        )
        (likes, rating, reviews) = c.fetchone()
        tags = tags_by_recipe_id(post_id)
        ingredients = ingredients_by_recipe_id(post_id)
        recipe_tuple: tuple[str, str, str, int, int, str] = c.execute(
            "SELECT RecipeName, Description, Instructions, CookTime, Difficulty, PhotoURL FROM Recipes WHERE RecipeId = ?",
            (post_id,),
        ).fetchone()

        recipe = Recipe(post_id, *recipe_tuple, ingredients, tags)
        return Post(recipe, likes, rating, reviews)


@app.get("/api/v1/recipe/by-id/<recipe_id>")
def get_recipe_by_id(recipe_id):
    return Response(
        create_post_by_row(int(recipe_id)).to_json(), content_type="application/json"
    )


@app.get("/api/v1/recipe/trending/<offset>")
def get_trending_recipe_by_offset(offset):

    with sqlite3.connect("data/fire.db") as db:
        c = db.cursor()
        recipe_id = c.execute(
            """
            SELECT RecipeId
            FROM Trending
            ORDER BY NumberOfRecentLikes DESC
            LIMIT 1 OFFSET ?
            """,
            (offset,)).fetchone()[0]

    return Response(
            create_post_by_row(int(recipe_id)).to_json(),
            content_type="application/json")



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
        for tag_id, tag_name in c.fetchall():
            tags.append({"name": tag_name, "id": tag_id})

    return Response(json.dumps(tags), content_type="application/json")


@app.get("/api/v1/tag/by-id/<tag_id>")
def get_tag_by_id(tag_id):
    with sqlite3.connect("data/fire.db") as db:
        c = db.cursor()
        c.execute("SELECT TagId, TagName FROM Tags WHERE TagId = ?", (tag_id,))
        (tag_id, tag_name) = c.fetchone()
        tag = {"name": tag_name, "id": tag_id}

    return Response(json.dumps(tag), content_type="application/json")
