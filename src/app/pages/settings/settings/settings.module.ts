import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';

import { JwtModule } from "@auth0/angular-jwt";

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../../../helpers/authconfig.interceptor';

export function tokenGetter() {
  return sessionStorage.getItem("access_token");
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    JwtModule.forRoot({
      config:
      {
        tokenGetter: tokenGetter,
        allowedDomains:
        [
          'https://127.0.0.1:3000',
          'https://localhost:4000',
          'https://fonts.gstatic.com/s/materialicons/v126/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
        ]
      }
    })
  ],
  declarations: [SettingsPage],
  providers: 
  [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class SettingsPageModule {}
