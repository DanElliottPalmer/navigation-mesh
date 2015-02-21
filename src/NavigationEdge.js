class NavigationEdge {

	get a(){
		return this._a;
	}

	get b(){
		return this._b;
	}

	constructor( a, b, cost ){
		this._a = a.id;
		this._b = b.id;
		this._cost = ( cost >>> 0 ) || 1;
		this.boundary = false;
		this.node1 = a;
		this.node2 = b;
	}

	get cost(){
		return this._cost;
	}

	destroy(){
		this.node1 = null;
		this.node2 = null;
	}
	
}