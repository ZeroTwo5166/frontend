import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DocumentService {

  private hubConnection!: HubConnection;

  private initialDocumentSubject = new BehaviorSubject<string>('');

  intialDoc$ = this.initialDocumentSubject.asObservable();

  private roomStatusSeubject = new Subject<string>();

  roomStausSubject$ = this.roomStatusSeubject.asObservable();


  // BehaviorSubject to hold the last received document and notify new subscribers
  private documentUpdateSubject = new BehaviorSubject<string>('');


  // Observable for document updates
  documentUpdate$ = this.documentUpdateSubject.asObservable();
 
   constructor() {
     this.hubConnection = new HubConnectionBuilder()
       .withUrl('https://localhost:7235/chat')
       .build();
 
     this.hubConnection
       .start()
       .then(() => {
        console.log('Connected to SignalR hub')
      })
       .catch((error) => console.error('Failed to connect to SignalR hub', error));

      this.hubConnection.on("ReceiveMessage", (user:string, message:string, messageTime:string, userCode : string) => {
        console.log("User: ", user);
        console.log("Message: ", message);
        console.log("messageTime: ", messageTime);
        console.log("UserCode: ", userCode);
        this.initialDocumentSubject.next(userCode);
      })
 
      // Register a method to receive document updates from the server
      this.hubConnection.on('ReceiveDocumentUpdate', (updatedDocument: string) => {
        // Notify subscribers about the document update
        this.documentUpdateSubject.next(updatedDocument);
      });
   }

  public async joinRoom(user: string, room: string) {
    try {
      await this.hubConnection.invoke("JoinRoom", { user, room }, "")
    } catch (error) {
      console.error("Error joining room:", error);
    }
  }

  public async createRoom(user: string, room: string, projectTitle:string) {
    try {
      await this.hubConnection.invoke("JoinRoom", { user, room }, projectTitle);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  }

    // Add a method to broadcast document updates to all clients
    public async broadcastDocumentUpdate(updatedDocument: string, projectTitle? :string) {
      this.hubConnection.invoke('BroadcastDocumentUpdate', updatedDocument, projectTitle).catch((error) => {
        console.error('Error invoking BroadcastDocumentUpdate:', error);
      });
    }

    public async leaveChat(){
      return this.hubConnection.stop();
    }

public async RoomValidator(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        this.hubConnection.on("RoomErrorMessage", (user: string, message: string, messageTime: string, userCode: string) => {
            console.log("Room error Message: ", message);
            resolve(message !== "Room does not exist!");
        });
    });
}



}
