class DisplayObject extends EventEmitter {

	constructor(){
		super();

		this.fill = "#000";
		this.stroke = "#000";
		this.strokeWidth = 0;
	}

	containsPoint( point ){
		return true;
	}

	render( ctx ){}

}