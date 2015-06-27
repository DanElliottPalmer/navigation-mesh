import Point from "./Point";

/**
 * Detects if three points are counter-clockwise
 * 1 - Counter-clockwise
 * 0 - Collinear
 * -1 - Clockwise
 * 
 * @param  {Point} a 
 * @param  {Point} b 
 * @param  {Point} c 
 * @return {Integer} 
 */
export function ccw( a, b, c ){
	let area2 = ( c.y - a.y ) * ( b.x - a.x ) - ( b.y - a.y ) * ( c.x - a.x );
	if( area2 < 0 ) return -1;
	if( area2 > 0 ) return 1;
	return 0;
};

/**
 * Works out the cross product between two points
 * @param  {Point} pt1 
 * @param  {Point} pt2 
 * @return {Boolean}     
 */
export function crossProduct( pt1, pt2 ){
	return pt1.x * pt2.y - pt1.y * pt2.x;
};

/**
 * Gets the distance between two points
 * @param  {Point} a 
 * @param  {Point} b 
 * @return {Number}   
 */
export function distance( a, b ){
	let x = a.x - b.x;
	let y = a.y - b.y;
	return Math.sqrt( x * x + y * y );
};

/**
 * Converts a line to the equation a, b, c
 * @param  {Array} line 
 * @return {Object}      
 */
export function getLineEquation( line ){
	let pt1 = line[0];
	let pt2 = line[1];

	let a = pt2.y - pt1.y;
	let b = pt1.x - pt2.x;
	let c = a * pt1.x + b * pt1.y;

	return {
		"a": a,
		"b": b,
		"c": c
	};
};

/**
 * Checks if a point is on a line
 * @param  {Point}  point       
 * @param  {Array}  line        
 * @param  {Boolean} includeEnds 
 * @return {Boolean}             
 */
export function isPointOnSegment( point, line, includeEnds = true ){
	let min = Math.min( line[0].x, line[1].x );
	let max = Math.max( line[0].x, line[1].x );
	if( includeEnds ){
		if( !( min <= point.x && point.x <= max ) ) return false;
	} else {
		if( !( min < point.x && point.x < max ) ) return false;
	}
	min = Math.min( line[0].y, line[1].y );
	max = Math.max( line[0].y, line[1].y );
	if( includeEnds ){
		if( !( min <= point.y && point.y <= max ) ) return false;
	} else {
		if( !( min < point.y && point.y < max ) ) return false;
	}
	return true;
};

/**
 * Check if a vertex is concave
 * @param  {Array.Point}  vertices    
 * @param  {Integer}  vertexIndex 
 * @return {Boolean}             
 */
export function isVertexConcave( vertices, vertexIndex ){
	let middlePoint = vertices[ vertexIndex ];
	let previousPoint = vertices[ vertexIndex === 0 ? 
												vertices.length - 1 : 
												vertexIndex - 1 ];
	let nextPoint = vertices[ ( vertexIndex + 1 ) % vertices.length ];

	let left = new Point( middlePoint.x - previousPoint.x, 
												middlePoint.y - previousPoint.y );
	let right = new Point( nextPoint.x - middlePoint.x, 
													nextPoint.y - middlePoint.y );

	return {
		"cross": crossProduct( left, right ),
		"value": crossProduct( left, right ) < 0
	};
};

/**
 * Checks to see if a line intersects with another. Will return an object with
 * the point information if there is an intersection
 * @param  {Array}  lineA       
 * @param  {Array}  lineB       
 * @param  {Boolean} includeEnds 
 * @return {Boolean/Point}              
 */
export function lineIntersection( lineA, lineB, includeEnds = true ){

	let lineAEquation = getLineEquation( lineA );
	let lineBEquation = getLineEquation( lineB );

	let determinant = lineAEquation.a * lineBEquation.b -
										lineBEquation.a * lineAEquation.b;

	// Lines are parallell
	if( determinant === 0 ) return false;

	let x = ( lineBEquation.b * lineAEquation.c - lineAEquation.b * lineBEquation.c ) / determinant;
	let y = ( lineAEquation.a * lineBEquation.c - lineBEquation.a * lineAEquation.c ) / determinant;
	let point = new Point( x, y );

	if( isPointOnSegment( point, lineA, includeEnds ) && isPointOnSegment( point, lineB, includeEnds ) ){
		return point;
	}

	return false;
};