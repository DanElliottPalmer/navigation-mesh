class NavigationNode {

	constructor( triangle ){
		let { x, y } = triangle.centroid;
		this.neighbours = [];
		this.triangle = triangle;
		this.x = x >>> 0;
		this.y = y >>> 0;
	}

}