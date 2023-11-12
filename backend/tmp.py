import random
import json

def get_random_words() -> list:
    return [
        "a1","b1","c1","d1","e1",
        "a2","b2","c2","d2","e2",
        "a3","b3","c3","d3","e3",
        "a4","b4","c4","d4","e4",
        "a5","b5","c5","d5","e5",
    ]

def init_grid(size: int=5) -> list:
    words = get_random_words()
    MINE_CASES = 1
    COLORED_CASES = 16
    FILLED_CASES = int(size*size - (MINE_CASES + COLORED_CASES))
    
    color_list = ["black"] * MINE_CASES + ["blue"] * int(COLORED_CASES / 2) + ["red"] * int(COLORED_CASES / 2) + ["white"] * FILLED_CASES
    random.shuffle(color_list)

    return [{
        "discovered": False,
        "word": words[i],
        "color": elem,
    } for i, elem in enumerate(color_list)]

with open("tmp.json", 'w', encoding="utf-8") as f:
    f.write(json.dumps(init_grid(), ensure_ascii=False, indent=2))
