import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Network } from '../common/network';
import { Link } from '../common/link';
import { Node } from '../common/node';
import { NetworkDTO } from '../dto';
import { Service } from '../common/service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private baseUrl = "https://txvcc.herokuapp.com/api/networks";
  private userUrl = "https://txvcc.herokuapp.com/api/users";

  constructor(private httpClient: HttpClient) { }

  getNetworkList(username:string): Observable<Object[]>{
    const networkURL = `${this.userUrl}/${username}/networks`;

    return this.httpClient.get<Object[]>(networkURL).pipe(
      map(response => {
        console.log(response);
        return response;}
        )
    )
  }

  getNetwork(networkId: number): Observable<Network>{
    const networkUrl =`${this.baseUrl}/${networkId}`;
    return this.httpClient.get<Network>(networkUrl);
  }

  createNetwork(networkDTO: NetworkDTO):Observable<Network>{
    return this.httpClient.post<Network>(`${this.baseUrl}`, networkDTO);
  }

  updateNetwork(networkId: number, network: any): Observable<Network>{
    const networkUrl =`${this.baseUrl}`;
    return this.httpClient.put<Network>(networkUrl, network);

  }

  deleteNetwork(networkId: number):Observable<string>{
    const networkUrl =`${this.baseUrl}/${networkId}`;
    return this.httpClient.delete<string>(networkUrl);
  }

  deleteNodes(networkId: number):Observable<string> {
    const nodesUrl =`${this.baseUrl}/${networkId}/nodes`;
    return this.httpClient.delete<string>(nodesUrl);
  }

  deleteLinks(networkId: number) {
    const linksUrl =`${this.baseUrl}/${networkId}/links`;
    return this.httpClient.delete<string>(linksUrl);
  }

  deleteServices(networkId: number) {
    const servicesUrl =`${this.baseUrl}/${networkId}/services`;
    return this.httpClient.delete<string>(servicesUrl);
  }

  postNodes(networkId:number, nodes:Node[]):Observable<Node[]>{
    const networkUrl =`${this.baseUrl}/${networkId}/nodes`;
    return this.httpClient.post<Node[]>(networkUrl, nodes);
  }

  postLinks(networkId:number, links:Link[]):Observable<Link[]>{
    const networkUrl =`${this.baseUrl}/${networkId}/links`;
    return this.httpClient.post<Link[]>(networkUrl, links);
  }

  postServices(networkId:number, services:Service[]):Observable<Service[]> {
    const networkUrl =`${this.baseUrl}/${networkId}/services`;
    return this.httpClient.post<Service[]>(networkUrl, services);
  }
}


