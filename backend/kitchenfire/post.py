class Post:
    recipe_id: int
    number_of_likes: int
    rating: float
    reviews: int

    def __init__(
            self,
            recipe_id: int,
            number_of_likes: int,
            rating: float,
            reviews: int
    ):
        self.recipe_id = recipe_id
        self.number_of_likes = number_of_likes
        self.rating = rating
        self.reviews = reviews
