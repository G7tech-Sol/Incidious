import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BlogService } from '../../../services/blog.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editblog',
  templateUrl: './editblog.component.html',
  styleUrls: ['./editblog.component.css']
})
export class EditblogComponent implements OnInit {
 message;
 messageClass;
 blog;
 processing = false;
 currentUrl;
 loading = true;
  constructor(
    private location: Location,
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }
  updateBlogSubmit() {
     this.processing = true; // Lock form fields
     // Function to send blog object to backend
     console.log(this.blog);
     // const blogz= {
     //   _id: this.blog._id,
     //   title: this.blog.title,
     //   body: this.blog.body
     // }
     this.blogService.editBlog(this.blog).subscribe(data => {
       // Check if PUT request was a success or not
         if (!data.success) {
         this.messageClass = 'alert alert-danger'; // Set error bootstrap class
         this.message = data.message; // Set error message
         this.processing = false; // Unlock form fields
       } else {
         this.messageClass = 'alert alert-success'; // Set success bootstrap class
         this.message = data.message; // Set success message
         // After two seconds, navigate back to blog page
         setTimeout(() => {
           this.router.navigate(['/blog']); // Navigate back to route page
         }, 2000);
       }
     });
   }
  goBack() {
   this.location.back();
 }
  ngOnInit() {
     this.currentUrl = this.activatedRoute.snapshot.params;
     console.log(this.currentUrl);
    // this.currentUrl= '5c7bc389e5b332193cf24bee';
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data =>{
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = 'Blog not found.'; // Set error message
      } else {
        this.blog = data.blog; // Save blog object for use in HTML
        this.loading = false; // Allow loading of blog form
      }
    });
  }

}
