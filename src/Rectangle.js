class Rectangle extends DisplayObject {

	constructor( x, y, width, height ){
		super();

		this.height = height >>> 0;
		this.width = width >>> 0;
		this.x = x >>> 0;
		this.y = y >>> 0;
	}

	render( ctx ){
		ctx.save();
		ctx.fillStyle = this.fill;
		ctx.fillRect( this.x, this.y, this.width, this.height );
		ctx.restore();
	}

}