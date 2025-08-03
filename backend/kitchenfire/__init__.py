from flask import Flask, Response, request
import sqlite3
import json

from .tag import Tag

from .Ingredient import Ingredient
from .post import Post
from .recipe import Recipe


app = Flask(__name__)

DB_URL = "data/fire.db"


def tags_by_recipe_id(recipe_id: int) -> list[Tag]:
    with sqlite3.connect(DB_URL) as db:
        c = db.cursor()
        tags = c.execute(
            """
            SELECT TagId, TagName
            FROM Tags NATURAL JOIN (
                SELECT TagId
                FROM HasTag
                WHERE RecipeId = ?
            ) AS AssociatedTags;
            """,
            (recipe_id,),
        ).fetchall()
    return [Tag(*t) for t in tags]

def create_post_to_database(json_post) -> int:
    print(json_post)
    # const formattedRecipe = {
    #   id: newId,
    #   name: recipeData.name,
    #   image: recipeData.image || '', // Default image if none provided
    #   rank: 0, // Random rank between 3-5
    #   rating: 0, // Random rating between 3.5-5.0
    #   reviews: 0, // Random reviews between 5-25
    #   tags: recipeData.tags.filter(tag => tag.trim() !== ''),
    #   ingredients: recipeData.ingredients
    #     .filter(ing => ing.ingredient.trim() !== '')
    #     .map(ing => ({
    #       ingredient: ing.ingredient,
    #       amount: ing.amount,
    #       unit: ing.unit,
    #     })),
    #   instructions: recipeData.instructions,
    #   isFavorited: false,
    #   likes: 0, // Random likes between 50-150
    #   dislikes: 0, // Random dislikes between 1-11
    #   comments: 0, // Random comments between 10-40
    # }
    tags: list[str] = json_post['tags']
    with sqlite3.connect(DB_URL) as db:
        c = db.cursor()
        c.execute("""
            CREATE TEMPORARY TABLE NewPostTags(TagName);
        """)

        c.executemany("""
            INSERT OR IGNORE INTO NewPostTags (TagName)
            VALUES (?)
        """, ((t,) for t in tags))
        db.commit()


        # insert tags
        c.execute("""
            INSERT OR IGNORE INTO Tags (TagName)
            SELECT * FROM NewPostTags
        """)
        db.commit()

        tag_ids = c.execute("""
            SELECT TagId FROM Tags
            NATURAL JOIN NewPostTags
        """).fetchall()
        tag_ids = [t[0] for t in tag_ids]

        c.execute("""
            DROP TABLE NewPostTags;
        """)

        # Ingredients

        c.execute("""
            CREATE TEMPORARY TABLE NewPostIngredients(IngredientName, TypeId);
        """)

        c.executemany("""
            INSERT OR IGNORE INTO NewPostIngredients (IngredientName, TypeId)
            VALUES (?, ?)
        """, ((i['ingredient'], 1) for i in json_post['ingredients']))
        db.commit()

        # insert ings
        c.execute("""
            INSERT OR IGNORE INTO Ingredients (IngredientName, TypeId)
            SELECT * FROM NewPostIngredients
        """)
        db.commit()

        ing_ids = c.execute("""
            SELECT IngredientName, IngredientId FROM Ingredients
            NATURAL JOIN NewPostIngredients;
        """).fetchall()
        ing_to_id = {name: id_ for name, id_ in ing_ids}

        c.execute("""
            DROP TABLE NewPostIngredients;
        """)

        # -- create recipe
        exists = not not c.execute("SELECT COUNT(*) FROM Recipes WHERE RecipeName = ?", (json_post['name'],)).fetchone()[0]
        if exists:
            return -1

        c.execute("""
INSERT INTO Recipes (RecipeName, Description, Instructions, CookTime, Difficulty, PhotoURL)
VALUES (?, ?, ?, ?, ?, ?);
                  """, 
                  (
                      json_post['name'],
                      json_post.get('description', "No Description"),
                      json_post['instructions'],
                      json_post.get('cooktime', 0),
                      json_post.get('difficulty', 3),
                      json_post.get('image',  "/recipe_not_found.png" ),
                      ))


    return 232


def ingredients_by_recipe_id(recipe_id: int) -> list[Ingredient]:
    with sqlite3.connect(DB_URL) as db:
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
    with sqlite3.connect(DB_URL) as db:
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
    posts = []
    for id_ in map(lambda x: int(x), recipe_id.replace(" ", ",").split(",")):
        posts.append(create_post_by_row(id_).to_json())
    return Response(
        f"[{','.join(posts)}]",
        content_type="application/json",
    )


@app.get("/api/v1/recipe/trending/<offset>/<count>")
@app.get("/api/v1/recipe/trending/<offset>")
def get_trending_recipe_by_offset(offset, count=1):
    if offset == "-":
        offset = 0
    with sqlite3.connect(DB_URL) as db:
        c = db.cursor()
        recipe_ids = c.execute(
            """
            SELECT RecipeId
            FROM Trending
            ORDER BY NumberOfRecentLikes DESC
            LIMIT ? OFFSET ?
            """,
            (int(count), int(offset))).fetchall()

    json = [create_post_by_row(int(*recipe_id)).to_json() for recipe_id in recipe_ids]

    return Response(
            f"[{','.join(json)}]",
            content_type="application/json")


