import { Injectable } from '@angular/core';
import { Project } from './project';
import { Issue } from './issue';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import base64 from 'base-64';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private token;
  private server = 'https://jira-work-logger-api.herokuapp.com';
  private apiUrl = `${this.server}/api`;
  private authUrl = `${this.apiUrl}/authenticate`;
  private projectsUrl = `${this.apiUrl}/projects`;
  private issuesUrl = `${this.apiUrl}/projects/:projectKey/issues`;
  private logWorkUrl = `${this.apiUrl}/issues/:issueKey/worklog`;

  constructor(private http: HttpClient) {
    const token = sessionStorage.getItem('TOKEN');

    if (token) {
      this.token = token;
    }
  }

  login(data): any {
    this.token = base64.encode(`${data.username}:${data.password}`);

    sessionStorage.setItem('TOKEN', this.token);

    return this.http.post(this.authUrl, data);
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectsUrl, {
      headers: { 'Authorization': `Basic ${this.token}` }
    });
  }

  getIssues(key, assignee): Observable<Issue[]> {
    let url = this.issuesUrl.replace(/:projectKey/, key) + `?assignee=${assignee}`;

    return this.http.get<Issue[]>(url, {
      headers: { 'Authorization': `Basic ${this.token}` }
    });
  }

  logWork(key, data): any {
    const url = this.logWorkUrl.replace(/:issueKey/, key);

    return this.http.post<any>(url, data, {
      headers: { 'Authorization': `Basic ${this.token}` }
    });
  }
}
