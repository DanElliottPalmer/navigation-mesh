import Link from "./Link";
import Node from "./Node";
import PriorityQueue from "./PriorityQueue";

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

	removeNode( node, withLinks = true ){

		if( withLinks ){
			let links = this.getLinksContainingNode( node );
			links.forEach( link => this.removeLink( link ) );
			links.length = 0;
		}

		this.nodes.delete( node.toString() );
	}

	route( startNode, endNode ){

		if( !startNode ) return false;
		if( !endNode ) return false;

		// Pathfinding
		// Priority queue to determine which nodes to check
		let openQueue = new PriorityQueue( function( a, b ){
			return this.heap[ a ].priority > this.heap[ b ].priority;
		} );
		// Priority counter
		let priority = 0;
		// Keeps track of points we've visited
		let closedList = new Map();
		// Keeps track of the cost of the points we've visited
		let costHistory = new Map();
		// The current node
		let currentNode = null;
		// The next node
		let nextNode = null;
		// The totaled new cost
		let newCost = 0;
		// Heuristic function
		let heuristic = ( a, b ) => Math.abs( a.x - b.x ) + Math.abs( a.y - b.y );


		// Add the start point to the queue
		openQueue.push( startNode, 0 );

		// Reset the closedList and costHistory
		closedList.set( startNode.toString(), null );
		costHistory.set( startNode.toString(), 0 );

		// Keep looping till we have emptied our queue
		while( openQueue.length > 0 ){
			currentNode = openQueue.pop();

			// If the currentNode is the endNode, stahp
			if( currentNode === endNode ) break;

			let currentLinks = this.getLinksContainingNode( currentNode );
			currentLinks.forEach( neighbour => {

				newCost = costHistory.get( currentNode.toString() ) + neighbour.length;
				nextNode = neighbour.getOtherNode( currentNode );

				/**
				 * Check if we haven't already visited the point and add it. If we
				 * have visited and the new cost is less, update the darn thing
				 */
				if( !costHistory.has( nextNode.toString() ) || newCost < costHistory.get( nextNode.toString() ) ){
					costHistory.set( nextNode.toString(), newCost );
					priority = newCost + heuristic( endNode.position, nextNode.position );
					openQueue.push( nextNode, priority );
					closedList.set( nextNode.toString(), currentNode );
				}

			});

		}

		return walkClosedList( closedList, startNode, endNode );

		function walkClosedList( closedList, startNode, endNode ){
			let currentNode = endNode;
			let path = [ currentNode.position.clone() ];
			while( currentNode !== startNode ){
				currentNode = closedList.get( currentNode.toString() );
				path.unshift( currentNode.position.clone() );
			}
			return path;
		}

	}

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