import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { IonicModule } from '@ionic/angular';

import { SplashScreenPage } from './splash-screen.page';

describe('SplashScreenPage', () => {
  let component: SplashScreenPage
  let fixture: ComponentFixture<SplashScreenPage>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SplashScreenPage ],
      imports: [IonicModule.forRoot()],
      providers: [ SplashScreen ]
    }).compileComponents();

    fixture = TestBed.createComponent(SplashScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
