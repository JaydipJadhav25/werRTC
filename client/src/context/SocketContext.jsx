import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

// Create the Socket context
export const SocketContext = createContext(null);

// Custom hook to use the socket
export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};

// SocketProvider to provide the socket instance
export const SocketProvider = (props) => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
