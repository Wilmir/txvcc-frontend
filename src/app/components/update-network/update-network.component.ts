import { Component, OnInit } from '@angular/core';
import { Network } from 'src/app/common/network';
import { NetworkService } from 'src/app/services/network.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-update-network',
  templateUrl: './update-network.component.html',
  styleUrls: ['./update-network.component.css']
})
export class UpdateNetworkComponent implements OnInit {
  id:number;
  network:Network;

  constructor(private networkService:NetworkService,
              private route:ActivatedRoute,
              private router:Router) { }

  ngOnInit(): void {
    this.network = new Network();
    this.id = +this.route.snapshot.params['id'];

    this.networkService.getNetwork(this.id)
      .subscribe(data => {
        console.log(data);
        this.network = data;
      }, error => console.log(error));
  }

  updateNetwork(){
    this.networkService.updateNetwork(this.id, this.network)
      .subscribe(data => 
                    {
                      console.log(data);
                      this.network = new Network();
                      this.gotoList();
                    }, 
                 error => console.log(error));

  }

  onSubmit(){
    this.updateNetwork();
  }

  gotoList(){
    this.router.navigateByUrl('/networks');
  }
}
