import { Component, OnInit } from '@angular/core';
import { Node, Link, Network, Service } from 'src/app/common'
import { ActivatedRoute, Router } from '@angular/router';
import { NetworkService } from 'src/app/services/network.service';
import { D3legendService } from 'src/app/services/d3legend.service';
import { D3tooltipService } from 'src/app/services/d3tooltip.service';
import * as d3 from 'd3';
import { identifierModuleUrl, WritePropExpr, ReturnStatement } from '@angular/compiler';
import * as XLSX from 'xlsx';
import {Title} from "@angular/platform-browser";


const FORCES = {
  LINKS: 1,
  COLLISION: 1,
  CHARGE: -5000,
  DISTANCE: 10
}

@Component({
  selector: 'app-network-details',
  templateUrl: './network-details.component.html',
  styleUrls: ['./network-details.component.css']
})
export class NetworkDetailsComponent implements OnInit {

  nodes: Node[] = [];
  links: Link[] = [];
  network: Network = new Network();
  uploadedNodes: any[] = [];
  uploadedLinks: any[] = [];
  uploadedServices: any[] = []
  currentNetworkId: number;

  constructor(private networkService: NetworkService, 
    private route: ActivatedRoute, 
    private router:Router,
    private d3LegendService:D3legendService,
    private d3TooltipService:D3tooltipService,
    private titleService:Title) { 
    this.titleService.setTitle("TxVcc - Network" );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.visualizeNetwork();
    })
  }

  /*DRAW THE GRAPH OF THE NETWORK*/
  visualizeNetwork() {
    const hasNetworkId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasNetworkId) {
      this.currentNetworkId = +this.route.snapshot.paramMap.get('id');
    } else {
      this.currentNetworkId = 1;
    }

    const svg = d3.select('svg');
    const width = +window.innerWidth * .73;
    const height = +window.innerHeight * .90;

    svg.attr('width', width);
    svg.attr('height', height);

    d3.select('.graphsvg').remove();

    const graphSvg = svg.append('g').attr('class','graphsvg');
    graphSvg.attr('width', width);
    graphSvg.attr('height', height);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.name).strength(FORCES.LINKS).distance(FORCES.DISTANCE))
      .force('charge', d3.forceManyBody().strength((d:Node, i) => FORCES.CHARGE * (d.linkCount/this.nodes.length) - 10).distanceMax(500))
      .force('center', d3.forceCenter(width*.6, height*.4))
      .force('collide', d3.forceCollide().strength(FORCES.COLLISION).radius((d:Node) => (d.linkCount/this.nodes.length) + 5).iterations(3));

    /*CREATE THE GRAPH*/  
    let networkRequest = this.networkService.getNetwork(this.currentNetworkId);

    networkRequest.subscribe(results => {

      this.nodes = results.nodes;
      this.links = results.links;
      this.network = results;
      console.log(this.network);
      const graphlinks: GraphLink[] = [];

      this.links.forEach(link => {
        const graphlink: GraphLink = new GraphLink(link.id, link.type, link.capacity, link.source.name, link.target.name, link.utilization, link.services);
        graphlinks.push(graphlink);
      })

      /*Adds the Network Summary Legend*/
      this.d3LegendService.generateLegend(graphSvg, this.links, this.nodes);
      /*Adds the Network Summary Legend*/

      simulation
        .nodes(this.nodes)
        .on('tick', ticked);

      simulation.force<d3.ForceLink<any, any>>('link')
        .links(graphlinks);

      /*ADDING LINE FOR EACH GRAPH LINK*/
      const link = graphSvg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(graphlinks)
        .enter()
        .append('line')
        .attr('stroke-width', (d: any) => Math.sqrt(d.capacity / 200))
        .attr('stroke', (d:any) => {
          if(d.utilization/d.capacity > 0.9){
            return 'red';
          }else if(d.utilization/d.capacity >= 0.5){
            return 'orange';
          }else if (d.utilization/d.capacity > 0){
            return 'green';
          }else{
            return 'gray';
          }
        })
        .attr('stroke-dasharray', (d:any) => {
          if(d.type && (d.type.toLowerCase() == "microwave" || d.type.toLowerCase() == "mw")){
            return '3';
          }else{
            return '0';
          }
        })
        .attr('stroke-opacity', 0.5);
      /*END OF ADDING LINE FOR EACH GRAPH LINK*/


      /*ADDING CIRCLE FOR EACH GRAPH NODE*/
      const nodeGroup = graphSvg.append('g')
        .attr('class', 'nodes');

      const node = nodeGroup.selectAll('circle')
        .data(this.nodes)
        .enter()
        .append('circle')
        .attr('r', d => 30 * (d.linkCount / 20) + 5)
        .attr('fill', (d: any) => d.isHoming ? "#0275d8" : "#f0ad4e")
        .attr('stroke','#292b2c')
        .attr('stroke-width','2')
        .attr('stroke-opacity',.8)
        .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

      /*END OF ADDING CIRCLE FOR EACH GRAPH NODE*/

      /*ADDING LABEL TO EACH GRAPH NODE*/
      const text = nodeGroup.selectAll('text')
        .data(this.nodes)
        .enter()
        .append("text")
        .text(d => d.name)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .attr('fill', '#444444');
      /*END OF ADDING LABEL TO EACH GRAPH NODE*/

      /*ADDING TOOLTIP TO EACH GRAPH NODE*/
        this.d3TooltipService.addTooltip(node);
      /*END OF ADDING TOOLTIP TO EACH GRAPH NODE*/

      function ticked() {
        link
          .attr('x1', function (d: any) { return d.source.x; })
          .attr('y1', function (d: any) { return d.source.y; })
          .attr('x2', function (d: any) { return d.target.x; })
          .attr('y2', function (d: any) { return d.target.y; });

        node
          .attr('cx', function (d: any) { return d.x = Math.max(20, Math.min(width - 20, d.x)); })
          .attr('cy', function (d: any) { return d.y = Math.max(40, Math.min(height - 20, d.y)); });

        text
          .attr('x', function (d: any) { return d.x; })
          .attr('y', function (d: any) { return d.y - (30 * (d.linkCount / 20) + 10) });

      }

    });

    function dragstarted(d) {
      if (!d3.event.active) { simulation.alphaTarget(0.3).restart(); }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) { simulation.alphaTarget(0); }
      d.fx = null;
      d.fy = null;
    }
  }


  /*READ DATA FROM EXCEL FILE*/
  onFileChange(event: any, data) {
    const target: DataTransfer = <DataTransfer>event.target;

    if (target.files.length != 1) throw new Error("Cannot use multiple files");

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      //get the binary string
      const binaryString: string = e.target.result;

      //convert binary string into an Excel workbook
      const workBook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });


      //get the name of first the first worksheet
      const workSheetName: string = workBook.SheetNames[0];

      //get the first worksheet object
      const workSheet: XLSX.WorkSheet = workBook.Sheets[workSheetName];

      console.log("Reading the worksheet...")
      console.log(workSheet);

      const uploadedData = (XLSX.utils.sheet_to_json(workSheet));

      if (data == this.uploadedLinks) {
          this.uploadedLinks = uploadedData;
      } else if (data == this.uploadedNodes) {
        uploadedData.forEach((d:any) =>{
          if(d.homing){
            d.isHoming = true;
          }else{
            d.isHoming = false;
          }
        });
        this.uploadedNodes = uploadedData;
      } else if (data == this.uploadedServices) {
          this.uploadedServices = uploadedData;
      }

      console.log(data);
      console.log("Uploading the data");
      console.log(uploadedData);

    }

    reader.readAsBinaryString(target.files[0]);

  }

  /*SEND UPLOADED DATA TO API*/
  onSubmit() {
    console.log("Initializing data submission...")
    console.log(this.uploadedNodes);
    console.log(this.uploadedLinks);
    console.log(this.uploadedServices);


    if(!(this.uploadedLinks.length>0) && !(this.uploadedNodes.length>0) && !(this.uploadedServices.length>0)){
      return;
    }

    if (this.uploadedNodes.length > 0) {
      console.log("Sending nodes...")
      const receivedData = this.networkService.postNodes(this.currentNetworkId, this.uploadedNodes)
        .subscribe(results => {
          console.log("Completed sending nodes");
          this.visualizeNetwork();
          console.log(results);
        });
    }

    if (this.uploadedLinks.length > 0) {
      console.log("Sending links...");
      const receivedData = this.networkService.postLinks(this.currentNetworkId, this.uploadedLinks)
        .subscribe(results => {
          console.log("Completed sending links");
          this.visualizeNetwork();
          console.log(results);
        });
    }

    if (this.uploadedServices.length > 0) {
      console.log("Sending services...");
      const receivedData = this.networkService.postServices(this.currentNetworkId, this.uploadedServices)
        .subscribe(results => {
          console.log("Completed sending services");
          this.visualizeNetwork();
          console.log(results);
        })
    }

    this.uploadedNodes = [];
    this.uploadedLinks = [];
    this.uploadedServices = [];
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

  deleteNodes(id:number){
    this.networkService.deleteNodes(id).subscribe(
      data =>{
        console.log("Nodes of network: " + id + " has been deleted");
        this.visualizeNetwork();
      },
      error => console.log("Deletion error: " + error)
    );
  }

  deleteLinks(id:number){
    this.networkService.deleteLinks(id).subscribe(
      data =>{
        console.log("Links of network: " + id + " has been deleted");
        this.visualizeNetwork();
      },
      error => console.log("Deletion error: " + error)
    );
  }


  deleteServices(id:number){
    this.networkService.deleteServices(id).subscribe(
      data =>{
        console.log("Services of network: " + id + " has been deleted");
        this.visualizeNetwork();
      },
      error => console.log("Deletion error: " + error)
    );
  }

  listNetworks(){
    this.router.navigateByUrl('/networks');
  }

  exportexcel(name:string): void
  {
    /* pass here the table id */
    let element = document.getElementById(name);
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, `txvcc_node_${this.network.networkName}.xlsx`);
 
  }

}

class GraphLink {
  id: number;
  type: string;
  capacity: number;
  source: string;
  target: string;
  utilization: number;
  servicedNodes: Node[]

  constructor(id, type, capacity, source, target, utilization, servicedNodes) {
    this.id = id;
    this.type = type;
    this.capacity = capacity;
    this.source = source;
    this.target = target;
    this.utilization = utilization;
    this.servicedNodes = servicedNodes;
  }

}






