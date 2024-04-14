import { io } from "socket.io-client";

export const SocketClient = io(
    (import.meta.env.VITE_APP_SOCKET_SERVER as string), 
    {
        autoConnect: false
    }
);
