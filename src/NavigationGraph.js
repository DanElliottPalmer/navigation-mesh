class NavigationGraph {

	calculatePath( startPoint, endPoint ){

		/**
		 * Deeply influenced by:
		 * http://www.redblobgames.com/pathfinding/a-star/implementation.html
		 */
		
		// Will store the final path
		let path;
		// Priority queue used to determine which nodes to check
		let openQueue = new PriorityQueue(function( a, b ){
			// Lowest priority == shortest distance
			return this.heap[ a ].priority > this.heap[ b ].priority;
		});
		// Store the priority of the current neighbour. Calculated from the new cost
		// and the heurestic value
		let priority;
		// Array of points with one of them that will be a final node
		let endPoints = this.mesh.triangles.filter( triangle => {
			return triangle.containsPoint( endPoint );
		})[0].points;
		// Keeps track of points we've visiting
		let closedList = {};
		// Keeps track of the cost of the points we've visited
		let costHistory = {};
		// The current point
		let current = null;
		// The neighbours of the current point
		let neighbours;
		// The totaled new cost
		let newCost;
		// The cost of the current link
		let linkCost = 0;
		// Stores if the current point is a startPoint or endPoint
		let isPoint = false;
		// Index for keeping track of what the last point was
		let endPointIndex = -1;

		// Add on the starting node
		openQueue.push( startPoint, 0 );

		// Reset the closedList for the startpoint
		closedList[ startPoint ] = null;
		// And store is cost value
		costHistory[ startPoint ] = 0;

		// Keep looping till we've emptied our queue
		while( openQueue.length !== 0 ){

			current = openQueue.pop();

			// If the current point is one of the points in the final triangle, we
			// can early quit and keep track of the index
			if( ( endPointIndex = endPoints.indexOf( current ) ) !== -1 ) break;

			isPoint = !( current instanceof NavigationNode );

			// If the current point is not a NavigationNode, we have to work out 
			// which triangle the point sits in and use the points of the triangle
			// as the neighbours
			if( isPoint ){
				neighbours = this.mesh.triangles.filter( triangle => {
					return triangle.containsPoint( current );
				})[0].points;

			// Or else just use the typical getNeighbours method
			} else {
				neighbours = this.getNeighbours( current );	
			}
			
			neighbours.forEach( next => {

				// If the point is not a NavigationNode, we have to use calculated
				// distance as there is not a link.
				if( isPoint ){
					linkCost = NavigationUtils.distance( current, next );
				} else {
					linkCost = this.links[ this.hasLink( current, next ) ].cost;
				}

				newCost = costHistory[ current ] + linkCost;

				// Check if we haven't visited this point or if we have, that the new
				// cost is less that previously
				if( !costHistory.hasOwnProperty( next ) || newCost < costHistory[ next ] ){

					costHistory[ next ] = newCost;
					priority = newCost + NavigationUtils.heuristic( endPoint, next );
					openQueue.push( next, priority );
					closedList[ next ] = current;

				}

			} );

		}

		// Add on the startPoint and endPoint
		path = walkPath( closedList, startPoint, endPoints[ endPointIndex ] );
		path.push( endPoint );

		return path;

		function walkPath( closedList, startNode, endNode ){
			var current = endNode;
			var path = [ current ];
			while( current !== startNode ){
				current = closedList[ current ];
				path.unshift( current );
			}
			return path;
		}

	}

	constructor( mesh, nodes, links ){
		this.links = links || {};
		this.mesh = mesh;
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

	getNeighbours( node ){
		if( !node.links ) return;
		return node.links.map( link => {
			if( link.from === node ){
				// Give b
				return link.to;
			}
			// Give a
			return link.from;
		} );
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

function generateLinkKeyFromNode( a, b ){
	return a.id + "," + b.id;
}