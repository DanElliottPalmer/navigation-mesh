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

	constructor( points = [] ){
		this.bounds = new Rect();
		this.points = points.slice(0);
		this._getBoundary();
	}

	contains( point = null ){
		if( !point ) return false;

		// Quick test
		if( !this.bounds.contains( point ) ) return false;

		return false;
	}

	toString(){
		return `(${ this.points.map( pt => pt.toString() ) })`;
	}

}

export default Polygon;