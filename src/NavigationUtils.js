let NavigationUtils = {

	"distance": function( a, b ){
		return Math.sqrt( NavigationUtils.square( a.x - b.x ) + NavigationUtils.square( a.y - b.y ) );
	},

	"distanceToEdge": function( point, edge ){
		let v = NavigationUtils.Vector.sub( edge.to.point, edge.from.point );
		let w = NavigationUtils.Vector.sub( point, edge.from.point );

		let c1 = NavigationUtils.Vector.dot( w, v );
		if( c1 <= 0 ) return NavigationUtils.distance( point, edge.from.point );
		let c2 = NavigationUtils.Vector.dot( v, v );
		if( c2 <= c1 ) return NavigationUtils.distance( point, edge.to.point );

		let b = c1 / c2;
		let pb = new NavigationPoint( edge.from.point.x + b * v.x, edge.from.point.y + b * v.y );

		return NavigationUtils.distance( point, pb );
	},

	"heuristic": function( a, b ){
		return Math.abs( a.x - b.x ) + Math.abs( a.y - b.y );
	},

	"lineIntersection": function( point1, point2, point3, point4 ){

		function ccw(x, y, z) {
			return (z.y-x.y) * (y.x-x.x) >= (y.y-x.y) * (z.x-x.x);
		}

		return ccw(point1, point3, point4) !== ccw(point2, point3, point4) &&
				ccw(point1, point2, point3) !== ccw(point1, point2, point4);
	},

	"square": function( value ){
		return value * value;
	},

	"Vector": {

		"add": function( a, b ){
			return new NavigationPoint( a.x + b.x, a.y + b.y );
		},

		"div": function( a, b ){
			return new NavigationPoint( a.x / b.x, a.y / b.y );
		},

		"dot": function( a, b ){
			return a.x * b.x + a.y * b.y;
		},

		"mul": function( a, b ){
			return new NavigationPoint( a.x * b.x, a.y * b.y );
		},

		"sub": function( a, b ){
			return new NavigationPoint( a.x - b.x, a.y - b.y );
		}

	}
	
};