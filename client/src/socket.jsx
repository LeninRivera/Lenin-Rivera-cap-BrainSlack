import { io } from "socket.io-client";

const server = "http://localhost:8080/";
const socket = io(server, { autoConnect: false });

export default socket;
