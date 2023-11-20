from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from utils import init_grid, handle_grid, handle_roles

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")
CORS(app)

clients = []

grid_instance = init_grid(number_of_players=2) # this should be in start_game event
game_status = {
    "status": "run",
    "winner": ""
}

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@socketio.on('connect')
def on_connect():
    try:
        global clients
        global game_status
        sid = request.sid
        clients, new_client = handle_roles(clients, sid, addition=True)
        print(f'Client with sid {sid} connected', clients)
        emit('log', {
            "game_status": game_status,
            "team_color": new_client['team_color'],
            "role": new_client['role']
        })
        emit('new_player', {
            "grid": grid_instance if len(clients) >= 2 else "",
            "game_status": game_status,
            "number_of_clients": len(clients)
        }, broadcast=True)
    except Exception as e:
        print('exception', e)
        

@socketio.on('disconnect')
def on_disconnect():
    global clients
    clients, _ = handle_roles(clients, request.sid, addition=False)
    print(f'Client with sid {request.sid} disconnected', clients)

@socketio.on('change_turn_client')
def handle_turn_client():
    print('should change turn')
    emit('change_turn_server', broadcast=True)

@socketio.on('guess_from_client')
def handle_change_list_event(json):
    global grid_instance
    global game_status
    grid_instance, game_status = handle_grid(
        grid=grid_instance,
        positions=json['data'],
        player_color=json['teamColor']
    )
    if game_status['status'] == "end":
        emit('end_game_server', {"grid": grid_instance, "game_status": game_status}, broadcast=True)
        return
    emit('guess_from_server', {"grid": grid_instance}, broadcast=True)


@socketio.on('helper_from_client')
def handle_guess_word_event(json):
    emit('helper_from_server', json['data'], broadcast=True)


@socketio.on('end_game_client')
def handle_end_game_event(json):
    print('game end event')
    emit('end_game_server', json)

@socketio.on('new_game_client')
def on_new_game(_):
    # handle new_grid mechanics
    print('new game event received from client')
    global grid_instance
    global game_status
    grid_instance = init_grid();
    game_status = {
        "status": "run",
        "winner": ""
    }
    emit('new_game_server', {"grid": grid_instance, "game_status": game_status}, broadcast=True)
    # no changing team for now.. should we?
    # what about clues, is it correctly reset?
    pass