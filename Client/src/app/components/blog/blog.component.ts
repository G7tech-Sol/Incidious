import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  message;
  messageClass;
  newPost = false;
  processing = false ;
  loadingBlogs ;
  form ;
  username;
  blogPost;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
  ) {
this.createNewBlogForm();
  }

  createNewBlogForm(){
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])]
    });
  }
  disableFormNewBlogForm(){
    this.form.get('title').disable();
    this.form.get('body').disable();
  }
  enableFormNewBlogForm(){
    this.form.get('title').enable();
    this.form.get('body').enable();
  }
  alphaNumericValidation(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'alphaNumericValidation': true } // Return error in validation
    }
  }
  newBlogForm(){
    this.newPost = true ;
  }
  reloadBlogs(){
    this.loadingBlogs = true; // Used to lock button
    this.getAllBlogs();
  // Get All Blogs
  setTimeout(() => {
    this.loadingBlogs = false; // Release button lock after four seconds
  }, 4000);
  };
  draftComment(){

  };
  onBlogSubmit(){
    this.processing = true ;
    this.disableFormNewBlogForm();
    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy:this.username
    }

    this.blogService.newBlog(blog).subscribe(data =>{
      if (!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableFormNewBlogForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(()=>{
          this.newPost = false;
          this.processing = false;
          this.message = false;
          this.form.reset();
          this.enableFormNewBlogForm();
        },2000);
        this.getAllBlogs();
      }
    });
  }
  goBack(){
    window.location.reload();
  }
  getAllBlogs(){
    this.blogService.getAllBlogs().subscribe(data=>{
      this.blogPost = data.blog;
    })
  }
  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      this.getAllBlogs();
    })
  }

}
