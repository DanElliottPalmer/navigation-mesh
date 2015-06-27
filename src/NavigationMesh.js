require("babel/polyfill");

import { distance, isVertexConcave, lineIntersection } from "./Maths";
import Graph from "./Graph";
import Point from "./Point";
import Polygon from "./Polygon";

class NavigationMesh {

	constructor( points, holes = null ){
		this.graph = null;
		this.shape = new Polygon( points );

		// Get any concave points
		let totals = 0;
		let isConcave = null;
		let concavePoints = points.map( ( point, index ) => {
			isConcave = isVertexConcave( points, index );
			totals += isConcave.cross;
			return [ point, isConcave.value ];
		}).filter( pointArr => {
			if( totals < 0 ){
				return !pointArr[1];
			}
			return pointArr[1];
		}).map( pointArr => pointArr[0] );

		// Build a graph with any concave points
		this.graph = new Graph();
		concavePoints.forEach( point => this.graph.addNode( Graph.createNode( point ) ));

		// Line of site graph links
		this.graph.nodes.forEach( fromNode => {
			this.graph.nodes.forEach( toNode => {

				if( fromNode === toNode ) return;

				let links = this.graph.getLinksContainingNode( fromNode, toNode );
				if( links.length === 0 ){

					// Check if there is a vertex first as it saves us doing other tests
					if( this.shape.hasVertex( fromNode.position, toNode.position ) ){
						this.graph.addLink( Graph.createLink( fromNode, toNode ) );
						return;
					}

					// Line of site check
					let los = [ fromNode.position, toNode.position ];
					let intersection = false;
					this.shape.vertices.forEach( vertex => {
						if( intersection ) return;
						intersection = lineIntersection( los, vertex, false );
					});
					if( intersection ) return;

					// Check that the line is not going outside the polygon. We get the
					// halfway point of the line and see if the polygon contains it.
					let halfX = ( toNode.position.x - fromNode.position.x ) / 2;
					let halfY = ( toNode.position.y - fromNode.position.y ) / 2;
					let halfPoint = new Point( fromNode.position.x + halfX, fromNode.position.y + halfY );

					if( !this.shape.contains( halfPoint ) ) return;

					this.graph.addLink( Graph.createLink( fromNode, toNode ) );
				}
				
			});
		});

	}

	route( start, end ){}

}

NavigationMesh.Graph = Graph;
NavigationMesh.Point = Point;
NavigationMesh.Polygon = Polygon;

export default NavigationMesh;