import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SettingsPage } from 'src/app/pages/settings/settings/settings.page';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  visible:boolean = false
  modal: HTMLElement

  constructor(
    private authService:AuthService,
    private modalController:ModalController
  ) { }

  ngOnInit(): void 
  {
    if( sessionStorage.getItem("access_token") ) this.visible = true
  }

  async settings()
  {
    const modal = await this.modalController.create({
      component: SettingsPage
    })

    return modal.present()
  }

  getStats()
  {
    alert('stats')
  }

  getNotifications()
  {
    alert('notifications')
  }

  async logout()
  {
    await this.authService.logout()
  }

  async goToLogin()
  {
    await this.authService.redirectTo('login')
  }
}
