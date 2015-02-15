class NavigationTriangle {

	get bounds(){
		if( this._dirty ){
			let length = this.points.length;
			let point = null;
			var minX = Number.MAX_VALUE;
			var minY = Number.MAX_VALUE;
			var maxX = Number.MIN_VALUE;
			var maxY = Number.MIN_VALUE;
			while( length-- ){
				point = this.points[ length ];
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
			this._bounds.x = minX;
			this._bounds.y = minY;
			this._bounds.width = maxX - minX;
			this._bounds.height = maxY - minY;
			this._dirty = false;
		}
		return this._bounds;
	}

	constructor( points ){
		this._bounds = {
			"containsPoint": function( point ){
				return ( point.y >= this.y &&
						 point.y <= this.height + this.y &&
						 point.x >= this.x &&
						 point.x <= this.width + this.x );
			},
			"height": 0,
			"width": 0,
			"x": 0,
			"y": 0
		};
		this._dirty = true;
		this._points = points;
	}

	containsPoint( point ){

		if( !this.bounds.containsPoint( point ) ){
			return false;
		}

		// Ray cast
		let intersections = 0;
		let len = this.points.length;
		let x1 = this.bounds.x;
		let x2 = x1 + this.bounds.width;
		let epsilon = ( x2 - x1 )/100;
		let point1 = new NavigationPoint( 0, 0 );
		let point2 = new NavigationPoint( 0, 0 );
		let point3 = new NavigationPoint( x1-epsilon, point.y );
		let point4 = point.clone();

		var i = -1;

		while( ++i < len ){

			point1.x = this.points[i].x;
			point1.y = this.points[i].y;

			point2.x = this.points[ (i+1) % len ].x;
			point2.y = this.points[ (i+1) % len ].y;

			if( NavigationTriangle.intersection( point3, point4, point1, point2 ) ){
				intersections++;
			}

		}
		return (intersections%2 !== 0);

	}

	get points(){
		return this._points;
	}
	set points( points ){
		this._points = points;
		this._dirty = true;
	}

}

NavigationTriangle.intersection = function( VecA, VecB, VecC, VecD ){
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