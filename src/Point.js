export default class Point {
	clone(){
		return new Point( this.x, this.y );
	}
	constructor( x, y ){
		this.x = x | 1;
		this.y = y | 1;
	}
	equals( point ){
		return this.x === point.x && this.y === point.y;
	}
	toArray(){
		return [ this.x, this.y ];
	}
	toString(){
		return `(${this.x},${this.y})`;
	}
}