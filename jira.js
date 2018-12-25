
// const serverURL = 'https://meng-mod-04.atlassian.net';
const serverURL = 'http://localhost:9090';
const authURL = `${serverURL}/rest/auth/1/session`;
const baseURL = `${serverURL}/rest/api/2`;
const token = 'bGVvLmZjeC5hbHNpZUBnbWFpbC5jb206YWxzaWUhQCM0NTY=';

let session = undefined;

const JIRA = {

  authenticate: function(username, password) {

    session = 123;
  },

  Projects: {
    url: `${baseURL}/project`,
    get: function(id) {
      return fetch(this.url, {
        headers: {
          'Authorization': `Basic ${token}`
        },
        mode: 'no-cors'
      })
        .then(function(response) {
          console.log('RESPONSE', response);
        })
        .catch(function(reason) {
          console.log(reason)
        });
    }
  },

  Issues: {
    get: function(projectId) {

    }
  }

};
