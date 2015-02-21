class NavigationEdge {

	get a(){
		return this._a;
	}

	get b(){
		return this._b;
	}

	constructor( a, b, cost ){
		this._a = a.id;
		this._b = b.id;
		this._cost = ( cost >>> 0 ) || 1;
		this.boundary = false;
		this.node1 = a;
		this.node2 = b;

		this.node1.links.push( this );
		this.node2.links.push( this );
	}

	get cost(){
		return this._cost;
	}

	destroy(){

		removeLink( this.node1, this );
		removeLink( this.node2, this );

		this.node1 = null;
		this.node2 = null;

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