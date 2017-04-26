import { defaults, filter, map } from 'lodash';

import filePicker from '../../../ui/filepicker';

import { registerBlock } from '../../api';

import './structure.css';

const defaultProps = {
	align: 'center',
	items: [
		{ alt: '', src: '', caption: [] },
		{ alt: '', src: '', caption: [] }
	]
};

function createOnClick( index ) {
	return function( props, callback ) {
		return onClick( props, callback, index );
	}
}

function onClick( props, callback, index ) {
	filePicker( false, 'image/*' )
		.then( function( files ) {
			if ( ! files || ! files.length ) {
				return;
			}

			if ( files[0].type.indexOf( 'image/' ) !== 0 ) {
				return;
			}

			props.items[ index ] = {
				alt: '',
				src: URL.createObjectURL( files[0] ),
				caption: []
			};

			callback( props );
		} )
		.catch( function() {} );
}

function getProps( content, h ) {
	return {
		align: h.getClass( content, 'align' ),
		items: map( h.getChildren( content ), function( item ) {
			return {
				alt:  h.getAttribute( h.find( item, 'img' ), 'alt' ),
				src: h.getAttribute( h.find( item, 'img' ), 'src' ),
				caption: h.getChildren( h.find( item, 'figcaption' ) )
			};
		} )
	}
}

function render( props ) {
	defaults( props, defaultProps );

	return (
		[ 'figure', {
			class: 'align' + props.align,
			'data-editable': false,
			'data-wp-block-setting-column': props.items.length
		},
			...map( props.items, function( item, i ) {
				return (
					[ 'figure',
						( ! item.src ?
							[ 'div', {
								class: 'wp-blocks-placeholder',
								onClick: createOnClick( i )
							},
								[ 'svg', { width: '48', height: '48' },
									[ 'use', {
										'xmlns:xlink': 'http://www.w3.org/1999/xlink',
										'xlink:href': 'vendor/gridicons.svg#add-outline'
									} ]
								],
								[ 'p', 'Pick image' ]
							] :
							[ 'img', { alt: item.alt, src: item.src } ]
						),
						[ 'figcaption', {
							'data-editable': true,
							'data-enter': false,
							placeholder: 'Write caption\u2026'
						},
							...item.caption
						]
					]
				);
			} )
		]
	);
}

function save( props ) {
	defaults( props, defaultProps );

	var items = filter( props.items, function( item ) {
		return item.src;
	} );

	if ( items.length ) {
		return (
			[ 'figure', {
				class: 'align' + props.align,
				'data-wp-block-setting-column': items.length
			},
				...map( items, function( item ) {
					return (
						[ 'figure',
							[ 'img', { alt: item.alt, src: item.src } ],
							item.caption.length ? [ 'figcaption', ...item.caption ] : null
						]
					);
				} )
			]
		);
	}
}

registerBlock( {
	name: 'gallery',
	namespace: 'wp',
	displayName: 'Gallery',
	type: 'media',
	keywords: [],
	icon: 'image-multiple',
	controls: [
		[
			...[ 'left', 'center', 'right', 'full' ].map( align => ( {
				icon: 'align-image-' + align,
				props: { align }
			} ) ),
			{
				icon: 'cog',
				onClick: function() {}
			}
		]
	],
	getProps: getProps,
	render: render,
	save: save
} );
