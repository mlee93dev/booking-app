import { Component, OnInit } from '@angular/core';
import { TimeService } from './time.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  activeFormPage = 1;
  selectedCleanOption;
  activeCleanDetails;
  currentMonth;
  currentYear;

  constructor(public timeService: TimeService) { }

  ngOnInit() {
    this.setCalendar();
    console.log(this.currentMonth);
  }

  prevPage(){
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

  selectCleaning(optionNum: number){
    this.selectedCleanOption = optionNum;
  }

  toggleCleanDetails(detailsNum: number) {
    if (this.activeCleanDetails == detailsNum) {
      return this.activeCleanDetails = null;
    }
    this.activeCleanDetails = detailsNum;
  }

  prevMonth(){
    console.log('prev');
  }

  nextMonth(){
    console.log('next');
  }

  setCalendar(){
    this.currentMonth = this.timeService.getCurrentMonthString();
    this.currentYear = this.timeService.getCurrentYear();
  }

}
