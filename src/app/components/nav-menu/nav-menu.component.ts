import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { LoginDTO } from 'src/app/dto';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  loginForm:FormGroup;
  loginDTO:LoginDTO;

  constructor(private authService:AuthService, private router:Router,  private spinnerService: NgxSpinnerService) {
    this.loginForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    });

    this.loginDTO = {
      'username':'',
      'password':''
    };
   }

  ngOnInit(): void {
  }

  get authenticationService():AuthService{
    return this.authService;
  }

  login(){
    this.loginDTO.username = this.loginForm.get('username').value;
    this.loginDTO.password = this.loginForm.get('password').value;
    this.spinnerService.show();
    this.authService.login(this.loginDTO).subscribe(data => {
      if(data){
        console.log("login success");
        this.spinnerService.hide();
        this.router.navigateByUrl("/networks")
      }else{
        console.log("login failed");
      }
    })
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl("/home");
  }

}
