import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../document.service';
import { HubService } from '../services/hub.service';
import { ToastrService } from 'ngx-toastr';
import { LoginStatusService } from '../services/login-status.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { JoinProjectComponent } from '../join-project/join-project.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent{

  constructor(private router: Router, 
    private loginStatus : LoginStatusService,
    private dialog : MatDialog){
      this.loginStatus.checkLoginStatus(router);
  }

  //Open popup for creating room
  createOptions(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CreateProjectComponent, dialogConfig);
  }

  //Open popup for joining room
  joinOptions(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(JoinProjectComponent, dialogConfig);
  }


}
