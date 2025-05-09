import { Component, OnInit } from '@angular/core';
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
  
  
  constructor(private socketService: ChatService) {
   
  }

  ngOnInit(): void {
     this.socketService.onMessage().subscribe((data) => {
      this.messages.push(data);
    });

     this.socketService.onImageMessage().subscribe((imgData) => {
      this.messages.push({
        username: imgData.username,
        message: imgData.prompt,
        imageUrl: imgData.url
      });
    });

  }

  sendMessage() {
    if (this.message.trim()) {
      const msg = { username: this.username, message: this.message };
      this.messages.push(msg); // Show immediately for sender
      this.socketService.sendMessage(msg);
      this.message = '';
    }
  }

  // sendMessage(): void {
  //   if (this.message.trim()) {
  //     this.messages.push({ message: this.message, username: this.username });
  //     this.socketService.sendMessage(this.message, this.username);
  //     this.message = '';
  //   }
  // }

 
}
