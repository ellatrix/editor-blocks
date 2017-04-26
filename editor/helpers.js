import { drop } from 'lodash';

// import * as h from '../vdom/selectors';

export function getChildIndex( child ) {
	var parent = child.parentNode;
	var i = parent.childNodes.length;

	while ( i-- ) {
		if ( child === parent.childNodes[ i ] ) {
			return i;
		}
	}
}

// export function getChildNodeByIndex( index, parentNode ) {
// 	return rootNode.childNodes[ index ];
// }

export function findNodeWithPath( path, rootNode ) {
	var childNodes = rootNode.childNodes;
	var index = path[ 0 ];

	if ( index != null && childNodes ) {
		var node = childNodes[ index ];

		if ( node ) {
			if ( node.nodeType === 3 ) {
				return node;
			} else {
				path = drop( path );

				if ( path.length ) {
					return findNodeWithPath( path, node );
				}

				return node;
			}
		}
	}

	return rootNode;
}

// export function mapPathToNodes( path, rootNode ) {
// 	return compact( map( path, function( index ) {
// 		var node = rootNode.childNodes[ index ];

// 		if ( node && node.nodeType === 1 ) {
// 			rootNode = node;

// 			return node;
// 		}
// 	} ) );
// }

export function createSelectionPath( range, startNode, endNode, isCollapsed, rootNode ) {
	var start = [];
	var end = [];

	if ( range.startContainer !== rootNode ) {
		start.push( range.startOffset );
	}

	if ( range.endContainer !== rootNode ) {
		end.push( range.endOffset );
	}

	if ( range.startContainer.nodeType === 3 ) {
		startNode = range.startContainer;
	}

	if ( range.endContainer.nodeType === 3 ) {
		endNode = range.endContainer;
	}

	while ( startNode !== rootNode ) {
		start.unshift( getChildIndex( startNode ) )
		startNode = startNode.parentNode;
	}

	while ( endNode !== rootNode ) {
		end.unshift( getChildIndex( endNode ) )
		endNode = endNode.parentNode;
	}

	// Browser selected start (0) of next node. We'll have to correct it.
	if ( ! isCollapsed && end.length > 1 && end[ end.length - 1 ] === 0 ) {
		// Find the first non zero index.
		var i = end.length;

		while ( i-- ) {
			if ( end[ i ] !== 0 ) {
				break;
			}
		}

		// Move one up the tree.
		end[ i ] = end[ i ] - 1;

		// Drop all 0 values.
		end.splice( i + 1 );

		// Fill with contents.

		var node = findNodeWithPath( end, rootNode );

		while ( node.lastChild ) {
			end.push( node.childNodes.length - 1 )
			node = node.lastChild;
		}

		if ( node.nodeType === 3 ) {
			end.push( node.nodeValue.length - 1 )
		}
	}

	return {
		start: start,
		end: end,
		isCollapsed: isCollapsed
	}
}

export function getParentBlock( node, rootNode ) {
	if ( ! rootNode.contains( node ) ) {
		return;
	}

	if ( node === rootNode ) {
		return;
	}

	while ( node.parentNode !== rootNode ) {
		node = node.parentNode;
	}

	return node;
}

// export function getEditableRoot( node, rootNode ) {
// 	while ( node !== rootNode ) {
// 		if ( node.contentEditable === 'true' ) {
// 			return node;
// 		}

// 		node = node.parentNode;
// 	}
// }

// export function getPathAtMarker( state, marker ) {
// 	if ( h.isText( state ) ) {
// 		var index = state.indexOf( marker );
// 		return index === -1 ? false : [ index ];
// 	} else {
// 		if ( h.isElement( state ) ) {
// 			state = h.getChildren( state );
// 		}

// 		var i = state.length;
// 		var path;

// 		while ( i-- ) {
// 			path = getPathAtMarker( state[ i ], marker );

// 			if ( path ) {
// 				return [ i ].concat( path );
// 			}
// 		}

// 		return false;
// 	}
// }
