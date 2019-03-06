import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  messageClass;
  message;
  processing = false;
  form: FormGroup;
  previousUrl;

  constructor(
    private formBuilder : FormBuilder,
    private router: Router,
    private authService : AuthService,
    private authguard : AuthGuard,
  ) { this.createForm(); }



  createForm() {
   this.form = this.formBuilder.group({
     username: ['', Validators.required], // Username field
     password: ['', Validators.required] // Password field
   });
 }

 enableForm() {
    this.form.controls['username'].enable(); // Enable username field
    this.form.controls['password'].enable(); // Enable password field
  }

  disableForm() {
   this.form.controls['username'].disable(); // Disable username field
   this.form.controls['password'].disable(); // Disable password field
 }
 onLoginSubmit() {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm(); // Disable form while being process
    // Create user object from user's input
    const user = {
      username: this.form.get('username').value, // Username input field
      password: this.form.get('password').value // Password input field
    }
    this.authService.loginUser(user).subscribe(data=>{
      if(!data.success){
        this.messageClass = 'alert alert-dismissible alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.messageClass ='alert alert-dismissible alert-success';
        this.message = data.message;
        this.authService.storeUserData(data.token, data.user);
        setTimeout(()=>{
          if(this.previousUrl){
            this.router.navigate([this.previousUrl]);
          } else{
                this.router.navigate(['/dashboard']);
          }
        },2000);
      }
    })
}
ngOnInit() {
  if(this.authguard.redirectUrl){
    this.messageClass = 'alert alert-danger';
    this.message = 'You Must be login to view this page';
    this.previousUrl = this.authguard.redirectUrl;
    this.authguard.redirectUrl = undefined;
  }
}

}
