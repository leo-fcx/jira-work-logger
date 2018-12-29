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
  private site;
  private server = 'https://jira-work-logger-api.herokuapp.com';
  private apiUrl = `${this.server}/api`;
  private authUrl = `${this.apiUrl}/authenticate`;
  private projectsUrl = `${this.apiUrl}/projects`;
  private issuesUrl = `${this.apiUrl}/projects/:projectKey/issues`;
  private logWorkUrl = `${this.apiUrl}/issues/:issueKey/worklog`;

  constructor(private http: HttpClient) {
    const token = sessionStorage.getItem('TOKEN');
    this.site = sessionStorage.getItem('JIRA-SITE');

    if (token) {
      this.token = token;
    }
  }

  login(data): any {
    this.site = data.site || 'https://meng-mod-04.atlassian.net';
    this.token = base64.encode(`${data.username}:${data.password}`);

    const url = this.authUrl + `?site=${this.site}`;

    sessionStorage.setItem('TOKEN', this.token);
    sessionStorage.setItem('JIRA-SITE', this.site);

    return this.http.post(url, {
      username: data.username,
      password: data.password
    });
  }

  getProjects(): Observable<Project[]> {
    const url = this.projectsUrl + `?site=${this.site}`;

    return this.http.get<Project[]>(url, {
      headers: { 'Authorization': `Basic ${this.token}` }
    });
  }

  getIssues(key, assignee): Observable<Issue[]> {
    const url = this.issuesUrl.replace(/:projectKey/, key) + `?assignee=${assignee}&site=${this.site}`;

    return this.http.get<Issue[]>(url, {
      headers: { 'Authorization': `Basic ${this.token}` }
    });
  }

  logWork(key, data): any {
    const url = this.logWorkUrl.replace(/:issueKey/, key) + `?site=${this.site}`;

    return this.http.post<any>(url, data, {
      headers: { 'Authorization': `Basic ${this.token}` }
    });
  }
}
