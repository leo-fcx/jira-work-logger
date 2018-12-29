import { Component, OnInit } from '@angular/core';
import { Project } from '../project';
import { Issue } from '../issue';
import { ProjectService } from '../project.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  constructor(private projectService: ProjectService, private toastr: ToastrService) {
    this.recoverSession();
  }

  username;
  email;
  password;
  site;
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
    this.login(this.username, this.password, this.site);
    this.email = this.username;
    this.username = undefined;
    this.password = undefined;
    this.site = undefined;
  }

  onLogout() {
    this.logout();
  }

  onSelectProject(project: Project) {
    this.selectedProject = project;
    this.selectedIssue = undefined;

    this.getIssues(project.key, this.email);
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
      this.email = this.session.username;
    }
  }

  clearSession() {
    this.session = undefined;
    sessionStorage.clear();
  }

  login(username, password, site) {
    this.projectService
      .login({ username, password, site })
      .subscribe((data) => {
        data.session.username = username;
        this.selectedProject = undefined;
        this.selectedIssue = undefined;
        this.projects = [];
        this.setSession(data.session);
        this.getProjects();
      }, (reason) => { this.toastr.error(reason.error || reason.statusText); });
  }

  logout() {
    this.clearSession();
  }

  getProjects(): void {
    this.projects = undefined;
    this.projectService
      .getProjects()
      .subscribe(projects => this.projects = projects, (reason) => { this.toastr.error('Cannot get projects information.'); });
  }

  getIssues(key, assignee): void {
    this.issues = undefined;
    this.projectService
      .getIssues(key, assignee)
      .subscribe(issues => {
        this.issues = issues;
      }, (reason) => { this.toastr.error('Cannot get issues information for project.'); });
  }

  logWork(key, data): void {
    this.projectService
      .logWork(key, data)
      .subscribe(() => {
        this.selectedIssue.fields.timespent += this.getTime();
        this.time = {hour: 0, minute: 0};
        this.description = '';
        this.toastr.success('Worklog saved.', '');
      }, (reason) => { this.toastr.error('Cannot save Worklog.'); });
  }

  getTime() {
    return (this.time.hour * 60 + this.time.minute) * 60;
  }
}
