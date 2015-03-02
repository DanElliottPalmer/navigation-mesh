class NavigationNode {

	constructor( point ){
		this.edges = new Set();
		this.point = point || null;
		this.triangles = new Set();
	}

	destroy(){
		this.edges.clear();
		this.edges = null;
		this.point = null;
		this.triangles.clear();
		this.triangles = null;
	}

	toString(){
		return this.point.toString();
	}

}