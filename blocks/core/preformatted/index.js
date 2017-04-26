import { defaults, map } from 'lodash';

import { registerBlock } from '../../api';

function fromBaseState( list, h ) {
	return map( list, function( element ) {
		return render( { content: h.getChildren( element ) } );
	} );
}

function toBaseState( element, h ) {
	return [ 'p', ...h.getChildren( element ) ]
}

function render( props ) {
	defaults( props, {
		content: []
	} );

	return [ 'pre', { placeholder: 'Write preformatted text\u2026' }, ...props.content ];
}

function getProps( content, h ) {
	return {
		content: h.getChildren( content )
	};
}

registerBlock( {
	name: 'preformatted',
	namespace: 'wp',
	displayName: 'Preformatted',
	elements: [ 'pre' ],
	type: 'text',
	icon: 'code',
	controls: [
		[ 'text-switcher' ],
		[
			{ icon: 'cog' }
		]
	],
	fromBaseState: fromBaseState,
	toBaseState: toBaseState,
	getProps: getProps,
	render: render
} );
