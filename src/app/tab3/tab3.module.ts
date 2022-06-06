import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { SideMenuComponent } from '../components/side-menu/side-menu/side-menu.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    Ng2SearchPipeModule,
    Tab3PageRoutingModule
  ],
  declarations: [Tab3Page,SideMenuComponent]
})
export class Tab3PageModule {}
