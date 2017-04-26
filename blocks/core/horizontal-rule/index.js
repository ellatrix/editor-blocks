import { registerBlock } from '../../api';

registerBlock( {
	name: 'hortizontal-rule',
	namespace: 'wp',
	displayName: 'Horizontal Rule',
	elements: [ 'hr' ],
	type: 'separator',
	icon: 'minus',
	getProps: () => ( {} ),
	render: () => [ 'hr', { 'data-editable': false } ]
} );
