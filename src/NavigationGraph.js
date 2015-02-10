class NavigationGraph {

	addNode( node ){
		this.nodes.push( node );
	}

	addLink( a, b, cost ){
		if( this.hasLink( a, b ) ) return;
		let key = generateLinkKeyFromNode( a, b );
		return ( this.links[ key ] = new NavigationLink( a, b, cost ) );
	}

	calculatePath( startPoint, endPoint ){

		let path = [];

		// Check if startPoint and endPoint are in the graph
		let startNode = this.containsPoint( startPoint.x, startPoint.y );
		if( startNode === undefined ) return false;
		let endNode = this.containsPoint( endPoint.x, endPoint.y );
		if( endNode === undefined ) return false;

		// Add start and end point
		path.push( startPoint, endPoint );

		// Check if startPoint and endPoint are in same polygon
		if( startNode._NODEID === endNode._NODEID ){
			return path;
		}



		/**
		 * Deeply influenced by:
		 * http://www.redblobgames.com/pathfinding/a-star/implementation.html
		 */
		
		// TODO: Add path simplification [Enhancement]
		// TODO: Add triangle points to graph network [Fix]
		// TODO: Add edge centroids to graph network [Fix]
		// TODO: Remove triangle centroids [Update]
		// TODO: Look at maybe restructuring nodes -> links [Enhancement]

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
		this.links = {};
		this.nodes = nodes || [];

		if( Array.isArray( links ) ){
			let key = "";
			links.forEach( link => {
				key = generateLinkKeyFromId( link.a, link.b );
				if( this.links.hasOwnProperty( key ) ) return;
				key = generateLinkKeyFromId( link.b, link.a );
				if( this.links.hasOwnProperty( key ) ) return;
				this.links[ key ] = link;
			} );
		} else {
			this.links = links || {};
		}

	}

	containsPoint( x, y ){
		let len = this.nodes.length;
		let point = new Point( x, y );
		while( len-- ){
			if( this.nodes[ len ].triangle.containsPoint( point ) ){
				return this.nodes[ len ];
			}
		}
		return;
	}

	getLinksByNode( node ){
		let keys = Object.keys( this.links );
		if( keys.length === 0 ) return;
		let re = new RegExp( "((^" + node._NODEID + ",)|(," + node._NODEID + "$))" );
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
		let id = node._NODEID;
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
			if( this.nodes[ length ]._NODEID === id ){
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

	removeLink( a, b ){
		let key = "";
		if( ( key = this.hasLink( a, b ) ) === false ) return;
		let link = this.links[ key ];
		link.destroy();
		this.links[ key ] = null;
		delete this.links[ key ];
	}

	removeNode( node, includeLinks ){
		let index = this.nodes.indexOf( node );
		if( index === -1 ) return;
		this.nodes.splice( index, 1 );
		if( !includeLinks ) return;
		// TODO: Remove links associated with node [Need finishing]
	}

}

function generateLinkKeyFromId( a, b ){
	return a + "," + b;
}

function generateLinkKeyFromNode( a, b ){
	return a._NODEID + "," + b._NODEID;
}