/** @jsx Array */

import { defaults, map } from 'lodash';

import { registerBlock } from '../../api';

const defaultProps = {
	name: 'h1',
	content: []
}

function fromBaseState( list, h ) {
	return map( list, function( element ) {
		return render( { content: h.getChildren( element ) } );
	} );
}

function toBaseState( element, h ) {
	return [ 'p', ...h.getChildren( element ) ]
}

function render( props ) {
	defaults( props, defaultProps );

	return [ props.name, { placeholder: 'Write heading\u2026' }, ...props.content ];
}

function save( props ) {
	defaults( props, defaultProps );

	return [ props.name, ...props.content ];
}

function getProps( content, h ) {
	return {
		name: h.getName( content ),
		content: h.getChildren( content )
	};
}

registerBlock( {
	name: 'heading',
	namespace: 'wp',
	displayName: 'Heading',
	elements: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
	type: 'text',
	icon: 'heading',
	controls: [
		[ 'text-switcher' ],
		[
			...'123456'.split( '' ).map( level => ( {
				icon: 'heading',
				text: level,
				props: {
					name: 'h' + level
				}
			} ) )
		]
	],
	toBaseState: toBaseState,
	fromBaseState: fromBaseState,
	getProps: getProps,
	render: render,
	save
} );
