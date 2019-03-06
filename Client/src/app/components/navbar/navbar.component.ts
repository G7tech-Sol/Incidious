import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public authService : AuthService ,
    private router : Router,
    private flashMessagesService : FlashMessagesService
  ) { }

  ngOnInit() {
  }
  onLogOut(){
    this.authService.logOut();
    this.flashMessagesService.show('You are Successfully logged out',{cssClass: 'alert-info'});
    this.router.navigate(['/home']);
  }
}
