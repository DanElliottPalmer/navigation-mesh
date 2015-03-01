class NavigationNode {

	constructor(){
		this.edges = new Set();
		this.point = null;
		this.triangles = new Set();
	}

	toString(){
		return this.point.toString();
	}

}