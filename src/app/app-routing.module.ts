import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo:'/login',
    pathMatch:'full'
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./pages/splash-screen/splash-screen.module').then(m => m.SplashScreenPageModule)
  // },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('../app/pages/register/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('../app/pages/login/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('../app/pages/forgot-password/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'notauthorized',
    loadChildren: () => import('./pages/not-authorized/not-authorized/not-authorized.module').then( m => m.NotAuthorizedPageModule )
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
