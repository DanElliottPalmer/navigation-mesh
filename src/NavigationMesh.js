class NavigationMesh {

	constructor(){
		this.edges = null;
		this.nodes = null;
		this.points = null;
		this.triangles = null;
	}

	findGraphPath( start, end ){

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
		path[0] = new NavigationPoint( start[0], start[1] );
		path[ path.length - 1 ] = new NavigationPoint( end[0], end[1] );

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

	path( start, end ){
		let path = this.findGraphPath( start, end );
		path = this.simplify( path );
		path = path.map( point => {
			if( point instanceof NavigationPoint ) return [ point.x, point.y ];
			return [ point.point.x, point.point.y ];
		});
		return path;
	}

	simplify( path ){

		if( path.length === 2 ) return path;

		// Copy the path as we're going to be manipulating it
		let pathCopy = path.slice( 0 );
		// We store simplified path
		let simplePath = []
		// The current point we are starting from
		let currentPoint = null;
		// The next point we are going to
		let nextPoint = null;
		// The last point that succeeded to be reached
		let lastPoint = null;
		// All the walls of the mesh
		let allEdges = [...this.edges].map( value => { return value[1]; });

		/**
		 * Add the first point to the path
		 */
		currentPoint = pathCopy.shift();
		simplePath.push( currentPoint );

		let i = -1;
		let pathLength = pathCopy.length;
		while( ++i < pathLength ){

			// Store the next point
			nextPoint = pathCopy[ i ];
			console.group( "New point", i, currentPoint.toString() + "->" + nextPoint.toString() );

			/**
			 * First check
			 * If the lastPoint is null, we can update it and skip all the caffuffle
			 */
			if( lastPoint === null ){
				console.log( "Skipping point as lastPoint is null" );
				lastPoint = nextPoint;
				console.groupEnd();
				continue;
			}

			/**
			 * Secondly, can we just draw a straight line and solve all problems?
			 */
			console.groupCollapsed( "Intersection test" );
			// Test all the edges left but skip ones that are connected to the
			// current point or next point
			let totalInsideIntersection = 0;
			let totalOutsideIntersection = 0;
			let lineStart = currentPoint.point || currentPoint;
			let lineEnd = nextPoint.point || nextPoint;
			allEdges.forEach( edge => {
				if( edge.from === currentPoint || edge.from === nextPoint ) return;
				if( edge.to === currentPoint || edge.to === nextPoint ) return;
				console.log("Testing edge", edge.toString());
				if( NavigationUtils.lineIntersection( lineStart, lineEnd, edge.from.point, edge.to.point ) ){
					if( edge.boundary ){
						totalOutsideIntersection++;
					} else {
						totalInsideIntersection++;
					}
				}
			});
			console.groupEnd();
			console.log( "Intersection summary:", "In", totalInsideIntersection, "Out", totalOutsideIntersection );
			if( totalInsideIntersection > 0 && totalOutsideIntersection === 0 ) {
				console.log("Direct line so updated path");
				lastPoint = nextPoint;
				console.groupEnd();
				continue;
			}

			/**
			 * Another check to make journeys shorter
			 * Get triangles that both the last point and next point share and check
			 * to see if the spare points are closed than the last
			 */
			console.log("Closer spare nodes test");
			let spareTriangles = new Set();
			let sparePoints = [];
			let currentDistance = NavigationUtils.distance( currentPoint.point || currentPoint, lastPoint.point );
			currentDistance += NavigationUtils.distance( lastPoint.point, nextPoint.point || nextPoint );
			let spareDistance = 0;
			lastPoint.triangles.forEach( triangle => { spareTriangles.add( triangle ) });
			if( nextPoint !== pathCopy[ pathCopy.length - 1 ] ){
				nextPoint.triangles.forEach( triangle => { spareTriangles.add( triangle ) });
			}
			spareTriangles.forEach( triangle => {
				sparePoints.push( triangle.points.filter( point => {
					return point !== lastPoint.point && (point !== (nextPoint.point || nextPoint));
				})[0] );
			});
			sparePoints.forEach( point => {
				spareDistance = NavigationUtils.distance( currentPoint.point || currentPoint, point );
				spareDistance += NavigationUtils.distance( point, nextPoint.point || nextPoint );
				if( spareDistance < currentDistance ){
					console.groupCollapsed("Shorter distance so intersection check");
					totalInsideIntersection = 0;
					totalOutsideIntersection = 0;
					lineStart = currentPoint.point || currentPoint;
					lineEnd = point;
					allEdges.forEach( edge => {
						if( edge.from.point === lineStart || edge.from.point === lineEnd ) return;
						if( edge.to.point === lineStart || edge.to.point === lineEnd ) return;
						console.log("Testing edge", edge.toString());
						if( NavigationUtils.lineIntersection( lineStart, lineEnd, edge.from.point, edge.to.point ) ){
							if( edge.boundary ){
								totalOutsideIntersection++;
							} else {
								totalInsideIntersection++;
							}
						}
					});
					console.groupEnd();
					console.log( "Intersection summary:", "In", totalInsideIntersection, "Out", totalOutsideIntersection );
					if( totalInsideIntersection > 0 && totalOutsideIntersection === 0 ) {
						currentDistance = spareDistance;
						lastPoint = this.nodes.get( point.toString() );
					}
				}
			});

			/**
			 * Failed at everything so update the line
			 */
			simplePath.push( lastPoint );
			currentPoint = lastPoint;
			lastPoint = nextPoint;

			console.groupEnd();

		}

		simplePath.push( lastPoint );

		return simplePath;

	}

}