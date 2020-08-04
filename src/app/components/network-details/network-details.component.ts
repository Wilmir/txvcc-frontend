import { Component, OnInit } from '@angular/core';
import { Node, Link, Network, Service } from 'src/app/common'
import { ActivatedRoute } from '@angular/router';
import { NetworkService } from 'src/app/services/network.service';
import * as d3 from 'd3';
import { identifierModuleUrl, WritePropExpr } from '@angular/compiler';
import * as XLSX from 'xlsx';

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

  constructor(private networkService: NetworkService, private route: ActivatedRoute) { }

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

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.name).strength(FORCES.LINKS).distance(FORCES.DISTANCE))
      .force('charge', d3.forceManyBody().strength((d:Node, i) => FORCES.CHARGE * (d.linkCount/this.nodes.length)).distanceMax(500))
      .force('center', d3.forceCenter(width / 2, height*.55))
      .force('collide', d3.forceCollide().strength(FORCES.COLLISION).radius((d:Node) => (d.linkCount/this.nodes.length) + 5).iterations(3));

    let networkRequest = this.networkService.getNetwork(this.currentNetworkId);

    networkRequest.subscribe(results => {

      this.nodes = results.nodes;
      this.links = results.links;
      this.network = results;
      console.log(this.network);
      const graphlinks: GraphLink[] = [];

      this.links.forEach(link => {
        const graphlink: GraphLink = new GraphLink(link.id, link.type, link.capacity, link.source.name, link.target.name, link.utilization, link.servicedNodes);
        graphlinks.push(graphlink);
      })

      console.log(this.nodes);
      console.log(graphlinks);

      /*ADDING LINE FOR EACH GRAPH LINK*/
      const link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(graphlinks)
        .enter()
        .append('line')
        .attr('stroke-width', (d: any) => Math.sqrt(d.capacity / 1000))
        .attr('stroke', (d:any) => {
          if(d.utilization/d.capacity > 0.9){
            return '#d6232a';
          }else if(d.utilization/d.capacity > 0.75){
            return '#ff7527';
          }else if (d.utilization/d.capacity > 0){
            return '#099730';
          }else{
            return '#b2a7a2';
          }
        })
        .attr('stroke-opacity', 0.5);
      /*END OF ADDING LINE FOR EACH GRAPH LINK*/


      /*ADDING CIRCLE FOR EACH GRAPH NODE*/
      const nodeGroup = svg.append('g')
        .attr('class', 'nodes');

      const node = nodeGroup.selectAll('circle')
        .data(this.nodes)
        .enter()
        .append('circle')
        .attr('r', d => 30 * (d.linkCount / 20) + 5)
        .attr('fill', (d: any) => d.isHoming ? "#156aa8" : "orange")
        .on('mouseover', showToolTip)
        .on('mouseout', hideToolTip);
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
      const tooltip = d3.select('.network-graph')
                                  .append('div')
                                  .attr('class','tooltip')

      function showToolTip(d) {
        let html = `<div align='center'><strong><span style='color:red; text-align:center'>${d.name}</span></strong></div>`;
          html += `<strong>ID: <span style='color:red'>${d.id}</span></strong><br>`;
          html += `<strong>Type: <span style='color:red'>${ d.isHoming? "Homing" : "Node"}</span></strong><br>`;
          html += `<strong># of Links: <span style='color:red'>${d.linkCount}</span></strong><br>`;
          html += `<strong># of Services: <span style='color:red'>${d.services.length}</span></strong><br>`;

          let sumOfservices = 0;
          d.services.forEach(service => {
            html += `<strong>&nbsp;&nbsp;&nbsp;${service.type}: <span style='color:red'>${service.capacity}</span></strong><br>`;
            sumOfservices += service.capacity;
          });

          html += `<strong>All Services (Mbps): <span style='color:red'>${sumOfservices}</span></strong><br>`;

        tooltip
          .style('top', d3.mouse(this)[1] - 20 + 'px')
          .style('left', d3.mouse(this)[0] + 20 + 'px')
          .style('width','150px')
          .style('visibility', 'visible')
          .style('background','black')
          .style('color','white')
          .style('border-radius','4px')
          .style('padding','6px')
          .style('opacity', 0.7)
          .style('font-size','10px')
          .html(html);
      }

      function hideToolTip(d) {
        tooltip
          .style('visibility','hidden')
          .style('opacity', 0);
      }
      /*END OF ADDING TOOLTIP TO EACH GRAPH NODE*/

      /*ADDING THE GRAPH LEGENDS*/
      const nodeTypes: boolean[] = [true, false];
      const linkTypes: string[] = ["not utilized", "<75% utilization", "75 - 90% utilization", ">90 % utilization"];

      const legend = svg.append('g')
        .attr('transform', 'translate(' + (width - 300) + ', ' + (50) + ')');

      const nodeLegend = legend.append('g');

      nodeTypes.forEach((nodeType, i) => {
        const legendRow = nodeLegend.append('g')
          .attr('transform', 'translate(0, ' + (i * 30) + ')');

        legendRow.append('circle')
          .attr('r', "8")
          .attr('fill', nodeType ? '#156aa8' : 'orange');


        legendRow.append('text')
          .attr('x', -15)
          .attr('y', 5)
          .attr('text-anchor', 'end')
          .style('text-transform', 'capitalize')
          .style('font-size', '11px')
          .text(nodeType ? "Homing" : "Node");
      })

      const linkLegend = legend.append('g')
        .attr('transform', 'translate(' + 200 + ', 0)');

      linkTypes.forEach((linkType, i) =>{
        const legendRow = linkLegend.append('g')
          .attr('transform', 'translate(0, ' + (i * 30) + ')');
          legendRow.append('rect')
            .attr('width', 30)
            .attr('height', 2)
            .attr('opacity',0.5)
            .attr('fill', () => {
              console.log(linkType);
             if(linkType === "not utilized"){
               return "gray";
             }else if(linkType === "<75% utilization"){
               return "green";
             }else if(linkType === "75 - 90% utilization"){
               return "orange";
             }else{
               return "red";
             }
            });

          legendRow.append('text')
          .attr('x', -15)
          .attr('y',5)
          .attr('text-anchor', 'end')
          .style('text-transform', 'capitalize')
          .style('font-size', '11px')
          .text(linkType);
      })


      /*END OF ADDING THE GRAPH LEGENDS*/

      
      svg.selectAll('circle').call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

      simulation
        .nodes(this.nodes)
        .on('tick', ticked);

      simulation.force<d3.ForceLink<any, any>>('link')
        .links(graphlinks);

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
          .attr('y', function (d: any) { return d.y - (30 * (d.linkCount / 20) + 6) });

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
        uploadedData.forEach((d: any) => {
          const link: Link = new Link();
          link.capacity = d.capacity;

          const source: Node = new Node(d.source_id);
          const target: Node = new Node(d.target_id)

          link.capacity = d.capacity;
          link.type = d.type;
          link.source = source;
          link.target = target;

          this.uploadedLinks.push(link);

        })
      } else if (data == this.uploadedNodes) {
        this.uploadedNodes = uploadedData;
      } else if (data == this.uploadedServices) {
        uploadedData.forEach((d: any) => {
          const service: Service = new Service();

          const node: Node = new Node(d.node_id);
          const homingNode: Node = new Node(d.homing_node_id);

          service.type = d.type;
          service.capacity = d.capacity;
          service.node = node;
          service.homingNode = homingNode;

          this.uploadedServices.push(service);
        })
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

    if (this.uploadedNodes.length > 0) {
      console.log("Sending nodes...")
      const receivedData = this.networkService.postNodes(this.currentNetworkId, this.uploadedNodes)
        .subscribe(results => {
          console.log("Completed sending nodes");
          console.log(results);
        });
    }

    if (this.uploadedLinks.length > 0) {
      console.log("Sending links...");
      const receivedData = this.networkService.postLinks(this.currentNetworkId, this.uploadedLinks)
        .subscribe(results => {
          console.log("Completed sending links");
          console.log(results);
        });
    }

    if (this.uploadedServices.length > 0) {
      console.log("Sending services...");
      const receivedData = this.networkService.postServices(this.currentNetworkId, this.uploadedServices)
        .subscribe(results => {
          console.log("Completed sending services");
          console.log(results);
        })
    }




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






