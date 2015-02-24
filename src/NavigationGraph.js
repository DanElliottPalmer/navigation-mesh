class NavigationGraph {

	calculatePath( startPoint, endPoint ){

		/**
		 * Deeply influenced by:
		 * http://www.redblobgames.com/pathfinding/a-star/implementation.html
		 */
		
		let path;
		let nodeQueue = new PriorityQueue(function( a, b ){
			// Lowest priority == shortest distance
			return this.heap[ a ].priority > this.heap[ b ].priority;
		});
		// Add on the starting node
		nodeQueue.push( startPoint, 0 );

		let endPoints = this.mesh.triangles.filter( triangle => {
			return triangle.containsPoint( endPoint );
		})[0].points;

		let came_from = {};
		let cost_so_far = {};
		let current = null;
		let neighbours;
		let new_cost;
		let priority;

		let link_cost = 0;
		let isPoint = false;
		let endPointIndex = -1;

		came_from[ startPoint ] = null;
		cost_so_far[ startPoint ] = 0;

		while( nodeQueue.length !== 0 ){
			current = nodeQueue.pop();
			if( ( endPointIndex = endPoints.indexOf( current ) ) !== -1 ) break;

			isPoint = !( current instanceof NavigationNode );

			if( isPoint ){
				neighbours = this.mesh.triangles.filter( triangle => {
					return triangle.containsPoint( current );
				})[0].points;
			} else {
				neighbours = this.getNeighbours( current );	
			}
			
			neighbours.forEach( next => {

				if( isPoint ){
					link_cost = NavigationUtils.getDistance( current, next );
				} else {
					link_cost = this.links[ this.hasLink( current, next ) ].cost;
				}

				new_cost = cost_so_far[ current ] + link_cost;

				if( !cost_so_far.hasOwnProperty( next ) || new_cost < cost_so_far[ next ] ){

					cost_so_far[ next ] = new_cost;
					priority = new_cost + NavigationUtils.heuristic( endPoint, next );
					nodeQueue.push( next, priority );
					came_from[ next ] = current;

				}

			} );

		}

		// Add on the startPoint and endPoint
		// TODO: Maybe turn these points into nodes or turn all the nodes into points
		let path = get_path( came_from, startPoint, endPoints[ endPointIndex ] );
		// path.unshift( startPoint );
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
		let id = node.id;
		return node.links.map( link => {
			if( link.node1.id === id ){
				// Give b
				return link.node2;
			}
			// Give a
			return link.node1;
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

function generateLinkKeyFromNode( a, b ){
	return a.id + "," + b.id;
}