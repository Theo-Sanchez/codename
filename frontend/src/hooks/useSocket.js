import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

const initStates = {
  gameStatus: { winner: "", status: "run" },
  turn: "red",
  guessHelper : { clue: "", nbOfGuess: 0 }
}
const useSocket = () => {
  const [gameGrid, setGameGrid] = useState([])
  const [gameStatus, setGameStatus] = useState(initStates.gameStatus)
  const [turn, setTurn] = useState(initStates.turn)
  const [guessHelper, setGuessHelper] = useState(initStates.guessHelper)
  const [teamColor, setTeamColor] = useState()
  const socketRef = useRef();
  const [numberOfClients, setNumberOfClients] = useState(0);

  useEffect(() => {
    socketRef.current = socketIOClient(ENDPOINT);
    socketRef.current.emit("join");

    socketRef.current.on("log", (event) => {
      setTeamColor(event.team_color);
      setGameStatus(event.game_status);
    });

    socketRef.current.on('new_player', (event) => {
      setGameStatus(event.game_status);
      setNumberOfClients(event.number_of_clients)
      if (event.number_of_clients >= 2) {
        setGameGrid(event.grid);
      }
    });

    socketRef.current.on("new_game_server", (event) => {
      setGameGrid(event.grid);
      setGameStatus(initStates.gameStatus);
      setGuessHelper(initStates.guessHelper);
      setTurn(initStates.turn);
    });

    socketRef.current.on("end_game_server", (event) => {
      setGameGrid(event.grid);
      setGameStatus(event.game_status)
    });
    
    socketRef.current.on("guess_from_server", (event) => {
      setGameGrid(event.grid);
      setGuessHelper(initStates.guessHelper);
    });

    socketRef.current.on("change_turn_server", () => {
      setTurn((turn) => turn === "red" ? "blue" : "red");
    });
    
    socketRef.current.on("helper_from_server", (event) => {
      setGuessHelper({
        clue: event.clue,
        nbOfGuess: event.number_of_guess
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (messageBody, teamColor, EVENT_NAME) => {
    socketRef.current.emit(EVENT_NAME, {
      data: messageBody,
      teamColor: teamColor,
    });
  }
  const changeTurn = () => {
    socketRef.current.emit("change_turn_client");
  }

  return {
    turn,
    teamColor,
    gameGrid,
    sendMessage,
    guessHelper,
    changeTurn,
    gameStatus,
    numberOfClients
  };
};

export default useSocket;