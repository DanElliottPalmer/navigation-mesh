class Circle extends DisplayObject {

	get bounds(){
		if( this._cachedBounds !== null ){
			return this._cachedBounds;
		}

		var x = this.cx - this.radius;
		var y = this.cy - this.radius;
		this._cachedBounds = new Rectangle( x, y, x + this.radius + this.radius, this.y + this.radius + this.radius );
		return this._cachedBounds;
	}

	constructor( cx, cy, radius ){
		super();

		this._cachedBounds = null;
		this._cx = cx >>> 0;
		this._cy = cy >>> 0;
		this._radius = radius >>> 0;
	}

	containsPoint( point ){
    var dist = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
    return dist <= this.radius;
	}

	get cx(){
		return this._cx;
	}
	set cx( cx ){
		this._cx = cx >>> 0;
		this._cachedBounds = null;
	}

	get cy(){
		return this._cy;
	}
	set cy( cy ){
		this._cy = cy >>> 0;
		this._cachedBounds = null;
	}

	render( ctx ){
		if( !this.visible ) return;
		ctx.save();
		ctx.beginPath();
		ctx.arc( this.cx, this.cy, this.radius, 0, Math.PI*2, false );
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

	get radius(){
		return this._radius;
	}
	set radius( radius ){
		this._radius = radius >>> 0;
		this._cachedBounds = null;
	}

}