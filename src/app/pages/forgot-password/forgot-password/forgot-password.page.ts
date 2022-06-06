import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {

  constructor(
    private router:Router,
    private authService:AuthService
  ) { }

  newPassword:string = ""
  forgotPasswordFormGroup = new FormGroup({
    emailControl : new FormControl("",[Validators.required, Validators.email , Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])
  })


  goBack()
  {
    this.router.navigate(['/login'])
  }

  getNewPassword()
  {
    if( !this.forgotPasswordFormGroup.valid ) return

    const form = this.forgotPasswordFormGroup.value

    const email = 
    {
      email : form.emailControl
    }

    this.authService.forgotPassword(email).subscribe( async(res) => {
      this.newPassword = res.newPassword
    })
  }

  get errorMessage() {
    return this.forgotPasswordFormGroup.controls;
  }
}
