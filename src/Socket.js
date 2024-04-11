import { io } from 'socket.io-client';
const URL = 'ws://localhost:3100'
// export const socket = io(URL, );

export const CustomSocket = (headers) => {
    return io(URL, {
        autoConnect: false,
        extraHeaders: headers || {}
      });
} // Socket(headers).connect()