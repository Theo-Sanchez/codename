import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";


export const socketEventKeys = {
  "guess_client": "guess_from_client",
  "receive_response": "guess_from_server",
  "emit_guess_helper": "helper_from_client",
  "receive_guess_helper": "helper_from_server",
}
const ENDPOINT = "http://localhost:5000";

const useSocket = () => {
  const [gameGrid, setGameGrid] = useState([])
  const [turn, setTurn] = useState('red')
  const [guessHelper, setGuessHelper] = useState({
    clue: "",
    nbOfGuess: 0,
  })
  const [teamColor, setTeamColor] = useState()
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(ENDPOINT);
    socketRef.current.emit("join"); // connect
    socketRef.current.on("log", (event) => {
      console.log("log", event)
      setTeamColor(event.team_color);
      setGameGrid(event.grid);
    });
    socketRef.current.on("new_game_server", (event) => {
      setGameGrid(event.grid);
    })
    socketRef.current.on(socketEventKeys.receive_response, (event) => {
      // handle guess response
      console.log("test_guess_from_server grid", event.grid)
      setGameGrid(event.grid);
      setGuessHelper({
        clue: "",
        nbOfGuess: 0,
      });
    });
    socketRef.current.on("change_turn_server", () => {
      setTurn((turn) => turn === "red" ? "blue" : "red");
    });
    
    socketRef.current.on(socketEventKeys.receive_guess_helper, (event) => {
      // handle submission of helper
      console.log("test_receive_event helper", event)
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
    changeTurn
  };
};

export default useSocket;