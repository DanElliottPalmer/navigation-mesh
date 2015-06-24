import Point from "./Point";
import Polygon from "./Polygon";

class NavigationMesh {

	constructor( points, holes = null ){
		this.graph = null;
		this.shape = new Polygon( points );
	}

	route( start, end ){}

}

NavigationMesh.Point = Point;
NavigationMesh.Polygon = Polygon;

export default NavigationMesh;