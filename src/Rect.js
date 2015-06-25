class Rect {
	constructor( x, y, width, height ){
		this.height = height | 1;
		this.width = width | 1;
		this.x = x | 1;
		this.y = y | 1;
	}
	contains( point = null ){
		if( !point ) return false;
		return point.x >= this.x && point.x <= this.x+this.width &&
						point.y >= this.y && point.y <= this.y+this.height;
	}
}
export default Rect;