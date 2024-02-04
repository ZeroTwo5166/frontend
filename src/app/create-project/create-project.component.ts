import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DocumentService } from '../document.service';
import { HubService } from '../services/hub.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent {
  projectTitle: string = '';
  room: string = '';
  username : string = "";

  constructor(private dialogRef: MatDialogRef<CreateProjectComponent>,
    private router: Router, 
    private chatService : DocumentService, 
    private hubService : HubService,
    private toastr : ToastrService,) {}

  closeDialog() {
    // Clear input values and close the dialog
    this.projectTitle = '';
    this.room = '';
    this.dialogRef.close();
  }

  createRoom(){
    const userObj = localStorage.getItem("LoggedInUser");
    if(userObj){
      this.username = JSON.parse(userObj).username;
    }

    if(this.room != ""){
      this.hubService.checkRoomValidity(this.room).subscribe((response : any) => {
        if(response.containsRoom){
          //room already exists, can't create it
          this.toastr.error(`Room "${this.room}" already exists!`,"Room Creation Failed", {
            timeOut:1000,
            progressBar:false
          })
        } else {
          //check if user has entered a title for their project
          if(this.projectTitle != ""){
            this.chatService.createRoom(this.username, this.room, this.projectTitle);
            this.toastr.success(`Room "${this.room}" created.`,"Room Created", {
              timeOut:1000,
              progressBar:false
            })
            this.dialogRef.close();
            this.router.navigate(['code-editor'])
          }
          else {
            this.toastr.error(`Enter a title!!`,"Room Creation Failed", {
              timeOut:1000,
              progressBar:false
            })
          }
        }
      })
    }
    else {
      this.toastr.error(`Enter room!!!`,"Room Creation Failed", {
        timeOut:1000,
        progressBar:false
      })
    }


  }
}
