import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Observer } from 'rxjs';
import { Location } from './models/location.model';
import * as io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

@Injectable()
export class SocketService {
  private socket;

  public dataReady = new Subject<Location>();

  public initializeSocket() {
    this.socket = io(SERVER_URL);
  }

  public requestLocationDetails(zipcode) {
    this.socket.emit('getLocationDetails', zipcode);
  }

  public onLocationReceived(): Observable<Location> {
    return new Observable<Location>((observer) => {
      this.socket.on('sentLocationDetails', (locationData: Location) => observer.next(locationData));
    });
  }
}