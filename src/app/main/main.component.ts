import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { TimeService } from './time.service';
import { Subscription, zip } from 'rxjs';
import { SocketService } from './socket.service';
import { Location } from './models/location.model';
import { GoogleService } from './google.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  activeFormPage = 1;
  ioConnection: any;
  city: string;
  state: string;
  locationSubscription: Subscription;
  selectedCleanOption: number;
  activeCleanDetails: number;
  defaultDate = new Date;
  defaultMonth: string;
  currentMonth: string;
  currentYear: number;
  datesList: number[];
  daysBeforePresentDayList: number[];
  nonGreyedOutDatesList = [];
  initialDayOfWeek = [];
  dateSubscription: Subscription;
  prevSelectedDay: HTMLElement;
  selectedDate: Date;
  auth2: any;

  constructor(public timeService: TimeService,
              private socketService: SocketService,
              public googleService: GoogleService) { }

  ngOnInit() {
    // this.initIoConnection();
    this.locationSubscription = this.socketService.dataReady
      .subscribe(
        (locationData: Location) => {
          this.city = locationData.city;
          this.state = locationData.state;
        }
      );
    this.setCalendar();
    this.greyOutDaysBeforePresentDay();
    this.dateSubscription = this.timeService.dateChanged
      .subscribe(
        (newDate: Date) => {
          this.defaultDate = newDate;
          this.setCalendar();
        }
      );
  }

  ngAfterViewInit() {
    this.googleInit();
  }

  ngOnDestroy() {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
    this.googleSignOut();
  }

  prevPage() {
    if (this.activeFormPage == 1) {
      return;
    } 
    document.getElementById(`${this.activeFormPage}`).classList.add('hidden');
    this.activeFormPage--;
    document.getElementById(`${this.activeFormPage}`).classList.remove('faded');
  }

  nextPage() {
    document.getElementById(`${this.activeFormPage}`).classList.add('faded');
    this.activeFormPage++;
    document.getElementById(`${this.activeFormPage}`).classList.remove('hidden');
  }

  initIoConnection() {
    let socketService = this.socketService;
    socketService.initializeSocket();

    this.ioConnection = this.socketService.onLocationReceived()
      .subscribe(
        {next(locationData: Location) {
          socketService.dataReady.next(locationData);
        }}
      )
  }

  requestLocationDetails(zipcode: any) {
    if (!isNaN(parseInt(zipcode)) && zipcode.length == 5) {
      this.socketService.requestLocationDetails(zipcode);
    }
  }

  selectCleaning(optionNum: number) {
    this.selectedCleanOption = optionNum;
  }

  toggleCleanDetails(detailsNum: number) {
    if (this.activeCleanDetails == detailsNum) {
      return this.activeCleanDetails = null;
    }
    this.activeCleanDetails = detailsNum;
  }

  prevMonth() {
    let dummyDate = new Date;
    if (this.timeService.getCurrentMonthNumeric(this.defaultDate) == dummyDate.getMonth()) {
      return false;
    }
    let prevMonthDate = this.timeService.decrementGivenMonth(this.defaultDate);
    this.timeService.dateChanged.next(prevMonthDate);
  }

  nextMonth() {
    let nextMonthDate = this.timeService.incrementGivenMonth(this.defaultDate);
    this.timeService.dateChanged.next(nextMonthDate);
  }

  setCalendar() {
    this.currentMonth = this.timeService.getCurrentMonthString(this.defaultDate);
    this.currentYear = this.timeService.getCurrentYear(this.defaultDate);
    this.datesList = this.timeService.getDatesList(this.defaultDate);
    this.initialDayOfWeek = this.timeService.setBlankDays(this.defaultDate);
  }

  greyOutDaysBeforePresentDay() {
    this.defaultMonth = this.timeService.getCurrentMonthString(this.defaultDate);
    this.daysBeforePresentDayList = this.timeService.getDaysBeforePresentDay();
    for (let i = this.daysBeforePresentDayList.length + 1; i <= this.datesList.length; i++) {
      this.nonGreyedOutDatesList.push(i);
    }
  }

  selectDay(event) {
    if (this.prevSelectedDay) {
      this.prevSelectedDay.classList.remove('active');
    } 
    event.target.classList.add('active');
    this.selectedDate = new Date(`${this.currentMonth} ${event.target.innerText}, ${this.currentYear}`);
    this.prevSelectedDay = event.target;
  }

  googleInit(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.googleService.loadGoogleAPIAuth2()
        .then((authInstance: any) => {
          this.auth2 = authInstance;
          this.googleAttachSignIn(document.getElementById('googleBtn'))
            .then((status) => console.log(status))
            .catch((e) => console.log(e));
          resolve();
        }).catch((e) => {
          console.log(e);
          reject(e);
        });
    })
  }

  googleAttachSignIn(element): Promise<any> {
    return new Promise((resolve, reject) => {
      this.googleService.attachSignin(element)
        .then((status) => {
          resolve(status);
        }).catch((e) => {
          reject(e);
        });
    })
  }

  googleSignOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.googleService.signOut()
        .then((status) => {
          console.log(status);
          resolve();
        }).catch((e) => {
          console.log(e);
          reject(e);
        })
    })
  }

  saveToGoogleCalendar() {
    // // Refer to the JavaScript quickstart on how to setup the environment:
    // // https://developers.google.com/calendar/quickstart/js
    // // Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
    // // stored credentials.

    // gapi.load('client', {
    //   callback: function () {
    //     // Handle gapi.client initialization.
    //   },
    //   onerror: function () {
    //     // Handle loading error.
    //     alert('gapi.client failed to load!');
    //   },
    //   timeout: 5000, // 5 seconds.
    //   ontimeout: function () {
    //     // Handle timeout.
    //     alert('gapi.client could not load in a timely manner!');
    //   }
    // });

    // gapi.client.load('calendar', 'v3', () => {
    //   // now we can use gapi.client.calendar
    //   // ... 
    // });

    // gapi.client.calendar

    // var event = {
    //   'summary': 'Google I/O 2015',
    //   'location': '800 Howard St., San Francisco, CA 94103',
    //   'description': 'A chance to hear more about Google\'s developer products.',
    //   'start': {
    //     'dateTime': '2015-05-28T09:00:00-07:00',
    //     'timeZone': 'America/Los_Angeles'
    //   },
    //   'end': {
    //     'dateTime': '2015-05-28T17:00:00-07:00',
    //     'timeZone': 'America/Los_Angeles'
    //   },
    //   'recurrence': [
    //     'RRULE:FREQ=DAILY;COUNT=2'
    //   ],
    //   'attendees': [
    //     { 'email': 'lpage@example.com' },
    //     { 'email': 'sbrin@example.com' }
    //   ],
    //   'reminders': {
    //     'useDefault': false,
    //     'overrides': [
    //       { 'method': 'email', 'minutes': 24 * 60 },
    //       { 'method': 'popup', 'minutes': 10 }
    //     ]
    //   }
    // };
  }

}
