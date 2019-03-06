import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BlogComponent } from './components/blog/blog.component';
import { EditblogComponent } from './components/blog/editblog/editblog.component';
import { ContactComponent } from './components/contact/contact.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notauth.guard'

const appRoutes :Routes = [
   { path:'', component: HomeComponent } ,
   { path:'dashboard', component: DashboardComponent, canActivate : [AuthGuard]},
   { path:'profile', component: ProfileComponent ,  canActivate : [AuthGuard]},
   { path:'blog', component: BlogComponent, canActivate : [AuthGuard] },
   { path:'editblog/:id', component: EditblogComponent , canActivate: [AuthGuard] },
   { path:'contact', component: ContactComponent },
   { path:'signup', component: SignupComponent, canActivate :[NotAuthGuard] },
   { path:'signin', component: SigninComponent,canActivate:[NotAuthGuard] }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(
       appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [],
  exports:[RouterModule]
})
export class AngularRoutingmodule {}
