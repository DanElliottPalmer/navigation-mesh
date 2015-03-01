class NavigationMesh {

	constructor(){
		this.edges = null;
		this.nodes = null;
		this.points = null;
		this.triangles = null;
	}

	findPath( start, end ){

		console.log( "Finding path", start, end );

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

	parse( structure ){

		/**
		 * TODO: Look into using Float32Array for speeeeeeed
		 */

		console.log( "Parsing structure", structure );

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