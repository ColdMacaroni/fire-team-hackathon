class Ingredient:
    id: int
    name: str
    type: str
    amount: int
    amount_unit: str

    def __init__(self, id: int, name: str, ingredient_type: str, amount: int, amount_unit: str):
        self.id = id
        self.name = name
        self.ingredient_type = ingredient_type
        self.amount = amount