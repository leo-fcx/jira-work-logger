import { Component, OnInit } from '@angular/core';
import { Project } from '../project';
import { Issue } from '../issue';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  constructor(private projectService: ProjectService) {
    this.recoverSession();
  }

  username;
  email;
  password;
  session;
  projects: Project[];
  issues: Issue[];
  selectedProject: Project;
  selectedIssue: Issue;
  description = '';
  time = {hour: 0, minute: 0};

  ngOnInit() {
    if (this.session) {
      this.getProjects();
    }
  }

  onLogin() {
    this.login(this.username, this.password);
    this.email = this.username;
    this.username = undefined;
    this.password = undefined;
  }

  onLogout() {
    this.logout();
  }

  onSelectProject(project: Project) {
    this.selectedProject = project;
    this.selectedIssue = undefined;

    this.getIssues(project.key);
  }

  onSelectIssue(issue: Issue) {
    this.selectedIssue = issue;
  }

  onSaveWorkLog() {
    const milliseconds = this.getTime();

    this.logWork(this.selectedIssue.key, {
      comment: this.description,
      timeSpentSeconds: milliseconds
    });
  }

  setSession(session) {
    this.session = session;
    sessionStorage.setItem('SESSION', JSON.stringify(session));
  }

  recoverSession() {
    const session = sessionStorage.getItem('SESSION');

    if (session) {
      this.session = JSON.parse(session);
    }
  }

  clearSession() {
    this.session = undefined;
    sessionStorage.removeItem('SESSION');
  }

  login(username, password) {
    this.projectService
      .login({ username, password })
      .subscribe((data) => {
        data.session.username = username;
        this.setSession(data.session);
        this.getProjects();
      });
  }

  logout() {
    this.clearSession();
  }

  getProjects(): void {
    this.projects = undefined;
    this.projectService
      .getProjects()
      .subscribe(projects => this.projects = projects);
  }

  getIssues(key): void {
    this.issues = undefined;
    this.projectService
      .getIssues(key)
      .subscribe(issues => {
        this.issues = issues;
      });
  }

  logWork(key, data): void {
    this.projectService
      .logWork(key, data)
      .subscribe(() => {
        this.selectedIssue.fields.timespent += this.getTime();
        this.time = {hour: 0, minute: 0};
        this.description = '';
      });
  }

  getTime() {
    return (this.time.hour * 60 + this.time.minute) * 60;
  }
}
