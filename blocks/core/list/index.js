import {
	assign,
	concat,
	defaults,
	forEach,
	indexOf,
	isPlainObject,
	last,
	map
} from 'lodash';

import { registerBlock } from '../../api';

function render( props ) {
	defaults( props, {
		name: 'ul',
		items: [
			[]
		]
	} );

	return (
		[ props.name,
			...map( props.items, function( item ) {
				return [ 'li', ...map( item, function( child ) {
					if ( isPlainObject( child ) ) {
						return render( assign( child, {
							name: props.name
						} ) );
					}

					return child;
				} ) ];
			} )
		]
	);
}

function getProps( content, h ) {
	return {
		name: h.getName( content ),
		items: map( h.getChildren( content ), function( item ) {
			return map( h.getChildren( item ), function( child ) {
				if ( indexOf( [ 'ul', 'ol' ], h.getName( child ) ) !== -1 ) {
					return getProps( child, h );
				}

				return child;
			} );
		} )
	}
}

function fromBaseState( list, h ) {
	var result = [ 'ul', [ 'li' ] ];

	forEach( list, function( element, i ) {
		if ( i ) {
			result.push( [ 'li' ] );
		}

		forEach( h.getChildren( element ), function( child ) {
			if ( h.getName( child ) === 'br' ) {
				result.push( [ 'li' ] );
			} else {
				last( result ).push( child );
			}
		} );
	} );

	return result;
}

function toBaseState( element, h ) {
	function unwrap( items ) {
		var children = [];

		forEach( items, function( item, i ) {
			if ( i ) {
				children.push( [ 'br' ] );
			}

			forEach( h.getChildren( item ), function( child ) {
				if ( indexOf( [ 'ul', 'ol' ], h.getName( child ) ) !== -1 ) {
					children.push( [ 'br' ] );
					children = concat( children, unwrap( h.getChildren( child ) ) )
				} else {
					children.push( child );
				}
			} );
		} );

		return children;
	}

	return concat( [ 'p' ], unwrap( h.getChildren( element ) ) );
}

registerBlock( {
	name: 'list',
	namespace: 'wp',
	displayName: 'List',
	elements: [ 'ul', 'ol' ],
	type: 'text',
	icon: 'list-unordered',
	toBaseState: toBaseState,
	fromBaseState: fromBaseState,
	controls: [
		[ 'text-switcher' ],
		[
			{
				icon: 'list-unordered',
				props: { name: 'ul' }
			},
			{
				icon: 'list-ordered',
				props: { name: 'ol' }
			}
		]
	],
	getProps: getProps,
	render: render
} );
