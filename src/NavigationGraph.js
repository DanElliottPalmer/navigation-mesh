class NavigationGraph {

	calculatePath( startPoint, endPoint ){

		// Check if startPoint and endPoint are in the graph
		let startNode = this.getClosestNode( startPoint.x, startPoint.y );
		if( startNode === undefined ) return false;
		let endNode = this.getClosestNode( endPoint.x, endPoint.y );
		if( endNode === undefined ) return false;

		// Check if startPoint and endPoint are in same polygon
		if( startNode.id === endNode.id ){
			return [ startPoint, startNode, endPoint ];
		}



		/**
		 * Deeply influenced by:
		 * http://www.redblobgames.com/pathfinding/a-star/implementation.html
		 */
		
		// TODO: Look at maybe restructuring nodes -> links [Enhancement]
		let path;
		let nodeQueue = new PriorityQueue(function( a, b ){
			// Lowest priority == shortest distance
			return this.heap[ a ].priority > this.heap[ b ].priority;
		});
		// Add on the starting node
		nodeQueue.push( startNode, 0 );

		let came_from = {};
		let cost_so_far = {};
		let current = null;
		let neighbours;
		let new_cost;
		let link;
		let priority;

		came_from[ startNode ] = null;
		cost_so_far[ startNode ] = 0;

		while( nodeQueue.length !== 0 ){
			current = nodeQueue.pop();
			if( current === endNode ) break;

			neighbours = this.getNeighbours( current );
			neighbours.forEach( next => {

				link = this.links[ this.hasLink( current, next ) ];
				new_cost = cost_so_far[ current ] + link.cost;

				if( !cost_so_far.hasOwnProperty( next ) || new_cost < cost_so_far[ next ] ){

					cost_so_far[ next ] = new_cost;
					priority = new_cost + heuristic( endNode, next );
					nodeQueue.push( next, priority );
					came_from[ next ] = current;

				}

			} );

		}

		// Add on the startPoint and endPoint
		// TODO: Maybe turn these points into nodes or turn all the nodes into points
		let path = get_path( came_from, startNode, endNode );
		path.unshift( startPoint );
		path.push( endPoint );

		return path;

		function get_path( came_from, startNode, endNode ){
			var current = endNode;
			var path = [ current ];
			while( current !== startNode ){
				current = came_from[ current ];
				path.unshift( current );
			}
			return path;
		}

		function heuristic( a, b ){
			return Math.abs( a.x - b.x ) + Math.abs( a.y - b.y );
		}

	}

	constructor( nodes, links ){
		this.links = links || {};
		this.nodes = nodes || [];
	}

	getClosestNode( x, y ){
		let closestNode;
		let closestDistance = Number.MAX_VALUE;
		let currentDistance;
		this.nodes.forEach( node => {
			currentDistance = Math.sqrt( Math.pow( x - node.x, 2 ) + 
																	Math.pow( y - node.y, 2 ) );
			if( currentDistance < closestDistance ){
				closestDistance = currentDistance;
				closestNode = node;
			}
		});
		return closestNode;
	}

	getLinksByNode( node ){
		let keys = Object.keys( this.links );
		if( keys.length === 0 ) return;
		let re = new RegExp( "((^" + node.id + ",)|(," + node.id + "$))" );
		keys = keys.filter( key => {
			return re.test( key );
		} );
		if( keys.length === 0 ) return null;
		return keys.map( key => {
			return this.links[ key ];
		} );
	}

	getNeighbours( node ){
		let links = this.getLinksByNode( node );
		if( !links ) return;
		let id = node.id;
		return links.map( link => {
			if( link.a === id ){
				// Give b
				return this.getNodeById( link.b );
			}
			// Give a
			return this.getNodeById( link.a );
		} );
	}

	getNodeById( id ){
		let length = this.nodes.length;
		while( length-- ){
			if( this.nodes[ length ].id === id ){
				return this.nodes[ length ];
			}
		}
		return;
	}

	hasLink( a, b ){
		let key = "";
		// Check if a -> b
		key = generateLinkKeyFromNode( a, b );
		if( this.links.hasOwnProperty( key ) ) return key;
		// Check if b -> a
		key = generateLinkKeyFromNode( b, a );
		return this.links.hasOwnProperty( key ) && key;
	}

}

function generateLinkKeyFromId( a, b ){
	return a + "," + b;
}

function generateLinkKeyFromNode( a, b ){
	return a.id + "," + b.id;
}