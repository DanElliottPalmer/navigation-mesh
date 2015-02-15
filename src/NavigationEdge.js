class NavigationEdge {

	get a(){
		return this._a;
	}

	get b(){
		return this._b;
	}

	get boundary(){
		return this._boundary;
	}
	set boundary( value ){
		this._boundary = value;
	}

	constructor( a, b, cost ){
		this._a = a._NODEID;
		this._b = b._NODEID;
		this._boundary = false;
		this._cost = ( cost >>> 0 ) || 1;
	}

	get cost(){
		return this._cost;
	}
	
}