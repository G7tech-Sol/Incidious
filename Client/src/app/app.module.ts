import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularRoutingmodule} from './app.routing-module';
import{ FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { BlogComponent } from './components/blog/blog.component';
import { ContactComponent } from './components/contact/contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthService } from './services/auth.service';
import { BlogService } from './services/blog.service';
import { FlashMessagesModule } from 'angular2-flash-messages/module';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notauth.guard';
import { EditblogComponent } from './components/blog/editblog/editblog.component'
// import 'rxjs';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    SignupComponent,
    SigninComponent,
    BlogComponent,
    ContactComponent,
    EditblogComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AngularRoutingmodule,
    ReactiveFormsModule,
    HttpModule,
FlashMessagesModule.forRoot()

  ],
  providers: [AuthService,AuthGuard, NotAuthGuard,BlogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
