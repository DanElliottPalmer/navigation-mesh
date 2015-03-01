class NavigationMesh {

	constructor(){
		this.edges = null;
		this.nodes = null;
		this.points = null;
		this.triangles = null;
	}

	findPath( start, end ){

		// Start node that we will add into the graph network
		let startNode = null;
		// End node that we will add into the graph network
		let endNode = null;
		// Will store the path
		let path;
		// Priority queue to determine which nodes to check
		let openQueue = new PriorityQueue(function( a, b ){
			// Lowest priority == shortest distance
			return this.heap[ a ].priority > this.heap[ b ].priority;
		});
		// Stores the priority of the current neighbour. Calculated from the new
		// cost and the heuristic value
		let priority;
		let startTrianglePoints = this.triangles.filter( triangle => {
			return triangle.containsPoint( start[0], start[1] );
		})[0].points;
		// Array of points from the triangle that contains the end point
		let endTrianglePoints = this.triangles.filter( triangle => {
			return triangle.containsPoint( end[0], end[1] );
		})[0].points;
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


		/**
		 * Add the start point and edges into the graph
		 */
		startNode = new NavigationNode();
		startNode.point = new NavigationPoint( start[0], start[1] );
		this.nodes.set( startNode.toString(), startNode );
		let startEdges = startTrianglePoints.map( point => {
			let edge = new NavigationEdge( startNode, this.nodes.get( point.toString() ) );
			this.edges.set( edge.toString(), edge );
			edge.from.edges.add( edge );
			edge.to.edges.add( edge );
			return edge;
		});		

		/**
		 * Do the same for the end point
		 */
		endNode = new NavigationNode();
		endNode.point = new NavigationPoint( end[0], end[1] );
		this.nodes.set( endNode.toString(), endNode );
		let endEdges = endTrianglePoints.map( point => {
			let edge = new NavigationEdge( endNode, this.nodes.get( point.toString() ) );
			this.edges.set( edge.toString(), edge );
			edge.from.edges.add( edge );
			edge.to.edges.add( edge );
			return edge;
		});

		/**
		 * Clear startTrianglePoint and endTrianglePoints
		 */
		startTrianglePoints = null;
		endTrianglePoints = null;

		// Add the start point to the queue
		openQueue.push( startNode, 0 );

		// Reset the closedList and costHistory
		closedList.set( startNode.toString(), null );
		costHistory.set( startNode.toString(), 0 );

		// Keep looping till we have emptied our queue
		while( openQueue.length !== 0 ){
			currentNode = openQueue.pop();

			/**
			 * If the current node is one of the points in the final triangle, we
			 * can quit early as long as we keep track of the index
			 */
			if( currentNode === endNode ) break;

			/**
			 * Here we are either looping over NavigationEdges or an array of points
			 * from the start triangle
			 */
			currentNode.edges.forEach( neighbour => {

				newCost = costHistory.get( currentNode.toString() ) + neighbour.cost;
				nextNode = otherNodeFromEdge( currentNode, neighbour );

				/**
				 * Check if we haven't already visited the point and add it. If we
				 * have visited and the new cost is less, update the darn thing
				 */
				if( !costHistory.has( nextNode.toString() ) || newCost < costHistory.get( nextNode.toString() ) ){
					costHistory.set( nextNode.toString(), newCost );
					priority = newCost + NavigationUtils.heuristic( endNode.point, nextNode.point );
					openQueue.push( nextNode, priority );
					closedList.set( nextNode.toString(), currentNode );
				}

			});
			
		}

		path = walkClosedList( closedList, startNode, endNode );
		
		/**
		 * Convert all the points to arrays
		 */
		path = path.map( point => {
			return [ point.point.x, point.point.y ];
		});

		/**
		 * Cleanup bits
		 * 1. Remove the startNode and it's edges
		 * 2. Remove the endNode and it's edges
		 */
		startNode.edges.forEach( edge => {
			let otherNode = otherNodeFromEdge( startNode, edge );
			otherNode.edges.delete( edge );
			startNode.edges.delete( edge );
			this.edges.delete( edge.toString() );
			edge.destroy();
		});
		this.nodes.delete( startNode.toString() );
		startNode.destroy();
		startNode = null;

		endNode.edges.forEach( edge => {
			let otherNode = otherNodeFromEdge( endNode, edge );
			otherNode.edges.delete( edge );
			endNode.edges.delete( edge );
			this.edges.delete( edge.toString() );
			edge.destroy();
		});
		this.nodes.delete( endNode.toString() );
		endNode.destroy();
		endNode = null;

		/**
		 * Serve up the path
		 */
		return path;



		function otherNodeFromEdge( node, edge ){
			if( edge.from === node ) return edge.to;
			return edge.from;
		}

		function walkClosedList( closedList, startNode, endNode ){
			let currentNode = endNode;
			let path = [ currentNode ];
			while( currentNode !== startNode ){
				currentNode = closedList.get( currentNode.toString() );
				path.unshift( currentNode );
			}
			return path;
		}

	}

	getEdgeContaining( node1, node2 ){
		if( this.edges === null ) return false;
		let key = "";
		if( this.edges.has( ( key = node1 + "," + node2 ) ) ){
			return this.edges.get( key );
		}
		if( this.edges.has( ( key = node2 + "," + node1 ) ) ){
			return this.edges.get( key );
		}
		return false;
	}

	getNeighbours( node ){
		if( node.edges.size === 0) return [];
		return Array.from( node.edges ).map( edge => {
			if( edge.from === node ) return edge.to;
			return edge.from;
		});
	}

	parse( structure ){

		/**
		 * TODO: Look into using Float32Array for speeeeeeed
		 */

		/**
		 * Create a copy of points we are going to use
		 */
		this.points = structure.points.map( point => {
			return new NavigationPoint( point[0], point[1] );
		});

		/**
		 * Create a copy of the triangles with all the correct points
		 */
		this.triangles = structure.triangles.map( triangle => {
			return new NavigationTriangle( triangle.map( pointIndex => {
				return this.points[ pointIndex ];
			}) );
		});

		/**
		 * Create the graph network
		 * Nodes & edges
		 */
		let currentNode = null;
		let otherNode = null;
		let currentEdge = null;
		let currentBoundaries = null;
		this.edges = new Map();
		this.nodes = new Map();
		this.triangles.forEach( ( triangle, triangleIndex ) => {

			/**
			 * Create a copy of the current boundaries so we can remove them as we go
			 */
			currentBoundaries = structure.boundaries[ triangleIndex ].slice( 0 );

			triangle.points.forEach( ( trianglePoint, trianglePointIndex ) => {

				/**
				 * Check to see if the node exists. If it doesn't, we need to create it
				 */
				if( !this.nodes.has( trianglePoint.toString() ) ){
					currentNode = new NavigationNode();
					currentNode.point = trianglePoint;
					this.nodes.set( trianglePoint.toString(), currentNode );
				} else {
					currentNode = this.nodes.get( trianglePoint.toString() );
				}
				currentNode.triangles.add( triangle );

				/**
				 * Create the edges between the nodes
				 */
				switch( trianglePointIndex ){

					/**
					 * If it is the first point in the triangle, it won't have anyone
					 * to connect to as we haven't created the other points in this
					 * triangle
					 */
					case 0:
						return;

					case 2:
						otherNode = this.nodes.get( triangle.points[0].toString() );
						if( !this.getEdgeContaining( currentNode, otherNode ) ){
							currentEdge = new NavigationEdge( currentNode, otherNode );
							/**
							 * Also do a boundary check here to save us doing an extra loop
							 */
							if( isBoundary( currentBoundaries, this.points, currentNode.point, otherNode.point ) ){
								currentEdge.boundary = true;
							}
							this.edges.set( currentEdge.toString(), currentEdge );
							currentNode.edges.add( currentEdge );
							otherNode.edges.add( currentEdge );
						}

					case 1:
						otherNode = this.nodes.get( triangle.points[ trianglePointIndex - 1 ].toString() );
						if( !this.getEdgeContaining( currentNode, otherNode ) ){
							currentEdge = new NavigationEdge( currentNode, otherNode );
							/**
							 * Also do a boundary check here to save us doing an extra loop
							 */
							if( isBoundary( currentBoundaries, this.points, currentNode.point, otherNode.point ) ){
								currentEdge.boundary = true;
							}
							this.edges.set( currentEdge.toString(), currentEdge );
							currentNode.edges.add( currentEdge );
							otherNode.edges.add( currentEdge );
						}
						break;

				}

			});

		});

		function isBoundary( boundaries, points, point1, point2 ){
			if( boundaries.length === 0 ) return false;
			let boundariesLength = boundaries.length;
			let boundaryPoint1 = null;
			let boundaryPoint2 = null;
			while( boundariesLength-- ){
				boundaryPoint1 = points[ boundaries[ boundariesLength ][0] ];
				boundaryPoint2 = points[ boundaries[ boundariesLength ][1] ];
				if( ( boundaryPoint1 === point1 && boundaryPoint2 === point2 ) ||
						( boundaryPoint1 === point2 && boundaryPoint2 === point1 ) ){
					boundaries.splice( boundariesLength, 1 );
					return true;
				}
			}
			return false;
		}

	}

}