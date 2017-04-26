/**
 * Redux middleware for scrolling.
 */

import { first, last } from 'lodash';

import { getRootNode, getBlockNode } from '../editor';

export default ( { getState } ) => next => action => {
	if ( action.type === 'MOVE_BLOCKS_UP' ) {
		let firstIndex = first( action.indices );
		let prevIndex = firstIndex - 1;

		if ( prevIndex >= 0 ) {
			let firstNode = getBlockNode( firstIndex, getRootNode() );
			let prevNode = getBlockNode( prevIndex, getRootNode() );
			let firstNodeRect = firstNode.getBoundingClientRect();
			let prevNodeRect = prevNode.getBoundingClientRect();

			window.scrollBy( 0, prevNodeRect.top - firstNodeRect.top );
		}
	}

	if ( action.type === 'MOVE_BLOCKS_DOWN' ) {
		let lastIndex = last( action.indices );
		let nextIndex = lastIndex + 1;

		if ( nextIndex <= getState().content.length ) {
			let lastNode = getBlockNode( lastIndex, getRootNode() );
			let nextNode = getBlockNode( nextIndex, getRootNode() );
			let lastNodeRect = lastNode.getBoundingClientRect();
			let nextNodeRect = nextNode.getBoundingClientRect();

			window.scrollBy( 0, nextNodeRect.top + lastNodeRect.top );
		}
	}

	console.log( action );

	return next( action );
}
