from kitchenfire.Ingredient import Ingredient
from typing import List


class Recipe:
    recipe_id: int
    name: str
    description: str
    instructions: str
    cook_time: int
    difficulty: int
    photo_url: str
    ingredients: List[Ingredient]
    tags: List[str]

    def __init__(
            self,
            recipe_id: int,
            name: str,
            description: str,
            instructions: str,
            cook_time: int,
            difficulty: int,
            photo_url: str,
            ingredients: List[Ingredient],
            tags: List[str]
    ):
        self.recipe_id = recipe_id
        self.name = name
        self.description = description
        self.instructions = instructions
        self.cook_time = cook_time
        self.difficulty = difficulty
        self.photo_url = photo_url
        self.ingredients = ingredients
        self.tags = tags
