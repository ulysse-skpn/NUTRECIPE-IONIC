import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
})
export class SplashScreenPage implements OnInit {

  constructor(
    private splashScreen:SplashScreen
  ) { }

  ngOnInit() 
  {
    this.splashScreen.show()
  }

}
