import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotAuthorizedPageRoutingModule } from './not-authorized-routing.module';

import { NotAuthorizedPage } from './not-authorized.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotAuthorizedPageRoutingModule
  ],
  declarations: [NotAuthorizedPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotAuthorizedPageModule {}
