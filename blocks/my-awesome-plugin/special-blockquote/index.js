import { extendBlock } from '../../api';

import './structure.css';

extendBlock( {
	extends: 'elements:blockquote',
	name: 'special-blockquote',
	namespace: 'my-awesome-plugin',
	displayName: 'Special Quote',
	icon: 'gridicons-quote'
} );
