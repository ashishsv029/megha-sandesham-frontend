import { io } from 'socket.io-client';
//const URL = 'ws://app:3100'
const URL = `wss://${window.location.hostname}`
// export const socket = io(URL, );

export const CustomSocket = (headers) => {
    return io(URL, {
        transports: ['websocket', 'polling'],
        autoConnect: false,
        extraHeaders: headers || {}
      });
} // Socket(headers).connect()