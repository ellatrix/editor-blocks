import { defaults } from 'lodash';

import { registerBlock } from '../../api';

const defaultProps = {
	align: null,
	content: []
};

function fromBaseState( list ) {
	return list;
}

function toBaseState( element ) {
	return element;
}

function render( props ) {
	defaults( props, defaultProps );

	return (
		[ 'p', { class: props.align ? 'text-align-' + props.align : null },
			...props.content
		]
	);
}

function getProps( content, h ) {
	return defaults( {
		align: h.getClass( content, 'text-align-' ),
		content: h.getChildren( content )
	}, defaultProps );
}

registerBlock( {
	name: 'text',
	namespace: 'wp',
	displayName: 'Paragraph',
	elements: [ 'p' ],
	type: 'text',
	section: 'text',
	icon: 'paragraph',
	controls: [
		[ 'text-switcher' ],
		[
			{
				icon: 'align-left',
				props: { align: null }
			},
			{
				icon: 'align-center',
				props: { align: 'center' }
			},
			{
				icon: 'align-right',
				props: { align: 'right' }
			}
		]
	],
	fromBaseState: fromBaseState,
	toBaseState: toBaseState,
	getProps: getProps,
	render: render
} );
