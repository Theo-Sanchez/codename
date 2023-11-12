import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const EMIT_EVENT = "from_client";
const LISTENER_EVENT = "from_server";
const ENDPOINT = "http://localhost:5000";

const useSocket = () => {
  const [gameGrid, setGameGrid] = useState()
  const [role, setRole] = useState()
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(ENDPOINT);
    socketRef.current.emit("join"); // connect

    socketRef.current.on("log", (event) => {
      setRole(event.role);
      setGameGrid(event.grid);
    });

    socketRef.current.on(LISTENER_EVENT, (event) => {
      console.log("test_receive_event", event.grid)
      setGameGrid(newGrid);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (messageBody, role) => {
    socketRef.current.emit(EMIT_EVENT, {
      data: messageBody,
      role: role,
    });
  }

  return { role, gameGrid, sendMessage };
};

export default useSocket;