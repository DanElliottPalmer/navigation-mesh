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
		var points = dataStructure.points.map( point => {
			return new Point( point[0], point[1] );
		} );

		// Parse polygons
		var poly = null;
		this._triangles = dataStructure.triangles.map( triangle => {
			poly = new Polygon( triangle.map( index => {
				return points[ index ];
			} ) );
			poly.fill = "none";
			poly.strokeWidth = 1;
			poly.stroke = "#f00";
			return poly;
		} );

		// Parse graph network

	}

	get triangles(){
		return this._triangles;	
	}

}