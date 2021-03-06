import { Subject } from "rxjs";

export class TimeService {
  private monthStrings = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
  public dateChanged = new Subject<Date>();

  constructor(){}

  public getCurrentMonthNumeric(date: Date) {
    return date.getMonth();
  }

  public getCurrentMonthString(date: Date) {
    return this.monthStrings[date.getMonth()];
  }

  public getCurrentYear(date: Date) {
    return date.getFullYear();
  }

  public getDatesList(date: Date) {
    let lastDay = this.getLastDayOfThisMonth(date);
    let datesList = [];
    for (let i = 1; i <= lastDay; i++) {
      datesList.push(i);
    }
    return datesList;
  }

  public incrementGivenMonth(date: Date) {
    date.setDate(1);
    if (date.getMonth() == 11) {
      date.setFullYear(date.getFullYear() + 1);
      date.setMonth(0);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    return date;
  }

  public decrementGivenMonth(date: Date) {
    date.setDate(1);
    if (date.getMonth() == 0) {
      date.setFullYear(date.getFullYear() - 1);
      date.setMonth(11);
    } else {
      date.setMonth(date.getMonth() - 1);
    }
    return date;
  }

  public getLastDayOfThisMonth(date: Date) {
    let dummyDate = new Date(date);
    this.incrementGivenMonth(dummyDate);
    dummyDate.setDate(0);
    return dummyDate.getDate();
  }

  public getInitialDay(date: Date) {
    let dummyDate = new Date(date);
    dummyDate.setDate(1);
    let day = dummyDate.getDay();
    return day;
  }

  public getDaysBeforePresentDay() {
    const dummyDate = new Date();
    let presentDay = dummyDate.getDate();
    let daysBeforeTodayList = [];
    for (let i = 1; i <= presentDay; i++) {
      daysBeforeTodayList.push(i);
    }
    return daysBeforeTodayList;
  }

  setBlankDays(date: Date) {
    let blankDays = [];
    for (let i = 0; i <= this.getInitialDay(date) - 1; i++) {
      blankDays.push('blankDay');
    }
    return blankDays;
  }
}