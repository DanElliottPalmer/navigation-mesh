class NavigationEdge {

	constructor( a, b, cost ){
		this._cost = ( cost >>> 0 ) || 1;
		this.boundary = false;
		this.from = a;
		this.to = b;

		this.from.links.push( this );
		this.to.links.push( this );
	}

	get cost(){
		return this._cost;
	}

	destroy(){

		removeLink( this.from, this );
		removeLink( this.to, this );

		this.from = null;
		this.to = null;

		function removeLink( node, link ){
			let len = node.links.length;
			while( len-- ){
				if( node.links[ len ] === link ){
					node.links.splice( len, 1 );
					return;
				}
			}
		}

	}
	
}