# Takes smth like 123,1234,345
# returns (123),(1234),(345)
def transform_ids(ids: str) -> str:
    return ','.join(map(lambda i: f"({int(i)})", ids.replace(" ", ",").split(",")))


@app.get("/api/v1/recipe/filter/ingredient/<without>")
@app.get("/api/v1/recipe/filter/ingredient/<without>/<with_>")
def get_recipe_filtered_by_ingredient(without: str, with_="-"):
    # Safety: ids are cast to int, so no sql injection
    exclude_ids = transform_ids(without) if without != "-" else "(null)"
    include_ids = transform_ids(with_)  if with_ != "-" else "(null)"

    query = f"""
        WITH
            ExcludeIds(IngredientId) AS (VALUES {exclude_ids}),
            IncludeIds(IngredientId) AS (VALUES {include_ids})
        SELECT RecipeId, RecipeName
        FROM Recipes {"NATURAL JOIN Requires WHERE IngredientId IN IncludeIds" if with_ != "-" else ""}
            EXCEPT
        SELECT RecipeId, RecipeName
        FROM Recipes NATURAL JOIN Requires
        WHERE IngredientId IN ExcludeIds;
        """

    with sqlite3.connect(DB_URL) as db:
        c = db.cursor()
        result = c.execute(query).fetchall()

    return Response(
            json.dumps([{"id": t[0], "name": t[1]} for t in result]),
            content_type="application/json")



@app.get("/api/v1/recipe/filter/tag/<without>")
@app.get("/api/v1/recipe/filter/tag/<without>/<with_>")
def get_recipe_filtered_by_tag(without, with_="-"):
    # Safety: ids are cast to int, so no sql injection
    exclude_ids = transform_ids(without) if without != "-" else "(null)"
    include_ids = transform_ids(with_)  if with_ != "-" else "(null)"

    query = f"""
        WITH
            ExcludeIds(TagId) AS (VALUES {exclude_ids}),
            IncludeIds(TagId) AS (VALUES {include_ids})
        SELECT RecipeId, RecipeName
        FROM Recipes {"NATURAL JOIN HasTag WHERE TagId IN IncludeIds" if with_ != "-" else ""}
            EXCEPT
        SELECT RecipeId, RecipeName
        FROM Recipes NATURAL JOIN HasTag
        WHERE TagId IN ExcludeIds;
        """

    with sqlite3.connect(DB_URL) as db:
        c = db.cursor()
        result = c.execute(query).fetchall()

    return Response(
            json.dumps([{"id": t[0], "name": t[1]} for t in result]),
            content_type="application/json")


@app.get("/api/v1/tag/all")
def get_all_tags():
    tags = []
    with sqlite3.connect(DB_URL) as db:
        c = db.cursor()
        c.execute("SELECT TagId, TagName FROM Tags")
        for tag_id, tag_name in c.fetchall():
            tags.append({"name": tag_name, "id": tag_id})

    return Response(json.dumps(tags), content_type="application/json")


@app.get("/api/v1/tag/by-id/<tag_id>")
def get_tag_by_id(tag_id):
    ids = transform_ids(tag_id)
    with sqlite3.connect(DB_URL) as db:
        c = db.cursor()
        c.execute(f"""
                  WITH GetIds(TagId)
                  AS (VALUES {ids})
                  SELECT TagId, TagName
                  FROM Tags
                  WHERE TagId IN GetIds
                  """)

        tag = [{"name": tag_name, "id": tag_id} for (tag_id, tag_name) in c.fetchall()]
    return Response(json.dumps(tag), content_type="application/json")

@app.get("/api/v1/ingredient/all")
def get_all_ingredients():
    ingredients = []
    with sqlite3.connect(DB_URL) as db:
        c = db.cursor()
        c.execute("SELECT IngredientId, IngredientName FROM Ingredients")
        for ingredient_id, ingredient_name in c.fetchall():
            ingredients.append({"name": ingredient_name, "id": ingredient_id})

    return Response(json.dumps(ingredients), content_type="application/json")


@app.get("/api/v1/ingredient/by-id/<ingredient_id>")
def get_tag_by_id2(ingredient_id):
    ids = transform_ids(ingredient_id)
    with sqlite3.connect(DB_URL) as db:
        c = db.cursor()
        c.execute(f"""
                  WITH GetIds(IngredientId)
                  AS (VALUES {ids})
                  SELECT IngredientId, IngredientName
                  FROM Ingredients
                  WHERE IngredientId IN GetIds
                  """)

        ingredients = [{"name": ingredient_name, "id": ingredient_id} for (ingredient_id, ingredient_name) in c.fetchall()]

    return Response(json.dumps(ingredients), content_type="application/json")

@app.put("/api/v1/recipe/save")
def save_recipe():
    # Assumes it's in the json post form
    post_id = create_post_to_database(request.json)

    if post_id > 0:
        return Response(json.dumps({"id": post_id}), status=201)
    else:
        return Response(status=409)
