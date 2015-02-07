class Polygon extends DisplayObject {

	addPoint( point ){
		this.points.push( point );
		this._cachedBounds = null;
	}

	get bounds(){
		if( this._cachedBounds !== null ){
			return this._cachedBounds;
		}
		return ( this._cachedBounds = getBoundFromPoints( this.points ) );
	}

	centroid(){
		var centroid = new Point();
		var pts = this.points;
		var signedArea = 0;
		var area = 0;
		var x0 = 0;
		var y0 = 0;
		var x1 = 0;
		var y1 = 0;

		var calculate = function( pt1, pt2 ){
			x0 = pt1.x;
			y0 = pt1.y;
			x1 = pt2.x;
			y1 = pt2.y;

			area = x0*y1 - x1*y0;
			signedArea += area;
			centroid.x += ( x0 + x1 ) * area;
			centroid.y += ( y0 + y1 ) * area;
		};

		var i = -1, l = pts.length-1;
		while( ++i < l ){
			calculate( pts[i], pts[i+1] );
		}

		calculate( pts[i], pts[0] );

		signedArea = ( signedArea * 0.5 ) * 6;
		centroid.x /= signedArea;
		centroid.y /= signedArea;

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
		ctx.fillStyle = this.fill;
		ctx.beginPath();
		ctx.moveTo( this.points[0].x, this.points[0].y );
		this.points.forEach(function onEachPoint( point, index ){
			if( index === 0 ) return;
			ctx.lineTo( point.x, point.y );
		});
		ctx.closePath();
		ctx.fill();
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