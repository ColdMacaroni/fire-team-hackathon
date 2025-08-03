from dataclasses import dataclass
from .recipe import Recipe
import json


@dataclass
class Post:
    recipe: Recipe
    number_of_likes: int
    rating: float
    reviews: int

    def to_json(self) -> str:
        out = {
            "id": self.recipe.recipe_id,
            "name": self.recipe.name,
            "image": self.recipe.photo_url,
            "rank": self.number_of_likes,
            "rating": self.rating,
            "reviews": self.reviews,
            "tags": [ t.to_json() for t in self.recipe.tags ],
            "ingredients": [i.to_json() for i in self.recipe.ingredients],
            "instructions": self.recipe.instructions,
            "isFavorited": not not self.recipe.recipe_id % 2,  # TODO: Favourites?
            "likes": self.number_of_likes,
            "comments": self.reviews,
        }

        return json.dumps(out)
