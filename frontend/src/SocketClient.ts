import { io } from "socket.io-client";

export const SocketClient = io((process.env.REACT_APP_SOCKET_SERVER as string), {
    autoConnect: false
});
