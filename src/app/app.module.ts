import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, CommonModule , FormsModule, ReactiveFormsModule , HttpClientModule, IonicModule.forRoot(), AppRoutingModule ],
  providers: 
  [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: SplashScreen },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
