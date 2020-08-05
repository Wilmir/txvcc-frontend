import APP_CONFIG from '../app.config';
import * as d3 from 'd3';
import { Service } from './service'


export class Node implements d3.SimulationNodeDatum{
     // optional - defining optional implementation properties - required for relevant typing assistance
    index?: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;

    id:number; //string in d3graph file
    linkCount: number = 0; //for update in the future
    name: string;
    isHoming:boolean;
    type?: string;
    services:Service[];
    dateCreated?:Date;
    lastUpdated?:Date;

    constructor(id) {
        this.id = id;
    }

    normal = () => {
        return Math.sqrt(this.linkCount / APP_CONFIG.N);
    }

    get r() {
        return 20 * this.normal() + 1;    
    }

    get fontSize() {
        return (10 * this.normal() + 1) + 'px';
      }
    
      get color() {
        let index = Math.floor(APP_CONFIG.SPECTRUM.length * this.normal());
        return APP_CONFIG.SPECTRUM[index];
      }

}

