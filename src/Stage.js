class Stage extends EventEmitter {

	addChild( child ){
		this.children.push( child );
	}

	constructor(){
		super();
		this._renderer = null;
		this.children = [];
	}

	removeChild( child ){
		var index = this.children.indexOf( child );
		if( index === -1 ) return;
		this.children.splice( index, 1 );
	}

	render( ctx ){
		this.children.forEach( child => {
			child.render( ctx );
		} );
	}

}