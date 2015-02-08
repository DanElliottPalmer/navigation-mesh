class NavigationGraph {

	constructor( nodes ){
		this.nodes = nodes;
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

}