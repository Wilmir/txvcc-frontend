import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { User } from 'src/app/common';
import { AuthService } from '../auth.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  user:User;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router:Router) {
    this.registerForm = this.formBuilder.group({
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    this.user = {
      name:'',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

  }

  ngOnInit(): void {
  }

  onSubmit(){
    this.user.name = this.registerForm.get('name').value;
    this.user.username = this.registerForm.get('username').value;
    this.user.email = this.registerForm.get('email').value;
    this.user.password = this.registerForm.get('password').value;
    this.user.confirmPassword = this.registerForm.get('confirmPassword').value;
    
    this.authService.register(this.user).subscribe(data => {
      console.log("register success");
      this.router.navigateByUrl('/register-success');
    }, error => {
      console.log("register failed");
    })

  }

}
