import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
 form : FormGroup;
 message;
 messageClass;
 processing;
 emailValid;
 emailMessage;
 usernameValid;
 usernameMessage;



  constructor(
    private formBuilder : FormBuilder,
    private authService:AuthService,
    private router : Router,
  ) {
    this.createForm();
  }

  createForm(){
    this.form = this.formBuilder.group({
      name : ["",Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])] ,
      username : ["",Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(10),
        this.validateUsername
      ])],
      email : ["",Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
      password : ["", Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        this.validatePassword
      ])],
      confirm :["",Validators.compose([
        Validators.required,
      ])]
    }, { validator: this.matchPassword('password','confirm')} )
  };
  validateEmail(controls){
     const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     if(regExp.test(controls.value)){
       return null;
     }else{
       return {"validateEmail" : true};
     }
  }
  validateUsername(controls){
    const regExp = /^[a-zA-Z0-9]+$/;
     if(regExp.test(controls.value)){
       return null;
     }else{
       return {"validateUsername" : true};
     }
  }
  validatePassword(controls){
    const regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ ;
    if (regExp.test(controls.value)){
      return null;
    } else {
      return {"validatePassword" : true};
    }
  }
  matchPassword(password,confirm){
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value){
        return null;
      } else {
      return { 'matchPassword':true};
      }
    }
  }

disableForm(){
  this.form.controls['email'].disable;
  this.form.controls['name'].disable;
  this.form.controls['username'].disable;
  this.form.controls['password'].disable;
  this.form.controls['confirm'].disable;
};

enableForm(){
  this.form.controls['email'].enable;
  this.form.controls['name'].enable;
  this.form.controls['username'].enable;
  this.form.controls['password'].enable;
  this.form.controls['confirm'].enable;
};




  onRegisterSubmit(){
    this.processing = true ;
    this.disableForm();
    const user = {
      name : this.form.get('name').value,
      email : this.form.get('email').value,
      username : this.form.get('username').value,
      password : this.form.get('password').value
    }
    this.authService.registerUser(user).subscribe(data =>{
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false ;
        this.enableForm();
      } else{
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(()=>{
          this.router.navigate(['/signin']);
        },2000);

      }
    })
  };
  checkEmail(){
    this.authService.checkEmail(this.form.get('email').value).subscribe(data=>{
      console.log(data);
      if(!data.success){
        this.emailValid = false;
        this.emailMessage = data.message;
      } else {
        this.emailValid = true;
        this.emailMessage = data.message;
      }
    }) ;
  };


  checkUsername(){
    this.authService.checkUsername(this.form.get('username').value).subscribe(data=>{
      if(!data.success){
        this.usernameValid = false;
        this.usernameMessage = data.message;
      } else {
        this.usernameValid = true;
        this.usernameMessage = data.message;
      }
    });
  };
  ngOnInit() {
  }

}
