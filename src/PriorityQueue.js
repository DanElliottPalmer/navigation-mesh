/**
 * Based from here:
 * http://algs4.cs.princeton.edu/24pq/
 */

class PriorityQueue {

	constructor( comparator ){
		this._comparator = typeof comparator === "function" ? comparator : function( a, b ){
			return this.heap[ a ].priority < this.heap[ b ].priority;
		};
		this.heap = [ null ];
	}

	get length(){
		return this.heap.length - 1;
	}

	pop(){
		if( this.length === 0 ) return;
		let value = this.heap[ 1 ].value;
		let last = this.heap.pop();
		if( this.length === 0 ) return value;		
		this.heap[ 1 ] = last;
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
			if( j < this.length && this._comparator( j, j + 1 ) ){
				j++;
			}
			if( !this._comparator( k, j ) ) break;
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
			if( !this._comparator( j, k ) ) break;
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