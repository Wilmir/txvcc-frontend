import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NetworkListComponent } from './components/network-list/network-list.component';
import { NetworkDetailsComponent } from './components/network-details/network-details.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import {HttpClientInterceptor} from './auth/http-client-interceptor.service'
import {NetworkService} from './services/network.service'

import {Routes, RouterModule} from '@angular/router';
import { CreateNetworkComponent } from './components/create-network/create-network.component';
import { UpdateNetworkComponent } from './components/update-network/update-network.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { D3legendService } from './services/d3legend.service';
import { D3tooltipService } from './services/d3tooltip.service';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterSuccessComponent } from './auth/register-success/register-success.component';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {AuthGuard} from './auth/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component'
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { NgxSpinnerModule } from "ngx-spinner";  



const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'register-success', component: RegisterSuccessComponent},
  {path: 'login', component: LoginComponent},
  {path: 'networks', component: NetworkListComponent, canActivate: [AuthGuard]},
  {path: 'networks/:id', component: NetworkDetailsComponent, canActivate: [AuthGuard]},
  {path: 'add', component: CreateNetworkComponent, canActivate: [AuthGuard]},
  {path: 'update/:id', component: UpdateNetworkComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/networks', pathMatch: 'full'},
  {path: '**', redirectTo: '/networks', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    NetworkListComponent,
    NetworkDetailsComponent,
    CreateNetworkComponent,
    UpdateNetworkComponent,
    DateAgoPipe,
    NavMenuComponent,
    RegisterComponent,
    LoginComponent,
    RegisterSuccessComponent,
    HomeComponent,
    AboutComponent
    ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxWebstorageModule.forRoot(),
    NgxPageScrollCoreModule,
    NgxPageScrollModule,
    NgxSpinnerModule  

  ],
  providers: [NetworkService, D3legendService, D3tooltipService,
              {provide: HTTP_INTERCEPTORS, useClass: HttpClientInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }