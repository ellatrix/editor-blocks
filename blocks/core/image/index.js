import { defaults } from 'lodash';

import filePicker from '../../../ui/filepicker';

import { registerBlock } from '../../api';

const defaultProps = {
	align: 'center',
	alt: '',
	src: '',
	caption: []
};

function render( props ) {
	defaults( props, defaultProps );

	return (
		[ 'figure', { 'data-editable': false, class: 'align' + props.align },
			( ! props.src ?
				[ 'div', {
					class: 'wp-blocks-placeholder',
					onClick: onClick
				},
					[ 'svg', { width: '48', height: '48' },
						[ 'use', {
							'xmlns:xlink': 'http://www.w3.org/1999/xlink',
							'xlink:href': 'vendor/gridicons.svg#gridicons-add-outline'
						} ]
					],
					[ 'p', 'Pick image' ]
				] :
				[ 'img', { alt: props.alt, src: props.src } ]
			),
			[ 'figcaption', {
				'data-editable': true,
				'data-enter': false,
				placeholder: 'Write caption\u2026'
			},
				...props.caption
			]
		]
	);
}

function save( props ) {
	defaults( props, defaultProps );

	if ( props.src ) {
		return (
			[ 'figure', { class: 'align' + props.align },
				[ 'img', { alt: props.alt, src: props.src } ],
				props.caption.length ? [ 'figcaption', ...props.caption ] : null
			]
		);
	}
}

function getProps( content, h ) {
	return {
		align: h.getClass( content, 'align' ),
		alt:  h.getAttribute( h.find( content, 'img' ), 'alt' ),
		src: h.getAttribute( h.find( content, 'img' ), 'src' ),
		caption: h.getChildren( h.find( content, 'figcaption' ) )
	};
}

function onClick( props, callback ) {
	filePicker( false, 'image/*' )
		.then( function( files ) {
			if ( ! files || ! files.length ) {
				return;
			}

			if ( files[0].type.indexOf( 'image/' ) !== 0 ) {
				return;
			}

			callback( { src: URL.createObjectURL( files[0] ) } );
		} )
		.catch( function() {} );
}

registerBlock( {
	name: 'image',
	namespace: 'wp',
	displayName: 'Image',
	type: 'media',
	icon: 'image',
	controls: [
		[
			...[ 'left', 'center', 'right', 'full' ].map( align => ( {
				icon: 'align-image-' + align,
				props: { align }
			} ) )
		]
	],
	getProps: getProps,
	render: render,
	save: save
} );
