import { defaults, filter } from 'lodash';

import { registerBlock } from '../../api';

import './structure.css';

const defaultProps = {
	content: [
		[ 'p' ]
	],
	footer: []
}

function render( props ) {
	defaults( props, defaultProps );

	return (
		[ 'blockquote', { 'data-editable': false },
			[ 'div', {
				'data-editable': true,
				placeholder: 'Write quote\u2026'
			},
				...props.content
			],
			[ 'footer', {
				'data-editable': true,
				'data-enter': false,
				placeholder: 'Write citation\u2026'
			},
				...props.footer
			]
		]
	);
}

function save( props ) {
	defaults( props, defaultProps );

	if ( props.content.length ) {
		return (
			[ 'blockquote',
				...props.content,
				props.footer.length ? [ 'footer', ...props.footer ] : null
			]
		);
	}
}

function getProps( content, h ) {
	var footer = h.getChildren( h.find( content, 'footer' ) );
	var content = filter( h.getChildren( content ), function( child ) {
		return h.getName( child ) !== 'footer';
	} );

	if ( content.length === 1 && h.getName( content[0] ) === 'div' ) {
		content = h.getChildren( content[0] )
	}

	return {
		content: content,
		footer: footer
	};
}

function fromBaseState( list ) {
	return render( { content: list } )
}

function toBaseState( element, h ) {
	element = h.find( element, 'div' ) || element;

	return filter( h.getChildren( element ), function( child ) {
		return h.getName( child ) !== 'footer';
	} );
}

registerBlock( {
	name: 'quote',
	namespace: 'wp',
	displayName: 'Quote',
	elements: [ 'blockquote' ],
	type: 'text',
	icon: 'quote',
	controls: [
		[ 'text-switcher' ]
	],
	fromBaseState: fromBaseState,
	toBaseState: toBaseState,
	getProps: getProps,
	render: render,
	save: save
} );
