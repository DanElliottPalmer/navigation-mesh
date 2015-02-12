class NavigationMesh extends EventEmitter {

	constructor(){
		super();

		this._graph = null;
		this._triangles = [];
	}

	get graph(){
		return this._graph;
	}

	parse( dataStructure ){
		console.log( dataStructure );

		// Parse points
		let points = dataStructure.points.map( point => {
			return new Point( point[0], point[1] );
		} );

		// Parse polygons
		let poly = null;
		this._triangles = dataStructure.triangles.map( triangle => {
			poly = new Polygon( triangle.map( index => {
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
		let links = [];

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
					previousNodes[ point ] = new NavigationNode( point.x, point.y, triangle );
					nodes.push( previousNodes[ point ] );
				}
				node = previousNodes[ point ];

				// Links
				switch( pointIndex ){
					// If we are the first point, there wont be anything to link to
					case 0:
						return;

					// If last point, we will let this fall through to do what the point
					// before would do too
					case 2:
						othernode = previousNodes[ triangle.points[0] ];
						link = new NavigationLink( node, othernode, getDistance( node, othernode ) );
						links.push( link );

					case 1:
						othernode = previousNodes[ triangle.points[ pointIndex - 1 ] ];
						link = new NavigationLink( node, othernode, getDistance( node, othernode ) );
						links.push( link );
						break;

				}

			} );

			// Boundaries
			boundaries = dataStructure.boundaries[ triIndex ];
			let len = links.length;
			let i;
			boundaries.forEach( boundary => {
				i = len - 4; // Go back 3 + 1 which increments at the start of loop
				while( ++i < len ){
					if( isLink( links[i], boundary[0], boundary[1] ) ){
						links[i].boundary = true;
						return;
					}
				}
			} );

		} );


		// Graph
		this._graph = new NavigationGraph( nodes, links );

		// Clean up
		previousNodes = null;
		node = null;

		function isLink( link, a, b ){
			return ( link.a === a && link.b === b ) ||
						 ( link.a === b && link.b === a );
		}

		function getDistance( a, b ){
			return Math.sqrt( Math.pow( a.x - b.x, 2) + Math.pow( a.y - b.y, 2) );
		}

	}

	get triangles(){
		return this._triangles;	
	}

}