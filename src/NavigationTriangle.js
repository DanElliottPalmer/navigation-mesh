class NavigationTriangle {

	get bounds(){
		if( this._dirty ){
			let pointsLength = this.points.length;
			let currentPoint = null;
			let minX = Number.MAX_VALUE;
			let minY = Number.MAX_VALUE;
			let maxX = Number.MIN_VALUE;
			let maxY = Number.MIN_VALUE;
			while( pointsLength-- ){
				currentPoint = this.points[ pointsLength ];
				if( minX > currentPoint.x ){
					minX = currentPoint.x;
				}
				if( maxX < currentPoint.x ){
					maxX = currentPoint.x;
				}
				if( minY > currentPoint.y ){
					minY = currentPoint.y;
				}
				if( maxY < currentPoint.y ){
					maxY = currentPoint.y;
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
			"containsPoint": function( x, y ){
				return ( y >= this.y &&
						 y <= this.height + this.y &&
						 x >= this.x &&
						 x <= this.width + this.x );
			},
			"height": 0,
			"width": 0,
			"x": 0,
			"y": 0
		};
		this._dirty = true;
		this._points = points;
	}

	containsPoint( x, y ){

		/**
		 * Check the bounds of the triangle first as it means we can skip doing
		 * HEEAAAAAVY math (kinda)
		 */
		if( !this.bounds.containsPoint( x, y ) ){
			return false;
		}

		/**
		 * Raycast
		 */
		let totalIntersections = 0;
		let i = -1;
		let pointsLength = this.points.length;
		let epsilon = this.bounds.width / 100;
		/**
		 * Points we're going to reuse
		 */
		let point1 = new NavigationPoint();
		let point2 = new NavigationPoint();
		let point3 = new NavigationPoint( this.bounds.x - epsilon, y );
		let point4 = new NavigationPoint( x, y );

		while( ++i < pointsLength ){

			point1.x = this.points[ i ].x;
			point1.y = this.points[ i ].y;
			point2.x = this.points[ ( i + 1 ) % pointsLength ].x;
			point2.y = this.points[ ( i + 1 ) % pointsLength ].y;

			if( NavigationUtils.lineIntersection( point3, point4, point1, point2 ) ){
				totalIntersections++;
			}

		}

		return totalIntersections % 2 !== 0;

	}

	get points(){
		return this._points;
	}
	set points( points ){
		this._points = points;
		this._dirty = true;
	}

}