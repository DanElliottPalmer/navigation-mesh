class Renderer extends EventEmitter {

	clear(){
		this.ctx.clearRect( 0, 0, this._width, this._height );
	}

	constructor( el ){
		super();

		this._frame = null;
		this._height = el.height;
		this._width = el.width;

		this.ctx = el.getContext("2d");
		this.el = el;

		var loop = function(){
			this._frame = requestAnimationFrame( loop );
			this.trigger("update");
			this.trigger("pre-render");
			this.trigger("render");
			this.trigger("post-render");
		}.bind( this );
		this._frame = requestAnimationFrame( loop );

	}

	destroy(){
		cancelAnimationFrame( this._frame );
		super();
		this._frame = null;
		this.ctx = null;
		this.el.parentNode.removeChild( this.el );
		this.el = null;
	}

	get height(){
		return this._height;
	}
	set height( _value ){
		let value = _value >>> 0;
		this.el.height = value;
		this._height = value;
	}

	get width(){
		return this._width;
	}
	set width( _value ){
		let value = _value >>> 0;
		this.el.width = value;
		this._width = value;
	}

}