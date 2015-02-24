class NavigationMesh {

	calculatePath( startPoint, endPoint ){

		if( this.graph === null ) return false;

		let graph = this.graph;
		let pathPoints = this.graph.calculatePath( startPoint, endPoint );

		// Simplify
		if( pathPoints.length === 2 ) return pathPoints;

		let simplePath = [];

		// The current point in the path we checking - a
		let currentPoint;
		// The last point that tested successful
		let lastPoint = null;
		// The next point we're testing
		let nextPoint;
		// Store the links as we will use them a lot
		let links = this.graph.links;
		// Store all the keys of the links as we will probably loop over them a lot
		let linkKeys = Object.keys( links );


		// Set the currentPoint and store it
		currentPoint = pathPoints.shift();
		simplePath.push( currentPoint );

		// Loop over all the points
		let i = -1;
		let len = pathPoints.length;
		while( ++i < len ){

			let nextPoint = pathPoints[ i ];
			console.group( "New point", i, currentPoint.toString(), "->", nextPoint.toString() );

			// If we're on the second point, it can reach so we can skip everything
			if( lastPoint === null ){
				console.log("Skipping point as second point");
				lastPoint = pathPoints[ i ];
				console.groupEnd();
				continue;
			}

			// Check if the nextPoint and currentPoint share the same triangle
			console.log("Performing a triangle check");
			let triangles;
			let testPoint = new NavigationPoint();
			if( nextPoint instanceof NavigationPoint ){
				if( currentPoint instanceof NavigationPoint ){
					triangles = this.triangles.filter( triangle => {
						return triangle.containsPoint( new NavigationPoint( currentPoint.x, currentPoint.y ) );
					});
				} else {
					triangles = this.getTrianglesByPoint( currentPoint.x, currentPoint.y );
				}
				testPoint.x = nextPoint.x;
				testPoint.y = nextPoint.y;
			} else {
				triangles = this.getTrianglesByPoint( nextPoint.x, nextPoint.y );
				testPoint.x = currentPoint.x;
				testPoint.y = currentPoint.y;
			}
			let containsPoint = triangles.some( triangle => {
				return triangle.containsPoint( testPoint );
			} );
			if( containsPoint ){
				console.log("Share a triangle");
				lastPoint = nextPoint;
				console.groupEnd();
				continue;
			}

			// Check if final point is a point as we can do triangle check
			if( nextPoint instanceof NavigationPoint ){
				console.log("Performing a second triangle check");
				triangles = this.getTrianglesByPoint( currentPoint.x, currentPoint.y );
				containsPoint = triangles.some( triangle => {
					return triangle.containsPoint( new NavigationPoint( nextPoint.x, nextPoint.y ) );
				} );
				if( containsPoint ){
					console.log("Share a triangle");
					lastPoint = nextPoint;
					console.groupEnd();
					continue;
				}
			}

			console.log("Performing intersection check");
			let j = -1;
			let jLen = linkKeys.length;
			let link;
			let nodeA;
			let nodeB;

			let nodeLinks = ( nextPoint.links && nextPoint.links.slice(0) || [] );
			if( !(currentPoint instanceof NavigationPoint) ){
				nodeLinks = nodeLinks.concat( ( currentPoint.links || [] ) );
			}

			let nodeLinkIndex = -1;
			let intersectionInsideCount = 0;
			let intersectionOutsideCount = 0;
			while( ++j < jLen ){

				link = links[ linkKeys[ j ] ];
				nodeA = this.graph.getNodeById( link.a );
				nodeB = this.graph.getNodeById( link.b );

				if( ( nodeLinkIndex = nodeLinks.indexOf( link ) ) !== -1 ){
					console.log("Skipping link as attached to node", nodeA.toString(), nodeB.toString());
					nodeLinks.splice( nodeLinkIndex, 1 );
					continue;
				}			
				
				
				if( NavigationTriangle.intersection( currentPoint, nextPoint, nodeA, nodeB ) ){

					console.log( "Line intersection", nodeA.toString(), nodeB.toString() );

					if( link.boundary ){
						intersectionOutsideCount++;
					} else {
						intersectionInsideCount++;
					}
					
				}

			}

			console.log( "Inside: "+intersectionInsideCount+" Outside: "+intersectionOutsideCount );
			if( (intersectionInsideCount === 0 && intersectionOutsideCount === 0) ||
					( intersectionOutsideCount > 0 ) ){
				simplePath.push( lastPoint );
				currentPoint = lastPoint;
			}

			lastPoint = nextPoint;

			console.groupEnd();

		}

		if( lastPoint !== null ){
			simplePath.push( lastPoint );
		}

		return simplePath;

	}

	constructor(){
		super();

		this._graph = null;
		this._triangles = [];
	}

	getTrianglesByPoint( x, y ){
		return this.triangles.filter( triangle => {
			return triangle.points.some( point => {
				return point.x === x && point.y === y;
			} );
		} );
	}

	get graph(){
		return this._graph;
	}

	parse( dataStructure ){
		console.log( dataStructure );

		// Parse points
		let points = dataStructure.points.map( point => {
			return new NavigationPoint( point[0], point[1] );
		} );

		// Parse polygons
		let poly = null;
		this._triangles = dataStructure.triangles.map( triangle => {
			poly = new NavigationTriangle( triangle.map( index => {
				return points[ index ];
			} ) );
			/* DEBUG STUFF */
			poly.fill = "none";
			poly.strokeWidth = 1;
			poly.stroke = "#f00";
			/*     EOD     */
			return poly;
		} );

		let nodes = [];
		let links = {};

		let node;
		let othernode;
		let link
		let cost;
		let boundaries;

		let previousNodes = {};

		this._triangles.forEach( ( triangle, triIndex ) => {
			triangle.points.forEach( ( point, pointIndex ) => {

				// If node doesnt exist, create it
				if( !previousNodes.hasOwnProperty( point ) ){
					previousNodes[ point ] = new NavigationNode( point.x, point.y );
					nodes.push( previousNodes[ point ] );
				}
				node = previousNodes[ point ];
				node.triangles.push( triangle );
				triangle.points[ pointIndex ] = node;

				// Links
				switch( pointIndex ){
					// If we are the first point, there wont be anything to link to
					case 0:
						return;

					// If last point, we will let this fall through to do what the point
					// before would do too
					case 2:
						othernode = previousNodes[ triangle.points[0] ];
						if( !hasLink( node, othernode ) ){
							link = new NavigationEdge( node, othernode, NavigationUtils.getDistance( node, othernode ) );
							links[ generateLinkKeyFromNode( node, othernode ) ] = link;
						}

					case 1:
						othernode = previousNodes[ triangle.points[ pointIndex - 1 ] ];
						if( !hasLink( node, othernode ) ){
							link = new NavigationEdge( node, othernode, NavigationUtils.getDistance( node, othernode ) );
							links[ generateLinkKeyFromNode( node, othernode ) ] = link;
						}
						break;

				}

			} );

			// Boundaries
			boundaries = dataStructure.boundaries[ triIndex ];
			let len = Object.keys( links ).length;
			let i;
			let pointA;
			let pointB;
			let linkKey;
			boundaries.forEach( boundary => {
				i = len - 4;	// Go back 3 + 1 which increments at the start of loop
				while( ++i < len ){
					pointA = previousNodes[ points[ boundary[0] ] ];
					pointB = previousNodes[ points[ boundary[1] ] ];
					if( ( linkKey = hasLink( pointA, pointB ) ) !== false ){
						links[ linkKey ].boundary = true;
					}
				}
			});

		} );

		// Graph
		this._graph = new NavigationGraph( this, nodes, links );

		// Clean up
		previousNodes = null;
		node = null;

		function hasLink( a, b ){
			let key = generateLinkKeyFromNode( a, b );
			if( links.hasOwnProperty( key ) ) return key;
			key = generateLinkKeyFromNode( b, a );
			if( links.hasOwnProperty( key ) ) return key;
			return false;
		}

		function isLink( link, a, b ){
			return ( link.node1 === a && link.node2 === b ) ||
						 ( link.node1 === b && link.node2 === a );
		}

	}

	get triangles(){
		return this._triangles;	
	}

}

function generateLinkKeyFromNode( a, b ){
	return a.id + "," + b.id;
}