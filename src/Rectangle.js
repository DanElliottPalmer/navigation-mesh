class Rectangle extends DisplayObject {

	constructor( x, y, width, height ){
		super();

		this.height = height >>> 0;
		this.width = width >>> 0;
		this.x = x >>> 0;
		this.y = y >>> 0;
	}

	containsPoint( point ){
		return ( point.y >= this.y &&
				 point.y <= this.height + this.y &&
				 point.x >= this.x &&
				 point.x <= this.width + this.x );
	}

	render( ctx ){
		if( !this.visible ) return;
		ctx.save();
		ctx.beginPath();
		ctx.rect( this.x, this.y, this.width, this.height );
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