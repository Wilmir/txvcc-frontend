import { Injectable } from '@angular/core';
import { Node } from 'src/app/common'
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class D3tooltipService {

  constructor() { }

  addTooltip(node:d3.Selection<SVGCircleElement, Node, SVGGElement, unknown>){
    const tooltip = d3.select('.network-graph')
    .append('div')
    .attr('class','tooltip');

    node
      .on('mouseover', showToolTip)
      .on('mouseout', hideToolTip);

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
          .style("left", 30 + +d3.select(this).attr("cx") +  "px")     
          .style("top", +d3.select(this).attr("cy") + "px")
          .style('width','150px')
          .style('visibility', 'visible')
          .style('background','black')
          .style('color','white')
          .style('border-radius','4px')
          .style('padding','6px')
          .style('opacity', 0.8)
          .style('font-size','10px')
          .html(html);
      }

      function hideToolTip(d) {
        tooltip
          .style('visibility','hidden')
          .style('opacity', 0);
      }

  }

}
