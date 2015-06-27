import { distance } from "./Maths";

class Link {

	constructor( node1, node2 ){
		this.nodes = [ node1, node2 ];
	}

	hasNode( node ){
		return this.nodes[0] === node || this.nodes[1] === node;
	}

	get length(){
		return distance( this.nodes[0].position, this.nodes[1].position );
	}

	toArray(){
		return [ this.nodes[0].toArray(), this.nodes[1].toArray() ];
	}

	toString(){
		return `(${this.nodes[0].toString()},${this.nodes[1].toString()})`;
	}

}

export default Link;