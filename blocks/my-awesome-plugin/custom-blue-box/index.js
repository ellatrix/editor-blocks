import { defaults } from 'lodash';

import { registerBlock } from '../../api';

import './structure.css';

function render( props ) {
	defaults( props, {
		content: [
			[ 'p' ]
		]
	} );

	return (
		[ 'section', { 'data-editable': false },
			[ 'div', {
				'data-editable': true,
				placeholder: 'Write in the magic box! ✨'
			},
				...props.content
			]
		]
	);
}

function getProps( content, h ) {
	return {
		content: h.getChildren( content )
	}
}

function fromBaseState( list ) {
	return render( { content: list } )
}

function toBaseState( element, h ) {
	return h.getChildren( element );
}

registerBlock( {
	name: 'custom-blue-box',
	namespace: 'my-awesome-plugin',
	displayName: 'Custom Box',
	icon: 'custom-post-type',
	type: 'text',
	fromBaseState: fromBaseState,
	toBaseState: toBaseState,
	controls: [
		[ 'text-switcher' ]
	],
	getProps: getProps,
	render: render
} );
