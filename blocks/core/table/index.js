import { defaults } from 'lodash';

import { registerBlock } from '../../api';

const defaultProps = {
	align: 'center',
	caption: []
};

function render( props ) {
	defaults( props, defaultProps );

	return (
		[ 'figure', { 'data-editable': false, class: 'align' + props.align },
			[ 'table', {
				'data-editable': true,
				'data-enter': false
			},
				[ 'tr',
					[ 'td' ],
					[ 'td' ]
				],
				[ 'tr',
					[ 'td' ],
					[ 'td' ]
				]
			],
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

function getProps( content, h ) {
	return {
		align: h.getClass( content, 'align' ),
		caption: h.getChildren( h.find( content, 'figcaption' ) )
	};
}

registerBlock( {
	name: 'table',
	namespace: 'wp',
	displayName: 'Table',
	type: 'data visualisation',
	icon: 'grid',
	getProps: getProps,
	render: render,
	controls: [
		[
			...[ 'left', 'center', 'right', 'full' ].map( align => ( {
				icon: 'align-image-' + align,
				props: { align }
			} ) )
		]
	]
} );
