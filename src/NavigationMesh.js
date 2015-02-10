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

		let previousNodes = {};

		this._triangles.forEach( triangle => {
			triangle.points.forEach( ( point, index ) => {

				// If node doesnt exist, create it
				if( !previousNodes.hasOwnProperty( point ) ){
					previousNodes[ point ] = new NavigationNode( point.x, point.y, triangle );
					nodes.push( previousNodes[ point ] );
				}
				node = previousNodes[ point ];

				// Links
				switch( index ){
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
						othernode = previousNodes[ triangle.points[ index - 1 ] ];
						link = new NavigationLink( node, othernode, getDistance( node, othernode ) );
						links.push( link );
						break;

				}

			} );
		} );


		// Graph
		this._graph = new NavigationGraph( nodes, links );

		// Clean up
		previousNodes = null;
		node = null;

		function getDistance( a, b ){
			return Math.sqrt( Math.pow( a.x - b.x, 2) + Math.pow( a.y - b.y, 2) );
		}

	}

	get triangles(){
		return this._triangles;	
	}

}