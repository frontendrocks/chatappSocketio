import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private readonly uri: string = 'http://localhost:3000';

  constructor() {
    this.socket = io(this.uri);
  }

  sendMessage(message: string, username: string) {
    this.socket.emit('send_message', { message, username });
  }

  onMessage(callback: (data: any) => void) {
    this.socket.on('receive_message', callback);
  }
}
