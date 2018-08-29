export class TimeService {
  private defaultDate = new Date;
  private monthStrings = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(){}

  getCurrentMonthString(){
    return this.monthStrings[this.defaultDate.getMonth()];
  }

  getCurrentYear(){
    return this.defaultDate.getFullYear();
  }

  getDatesList(){
    let lastDay = this.getLastDayOfThisMonth();
    let datesList = [];
    for (let i = 1; i <= lastDay; i++) {
      datesList.push(i);
    }
    return datesList;
  }

  incrementMonth(date: Date) {
    if (date.getMonth() == 11) {
      date.setFullYear(date.getFullYear() + 1);
      date.setMonth(0);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
  }

  getLastDayOfThisMonth(){
    let dummyDate = new Date;
    this.incrementMonth(dummyDate);
    dummyDate.setDate(0);
    return dummyDate.getDate();
  }
}