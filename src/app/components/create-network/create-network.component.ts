import { Component, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/services/network.service';
import { NetworkDTO } from 'src/app/dto/';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-network',
  templateUrl: './create-network.component.html',
  styleUrls: ['./create-network.component.css']
})
export class CreateNetworkComponent implements OnInit {

  addNetworkForm:FormGroup;
  networkName = new FormControl('');
  description = new FormControl('');
  networkDTO: NetworkDTO;

  constructor(private networkService: NetworkService, private router: Router) {
    this.addNetworkForm = new FormGroup({
      networkName:this.networkName,
      description:this.description
    })
    this.networkDTO = {
      networkName:'',
      description:''
    }
   }

  ngOnInit(): void {

  }

  onSubmit(){
    this.networkDTO.networkName = this.addNetworkForm.get('networkName').value;
    this.networkDTO.description = this.addNetworkForm.get('description').value;
    this.networkService.createNetwork(this.networkDTO)
    .subscribe(data =>
                      {
                        console.log(data);
                        this.gotoNetwork();
                      },
                error => console.log(error));
  }

  gotoNetwork(){
    this.router.navigate([`/networks`]);
  }

}
