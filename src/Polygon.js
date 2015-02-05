class Polygon extends DisplayObject {

	centroid(){

	}

	constructor( points ){
		super();
		this.points = points.slice( 0 );
	}

	render( ctx ){
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