class Polygon extends DisplayObject {

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

	constructor( points ){
		super();
		this.points = points.slice( 0 );
	}

	render( ctx ){
		if( this.points.length === 0 ) return;
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