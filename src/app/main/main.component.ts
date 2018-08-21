import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  id = 1;

  constructor() { }

  ngOnInit() {
  }

  onBack(){
    console.log('back');
  }

  onNext(){
    document.getElementById(`${this.id}`).classList.add('faded');
    this.id++;
    document.getElementById(`${this.id}`).classList.remove('hidden');
  }

}
