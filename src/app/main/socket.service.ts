import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import * as socketIO from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

@Injectable()
export class SocketService {
  private socket;

  public initializeSocket() {
    this.socket = socketIO(SERVER_URL);
  }

  public requestLocationDetails(zipcode) {
    this.socket.emit('getLocationDetails', zipcode);
  }

  public onLocationReceived(): Observable
}