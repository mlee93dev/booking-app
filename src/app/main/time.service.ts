import { Subject } from "rxjs";

export class TimeService {
  private defaultDate = new Date;
  private monthStrings = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
  public dateChanged = new Subject<Date>();

  constructor(){}

  getCurrentMonthNumeric(date: Date){
    return date.getMonth();
  }

  getCurrentMonthString(date: Date){
    return this.monthStrings[date.getMonth()];
  }

  getCurrentYear(date: Date){
    return date.getFullYear();
  }

  getDatesList(date: Date){
    let lastDay = this.getLastDayOfThisMonth(date);
    let datesList = [];
    for (let i = 1; i <= lastDay; i++) {
      datesList.push(i);
    }
    return datesList;
  }

  incrementGivenMonth(date: Date) {
    date.setDate(1);
    if (date.getMonth() == 11) {
      date.setFullYear(date.getFullYear() + 1);
      date.setMonth(0);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    return date;
  }

  decrementGivenMonth(date: Date) {
    date.setDate(1);
    if (date.getMonth() == 0) {
      date.setFullYear(date.getFullYear() - 1);
      date.setMonth(11);
    } else {
      date.setMonth(date.getMonth() - 1);
    }
    return date;
  }

  getLastDayOfThisMonth(date: Date){
    let dummyDate = new Date(date);
    this.incrementGivenMonth(dummyDate);
    dummyDate.setDate(0);
    return dummyDate.getDate();
  }

  getInitialDay(date: Date){
    let dummyDate = new Date(date);
    dummyDate.setDate(1);
    let day = dummyDate.getDay();
    return day;
  }
}