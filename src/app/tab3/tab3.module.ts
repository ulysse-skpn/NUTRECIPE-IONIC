import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Ng2SearchPipeModule,
    Tab3PageRoutingModule
  ],
  declarations: [Tab3Page],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab3PageModule {}
