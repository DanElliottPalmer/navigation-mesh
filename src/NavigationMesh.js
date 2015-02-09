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

		// Parse graph network
		let nodes = this._triangles.map( triangle => {
			return new NavigationNode( triangle );
		} );
		let edges = [];
		let node;
		dataStructure.neighbours.forEach( ( neighbourIndices, index ) => {
			node = nodes[ index ];
			neighbourIndices.forEach( neighbourIndex => {
				edges.push( new NavigationLink( node, nodes[ neighbourIndex ] ) );
			} );
		} );

		this._graph = new NavigationGraph( nodes, edges );

	}

	get triangles(){
		return this._triangles;	
	}

}