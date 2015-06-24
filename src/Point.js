export default class Point {
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