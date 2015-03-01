class NavigationEdge {

	constructor( from, to ){
		this.boundary = false;
		this.cost = NavigationUtils.distance( from.point, to.point );
		this.from = from;
		this.to = to;
	}

	toString(){
		return `(${this.from.toString()},${this.to.toString()})`;
	}

}