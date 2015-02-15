class Line extends DisplayObject {

	constructor( x1, y1, x2, y2 ){
		super();

		this.x1 = x1 >>> 0;
		this.y1 = y1 >>> 0;
		this.x2 = x2 >>> 0;
		this.y2 = y2 >>> 0;

		this.strokeWidth = 1;
	}

	render( ctx ){
		if( !this.visible ) return;
		ctx.save();
		ctx.beginPath();
		ctx.moveTo( this.x1, this.y1 );
		ctx.lineTo( this.x2, this.y2 );
		ctx.closePath();
		if( this.strokeWidth > 0 ){
			ctx.lineWidth = this.strokeWidth;
			ctx.strokeStyle = this.stroke;
			ctx.stroke();
		}
		ctx.restore();
	}

}