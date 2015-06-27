class Node {
	constructor( point ){
		this.position = point.clone();
	}
	toArray(){
		return this.position.toArray();
	}
	toString(){
		return this.position.toString();
	}
}
export default Node;