from dataclasses import dataclass
import json


@dataclass
class Tag:
    tag_id: int
    name: str

    def to_json(self) -> str:
        return json.dumps({"id": self.tag_id, "name": self.name})

