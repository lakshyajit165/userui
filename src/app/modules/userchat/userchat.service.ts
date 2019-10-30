import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { TicketResponse } from './TicketResponse';
import { environment } from '../../../environments/environment';
import { Chats } from './Chats'; 

@Injectable({
  providedIn: 'root'
})

export class UserchatService {

    private ticketUrl = 'http://15.206.36.205:8765/ticket-service/api/v1/tickets';

    chaturl: string = environment.url + "api/v1/socketserver/chats/";


    constructor(private httpClient: HttpClient) { }

    postTicket(ticket:Object):Observable<TicketResponse>{
        return this.httpClient.post<TicketResponse>(this.ticketUrl,ticket);
    }
    getChats(emailId: string) {
      console.log(this.chaturl + emailId);
      return this.httpClient.get<Chats[]>(this.chaturl + emailId);
    }
    
}