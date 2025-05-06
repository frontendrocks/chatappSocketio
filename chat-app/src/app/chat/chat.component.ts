import { Component, OnInit } from '@angular/core';
// import { SocketService } from '../chat.service';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone:true,
  imports:[FormsModule, CommonModule],
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message = '';
  messages: any[] = [];
  username = 'User' + Math.floor(Math.random() * 1000);
  
  files: { name: string; url: string }[] = [];
  constructor(private socketService: ChatService) {
    this.socketService.onNewFile((fileMeta) => {
    this.files.push(fileMeta);
  });
  }

  ngOnInit(): void {
    this.socketService.onMessage((data: any) => {
      this.messages.push(data);
    });
     this.socketService.onUploadSuccess((fileName) => {
      this.message = `Upload successful: ${fileName}`;
    });

    this.socketService.onUploadError((error) => {
      this.message = `Upload failed: ${error}`;
    });
  }

   onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.socketService.uploadFile(file);
      this.message = 'Uploading...';
    }
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.messages.push({ message: this.message, username: this.username });
      this.socketService.sendMessage(this.message, this.username);
      this.message = '';
    }
  }

 
}
