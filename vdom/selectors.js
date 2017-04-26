import {
	assign,
	concat,
	drop,
	isArray,
	isEmpty,
	isEqual,
	isPlainObject,
	isString,
	remove,
	tail,
	take
} from 'lodash';

export function create() {
	return Array.from( arguments );
}

export function isText( vNode ) {
	return isString( vNode );
}

export function isElement( vNode ) {
	return isArray( vNode ) && isString( vNode[ 0 ] );
}

export function getName( vNode ) {
	if ( isElement( vNode ) ) {
		return vNode[ 0 ];
	}
}

export function setName( vNode, name ) {
	if ( isElement( vNode ) ) {
		return concat( [ name ], tail( vNode ) )
	}

	return vNode;
}

export function hasAttributes( vNode ) {
	return isElement( vNode ) && isPlainObject( vNode[ 1 ] ) && ! isEmpty( vNode[ 1 ] );
}

export function getAttributes( vNode ) {
	if ( hasAttributes( vNode ) ) {
		return assign( {}, vNode[ 1 ] );
	}

	return {};
}

export function getAttribute( vNode, name ) {
	return getAttributes( vNode )[ name ];
}

export function setAttributes( vNode, attributes ) {
	return [
		getName( vNode ),
		assign( {}, getAttributes( vNode ), attributes ),
		...getChildren( vNode )
	];
}

/**
 * Return the last class based on a prefix.
 *
 * @param  VNode  vNode  Content to operate on.
 * @param  String prefix Prefix of the class value.
 * @return String        Class value.
 */
export function getClass( vNode, prefix ) {
	var classes = ( getAttribute( vNode, 'class' ) || '' ).split( /\s+/ );
	var i = classes.length;

	while ( i-- ) {
		if ( classes[ i ].indexOf( prefix ) === 0 ) {
			return classes[ i ].slice( prefix.length );
		}
	}
}

/**
 * Set the classes based on a prefix.
 *
 * @param  VNode  vNode  Content to operate on.
 * @param  String prefix Prefix of the class value.
 * @param  String value  New class value.
 * @return VNode         New VNode.
 */
export function setClass( vNode, prefix, value ) {
	var classes = ( getAttribute( vNode, 'class' ) || '' ).split( /\s+/ );
	var i = classes.length;

	while ( i-- ) {
		if ( classes[ i ].indexOf( prefix ) === 0 ) {
			classes.splice( i, 1 );
		}
	}

	classes.push( prefix + value );

	return setAttributes( vNode, {
		class: classes.join( ' ' )
	} );
}

export function getChildren( vNode ) {
	if ( isElement( vNode ) ) {
		if ( isPlainObject( vNode[ 1 ] ) ) {
			return drop( vNode, 2 );
		}

		return drop( vNode );
	}

	return [];
}

export function getChild( vNode, index ) {
	return getChildren( vNode )[ index ];
}

export function setChildren( vNode, children ) {
	if ( isElement( vNode ) ) {
		if ( isPlainObject( vNode[ 1 ] ) ) {
			return concat( take( vNode, 2 ), children );
		}

		return concat( take( vNode ), children );;
	}

	return vNode;
}

export function hasChildren( vNode ) {
	return getChildren( vNode ).length === 0;
}

export function find( vNode, name ) {
	var children = getChildren( vNode );
	var i = children.length;
	var found;

	while ( i-- ) {
		if ( getName( children[ i ] ) === name ) {
			return children[ i ];
		} else {
			found = find( children[ i ], name );

			if ( found ) {
				return found;
			}
		}
	}
}

export function isEmptyNode( vNode ) {
	if ( isText( vNode ) ) {
		return false;
	}

	if ( getName( vNode ) === 'br' ) {
		return false;
	}

	const children = getChildren( vNode );

	if ( ! children.length ) {
		return true;
	}

	remove( children, child => ! child || isEqual( child, [ 'br' ] ) )

	return ! children.length;
}
