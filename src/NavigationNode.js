let NavigationNodeID = 0;
class NavigationNode {

	constructor( triangle ){
		let { x, y } = triangle.centroid;
		this._NODEID = NavigationNodeID++;
		this.triangle = triangle;
		this.x = x >>> 0;
		this.y = y >>> 0;
	}

	toString(){
		return `(${this.x},${this.y})`;
	}

}