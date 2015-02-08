class Polygon extends DisplayObject {

	addPoint( point ){
		this.points.push( point );
		this._cachedBounds = null;
	}

	get area(){

		var area = 0;
		var i = -1;
		var length = this.points.length;

		var currentPoint;
		var nextPoint = this.points[ length - 1 ];
		while( ++i < length ){
			currentPoint = this.points[ i ];
			console.log( currentPoint.toString(), nextPoint.toString() );
			area += ( currentPoint.x * nextPoint.y );
			area -= ( currentPoint.y * nextPoint.x );
			nextPoint = this.points[ i ];
		}
		area /= 2;

		return area;

	}

	get bounds(){
		if( this._cachedBounds !== null ){
			return this._cachedBounds;
		}
		return ( this._cachedBounds = getBoundFromPoints( this.points ) );
	}

	get centroid(){

		var centroid = new Point( 0, 0 );
		var i = -1;
		var length = this.points.length;
		var value;

		var currentPoint;
		var nextPoint = this.points[ length - 1 ];
		while( ++i < length ){
			currentPoint = this.points[ i ];
			value = currentPoint.x * nextPoint.y - nextPoint.x * currentPoint.y;
			centroid.x += ( currentPoint.x + nextPoint.x ) * value;
			centroid.y += ( currentPoint.y + nextPoint.y ) * value;
			nextPoint = this.points[ i ];
		}

		value = this.area * 6;
		centroid.x = centroid.x / value;
		centroid.y = centroid.y / value;
		return centroid;
	}

	containsPoint( point ){

		if( this.points.length < 3 ){
			return false;
		}

		if( !this.bounds.containsPoint( point ) ){
			return false;
		}

		// Ray cast
		var intersections = 0,
			len = this.points.length,
			x1 = this.bounds.x, x2 = x1 + this.bounds.width,
			epsilon = Math.floor( ( x2-x1 )/100 ),
			point1 = new Point(0,0),
			point2 = new Point(0,0),
			point3 = new Point( x1-epsilon, point.y ),
			point4 = point.clone();

		var i = -1;

		while( ++i < len ){

			point1.x = this.points[i].x;
			point1.y = this.points[i].y;

			point2.x = this.points[ (i+1) % len ].x;
			point2.y = this.points[ (i+1) % len ].y;

			if( polygonIntersection( point3, point4, point1, point2 ) ){
				intersections++;
			}

		}

		return (intersections%2 === 0);

	}

	constructor( points ){
		super();
		this._cachedBounds = null;
		this._points = points.slice( 0 );

		this._cachedBounds = getBoundFromPoints( this.points );
	}

	get points(){
		return this._points;
	}
	set points( points ){
		this._points = points;
		this._cachedBounds = null;
	}

	render( ctx ){
		if( this.points.length < 2 ) return;
		ctx.save();
		ctx.beginPath();
		ctx.moveTo( this.points[0].x, this.points[0].y );
		this.points.forEach(function onEachPoint( point, index ){
			if( index === 0 ) return;
			ctx.lineTo( point.x, point.y );
		});
		ctx.closePath();
		if( this.fill !== "none" ){
			ctx.fillStyle = this.fill;
			ctx.fill();
		}
		if( this.strokeWidth > 0 ){
			ctx.lineWidth = this.strokeWidth;
			ctx.strokeStyle = this.stroke;
			ctx.stroke();
		}
		ctx.restore();
	}

}

function polygonIntersection( VecA, VecB, VecC, VecD ){
	/**
	 * VecA - Epsilon
	 * VecB - Click point
	 * VecC - Point1 Segment
	 * VecD - Point2 Segment
	 */

	function ccw(x, y, z) {
		return (z.y-x.y) * (y.x-x.x) >= (y.y-x.y) * (z.x-x.x);
	}

	return ccw(VecA, VecC, VecD) !== ccw(VecB, VecC, VecD) &&
			ccw(VecA, VecB, VecC) !== ccw(VecA, VecB, VecD);
};

function getBoundFromPoints( points ){
	var len = points.length;
	var point;
	var minX = Number.MAX_VALUE;
	var minY = Number.MAX_VALUE;
	var maxX = Number.MIN_VALUE;
	var maxY = Number.MIN_VALUE;
	while( len-- ){
		point = points[ len ];
		if( minX > point.x ){
			minX = point.x;
		}
		if( maxX < point.x ){
			maxX = point.x;
		}
		if( minY > point.y ){
			minY = point.y;
		}
		if( maxY < point.y ){
			maxY = point.y;
		}
	}
	return new Rectangle( minX, minY, maxX - minX, maxY - minY );
}