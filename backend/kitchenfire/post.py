from kitchenfire.recipe import Recipe


class Post:
    post_id: int
    no_likes: int
    recipe: Recipe

    def __init__(
            self,
            post_id: int,
            no_likes: int,
            recipe: Recipe
    ):
        self.post_id = post_id
        self.no_likes = no_likes
        self.recipe = recipe
