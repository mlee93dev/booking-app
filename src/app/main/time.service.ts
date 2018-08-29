export class TimeService {
  private date = new Date;
  private monthStrings = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(){}

  getCurrentMonthString(){
    return this.monthStrings[this.date.getMonth()];
  }

  getCurrentYear(){
    return this.date.getFullYear();
  }

}