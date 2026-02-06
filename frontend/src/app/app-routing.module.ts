import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AircraftListComponent } from './components/aircraft-list/aircraft-list.component';
import { WorkOrderListComponent } from './components/work-order-list/work-order-list.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'aircraft', component: AircraftListComponent, canActivate: [AuthGuard] },
  { 
    path: 'work-orders', 
    component: WorkOrderListComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['maintainer', 'admin'] }
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
