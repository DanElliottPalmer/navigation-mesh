import Link from "./Link";
import Node from "./Node";

class Graph {

	addLink( link ){
		if( this.hasLink( link ) ) return;
		this.links.set( link.toString(), link );
	}

	addNode( node ){
		if( this.hasNode( node ) ) return;
		this.nodes.set( node.toString(), node );
	}

	constructor(){
		this.links = new Map();
		this.nodes = new Map();
	}

	getLinksContainingNode( node, extraNode = false ){
		let filter = function( link ){
			if( !extraNode ) return link[1].hasNode( node );
			return link[1].hasNode( node ) && link[1].hasNode( extraNode );
		};
		return Array.from( this.links )
						.filter( filter )
						.map( link => link[1] );
	}

	hasLink( link ){
		return this.links.has( link.toString() );
	}

	hasNode( node ){
		return this.nodes.has( node.toString() );
	}

	removeLink( link ){
		this.links.delete( link.toString() );
	}

	removeNode(){
		this.nodes.delete( node.toString() );
	}

	route( start, end ){}

	static createLink( node1, node2 ){
		return new Link( node1, node2 );
	}

	static createNode( position ){
		return new Node( position );
	}

}

Graph.Link = Link;
Graph.Node = Node;

export default Graph;