declare const gapi: any;

export class GoogleService {
  private auth2: any;

  public loadGoogleAPIAuth2(): Promise<any> {
    return new Promise((resolve, reject) => {
      gapi.load('auth2', {
        callback: () => {
          this.auth2 = gapi.auth2.init({
            client_id: '891773536607-gv6rrqqgd04bo8gls795np40kqjb4rea.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            scope: 'profile email https://www.googleapis.com/auth/calendar'
          });
          resolve(this.auth2);
        },
        onerror: () => {
          reject('gapi.client failed to load!');
        },
        timeout: 5000,
        ontimeout: () => {
          reject('gapi.client timed out!');
        }
      });
    })
  }

  // public loadGoogleAPIClient() {
  //   //wrap in promise for unit testing later
  //   //might eventually just handle this serverside instead
  //   gapi.load('client', {
  //     callback: () => {
  //       gapi.client.load('calendar', 'v3', () => {
  //         var event = {
  //           'summary': 'testy test',
  //           'location': '800 Howard St., San Francisco, CA 94103',
  //           'description': 'A chance to hear more about Google\'s developer products.',
  //           'start': {
  //             'dateTime': '2018-10-28T09:00:00-07:00',
  //             'timeZone': 'America/Los_Angeles'
  //           },
  //           'end': {
  //             'dateTime': '2018-10-28T17:00:00-07:00',
  //             'timeZone': 'America/Los_Angeles'
  //           },
  //           // 'recurrence': [
  //           //   'RRULE:FREQ=DAILY;COUNT=2'
  //           // ],
  //           // 'reminders': {
  //           //   'useDefault': false,
  //           //   'overrides': [
  //           //     { 'method': 'email', 'minutes': 24 * 60 },
  //           //     { 'method': 'popup', 'minutes': 10 }
  //           //   ]
  //           // }
  //         };

  //         gapi.client.calendar.events.insert({
  //           'calendarId': 'primary',
  //           'resource': event
  //         }).then(() => {
  //           console.log('success');
  //         });
  //       });
  //     },
  //     onerror: () => {
  //     }
  //   })
  // }

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
          console.log('Signed in.');
          //Should resolve with relevant information later
          resolve('Attached.');
        },
        (error) => {
          reject(error);
        });
    });
  }

  public signOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      let auth2 = gapi.auth2.getAuthInstance();
      let signOut = auth2.signOut();
      let disconnect = auth2.disconnect();
      Promise.all([signOut, disconnect])
        .then(() => resolve('Signed out.'))
        .catch((e) => reject(e));
    })
  }

  public isSignedIn() {
    return this.auth2.isSignedIn.get();
  }
}