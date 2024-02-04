import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DocumentService } from '../document.service';
import { HubService } from '../services/hub.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-join-project',
  templateUrl: './join-project.component.html',
  styleUrl: './join-project.component.css'
})
export class JoinProjectComponent {

  room: string = '';
  username : string = "";

  constructor(private dialogRef: MatDialogRef<JoinProjectComponent>,
    private router: Router, 
    private chatService : DocumentService, 
    private hubService : HubService,
    private toastr : ToastrService,) {}

  joinRoom() {
    const userObj = localStorage.getItem("LoggedInUser");
    if(userObj){
      this.username = JSON.parse(userObj).username;
    }
    if(this.room != ""){
      this.hubService.checkRoomValidity(this.room).subscribe((response : any)=>{
        if(response.containsRoom){
          this.chatService.joinRoom(this.username, this.room); //If room is valid, allow user to join the room
          this.toastr.success(`Joined room: ${this.room}`,"Room Joined Success", {
            timeOut:1000,
            progressBar:false
          })
          this.dialogRef.close();
          setTimeout(()=>{
            this.router.navigate(['code-editor'])
          }, 500)
        } else {
          //If room is not valid/doesnt exists, let the user know
          this.toastr.error(`Room "${this.room}" doesn't exists!`,"Room Joined Failed", {
            timeOut:1000,
            progressBar:false
          })
        }
      })
    } else {
      this.toastr.error(`Enter room`,"Room Joined Failed", {
        timeOut:1000,
        progressBar:false
      })
    }
    
  }



  closeDialog() {
    // Clear input values and close the dialog
    this.room = '';
    this.dialogRef.close();
  }
}
