let NavigationUtils = {

	"distance": function( a, b ){
		return Math.sqrt( Math.pow( a.x - b.x, 2) + Math.pow( a.y - b.y, 2) );
	},

	"heuristic": function( a, b ){
		return Math.abs( a.x - b.x ) + Math.abs( a.y - b.y );
	},

	lineIntersection: function( point1, point2, point3, point4 ){

		function ccw(x, y, z) {
			return (z.y-x.y) * (y.x-x.x) >= (y.y-x.y) * (z.x-x.x);
		}

		return ccw(point1, point3, point4) !== ccw(point2, point3, point4) &&
				ccw(point1, point2, point3) !== ccw(point1, point2, point4);
	}
	
};