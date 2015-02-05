class DisplayObject extends EventEmitter {

	constructor(){
		super();

		this.fill = "#000";
	}

	containsPoint( point ){
		return true;
	}

	render( ctx ){}

}