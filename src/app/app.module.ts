import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NetworkListComponent } from './components/network-list/network-list.component';
import { NetworkDetailsComponent } from './components/network-details/network-details.component';
import {HttpClientModule} from '@angular/common/http'
import {NetworkService} from './services/network.service'

import {Routes, RouterModule} from '@angular/router';
import { CreateNetworkComponent } from './components/create-network/create-network.component';
import { UpdateNetworkComponent } from './components/update-network/update-network.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { D3legendService } from './services/d3legend.service';
import { D3tooltipService } from './services/d3tooltip.service';

const routes: Routes = [
  {path: 'networks', component: NetworkListComponent},
  {path: 'networks/:id', component: NetworkDetailsComponent},
  {path: 'add', component: CreateNetworkComponent},
  {path: 'update/:id', component: UpdateNetworkComponent},
  {path: 'add', component: CreateNetworkComponent},
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
    DateAgoPipe],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule
  ],
  providers: [NetworkService, D3legendService, D3tooltipService],
  bootstrap: [AppComponent]
})
export class AppModule { }