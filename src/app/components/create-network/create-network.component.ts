import { Component, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/services/network.service';
import { Network } from 'src/app/common/network';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-network',
  templateUrl: './create-network.component.html',
  styleUrls: ['./create-network.component.css']
})
export class CreateNetworkComponent implements OnInit {

  network: Network = new Network();
  submitted = false;

  constructor(private networkService: NetworkService, private router: Router) {
   }

  ngOnInit(): void {

  }

  save() {
    this.networkService.createNetwork(this.network)
      .subscribe(data =>
                        {
                          console.log(data);
                          this.gotoNetwork(data.id);
                        },
                  error => console.log(error));
  }

  onSubmit(){
    this.submitted = true;
    this.save();
  }

  gotoNetwork(id:number){
    this.router.navigate([`/networks/${id}`]);
  }

}
