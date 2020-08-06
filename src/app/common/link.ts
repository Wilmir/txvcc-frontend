import { Node } from './node'
import { Service } from './service'

import * as d3 from 'd3';

export class Link implements d3.SimulationLinkDatum<Node>{
    // optional - defining optional implementation properties - required for relevant typing assistance
    id: number;
    capacity: number;
    source: Node;
    target: Node;
    type:string;
    utilization:number;
    services:Service[]


    constructor() {

    }

}
