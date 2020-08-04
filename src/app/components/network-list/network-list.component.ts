import { Component, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/services/network.service';
import { Network } from 'src/app/common/network';
import { Router } from '@angular/router';

@Component({
  selector: 'app-network-list',
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.css']
})
export class NetworkListComponent implements OnInit {

  networks: Object[];

  constructor(private networkService: NetworkService,
              private router: Router) { }

  ngOnInit(): void {
    this.listNetworks();
  }

  listNetworks() {
    this.networkService.getNetworkList().subscribe(
      data => {
        this.networks = data;
        console.log(this.networks);
      }
    )
  }

  deleteNetwork(id:number){
    this.networkService.deleteNetwork(id).subscribe(
      data =>{
        console.log("Network: " + id + " has been deleted");
        this.listNetworks();
      },
      error => console.log("Deletion error: " + error)
    );
  }

  updateNetwork(id:number){
    this.router.navigate(['update',id]);
  }
  

}
