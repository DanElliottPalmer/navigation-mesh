#navigation mesh

hi.

![](https://dl.dropboxusercontent.com/u/26586559/gifs/saywat.gif)

##Mesh data object
The mesh data object is built up of four parts.

* boundaries - An array of arrays representing a triangle. Inside contains an array with point indices representing which edges are walls.
* neighbours - An array of triangle indices that are neighbours
* points - An array of `[x, y]`
* triangles - An array of point indices

###Example
```
{"boundaries":[[[0,2],[1,0]],[[3,1]],[[2,4]],[[5,3]],[],[[7,5]],[[6,8]],[[9,7]],[[8,10]],[[10,11]],[[12,9]],[[13,12]],[[11,6]],[[4,13]]],"neighbours":[[1],[2,0],[1,3],[2,4],[13,3,5],[4,6],[5,7],[8,6],[7,9],[10,8],[11,9],[12,10],[13,11],[4,12]],"points":[[268,343],[79,332],[245,131],[80,53],[504,135],[675,64],[606,262],[691,336],[615,309],[376,336],[434,308],[435,264],[365,233],[505,231]],"triangles":[[0,1,2],[1,3,2],[4,2,3],[5,4,3],[5,6,4],[7,6,5],[7,8,6],[7,9,8],[9,10,8],[10,9,11],[11,9,12],[11,12,13],[11,13,6],[6,13,4]]}
```

##NavigationEdge
```
boundary → {Boolean}
```
Whether the edge is a wall around the mesh or a wall in a hole

```
constructor( from, to )
```

| Name | Required | Type            | Description                       |
|------|----------|-----------------|-----------------------------------|
| from    | Yes      | NavigationNode | The node that the edge goes from |
| to    | Yes      | NavigationNode | The node that the edge goes to |

```
cost → {Number}
```
The cost value of the edge. Usually the distance of from and to

```
destroy() → {Void}
```
Removes from and to values for clearing

```
from → {NavigationNode}
```
The `NavigationNode` to start the edge from

```
to → {NavigationNode}
```
The `NavigationNode` to edge the edge at

```
toString() → {String}
```
Returns a string in the format of `((from.x, from.y),(to.x, to.y))`

##NavigationMesh
```
edges → {Map}
```
A map containing all the edges with the edge.toString() as the key value

```
findGraphPath( start, end ) → {Array.<NavigationPoint,NavigationNode>}
```
Walks the nodes and edges to work out what is the shortest **only** using edges.

| Name | Required | Type            | Description                       |
|------|----------|-----------------|-----------------------------------|
| start    | Yes      | NavigationPoint | The point to start pathfinding from |
| end    | Yes      | NavigationPoint | The point to end pathfinding |

```
getEdgeContaining( nodeA, nodeB ) → {Boolean,NavigationEdge}
```
Returns an edge that contains nodeA and nodeB. If it fails, it will return false.

| Name | Required | Type            | Description                       |
|------|----------|-----------------|-----------------------------------|
| nodeA    | Yes      | NavigationNode | One of the nodes in the edge |
| nodeB    | Yes      | NavigationNode | One of the nodes in the edge |

```
getNeighbours( node ) → {Boolean, Array.<NavigationPoint>}
```
Returns any neighbouring points. If it fails, it will return false.

| Name | Required | Type            | Description                       |
|------|----------|-----------------|-----------------------------------|
| node    | Yes      | NavigationNode | The node whos neighbours we want to know |

```
nodes → {Map}
```
A map containing all the nodes with the node.toString() as the key value

```
parse( structure ) → {Void}
```
Parses the mesh object

| Name | Required | Type            | Description                       |
|------|----------|-----------------|-----------------------------------|
| structure    | Yes      | Object | Mesh data object |

```
path( start, end ) → {Array.<Array.<Number>>}
```
Calculates a path and simplifies

| Name | Required | Type            | Description                       |
|------|----------|-----------------|-----------------------------------|
| start    | Yes      | NavigationPoint | Start point of the path |
| end    | Yes      | NavigationPoint | End point of the path |

```
simplify( path ) → {Array.<NavigationNode,NavigationPoint>}
```
Simplifies the graph network path

| Name | Required | Type            | Description                       |
|------|----------|-----------------|-----------------------------------|
| path    | Yes      | Array.<NavigationNode,NavigationPoint> | Graph network path |

```
points → {Array.<NavigationPoint>}
```
An array containing all the points used by the triangles

```
triangles → {Array.<NavigationTriangle>}
```
An array containing all the triangles in the mesh

##NavigationNode
```
constructor( point )
```
| Name | Required | Type            | Description                       |
|------|----------|-----------------|-----------------------------------|
| point    | No      | NavigationPoint | The position of the node |

```
destroy() → {Void}
```
Clears the edges, points and triangles associated with this node

```
edges → {Set}
```
A set containing the edges linking to this node

```
point → {NavigationPoint}
```
The location of the node

```
toString() → {String}
```
Returns a string in the format of `(x, y)`

```
triangles → {Set}
```
A set containing all the associated triangles to the node

##NavigationPoint
```
clone() → {NavigationPoint}
```
Makes a copy of the current point's location and returns a new one


```
constructor( x = 0, y = 0 )
```
| Name | Required | Type            | Description                       |
|------|----------|-----------------|-----------------------------------|
| x    | No      | Number | The x position of the point |
| y    | No      | Number | The y position of the point |

```
toString() → {String}
```
Returns a string in the format of `(x, y)`

```
x → {Number}
```
The x value of the point

```
y → {Number}
```
The y value of the point

##NavigationTriangle
```
bounds → {Object}
```
Returns the rectangular bounds of the triangle. Bounds contains this information.

| Name | Type            | Description                       |
|------|-----------------|-----------------------------------|
| containsPoint( x<Number>, y<Number> ) → {Boolean} | Function | Returns if the x and y are inside the rectangular bounds |
| height | Number | The height of the bounds |
| width | Number | The width of the bounds |
| x | Number | The x position of the bounds |
| y | Number | The y position of the bounds |

```
constructor( points )
```
| Name | Required | Type            | Description                       |
|------|----------|-----------------|-----------------------------------|
| points    | Yes      | Array.<NavigationPoint> | Three NavigationPoints in an array |

```
containsPoint( x, y ) → {Boolean}
```
Checks to see if the triangle contains the x, y

| Name | Required | Type            | Description                       |
|------|----------|-----------------|-----------------------------------|
| x    | Yes      | Number | The x position |
| y    | Yes      | Number | The y position |

```
points → {Array.<NavigationPoint>}
```
Returns or sets the triangle points

##NavigationUtils

```
distance( a, b ) → {Boolean}
```
Measures the distance from point a to point b

| Name | Required | Type            | Description                       |
|------|----------|-----------------|-----------------------------------|
| a    | Yes      | NavigationPoint | The point to start measuring from |
| b    | Yes      | NavigationPoint | The point to measure to           |
  
```
heuristic( a, b ) → {Number}
```
Works out the heuristic value from point a to point b

| Name | Required | Type            | Description                       |
|------|----------|-----------------|-----------------------------------|
| a    | Yes      | NavigationPoint | The point to start the heuristic value from |
| b    | Yes      | NavigationPoint | The point to get the heuristic to           |

```
lineIntersection( point1, point2, point3, point4 ) → {Boolean}
```
Calculates if line1 (point1, point2) intersects with line2 (point3, point4)

| Name | Required | Type            | Description                       |
|------|----------|-----------------|-----------------------------------|
| point1    | Yes      | NavigationPoint | Starting point of line1 |
| point2    | Yes      | NavigationPoint | End point of line1 |
| point3    | Yes      | NavigationPoint | Starting point of line2 |
| point4    | Yes      | NavigationPoint | End point of line2 |