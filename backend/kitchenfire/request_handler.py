import json
import sqlite3

database = sqlite3.connect("data/fire.db")

def query_recipe(recipe_id: int):
    cursor = database.cursor()
    cursor.execute(f"""
SELECT *
FROM Recipes
WHERE RecipeId = {recipe_id}
    """)


def convert_to_json(object_to_convert):
    return json.dumps(vars(object_to_convert))
