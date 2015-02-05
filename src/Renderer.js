var events = {
	"click": function( e ){
		// console.log( e );
		// Trigger renderer click
		this.trigger( "click", e );
		// Trigger any thing renderered on the stage
		var point = new Point( e.offsetX, e.offsetY );
		var len = this._stage.children.length;
		var child;
		while( len-- ){
			child = this._stage.children[len];
			if( child.containsPoint( point ) ){
				child.trigger("click", e);
				if( !e.returnValue ) return;
			}
		}
		// If nothing stopped the event, send one to the stage
		this._stage.trigger( "click", e );
	}
};

class Renderer extends EventEmitter {

	clear(){
		this.ctx.clearRect( 0, 0, this._width, this._height );
	}

	constructor( el ){
		super();

		this._frame = null;
		this._height = el.height;
		this._stage = null;
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

		var eventKeys = Object.keys( events );
		eventKeys.forEach( key => {
			this.el.addEventListener( key, events[ key ].bind( this ) );
		} );

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

	render(){
		if( !this._stage ) return;
		this._stage.render( this.ctx );
	}

	get stage(){
		return this._stage;
	}
	set stage( value ){
		if( this._stage === value ) return;
		if( this._stage !== null ){
			this._stage._renderer = null;
		}
		if( value === null ){
			this._stage = null;
		} else {
			value._renderer = this;
			this._stage = value;
		}
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