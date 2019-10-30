import { Component, OnInit, Input, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserchatService } from './userchat.service';
import { StarRatingComponent } from 'ng-starrating';
import { Message } from './Message';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { SocketStorage } from './SocketStorage';
import { Chats } from './Chats';

export interface DialogData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-userchat',
  templateUrl: './userchat.component.html',
  styleUrls: ['./userchat.component.css']
})
export class UserchatComponent implements OnInit {


  private serverUrl = environment.url + 'socket';
  private uuId: string;
  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  private stompClient;
  // private form: FormGroup;
  // private userForm: FormGroup;
  messages: Message[] = [];
  chats: Chats[] = [];
  title: string;
  description: string;
  //messages: Message[];

  end: boolean = false;

  private ticketParams:Object;

  @Input('usermail') usermail: string;

  //private serverUrl = 'http://15.206.36.205:8765/botwatson/websocketApp';
  

  constructor(
    public http: HttpClient,public dialog: MatDialog,
    private toastr: ToastrService,
    public userservice: UserchatService
  ) {
    //this.initializeWebSocketConnection();
  }

  ngOnInit() {
    
    this.uuId = this.uuid();
    this.initializeWebSocketConnection();
    
    this.userservice.getChats(this.usermail).subscribe(data => {
      
      data.map(chatMessage => {
        console.log(chatMessage);
        let previousMessage: Message = { content: chatMessage.message, emailId: '', type: chatMessage.user, sender:'' };
        this.messages.push(previousMessage);
        console.log(previousMessage);
        });

    });
    // this.openSocket();
    // this.sendMessageWhenEstablished();

  }


  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}) {
    // alert(`Old Value:${$event.oldValue}, 
    //   New Value: ${$event.newValue}, 
    //   Checked Color: ${$event.starRating.checkedcolor}, 
    //   Unchecked Color: ${$event.starRating.uncheckedcolor}`);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ReportDialog, {
      height: 'auto',
      width: 'auto',
      //width: '250px',
      data: {title: this.title, description: this.description}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.greivance = result;
      //console.log(result);
      this.ticketParams={
        query:result,
        type:"grievance",
        usermail:this.usermail
      }
      console.log("params "+this.ticketParams);
      this.userservice.postTicket(this.ticketParams).subscribe(result=>console.log(result));
    });
  }


 
  // sendMessage(message: string) {
  //   //this.messages.push(message);
  //   let chatMessage = {
	// 		sender : "User",
	// 		content : message,
  //     type : 'CHAT',
  //     emailId: this.usermail
	// 	};
  //   this.stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
  //   this.stompClient.send('/app/chat.botMessage', {}, JSON.stringify(chatMessage));
  //   //this.end = true;
  //   (<HTMLInputElement>document.getElementById('chatmessage')).value=''; 
  // }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl, '_reserved' , 10);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, (res) => {
    that.isLoaded = true;
      // console.log(res.command);
      // console.log('socket id = ' + ws.sessionId);
    // this.openGlobalSocket();
    this.openSocket();
    });
  }

  openSocket() {
    // if (this.isLoaded) {
      this.isCustomSocketOpened = true;
      console.log('uuid = ' + this.uuId);
      this.stompClient.subscribe("/socket-publisher/"+ this.uuId, (message) => {
        this.handleResult(message);
        console.log('connected');
      });
      this.sendMessageWhenEstablished();
      // }
  }

  public uuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      let random = Math.random() * 16 | 0; // Nachkommastellen abschneiden
      let value = char === "x" ? random : (random % 4 + 8); // Bei x Random 0-15 (0-F), bei y Random 0-3 + 8 = 8-11 (8-b) gemäss RFC 4122
      return value.toString(16); // Hexadezimales Zeichen zurückgeben
    });
  }

  sendMessage(message: string) {
    
      let chatmessage: Message = { content: message, emailId: this.usermail, type: 'user', sender:'user' };
      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(chatmessage));
      this.messages.push(chatmessage);
      //this.handleResult(chatmessage);
      (<HTMLInputElement>document.getElementById('chatmessage')).value='';
    
  }

  // openGlobalSocket() {
  //   this.stompClient.subscribe("/socket-publisher", (message) => {
  //     console.log('global');
  //     this.handleResult(message);
  //   });
  // }

  sendMessageWhenEstablished() {
      console.log("when estd");
      let socketStorage: SocketStorage = { emailId: this.usermail, socketId: this.uuId };
      //let message: Message = { content: this.uuId, emailId: 'this.userForm.value.fromId', type: this.userForm.value.toId, sender:'CHAT' };
      this.stompClient.send("/socket-subscriber/send/socketid", {}, JSON.stringify(socketStorage));
      console.log("when estd sent the socket message as = "+socketStorage);
  }


  handleResult(message) {
    if (message.body) {
      let messageResult: Message = JSON.parse(message.body);
      console.log('result = ' + messageResult);
      this.messages.push(messageResult);
      this.toastr.success("new message recieved", null, {
        'timeOut': 3000
      });
    }
  }

}
//   initializeWebSocketConnection() {
    
//     const ws = new SockJS(this.serverUrl);
//     this.stompClient = Stomp.over(ws);
//     // let that = this;
//     this.stompClient.connect({}, (frame) => {
//       //subscribe
//       this.stompClient.subscribe('/topic/public', (message) => {
//         if (message.body) {
         
//           const payload = JSON.parse(message.body);
          
//           const querry = new Message();
//           querry.value = payload.sender + ': ' + payload.content;
//           querry.sender = payload.sender;
//           console.log(querry);

//           this.messages.push(querry);

        
//         }
//       });
//       this.stompClient.send("/app/chat.welcomeFromBot", {}, JSON.stringify({
//         sender : 'Optimus',
//         type : 'initiate-chat'
//     }));    
//     });
//   }

  
// }

@Component({
  selector: 'report-dialog',
  templateUrl: 'report-dialog.html',
})
export class ReportDialog {

  constructor(
    public dialogRef: MatDialogRef<ReportDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}