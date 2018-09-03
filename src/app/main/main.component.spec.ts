import { MainComponent } from "./main.component";
import { TimeService } from "./time.service";
import { SocketService } from './socket.service';
import { Location } from './models/location.model';

describe('MainComponent', () => {
  let timeService = new TimeService();
  let socketService = new SocketService();
  const comp = new MainComponent(timeService, socketService);

  it('location subscription should change data', () => {
    comp.city = 'Boston';
    comp.state = 'MA';
    let idealPlace = {city: 'Seattle', state: 'WA'};

    comp.locationSubscription = socketService.dataReady
      .subscribe(
        (locationData: Location) => {
          comp.city = locationData.city;
          comp.state = locationData.state;
        }
      );
    socketService.dataReady.next(idealPlace);

    expect(comp.city).toBe(idealPlace.city);
    expect(comp.state).toBe(idealPlace.state);
  });

})