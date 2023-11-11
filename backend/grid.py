import random

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


def handle_grid(grid: list, position: tuple, player_color: str, score: dict) -> tuple:

    # enemy_color = "red" if player_color == "blue" else "blue"
    x = position[0]
    y = position[1]
    case = grid[x*5 + y]
    match = False
    if (case.get("color")) == player_color:
        score[player_color] += 1
        match = True
    # elif case.get("color") == enemy_color :
    #     print("mistaken")
    elif case.get("color") == "black":
        print('game should end') 
    else:
        print('should be white case or enemy coloured')

    case.update({"discovered": True})
    return grid, match