import csv
import os
import sqlite3
from typing import Dict
from typing import Set

from kitchenfire.Ingredient import Ingredient
from kitchenfire.post import Post
from kitchenfire.recipe import Recipe

if __name__ == "__main__":
    os.remove("../data/fire.db")
    database = sqlite3.connect("../data/fire.db")
    cursor = database.cursor()

    with open("schema.sql") as setup:
        cursor.executescript(setup.read())
        database.commit()

    ingredients: Dict[str, Ingredient] = {}
    ingredient_types: Set[str] = set()
    recipe_ingredients: Dict[str, Set[Ingredient]] = {}

    with open("../static/IngredientInfo.csv") as raw_ingredient_data:
        reader = csv.reader(raw_ingredient_data)
        rowNumber = 0

        for row in reader:
            if rowNumber != 0:
                recipe, ingredient_name, amount, unit = row

                if amount == "" or unit == "":
                    ingredient = Ingredient(
                        -1,
                        ingredient_name,
                        "unknown",
                        None,
                        None
                    )
                else:
                    ingredient = Ingredient(
                        -1,
                        ingredient_name,
                        "unknown",
                        float(amount),
                        unit
                    )

                ingredients[ingredient_name] = ingredient
                ingredient_types.add("unknown")

                if recipe in recipe_ingredients:
                    recipe_ingredients[recipe].add(ingredient)
                else:
                    recipe_ingredients[recipe] = {ingredient}

            rowNumber += 1

    tags: Set[str] = set()
    recipe_tags: Dict[str, Set[str]] = {}
    recipes: Dict[str, Recipe] = {}

    with open("../static/RecipeInfo.csv") as raw_recipe_data:
        reader = csv.reader(raw_recipe_data)
        rowNumber = 0

        for row in reader:
            if rowNumber != 0:
                name, photo_url, raw_tags, description, cook_time, difficulty, method = row

                recipe_tags[name] = set()
                for tag in raw_tags.split():
                    tags.add(tag)
                    recipe_tags[name].add(tag)

                recipe = Recipe(-1, name, description, method, int(cook_time), int(difficulty), photo_url, [], [])
                recipes[name] = recipe
            rowNumber += 1

    trending: Dict[str, int] = {}

    with open("../static/TrendingInfo.csv") as raw_trending_info:
        reader = csv.reader(raw_trending_info)
        rowNumber = 0

        for row in reader:
            if rowNumber != 0:
                trending[row[0]] = int(row[1])

            rowNumber += 1

    posts: Set[Post] = set()

    with open("../static/PostInfo.csv") as raw_post_info:
        reader = csv.reader(raw_post_info)
        rowNumber = 0

        for row in reader:
            if rowNumber != 0:


            rowNumber += 1

    for tag in tags:
        cursor.execute(f"""
INSERT INTO Tags (TagName)
VALUES ("{tag}");
""")

        database.commit()

    for ingredient_type in ingredient_types:
        cursor.execute(f"""
INSERT INTO IngredientTypes (TypeName)
VALUES ("{ingredient_type}");
""")

        database.commit()

    for ingredient in ingredients.values():
        type_id = cursor.execute(f"""
SELECT TypeId
FROM IngredientTypes
WHERE TypeName = "{ingredient.ingredient_type}";
""").fetchall()[0][0]

        cursor.execute(f"""
INSERT INTO Ingredients (IngredientName, TypeId)
VALUES ("{ingredient.name}", {type_id});
""")

        database.commit()

    for recipe in recipes.values():
        cursor.execute(f"""
INSERT INTO Recipes (RecipeName, Description, Instructions, CookTime, Difficulty, PhotoURL)
VALUES ("{recipe.name}", "{recipe.description}", "{recipe.instructions}", {recipe.cook_time}, {recipe.difficulty}, "{recipe.photo_url}");
""")

        database.commit()

    # TODO: Populate Trending table

    for r, t in recipe_tags.items():
        recipe_id = cursor.execute(f"""
SELECT RecipeId
FROM Recipes
WHERE RecipeName = "{r}";
""").fetchall()[0][0]

        for tag in t:
            tag_id = cursor.execute(f"""
SELECT TagId
FROM Tags
WHERE TagName = "{tag}";
""").fetchall()[0][0]

            cursor.execute(f"""
INSERT INTO HasTag (RecipeId, TagId)
VALUES ("{recipe_id}", "{tag_id}");
""")

            database.commit()

    for r, i in recipe_ingredients.items():
        recipe_id = cursor.execute(f"""
SELECT RecipeId
FROM Recipes
WHERE RecipeName = "{r}";
""").fetchall()[0][0]

        for ingredient in i:
            ingredient_id = cursor.execute(f"""
SELECT IngredientId
FROM Ingredients
WHERE IngredientName = "{ingredient.name}";
""").fetchall()[0][0]
            if ingredient.amount is None or ingredient.amount_unit is None:
                cursor.execute(f"""
INSERT INTO Requires (RecipeId, IngredientId)
VALUES ({recipe_id}, {ingredient_id});
""")
            else:
                cursor.execute(f"""
INSERT INTO Requires (RecipeId, IngredientId, Amount, AmountUnit)
VALUES ({recipe_id}, {ingredient_id}, {ingredient.amount}, "{ingredient.amount_unit}");
""")

            database.commit()

    # TODO: Populate Post table
