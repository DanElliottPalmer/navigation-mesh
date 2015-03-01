class NavigationPoint {

	clone(){
		return new NavigationPoint( this.x, this.y );
	}

	constructor( x = 0, y = 0 ){
		this.x = x;
		this.y = y;
	}

	toString(){
		return `(${this.x},${this.y})`;
	}

}