import { Injectable } from '@angular/core';
import { User } from 'src/app/common';
import { LoginDTO } from 'src/app/dto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { JWTAuthenticationResponse } from 'src/app/dto';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = `https://txvcc.herokuapp.com/api/auth`;

  constructor(private httpClient:HttpClient, private localStorageService:LocalStorageService) { }
  
  register(user:User):Observable<any>{
    let signUpUrl = `${this.url}/signup`;
    return this.httpClient.post(signUpUrl,user);
  }

  login(loginDTO: LoginDTO):Observable<boolean>{
    let loginUrl = `${this.url}/login`;
    return this.httpClient.post<JWTAuthenticationResponse>(loginUrl,loginDTO).pipe(map(data => {
      this.localStorageService.store('authenticationToken',data.authenticationToken);
      this.localStorageService.store('username',data.username);
      return true;
    }))
  }

  isAuthenticated():boolean{
    return this.localStorageService.retrieve('username') !=null;
  }

  logout() {
    this.localStorageService.clear('authenticationToken');
    this.localStorageService.clear('username');
  }

}
