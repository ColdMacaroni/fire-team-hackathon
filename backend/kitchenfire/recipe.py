from kitchenfire.Ingredient import Ingredient
from typing import List
import json
from dataclasses import dataclass


@dataclass
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

@dataclass
class Post:
    recipe: Recipe
    likes: int
    rating: float
    reviews: int

    def to_json(self) -> str:
        out = {
                "id": self.recipe.recipe_id,
                "name": self.recipe.name,
                "image": self.recipe.photo_url,
                "rank": self.likes,
                "rating": self.rating,
                "reviews": self.reviews,
        }

        return json.dumps(out)
