import { Component, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/services/network.service';
import { Router } from '@angular/router';
import { Title } from "@angular/platform-browser";
import { LocalStorageService } from 'ngx-webstorage';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-network-list',
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.css']
})
export class NetworkListComponent implements OnInit {

  networks: Object[];

  constructor(private networkService: NetworkService,
    private router: Router,
    private titleService: Title,
    private localStorageService: LocalStorageService,
    private spinnerService: NgxSpinnerService) {
    this.titleService.setTitle("TxVCC - Networks");
  }

  ngOnInit(): void {
    this.listNetworks();
  }

  listNetworks() {
    let username = this.localStorageService.retrieve('username');
    /*SHOW SPINNER WHILE WAITING FOR THE DATA*/
    this.spinnerService.show();
    this.networkService.getNetworkList(username).subscribe(
      data => {
        this.networks = data;
        console.log(this.networks);
        /*HIDE THE SPINNER WHEN THE DATA IS RECEIVE*/
        this.spinnerService.hide();
      }
    )
  }

  deleteNetwork(id: number) {
    this.networkService.deleteNetwork(id).subscribe(
      data => {
        console.log("Network: " + id + " has been deleted");
        this.listNetworks();
      },
      error => console.log("Deletion error: " + error)
    );
  }

  updateNetwork(id: number) {
    this.router.navigate(['update', id]);
  }


}
