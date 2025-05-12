import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private readonly uri: string = 'http://localhost:3000';

  constructor() {
    this.socket = io('http://localhost:3000', {
    transports: ['websocket'], 
  });
  }

  sendMessage( data: { username: string; message: string }) {
    this.socket.emit('send_message', data);
  }

  onBotResponse(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('bot_response', data => {
        observer.next(data);
      });
    });
  }

   onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('receive_message', (data) => observer.next(data));
    });
  }

  onImageMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('image_message', (data) => observer.next(data));
    });
  }

  // onMessage(callback: (data: any) => void) {
  //   this.socket.on('receive_message', callback);
  // }



 
}
