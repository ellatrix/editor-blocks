import { clone, drop, filter, first } from 'lodash';

import * as h from '../vdom/selectors';

export function getSelectedBlockIndex( state ) {
	var start = state.selection.start;
	var end = state.selection.end;

	if ( start[ 0 ] === end[ 0 ] && state.content[ start[ 0 ] ] ) {
		return start[ 0 ];
	}

	return -1;
}

export function getSelectedBlockIndices( state ) {
	var start = state.selection.start[ 0 ];
	var end = state.selection.end[ 0 ];
	var indices = [];

	if ( start != null ) {
		indices.push( start );

		while ( start !== end ) {
			start++;
			indices.push( start );
		}
	}

	return indices;
}

export function getSelectedBlockContent( state ) {
	var index = getSelectedBlockIndex( state );

	if ( index !== -1 ) {
		return state.content[ index ];
	}
}

export function hasPreviousBlock( state ) {
	var indices = getSelectedBlockIndices( state );

	if ( indices.length ) {
		return !! state.content[ indices[ 0 ] - 1 ];
	}

	return false;
}

export function hasNextBlock( state ) {
	var indices = getSelectedBlockIndices( state );

	if ( indices.length ) {
		return !! state.content[ indices[ indices.length - 1 ] + 1 ];
	}

	return false;
}

export function isSelectedBlockEmptySlot( state ) {
	var index = getSelectedBlockIndex( state );

	if ( index !== -1 ) {
		return (
			h.getName( state.content[ index ] ) === 'p' &&
			h.isEmptyNode( state.content[ index ] )
		);
	}
}

export function isUIShown( state ) {
	return state.showUI;
}

export function isInserterShown( state ) {
	return state.showInserter;
}

export function isDragging( state ) {
	return !! state.dragData;
}

export function getDragData( state ) {
	return state.dragData;
}

export function getHoverIndex( state ) {
	return state.hoverIndex;
}

export function isCollapsed( state ) {
	return state.selection.isCollapsed;
}

export function getCommonSelectionPath( state ) {
	var pointer = state.content;
	var diverged;

	return filter( state.selection.start, function( index, i ) {
		var content = pointer && pointer[ index ];

		if ( ! diverged && content && h.isElement( content ) && index === state.selection.end[ i ] ) {
			pointer = h.getChildren( content )
			return content;
		} else {
			diverged = true;
		}
	} );
}

/**
 * Selection path without string index.
 */
export function getSelectedNodePath( state ) {
	var pointer = state.content;

	return filter( state.selection.start, function( index ) {
		var content = pointer && pointer[ index ];

		if ( content ) {
			pointer = h.getChildren( content )
			return content;
		}
	} );
}

export function getContent( state, index ) {
	if ( index != null && index !== -1 ) {
		return state.content[ index ];
	}

	return state.content;
}

export function getContentWithMarkers( state, index ) {
	var content = _insertMarkersAtPath( getContent( state ), state.selection.start, '\u0086' );

	if ( index != null && index !== -1 ) {
		return content[ index ];
	}

	return content;
}

export function _insertMarkersAtPath( content, path, marker ) {
	var index = first( path );

	function map( element, i ) {
		if ( i === index ) {
			return _insertMarkersAtPath( element, drop( path ), marker );
		}

		return element;
	}

	if ( h.isText( content ) ) {
		return content.slice( 0, index ) + marker + content.slice( index );
	} else if ( h.isElement( content ) ) {
		return h.setChildren( content, map( h.getChildren( content ), map ) );
	}

	return map( content, map );
}

export function isCurrentNodeEmpty( state ) {
	var selection = state.selection;
	var path = clone( selection.start );
	var index = path.shift();
	var pointer = state.content;
	var element;

	if ( ! selection.isCollapsed ) {
		return false;
	}

	while ( index != null && pointer.length ) {
		element = pointer[ index ];

		if ( h.isElement( element ) && h.isEmptyNode( element ) ) {
			return true;
		}

		index = path.shift();
		pointer = h.getChildren( element );
	}

	return false;
}

export function getSelection( state ) {
	return state.selection;
}
