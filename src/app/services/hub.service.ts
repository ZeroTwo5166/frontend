import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HubService {

  baseURL : string = "https://localhost:7235/api/monacohub";

  constructor(private http: HttpClient) { }

  //checks if the room is valid or not
  checkRoomValidity(roomName:string){
    const url = `${this.baseURL}/checkRoom/${roomName}`;
    return this.http.get(url);
  }


}
