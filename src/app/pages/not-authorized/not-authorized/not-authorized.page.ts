import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.page.html',
  styleUrls: ['./not-authorized.page.scss'],
})
export class NotAuthorizedPage{

  constructor(
    private router:Router
  ) { }

  async goToLogin()
  {
    await this.router.navigate(['/login'])
  }
}
