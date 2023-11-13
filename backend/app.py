from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from utils import init_grid, handle_grid, handle_roles
import random
from pprint import pprint

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")
CORS(app)

clients = []

grid_instance = init_grid()
score = {"blue": 0, "red": 0}

# for i, params in enumerate([
#     {
#         "grid": grid_instance,
#         "position": tuple(random.randint(0, 4) for _ in range(2)),
#         "player_color": "red",
#         "score": score
#     },
#     {
#         "grid": grid_instance,
#         "position": tuple(random.randint(0, 4) for _ in range(2)),
#         "player_color": "blue",
#         "score": score
#     },
#     {
#         "grid": grid_instance,
#         "position": tuple(random.randint(0, 4) for _ in range(2)),
#         "player_color": "red",
#         "score": score
#     },
# ]):
#     grid_instance, score = handle_grid(**params)
#     pprint(grid_instance, indent=2)
#     pprint(score, indent=2)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@socketio.on('connect')
def on_connect():
    try:
        global clients
        sid = request.sid
        print(sid, "in log")
        clients, new_client = handle_roles(clients, sid, addition=True)
        print(f'Client with sid {sid} connected', clients)
        emit('log', {
            'message': f'Connected as spy',
            "grid": grid_instance,
            "team_color": new_client['team_color'],
            "role": new_client['role']
        })
    except Exception as e:
        print('exception', e)
        

@socketio.on('disconnect')
def on_disconnect():
    global clients
    print(request.sid, "in log out")
    clients, _ = handle_roles(clients, request.sid, addition=False)
    print(f'Client with sid {request.sid} disconnected', clients)

@socketio.on('guess_from_client')
def handle_change_list_event(json):
    print("received grid event", json)
    global grid_instance
    grid_instance = handle_grid(
        grid=grid_instance,
        position=json['position'],
        player_color=json['color']
    )
    emit('guess_from_server', {"grid": grid_instance}, broadcast=True)


@socketio.on('helper_from_client')
def handle_guess_word_event(json):
    print("received guess help", json)
    emit('helper_from_server', {'data': {**json['data']}}, broadcast=True)


@socketio.on('end_game')
def handle_end_game_event(json):
    print('game end event')
    emit('end_game', json)

@socketio.on('new_game')
def on_new_game():
    # handle new_grid mechanics
    pass