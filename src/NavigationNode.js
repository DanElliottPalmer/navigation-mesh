let NavigationNodeID = 0;
class NavigationNode {

	constructor( x, y, triangle ){
		this.id = NavigationNodeID++;
		this.triangle = triangle;
		this.x = x >>> 0;
		this.y = y >>> 0;
	}

	toString(){
		return `(${this.x},${this.y})`;
	}

}