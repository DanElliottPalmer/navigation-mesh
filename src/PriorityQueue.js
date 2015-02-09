/**
 * Based from here:
 * http://algs4.cs.princeton.edu/24pq/
 */

class PriorityQueue {

	constructor(){
		this.heap = [ null ];
	}

	get length(){
		return this.heap.length - 1;
	}

	less( a, b ){
		return this.heap[ a ].priority < this.heap[ b ].priority;
	}

	pop(){
		let value = this.heap[ 1 ].value;
		this.heap[ 1 ] = this.heap.pop();
		this.sink( 1 );
		return value;
	}

	push( value, priority ){
		let item = new PriorityQueueItem( value, priority );
		this.heap.push( item );
		this.swim( this.length );
	}

	sink( k ){
		let j = k << 1;
		while( j <= this.length ){
			if( j < this.length && this.less( j, j + 1 ) ){
				j++;
			}
			if( !this.less( k, j ) ) break;
			this.swap( k, j );
			k = j;
		}
	}

	swap( a, b ){
		let tmp = this.heap[ a ];
		this.heap[ a ] = this.heap[ b ];
		this.heap[ b ] = tmp;
	}

	swim( k ){
		let j = 0;
		while( k > 1 ){
			j = k >> 1;
			if( !this.less( j, k ) ) break;
			this.swap( k, j );
			k = j;
		}
	}

}

class PriorityQueueItem {

	constructor( value, priority ){
		this.priority = priority;
		this.value = value;
	}

}