from dataclasses import dataclass
from typing import Optional
import json

@dataclass
class Ingredient:
    ingredient_id: int
    name: str
    ingredient_type: str
    amount: Optional[float]
    amount_unit: Optional[str]

    def to_json(self):
        return json.dumps({
            "ingredient": self.name,
            "amount": self.amount,
            "unit": self.amount_unit,
        })

