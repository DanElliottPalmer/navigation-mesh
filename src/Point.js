class Point {
	clone(){
		return new Point( this.x, this.y );
	}
	constructor( x, y ){
		this.x = x >>> 0 || 0;
		this.y = y >>> 0 || 0;
	}
	toString(){
		return `(${this.x},${this.y})`;
	}
}