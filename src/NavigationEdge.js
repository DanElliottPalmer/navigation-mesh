class NavigationEdge {

	get a(){
		return this._a;
	}

	get b(){
		return this._b;
	}

	constructor( a, b, cost ){
		this._a = a._NODEID;
		this._b = b._NODEID;
		this._cost = ( cost >>> 0 ) || 1;
		this.boundary = false;
	}

	get cost(){
		return this._cost;
	}
	
}