import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IUserIn } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  buttonVisible = true
  constructor(
    private router:Router,
    private authService:AuthService,
    private toastController:ToastController
  ) { }
  
  registerFormGroup = new FormGroup({
    lastNameControl:  new FormControl( "" , [ Validators.required , Validators.minLength(1) ]),
    firstNameControl:  new FormControl( "" , [ Validators.required , Validators.minLength(1) ]),
    phoneNumberControl:  new FormControl( null , [ Validators.minLength(10) , Validators.maxLength(20) , Validators.pattern('^[0-9]+$')  ]),
    emailControl:  new FormControl( "" , [ Validators.required , Validators.email , Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$') ]),
    passwordControl:  new FormControl( "" , [ Validators.required , Validators.minLength(6) ]),
    passwordConfirmControl:  new FormControl( "" , [ Validators.required , Validators.minLength(6) ])
  })
  
  goBack()
  {
    this.router.navigate(['/login'])
  }

  onFormSubmit()
  { 
    const form = this.registerFormGroup.value
    if( form.passwordControl !== form.passwordConfirmControl  ) 
    {
      alert('Les mots de passe ne sont pas identiques...')
      return
    }
    
    if( this.registerFormGroup.valid === false ) return

    this.buttonVisible = false

    const user:IUserIn = 
    {
      last_name: form.lastNameControl.toUpperCase(),
      first_name: form.firstNameControl.toLowerCase(),
      phone_number: form.phoneNumberControl,
      email: form.emailControl,
      password: form.passwordControl,
      role: 'user',
      receiveEmail: true,
      receiveNotification:true
    }
    
    this.authService.register(user).subscribe( async(res) => {
      
      sessionStorage.setItem( "access_token" , res.access_token )
      sessionStorage.setItem( "expiresIn" , res.expires_in.toString() )

      const toast = await this.toastController.create({
        message: 'Utilisateur enregistré , vous allez être redirigé vers la page de connexion',
        duration: 3200
      });
      toast.present();

      await toast.onDidDismiss().then( async() => {
        await this.authService.redirectTo("login")
      })
    })
    
  }

  get errorMessage() {
    return this.registerFormGroup.controls;
  }
}
