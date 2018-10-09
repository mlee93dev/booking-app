declare const gapi: any;

export class GoogleService {
  private auth2: any;

  public loadGoogleAPI(): Promise<any> {
    return new Promise((resolve, reject) => {
      gapi.load('auth2', {
        callback: () => {
          this.auth2 = gapi.auth2.init({
            client_id: '891773536607-gv6rrqqgd04bo8gls795np40kqjb4rea.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            scope: 'profile email'
          });
          resolve(this.auth2);
        },
        onerror: () => {
          reject('gapi.client failed to load!');
        },
        timeout: 5000,
        ontimeout: () => {
          reject('gapi.client timed out!')
        }
      });
    })
  }

  public attachSignin(element): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          // let profile = googleUser.getBasicProfile();
          // console.log('Token || ' + googleUser.getAuthResponse().id_token);
          // console.log('ID: ' + profile.getId());
          // console.log('Name: ' + profile.getName());
          // console.log('Image URL: ' + profile.getImageUrl());
          // console.log('Email: ' + profile.getEmail());
          // console.log(this.auth2);
          resolve('Signed in.')
        },
        (error) => {
          reject(error);
        });
    });
  }

  public signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => console.log('Signed out.'));
    auth2.disconnect().then(() => console.log('Disconnected.'));
  }
}