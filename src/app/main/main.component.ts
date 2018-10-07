import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { TimeService } from './time.service';
import { Subscription, zip } from 'rxjs';
import { SocketService } from './socket.service';
import { Location } from './models/location.model';
import { GoogleService } from './google.service';
declare const gapi: any;

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

  nextPage(){
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

  requestLocationDetails(zipcode: any){
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

  selectDay(event){
    if (this.prevSelectedDay) {
      this.prevSelectedDay.classList.remove('active');
    } 
    event.target.classList.add('active');
    this.selectedDate = new Date(`${this.currentMonth} ${event.target.innerText}, ${this.currentYear}`);
    this.prevSelectedDay = event.target;
  }

  // Google sign in methods
  googleInit() {
    gapi.load('auth2', () => {
      //callback: resolve the promise on api wrapper
      this.auth2 = gapi.auth2.init({
        client_id: '891773536607-gv6rrqqgd04bo8gls795np40kqjb4rea.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      //onerror: reject the promise on api wrapper
      this.attachSignin(document.getElementById('googleBtn'));
    });

    this.googleService.LoadGoogleAPI().
      then(() => {
        console.log('success');
      }).catch((e) => {
        console.log('failure');
      })

  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        console.log('Signed in.');
        // let profile = googleUser.getBasicProfile();
        // console.log('Token || ' + googleUser.getAuthResponse().id_token);
        // console.log('ID: ' + profile.getId());
        // console.log('Name: ' + profile.getName());
        // console.log('Image URL: ' + profile.getImageUrl());
        // console.log('Email: ' + profile.getEmail());
        // console.log(this.auth2);
      });
  }

  googleSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => console.log('Signed out.'))
    auth2.disconnect().then(() => console.log('Disconnected.'))
  }

}
