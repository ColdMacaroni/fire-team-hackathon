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

