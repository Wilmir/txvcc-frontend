import { Injectable } from '@angular/core';
import { Link, Node } from '../common';
import * as d3 from 'd3';


@Injectable({
  providedIn: 'root'
})
export class D3legendService {

  constructor() { }

  generateLegend(svg:any, links:Link[], nodes:Node[]){
     /*ADDING THE GRAPH LEGENDS*/
     const nodeTypes: boolean[] = [true, false];
     const linkTypes: string[] = ["no utilization", "<50% utilization", "50 - 90% utilization", ">90 % utilization"];
     
     d3.select('.class-legend').remove();
     d3.select('.title-legend').remove();

     const legend = svg.append('g')
       .attr('class','graph-legend')
       .attr('transform', 'translate(' + 50 + ', ' + (50) + ')');

     const titleLegend = svg.append('g')
       .attr('class','title-legend')
       .attr('transform', 'translate(' + 130 + ', 20)');

     titleLegend.append("text")
       .attr('text-anchor', 'middle')
       .style('font-size', '12px')
       .style('font-weight', 'bold')
       .text("NETWORK SUMMARY");

     const nodeLegend = legend.append('g')
       .attr('transform', 'translate(' + 150 + ', 0)');

     nodeTypes.forEach((nodeType, i) => {
       const legendRow = nodeLegend.append('g')
         .attr('transform', 'translate(0, ' + (i * 30) + ')');

       legendRow.append('circle')
         .attr('r', "8")
         .attr('cx',"14")
         .attr('fill', nodeType ? '#0275d8' : '#f0ad4e');

       /*Count the node types*/
       let homingCount = 0;
       let nodeCount = 0;

       nodes.forEach(node => node.isHoming? homingCount++ : nodeCount++);

       legendRow.append('text')
         .attr('x', -15)
         .attr('y', 5)
         .attr('text-anchor', 'end')
         .style('text-transform', 'capitalize')
         .style('font-size', '11px')
         .text(nodeType ? homingCount + " Homing" : nodeCount + " Nodes");
     })

     let unutilized = 0;
     let lessthan50 = 0;
     let greaterthan50 = 0;
     let greaterthan90 = 0;

     /*count the link types*/
     links.forEach(link => {
       let percentUtil = link.utilization/link.capacity;
       if(percentUtil > .9){
         greaterthan90++;
       }else if(percentUtil >= .5){
         greaterthan50++;
       }else if(percentUtil > 0){
         lessthan50++;
       }else{
         unutilized++;
       }
     });

     const linkLegend = legend.append('g')
       .attr('transform', 'translate(' + 150 + ', 60)');

     linkTypes.forEach((linkType, i) =>{
       const legendRow = linkLegend.append('g')
         .attr('transform', 'translate(0, ' + (i * 30) + ')');
         legendRow.append('rect')
           .attr('width', 30)
           .attr('height', 2)
           .attr('opacity',0.5)
           .attr('fill', () => {
             console.log(linkType);
            if(linkType === "no utilization"){
              return "gray";
            }else if(linkType === "<50% utilization"){
              return "green";
            }else if(linkType === "50 - 90% utilization"){
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
         .text(function(){
           if(linkType === "no utilization"){
             return unutilized + (`${pluralizeArticle(unutilized)}`) + linkType;
           }else if(linkType === "<50% utilization"){
             return lessthan50 +  (`${pluralizeArticle(lessthan50)}`) + linkType;
           }else if(linkType === "50 - 90% utilization"){
             return greaterthan50 + (`${pluralizeArticle(greaterthan50)}`) + linkType;
           }else{
             return greaterthan90 + (`${pluralizeArticle(greaterthan90)}`)  + linkType;
           }
         });

         function pluralizeArticle(n){
           return n > 1? ' Links have ' : ' Link has ';
         }
     })


     /*END OF ADDING THE GRAPH LEGENDS*/
  }




}
