import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { SideMenuComponent } from '../components/side-menu/side-menu/side-menu.component';

import { ScrollingModule } from '@angular/cdk/scrolling'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    ScrollingModule,
    Ng2SearchPipeModule,
    Tab2PageRoutingModule
  ],
  declarations: [Tab2Page,SideMenuComponent]
})
export class Tab2PageModule {}
