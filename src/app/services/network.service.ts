import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Network } from '../common/network';
import { Link } from '../common/link';
import { Node } from '../common/node';
import { Service } from '../common/service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private baseUrl = "http://localhost:8080/api/networks";

  constructor(private httpClient: HttpClient) { }

  getNetworkList(): Observable<Object[]>{
    return this.httpClient.get<Object[]>(this.baseUrl).pipe(
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

  createNetwork(network: Network):Observable<Network>{
    return this.httpClient.post<Network>(`${this.baseUrl}`, network);
  }

  updateNetwork(networkId: number, network: any): Observable<Network>{
    const networkUrl =`${this.baseUrl}`;
    return this.httpClient.put<Network>(networkUrl, network);

  }

  deleteNetwork(networkId: number):Observable<string>{
    const networkUrl =`${this.baseUrl}/${networkId}`;
    return this.httpClient.delete<string>(networkUrl);
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


