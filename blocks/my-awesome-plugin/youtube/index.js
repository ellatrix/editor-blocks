import { defaults } from 'lodash';

import { registerBlock } from '../../api';

import './structure.css';

const defaultProps = {
	align: 'center',
	src: '',
	caption: []
};

function render( props ) {
	defaults( props, defaultProps );

	return (
		[ 'figure', { 'data-editable': false, class: 'align' + props.align },
			( ! props.src ?
				[ 'div', {
					class: 'wp-blocks-placeholder'
				},
					[ 'svg', { width: '48', height: '48' },
						[ 'use', {
							'xmlns:xlink': 'http://www.w3.org/1999/xlink',
							'xlink:href': 'vendor/gridicons.svg#gridicons-add-outline'
						} ]
					],
					[ 'p', 'Paste YouTube link here' ]
				] :
				[ 'iframe', { src: props.src } ]
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
				[ 'iframe', { src: props.src } ],
				props.caption.length ? [ 'figcaption', ...props.caption ] : null
			]
		);
	}
}

function getProps( content, h ) {
	return {
		align: h.getClass( content, 'align' ),
		src: h.getAttribute( h.find( content, 'iframe' ), 'src' ),
		caption: h.getChildren( h.find( content, 'figcaption' ) )
	}
}

function onPaste( content ) {
	var regEx = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^?&]+).*/;
	var matches = regEx.exec( content );

	if ( matches && matches.length ) {
		return {
			src: 'https://www.youtube.com/embed/' + matches[1]
		};
	}
}

registerBlock( {
	name: 'embed',
	namespace: 'wp',
	displayName: 'YouTube Video',
	type: 'media',
	keywords: [],
	icon: 'video',
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
	save: save,
	onPaste
} );
