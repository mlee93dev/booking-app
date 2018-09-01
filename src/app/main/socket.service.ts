import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { Location } from './models/location.model';
import * as io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

@Injectable()
export class SocketService {
  private socket;

  public initializeSocket() {
    this.socket = io(SERVER_URL);
  }

  public requestLocationDetails(zipcode) {
    this.socket.emit('getLocationDetails', zipcode);
  }

  public onLocationReceived(): Observable<Location> {
    return new Observable<Location>(observer => {
      this.socket.on('sentLocationDetails', (location: Location) => observer.next(location));
    });
  }
}