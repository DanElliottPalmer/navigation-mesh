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

	route( start, end ){

		if( !start ) return false;
		if( !end ) return false;

		let startPoint = start.clone();
		let endPoint = end.clone();

		// Check points are in the shape
		if( !this.shape.contains( startPoint ) ) return false;
		if( !this.shape.contains( endPoint ) ) return false;

		// Check if the two points can see each other. If so, we can skip
		// adding them to the graph network
		let los = [ startPoint, endPoint ];
		let intersection = false;
		this.shape.vertices.forEach( vertex => {
			if( intersection ) return;
			intersection = lineIntersection( los, vertex, false );
		});
		if( !intersection ){

			// Check the half point is inside the shape
			let halfX = ( endPoint.x - startPoint.x ) / 2;
			let halfY = ( endPoint.y - startPoint.y ) / 2;
			let halfPoint = new Point( startPoint.x + halfX, startPoint.y + halfY );

			if( this.shape.contains( halfPoint ) ){
				return [ startPoint, endPoint ];
			}	
			
		}

		// Add start and end points to the graph
		let startNode = Graph.createNode( startPoint );
		let endNode = Graph.createNode( endPoint );
		this.graph.addNode( startNode );
		this.graph.addNode( endNode );

		// Add links to nodes
		this.graph.nodes.forEach( node => {

			// Dont need to check the node if it is our startPoint or endPoint
			if( node === startNode || node === endNode ) return;

			// We're going to check both nodes in this one loop to save an extra loop
			let losStart = [ startNode.position, node.position ];
			let losEnd = [ endNode.position, node.position ];
			let intersectionStart = false;
			let intersectionEnd = false;
			this.shape.vertices.forEach( vertex => {
				// Start node check
				if( !intersectionStart ){
					intersectionStart = lineIntersection( losStart, vertex, false );
				}
				// End node check
				if( !intersectionEnd ){
					intersectionEnd = lineIntersection( losEnd, vertex, false );
				}
			});
			// If both nodes have intersected a line, move onto the next node
			if( intersectionStart && intersectionEnd ) return;

			// Check that the los is not outside the shape
			if( !intersectionStart ){
				let halfX = ( node.position.x - startNode.position.x ) / 2;
				let halfY = ( node.position.y - startNode.position.y ) / 2;
				let halfPoint = new Point( startNode.position.x + halfX, startNode.position.y + halfY );

				if( this.shape.contains( halfPoint ) ){
					this.graph.addLink( Graph.createLink( startNode, node ) );
				}				
			}
			if( !intersectionEnd ){
				let halfX = ( node.position.x - endNode.position.x ) / 2;
				let halfY = ( node.position.y - endNode.position.y ) / 2;
				let halfPoint = new Point( endNode.position.x + halfX, endNode.position.y + halfY );

				if( this.shape.contains( halfPoint ) ){
					this.graph.addLink( Graph.createLink( endNode, node ) );
				}				
			}

		});

		let path = this.graph.route( startNode, endNode );

		// Clean up - remove start and end nodes from graph
		this.graph.removeNode( startNode );
		this.graph.removeNode( endNode );

		return path;

	}

}

NavigationMesh.Graph = Graph;
NavigationMesh.Point = Point;
NavigationMesh.Polygon = Polygon;

export default NavigationMesh;