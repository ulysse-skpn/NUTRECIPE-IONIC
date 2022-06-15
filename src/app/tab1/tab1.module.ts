import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';

import { ScrollingModule } from '@angular/cdk/scrolling'
import { Ng2SearchPipeModule } from 'ng2-search-filter'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ScrollingModule,
    Ng2SearchPipeModule,
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab1PageModule {}
