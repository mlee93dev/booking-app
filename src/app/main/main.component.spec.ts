import { MainComponent } from "./main.component";
import { TimeService } from "./time.service";
import { SocketService } from './socket.service';

describe('MainComponent', () => {
  let timeService = new TimeService();
  let socketService = new SocketService();
  const comp = new MainComponent(timeService, socketService);

  it('activeFormPage should initialize as 1', () => {
    expect(comp.activeFormPage).toBe(1);
  });
  
})