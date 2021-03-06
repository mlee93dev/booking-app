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
    this.createGoogleBtnShadow();
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

  createGoogleBtnShadow() {
    let checkbox = document.getElementById('checkBoxShadowSource');
    let shadow = checkbox.attachShadow({mode: 'open'});
    let googleBtn = document.createElement('div');
    googleBtn.setAttribute('id', 'googleBtn');
    shadow.appendChild(googleBtn);
  }

  googleInit(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.googleService.loadGoogleAPIAuth2()
        .then((authInstance: any) => {
          this.auth2 = authInstance;
          let checkbox = document.getElementById('checkBoxShadowSource');
          this.googleAttachSignIn(checkbox.shadowRoot.getElementById('googleBtn'))
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

  // saveToGoogleCalendar() {
  //   this.googleService.loadGoogleAPIClient();
  // }

  toggleGoogleLogin(event) {
    if (event.target.checked) {
      this.clickGoogleBtn();
    } else {
      this.googleSignOut();
    }
  }

  clickGoogleBtn() {
    let checkbox = document.getElementById('checkBoxShadowSource');
    checkbox.shadowRoot.getElementById('googleBtn').click();
  }

  openCheckOut() {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_ycrEW8xQaQhrWO69ApbhfqX3',
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
      }
    });

    handler.open({
      name: 'Demo Site',
      description: '2 widgets',
      amount: 2000
    });
  }
}
