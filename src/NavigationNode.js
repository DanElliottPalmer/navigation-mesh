let NavigationNodeID = 0;
class NavigationNode {

	constructor( x, y, triangle ){
		this.id = NavigationNodeID++;
		this.links = [];
		this.triangle = triangle;
		this.triangles = [];
		this.x = x >>> 0;
		this.y = y >>> 0;
	}

	destroy(){
		this.links = null;
		this.triangles = null;
	}

	toString(){
		return `(${this.x},${this.y})`;
	}

}