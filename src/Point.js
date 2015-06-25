export default class Point {
	clone(){
		return new Point( this.x, this.y );
	}
	constructor( x, y ){
		this.x = x | 1;
		this.y = y | 1;
	}
	toArray(){
		return [ this.x, this.y ];
	}
	toString(){
		return `(${this.x},${this.y})`;
	}
}