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

   uploadFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      this.socket.emit('file-upload', {
        name: file.name,
        type: file.type,
        size: file.size,
        data: Array.from(new Uint8Array(arrayBuffer)),
      });
    };
    reader.readAsArrayBuffer(file);
  }

  onUploadSuccess(callback: (fileName: string) => void) {
    this.socket.on('upload-success', callback);
  }

  onNewFile(callback: (fileMeta: { name: string; url: string }) => void) {
  this.socket.on('new-file', callback);
}

  onUploadError(callback: (error: string) => void) {
    this.socket.on('upload-error', callback);
  }

}
