from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from grid import init_grid, handle_grid
import random
from pprint import pprint

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")
CORS(app)

nb_users = 0
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
        print('Client connected')
        emit('log', {'message': f'Connected as', "grid": grid_instance})
    except:
        raise ConnectionRefusedError({'message': 'There are already two players connected'})

@socketio.on('disconnect')
def on_disconnect():
    print('Client disconnected')

@socketio.on('my event')
def handle_my_custom_event(json):
    print("received grid event", json)
    emit('my response', json)

@socketio.on('end_game')
def handle_my_custom_event(json):
    print('game end event')
    emit('end_game', json)