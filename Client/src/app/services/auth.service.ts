import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { Observable } from 'rxjs/Observable';
  import { map } from 'rxjs/operators';
 // import { Observable } from "rxjs/Rx";
import { tokenNotExpired } from 'angular2-jwt';






@Injectable({
  providedIn: 'root'
})
export class AuthService {

domain = "";
authToken;
user;
options;
  constructor(
    private http: Http,



  ) { }

  createAuthenticationHeaders(){
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-type' : 'application/json',
        'authorization' : this.authToken
      })
    });
  };
  loadToken(){
    this.authToken = localStorage.getItem('token');
  };
  registerUser(user){
    return this.http.post(this.domain + "/authentication/register", user).pipe(map(res => res.json()));
  };

  checkUsername(username){
    return this.http.get(this.domain + "/authentication/checkUsername/" + username).pipe( map ((res : any) => res.json()));
  };

  checkEmail(email){

     // return this.http.get(this.domain + "/authentication/checkEmail" + email).pipe(map (res => res.json()));
     return this.http.get(this.domain + "/authentication/checkEmail/" + email).pipe(map ((res : any) => res.json()));
     console.log("email is", email);
  };

  loginUser(user){
    return this.http.post(this.domain + "/authentication/login" , user).pipe(map(res => res.json()));
  };
  logOut(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();

  };

  storeUserData(token, user){
    localStorage.setItem ('token',token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  };
  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + "/authentication/profile" , this.options).pipe(map(res => res.json()));
  };

  loggedIn() {
    return tokenNotExpired();
  }
}
