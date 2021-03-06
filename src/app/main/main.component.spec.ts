import { MainComponent } from "./main.component";
import { TimeService } from "./time.service";
import { SocketService } from './socket.service';
import { Location } from './models/location.model';
import { SocketIO, Server } from 'mock-socket';
import { Observable } from "rxjs";
import { GoogleService } from "./google.service";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { DebugElement } from "@angular/core";
import { resolve } from "path";
import { reject } from "q";

describe('MainComponent', () => {
  let timeService = new TimeService();
  let socketService = new SocketService();
  let googleService = new GoogleService();
  const comp = new MainComponent(timeService, socketService, googleService);

  it('-location subscription should change data', () => {
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

  it('-should correctly set the calendar', () => {
    comp.defaultDate = new Date('September 1, 2018');
    comp.setCalendar();

    expect(comp.currentYear).toBe(2018);
    expect(comp.currentMonth).toBe('September');
    expect(comp.datesList.length).toBe(30);
    expect(comp.initialDayOfWeek.length).toBe(6);
  });

  it('-should correctly set greyed out and non greyed out days', () => {
    comp.setCalendar();
    comp.greyOutDaysBeforePresentDay();
    let datesSum = comp.daysBeforePresentDayList.length + comp.nonGreyedOutDatesList.length;
    expect(datesSum).toBe(comp.datesList.length);
  });

  it('-date subscription should change date', () => {
    comp.defaultDate = new Date('January 1, 2000');
    comp.setCalendar();
    expect(comp.currentMonth).toBe('January');

    comp.dateSubscription = timeService.dateChanged
      .subscribe(
        (newDate: Date) => {
          comp.defaultDate = newDate;
          comp.setCalendar();
        }
      );
    let newDate = new Date('February 1, 2000');
    timeService.dateChanged.next(newDate);
    expect(comp.currentMonth).toBe('February');
  });

  it('-should select correct cleaning option', () => {
    comp.selectCleaning(3);
    expect(comp.selectedCleanOption).toBe(3);
  });

  it('-should correctly toggle clean details', () => {
    comp.activeCleanDetails = 1;
    comp.toggleCleanDetails(1);
    expect(comp.activeCleanDetails).toBe(null);
    comp.toggleCleanDetails(3);
    expect(comp.activeCleanDetails).toBe(3);
  });

  it('-should correctly decrement / increment the month', () => {
    comp.defaultDate = new Date('January 1, 2000');
    comp.setCalendar();
    comp.prevMonth();
    expect(comp.currentMonth).toBe('December');
    comp.nextMonth();
    expect(comp.currentMonth).toBe('January');
  });

});

describe('Socket.IO', () => {
  let timeService = new TimeService();
  let socketService = new SocketService();
  let googleService = new GoogleService();
  const comp = new MainComponent(timeService, socketService, googleService);
  const SERVER_URL = window.location.host;
  const mockServer = new Server(SERVER_URL);
  let requestedLocation = { city: 'Seattle', state: 'WA' };

  //Mock server socket emitter
  mockServer.on('connection', socket => {
    setTimeout(() => {
      mockServer.emit('sentLocationDetails', requestedLocation);
    }, 500);
  });

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  //Mock client socket receiver
  it('-ioConnection should receive location from socket observable', async (done) => {
    (window as any).io = SocketIO;
    let socket = io(window.location.host);
    let receivedLocation: Location;

    function onLocationReceived(): Observable<Location> {
      return new Observable<Location>((observer) => {
        socket.on('sentLocationDetails', (locationData: Location) => observer.next(locationData));
      });
    }

    comp.initIoConnection = function() {
      this.ioConnection = onLocationReceived()
        .subscribe(
          {next(locationData: Location) {
              receivedLocation = locationData;
              expect(receivedLocation.city).toBe(requestedLocation.city);
              expect(receivedLocation.state).toBe(requestedLocation.state);
              mockServer.stop();
              done();
            }
          }
        );
    }

    comp.initIoConnection();
  });
});

describe('GoogleBtn and DOM Emulation', () => {
  let fixture: ComponentFixture<MainComponent>;
  let component: MainComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MainComponent],
      providers: [
        TimeService,
        SocketService,
        GoogleService
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;

    window['gapi'] = {
      load() {
        return null;
      },
      auth2: {
        getAuthInstance() {
          return {
            signOut(): Promise<any> {
              return new Promise(() => resolve());
            },
            disconnect(): Promise<any> {
              return new Promise(() => resolve());
            }
          }
        }
      }
    }

    fixture.detectChanges();
  });

  it('-should call toggleGoogleLogin upon checkbox change', async(() => {
    spyOn(component, 'toggleGoogleLogin');

    const checkboxDebug: DebugElement = fixture.debugElement.query(By.css('#calendarCheckbox'));
    checkboxDebug.triggerEventHandler('change', {target: {}});

    fixture.whenStable().then(() => {
      expect(component.toggleGoogleLogin).toHaveBeenCalled();
    });
  }));

  it('-should call clickGoogleBtn upon checkbox true', async(() => {
    spyOn(component, 'clickGoogleBtn');

    const checkboxDebug: DebugElement = fixture.debugElement.query(By.css('#calendarCheckbox'));
    checkboxDebug.triggerEventHandler('change', { target: { checked: true } });

    fixture.whenStable().then(() => {
      expect(component.clickGoogleBtn).toHaveBeenCalled();
    });
  }));

  it('-should call googleSignOut upon checkbox false', async(() => {
    spyOn(component, 'googleSignOut');

    const checkboxDebug: DebugElement = fixture.debugElement.query(By.css('#calendarCheckbox'));
    checkboxDebug.triggerEventHandler('change', { target: { checked: false } });

    fixture.whenStable().then(() => {
      expect(component.googleSignOut).toHaveBeenCalled();
    });
  }));
});

describe('GoogleService Methods', () => {
  let timeService = new TimeService();
  let socketService = new SocketService();
  let googleService = new GoogleService();
  const comp = new MainComponent(timeService, socketService, googleService);

  let success = true;
  let auth2 = 'dummyauth';
  let errormsg = 'failure';
  let dummyElement = 'div';
  console.log = jasmine.createSpy('Console Log').and.callFake(() => { });

  googleService.loadGoogleAPIAuth2 = function (): Promise<any> {
    return new Promise((resolve, reject) => {
      if (success) resolve(auth2);
      else reject(errormsg);
    });
  }

  googleService.attachSignin = function (element): Promise<any> {
    return new Promise((resolve, reject) => {
      if (success) resolve('Attached.');
      else reject(errormsg);
    })
  }

  googleService.signOut = function (): Promise<any> {
    return new Promise((resolve, reject) => {
      if (success) {
        auth2 = null;
        resolve();
      } else reject(errormsg);
    })
  }

  it('-googleInit() should make call to gapi and get appropriate response', () => {
    comp.googleInit()
      .then(() => expect(comp.auth2).toBe(auth2));

    success = false;
    comp.googleInit()
      .catch((e) => expect(e).toBe(errormsg));
  });

  it('-googleAttachSignIn() should catch appropriate response', () => {
    success = true;
    comp.googleAttachSignIn(dummyElement)
      .then((status) => expect(status).toBe('Attached.'));

    success = false;
    comp.googleAttachSignIn(dummyElement)
      .catch((error) => expect(error).toBe(errormsg));
  });

  it('-googleSignOut() should call googleService.signOut', async(() => {
    success = true;
    comp.googleSignOut()
      .then(() => expect(auth2).toBe(null));

    success = false;
    comp.googleSignOut()
      .catch((error) => expect(error).toBe(errormsg));
  }));
});