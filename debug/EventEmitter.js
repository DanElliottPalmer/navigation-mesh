class EventEmitter {

	constructor(){
		this._listeners = {};
	}

	destroy(){
		this._listeners = null;
	}

	has( type ){
		return this._listeners.hasOwnProperty( type ) &&
			this._listeners[ type ].length > 0;
	}

	off( type, handler ){
		if( !this.has( type ) ) return;
		let listeners = this._listeners[ type ];
		let length = listeners.length;
		while( length-- ){
			if( listeners[ length ] === handler ){
				listeners.splice( length, 1 );
				return true;
			}
		}
		return false;
	}

	on( type, handler ){
		if( !this._listeners.hasOwnProperty( type ) ){
			this._listeners[ type ] = [];
		}
		this._listeners[ type ].push( handler );
	}

	trigger( type, ...data ){
		if( !this.has( type ) ) return;
		this._listeners[ type ].forEach( handler => {
			handler.apply( this, data );
		} );
	}

}