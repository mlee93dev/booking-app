import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  activeFormPage = 1;
  firstDetails = 'Details';
  secondDetails = 'dets';
  thirdDetails = 'doods';

  constructor() { }

  ngOnInit() {
  }

  onBack(){
    if (this.activeFormPage == 1) {
      return;
    } 
    document.getElementById(`${this.activeFormPage}`).classList.add('hidden');
    this.activeFormPage--;
    document.getElementById(`${this.activeFormPage}`).classList.remove('faded');
  }

  onNext(){
    document.getElementById(`${this.activeFormPage}`).classList.add('faded');
    this.activeFormPage++;
    document.getElementById(`${this.activeFormPage}`).classList.remove('hidden');
  }

  popUpServiceDetails(details: string){
    swal(details);
  }

}
