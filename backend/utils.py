import random
import json
import os

ROLES = ("spy", "guess")
TEAM_COLORS = ('blue', 'red')
NUMBER_OF_WORDS = 25

def get_random_words() -> list:
    """ read from json list of words and pseudo randomly return 25 of them
    """
    with open(f"{os.getcwd()}/wordsList.json", "r", encoding='utf-8') as f:
        words_list = json.load(f)

    guess_list = []
    tmp = []

    while len(guess_list) < NUMBER_OF_WORDS:
        tmp += [words_list[random.randint(0, len(words_list) - 1)] for _ in range(NUMBER_OF_WORDS)]
        guess_list = list(set(tmp))[0:25]

    return guess_list


def init_grid(number_of_players: int=4, size: int=5) -> list:
    """ init the grid game using random list of words and associate them to teams
    """
    words = get_random_words()
    MINE_CASES = 1
    COLORED_CASES = 15
    FILLED_CASES = int(size*size - (MINE_CASES + COLORED_CASES))
    if number_of_players == 2:
        # need to create 2 grids for this case to possibly have same cells with two colors
        color_list = ["black_red"] * MINE_CASES + ["black_blue"] * MINE_CASES + ["blue"] * int((COLORED_CASES + 1) // 2) + ["red"] * int(COLORED_CASES / 2) + ["white"] * (FILLED_CASES - 1)
    else:
        color_list = ["black"] * MINE_CASES + ["blue"] * int((COLORED_CASES + 1) // 2) + ["red"] * int(COLORED_CASES / 2) + ["white"] * FILLED_CASES
    random.shuffle(color_list)
    return [{
        "discovered": False,
        "word": words[i],
        "color": elem,
    } for i, elem in enumerate(color_list)]



def handle_grid(grid: list, positions: tuple, player_color: str) -> list:
    """ handler for grid object used whenever a socket is received.
    params:
     - grid(list): the grid of words
     - positions(list): [{x: int, y: int}] coordinates of chosen words
     - player_color(str): color of the player who commit its choices
     - score:(str): 
    returns: new list with updated states and game_status that state if game should be over
    """
    game_status = {
        "status": "run"
    }
    for position in positions:
        case = grid[position]
        case.update({"discovered": True})
        if winner := handle_victory(grid, case.get("color") == f"black_{get_any_other(TEAM_COLORS, player_color)}", player_color):
            game_status.update({
                "status": "end",
                "winner": winner
            })
            return grid, game_status
    return grid, game_status


def handle_roles(clients: list, sid: str, addition: bool)-> tuple:
    """ handler for roles on user joining socket pipe.
    params:
     - clients(list): list of already set clients
     - sid(str): session unique ID for socket client
     - addition(bool): wether the handler add or remove a client
    returns: tuple('new clients list',' role for new client to emit back to socket client')
    """
    if addition:
        if len(clients) >= 2:
            raise Exception("No more than two players allowed")
        try:
            client_ = clients[0].copy()
        except IndexError:
            client_ = {
                "role": "guess",
                "team_color": "blue"
            }
        new_client = {
            "role": get_any_other(ROLES, client_['role']),
            "team_color": get_any_other(TEAM_COLORS, client_['team_color']),
            "sid": sid
        }
        clients += [new_client]
        return clients, client_
    else:
        # handle game pause while len != 2
        # TODO-> send socket event with new number of players and wait
        # for 2 numbers again
        return list(filter(lambda client: client['sid'] != sid, clients)), None
        pass


def get_any_other(input: tuple, already_took: str):
    """return next item not present in given tuple"""
    return next(elem for elem in input if elem != already_took)


def handle_victory(grid, is_mine_case, player_color):
    if is_mine_case:
        return get_any_other(TEAM_COLORS, player_color)
    for color in TEAM_COLORS:
        if not any(case['discovered'] == False and case['color'] == color for case in grid):
            return color
    return False
