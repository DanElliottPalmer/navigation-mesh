import Point from "./Point";
import Rect from "./Rect";

class Polygon {

	_getBoundary(){
		let minPos = new Point();
		let maxPos = new Point();

		this.points.forEach( ( point, index ) => {
			if( index === 0 ){
				minPos.x = maxPos.x = point.x;
				minPos.y = maxPos.y = point.y;
			} else {
				if( point.x < minPos.x ) minPos.x = point.x;
				if( point.y < minPos.y ) minPos.y = point.y;
				if( point.x > maxPos.x ) maxPos.x = point.x;
				if( point.y > maxPos.y ) maxPos.y = point.y;
			}
		});

		this.bounds.x = minPos.x;
		this.bounds.y = minPos.y;
		this.bounds.width = maxPos.x - minPos.x;
		this.bounds.height = maxPos.y - minPos.y;
	}

	_getVertices(){
		this.vertices.length = 0;
		this.points.reduce( ( previous, current ) => {
			this.vertices.push( [ previous, current ] );
			return current;
		}, this.points[ this.points.length - 1 ]);
	}

	constructor( points = [] ){
		this.bounds = new Rect();
		this.points = points.slice(0);
		this.vertices = [];

		this._getBoundary();
		this._getVertices();
	}

	// http://alienryderflex.com/polygon/
	contains( point = null ){
		if( !point ) return false;

		// Quick test
		if( !this.bounds.contains( point ) ) return false;

		let i = -1;
		let j = this.points.length - 1;
		let length = this.points.length;
		let oddIntersections = false;

		while( ++i < length ){

			if(
				( this.points[i].y < point.y && this.points[j].y >= point.y ||
					this.points[j].y < point.y && this.points[i].y >= point.y ) &&
				( this.points[i].x <= point.x || this.points[j].x <= point.x )
			){

				if(
					this.points[i].x +
					( point.y - this.points[i].y ) /
					( this.points[j].y - this.points[i].y ) *
					( this.points[j].x - this.points[i].x ) < point.x
				){
					oddIntersections = !oddIntersections;
				}

			}

			j = i;

		}

		return oddIntersections;
	}

	toString(){
		return `(${ this.points.map( pt => pt.toString() ) })`;
	}

}

export default Polygon;