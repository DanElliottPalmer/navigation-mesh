class NavigationGraph {

	addNode( node ){
		this.nodes.push( node );
	}

	addLink( a, b, cost ){
		if( this.hasLink( a, b ) ) return;
		let key = generateLinkKeyFromNode( a, b );
		return ( this.links[ key ] = new NavigationLink( a, b, cost ) );
	}

	constructor( nodes, links ){
		this.links = {};
		this.nodes = nodes || [];

		if( Array.isArray( links ) ){
			let key = "";
			links.forEach( link => {
				key = generateLinkKeyFromId( link.a, link.b );
				if( this.links.hasOwnProperty( key ) ) return;
				key = generateLinkKeyFromId( link.b, link.a );
				if( this.links.hasOwnProperty( key ) ) return;
				this.links[ key ] = link;
			} );
		} else {
			this.links = links || {};
		}

	}

	containsPoint( x, y ){
		let len = this.nodes.length;
		let point = new Point( x, y );
		while( len-- ){
			if( this.nodes[ len ].triangle.containsPoint( point ) ){
				return this.nodes[ len ];
			}
		}
		return;
	}

	getLinksByNode( node ){
		let keys = Object.keys( this.links );
		if( keys.length === 0 ) return;
		let re = new RegExp( "((^" + node._NODEID + ",)|(," + node._NODEID + "$))" );
		keys = keys.filter( key => {
			return re.test( key );
		} );
		if( keys.length === 0 ) return null;
		return keys.map( key => {
			return this.links[ key ];
		} );
	}

	getNeighbours( node ){
		let links = this.getLinksByNode( node );
		if( !links ) return;
		let id = node._NODEID;
		return links.map( link => {
			if( link.a === id ){
				// Give b
				return this.getNodeById( link.b );
			}
			// Give a
			return this.getNodeById( link.a );
		} );
	}

	getNodeById( id ){
		let length = this.nodes.length;
		while( length-- ){
			if( this.nodes[ length ]._NODEID === id ){
				return this.nodes[ length ];
			}
		}
		return;
	}

	hasLink( a, b ){
		let key = "";
		// Check if a -> b
		key = generateLinkKeyFromNode( a, b );
		if( this.links.hasOwnProperty( key ) ) return key;
		// Check if b -> a
		key = generateLinkKeyFromNode( b, a );
		return this.links.hasOwnProperty( key ) && key;
	}

	removeLink( a, b ){
		let key = "";
		if( ( key = this.hasLink( a, b ) ) === false ) return;
		let link = this.links[ key ];
		link.destroy();
		this.links[ key ] = null;
		delete this.links[ key ];
	}

	removeNode( node, includeLinks ){
		let index = this.nodes.indexOf( node );
		if( index === -1 ) return;
		this.nodes.splice( index, 1 );
		if( !includeLinks ) return;
		// TODO: Remove links associated with node
	}

}

function generateLinkKeyFromId( a, b ){
	return a + "," + b;
}

function generateLinkKeyFromNode( a, b ){
	return a._NODEID + "," + b._NODEID;
}