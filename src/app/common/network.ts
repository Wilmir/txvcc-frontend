import {Node} from './node';
import {Link} from './link'

export class Network {
    id: number;
    networkName: string;
    description: string;
    dateCreated: Date;
    lastUpdated: Date;
    nodes: Node[];
    links: Link[];
}
