import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing-module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { TimeService } from './main/time.service';
import { SocketService } from './main/socket.service';
import { GoogleService } from './main/google.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    TimeService,
    SocketService,
    GoogleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
