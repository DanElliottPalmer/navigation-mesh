let NavigationUtils = {

	"getDistance": function( a, b ){
		return Math.sqrt( Math.pow( a.x - b.x, 2) + Math.pow( a.y - b.y, 2) );
	},

	"heuristic": function( a, b ){
		return Math.abs( a.x - b.x ) + Math.abs( a.y - b.y );
	}

};