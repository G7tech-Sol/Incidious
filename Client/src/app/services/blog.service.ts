import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthService } from './auth.service';
 import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  options;
   domain = this.authService.domain;

   constructor(
     private authService: AuthService,
     private http: Http
   ) { }

   // Function to create headers, add token, to be used in HTTP requests
   createAuthenticationHeaders() {
     this.authService.loadToken(); // Get token so it can be attached to headers
     // Headers configuration options
     this.options = new RequestOptions({
       headers: new Headers({
         'Content-Type': 'application/json', // Format set to JSON
         'authorization': this.authService.authToken // Attach token
       })

     });
   }

 newBlog(blog){
   this.createAuthenticationHeaders();
   return this.http.post(this.domain + '/blogs/newBlog', blog , this.options).pipe(map(res => res.json()));
 }
 getAllBlogs(){
   this.createAuthenticationHeaders();
   return this.http.get(this.domain + '/blogs/allBlogs' , this.options).pipe(map(res=>res.json()));
 }
 getSingleBlog(id){
   this.createAuthenticationHeaders();
   return this.http.get(this.domain+ '/blogs/singleblog/' + id , this.options).pipe(map(res=>res.json()));
 }
 editBlog(blog) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + '/blogs/updateBlog', blog , this.options).pipe(map(res => res.json()));
  }
}
