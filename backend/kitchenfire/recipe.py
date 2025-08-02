from kitchenfire.Ingredient import Ingredient
from typing import List


class Recipe:
    recipe_id: int
    name: str
    instructions: str
    photo_url: str
    ingredients: List[Ingredient]
    tags: List[str]

    def __init__(
            self,
            recipe_id: int,
            name: str,
            instructions: str,
            photo_url: str,
            ingredients: List[Ingredient],
            tags: List[str]
    ):
        self.recipe_id = recipe_id
        self.name = name
        self.instructions = instructions
        self.photo_url = photo_url
        self.ingredients = ingredients
        self.tags = tags
