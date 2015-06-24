class Polygon {

	constructor( points = [] ){
		this.points = points.slice(0);
	}

	toString(){
		return `(${ this.points.map( pt => pt.toString() ) })`;
	}

}

export default Polygon;