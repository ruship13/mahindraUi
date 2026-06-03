import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MyprofileComponent } from './components/myprofile/myprofile.component';
import { AuthGuard } from './components/auth/auth.guard';
import { Role } from './utils/role.enum';
import { AccesDeniedComponent } from './acces-denied/acces-denied.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
      accessField: 'Live Dashboard' 
    },
  },
  {
    path: 'myprofile',
    component: MyprofileComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin, Role.Superwise, Role.Operator,Role.Monitor],
      accessField: 'User Profile' 
    },
  },
  {
    path: 'master',
    loadChildren: () => import('./components/master/master.module').then(m => m.MasterModule),
  },
  {
    path: 'control',
    loadChildren: () => import('./components/control/control.module').then(m => m.ControlModule),
  },
  {
    path: 'monitor',
    loadChildren: () => import('./components/monitor/monitor.module').then(m => m.MonitorModule),
  },
  {
    path: 'reports',
    loadChildren: () => import('./components/reports/reports.module').then(r => r.ReportsModule),
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'access-denied',
    component: AccesDeniedComponent
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
