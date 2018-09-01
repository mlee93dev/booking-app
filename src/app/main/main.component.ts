import { Component, OnInit } from '@angular/core';
import { TimeService } from './time.service';
import { Subscription } from 'rxjs';
import { SocketService } from './socket.service';
import { Location } from './models/location.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  activeFormPage = 1;
  ioConnection: any;
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

  constructor(public timeService: TimeService,
              public socketService: SocketService) { }

  ngOnInit() {
    this.initIoConnection();
    this.setCalendar();
    this.greyOutDaysBeforePresentDay();
    this.dateSubscription = this.timeService.dateChanged
      .subscribe(
        (newDate: Date) => {
          this.defaultDate = newDate;
          this.setCalendar();
        }
      )
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
    this.socketService.initializeSocket();

    this.ioConnection = this.socketService.onLocationReceived()
      .subscribe((location: Location) => {
        console.log(location);
      })
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

}
