import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { projectModel } from '../others';

@Injectable({
  providedIn: 'root'
})
export class ProjectApiService {

  private baseUrl = "https://localhost:7235/api/Project";
  constructor(private http : HttpClient) { }

  createProject(data : projectModel){
    return this.http.post(`${this.baseUrl}/create`, data);
  }



}
