class Ingredient:
    ingredient_id: int
    name: str
    type: str
    amount: int
    amount_unit: str

    def __init__(
            self,
            ingredient_id: int,
            name: str,
            ingredient_type: str,
            amount: int,
            amount_unit: str
    ):
        self.ingredient_id = ingredient_id
        self.name = name
        self.ingredient_type = ingredient_type
        self.amount = amount
        self.amount_unit = amount_unit
