import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { IUserIn } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';
import { JwtHelperService } from '@auth0/angular-jwt'
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {

  newPassword:string = ""
  modifyButton:string = 'Modifier'
  isDisabled:boolean = true
  isModify:boolean = false
  receiveEmail:boolean
  receiveNotification:boolean

  settingFormGroup:FormGroup = new FormGroup({
    lastNameControl : new FormControl([ Validators.minLength(1) ]),
    firstNameControl : new FormControl([ Validators.minLength(1) ]),
    phoneNumberControl : new FormControl([ Validators.minLength(10) , Validators.maxLength(20) , Validators.pattern('^[0-9]+$')  ]),
    emailControl : new FormControl([ Validators.email , Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$') ]),
    passwordControl : new FormControl([Validators.required, Validators.minLength(6) ]),
    receiveEmailControl: new FormControl(),
    receiveNotificationControl: new FormControl()
  })

  constructor(
    private modalController:ModalController,
    private actionSheetController:ActionSheetController,
    private toastController:ToastController,
    private userService:UsersService,
    private authService:AuthService,
    private jwtHelper: JwtHelperService,
    private router:Router
  ) { }


  ngOnInit(): void 
  {
    let id:number
    
    try 
    {
      const token = sessionStorage.getItem("access_token")
      if( token === null || this.jwtHelper.isTokenExpired(token) ) 
      {
        this.router.navigate(["/notauthorized"])
        return
      }
      else
      {
        id = parseInt(sessionStorage.getItem("userId"))
  
        this.userService.getUserById(id).subscribe( async(res) => {
          
          this.settingFormGroup = new FormGroup({
            lastNameControl:  new FormControl( res.last_name , [ Validators.minLength(1) ]),
            firstNameControl:  new FormControl( res.first_name , [ Validators.minLength(1) ]),
            phoneNumberControl:  new FormControl( res.phone_number , [ Validators.minLength(10) , Validators.maxLength(20) , Validators.pattern('^[0-9]+$')  ]),
            emailControl:  new FormControl( res.email , [ Validators.email , Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$') ]),
            passwordControl : new FormControl( res.password ,[Validators.required, Validators.minLength(6) ]),
            receiveEmailControl: new FormControl( res.receiveEmail ),
            receiveNotificationControl: new FormControl( res.receiveNotification )
          })
        })
      }

    } 
    catch (error) 
    {
      return
    }

  }

  async dismissModal()
  { 
    if( sessionStorage.getItem('userId') === null ) return

    const form = this.settingFormGroup.value
    const id = parseInt( sessionStorage.getItem('userId') )
    
    const user:IUserIn = 
    {
      last_name: form.lastNameControl,
      first_name: form.firstNameControl,
      phone_number: form.phoneNumberControl,
      email: form.emailControl,
      password: form.passwordControl,
      role: 'user',
      receiveEmail:form.receiveEmailControl,
      receiveNotification:form.receiveNotificationControl
    }
    
    this.userService.updateUser( user , id).subscribe( async() => {
      await this.modalController.dismiss()
    })
  
  }

  modify()
  {
    this.isDisabled = !this.isDisabled
    if( this.isDisabled === true )
    {
      this.modifyButton = "Modifier"
    }
    else if( this.isDisabled === false )
    {
      this.modifyButton = "Annuler"
    }
  }

  async handleDelete()
  {
    const actionSheet = await this.actionSheetController.create({
      header: 'Suppression de compte',
      subHeader: 'La suppression du compte est définitive',
      buttons: [{
        cssClass:"action_sheet_delete",
        text: 'Supprimer',
        role: 'destructive',
        data: {
          type: 'delete'
        },
        handler: () => {
          this.deleteUser()
        }
      }, {
        cssClass:"action_sheet_cancel",
        text: 'Annuler',
        handler: () => {
          return
        }
      }]
    })

    await actionSheet.present()
  }

  deleteUser()
  {
    const userId = sessionStorage.getItem("userId")
    if( !userId === null ) return

    const id = parseInt( sessionStorage.getItem("userId") )

    if( id !== null )
    {
      this.userService.deleteUser(id).subscribe( async() => {
        const toast = await this.toastController.create({
          message: 'Vous allez être redirigé vers la page de connexion dans quelques instants ...',
          duration: 3000,
        })
  
        await toast.present().then( async() => {
          await this.modalController.dismiss()
        }).then( async() => {
          await toast.onDidDismiss().then( async() => {
            await this.authService.logout()
          })
        })
  
      })
    }
  }

  get errorMessage() {
    return this.settingFormGroup.controls;
  }

  getFormValue()
  {
    return this.settingFormGroup.value
  }

}
