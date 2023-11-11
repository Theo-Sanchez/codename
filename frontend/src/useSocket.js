import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const EMIT_EVENT = "sent_event";
const LISTENER_EVENT = "received_event";
const ENDPOINT = "http://localhost:5000";

const useSocket = () => {
  const [gameGrid, setGameGrid] = useState()
  const [role, setRole] = useState()
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(ENDPOINT);
    socketRef.current.emit("join"); // connect

    socketRef.current.on("log", (newGrid) => {
      console.log("test_receive_event", newGrid)
      setGameGrid(newGrid);
    });

    socketRef.current.on(LISTENER_EVENT, (newGrid) => {
      console.log("test_receive_event", newGrid)
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