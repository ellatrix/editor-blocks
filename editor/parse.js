import * as api from '../blocks/api';

export default function( editor ) {
	editor.on( 'preinit', () =>
		editor.parser.addNodeFilter( '#comment', comments =>
			comments.forEach( comment => {
				const value = comment.value.trim();

				if ( value === '/wp' ) {
					comment.remove();
					return;
				}

				let namespace;
				let name;
				let attributes = {};

				value.split( /\s+/ ).forEach( ( piece, i ) => {
					let pair = piece.split( ':' );

					if ( ! pair.length === 2 ) {
						return;
					}

					if ( i === 0 ) {
						namespace = pair[ 0 ];
						name = pair[ 1 ];
					} else {
						attributes[ pair[ 0 ] ] = pair[ 1 ];
					}
				} );

				if ( ! namespace || ! name ) {
					return;
				}

				const next = comment.next;
				const settings = api.getBlockSettings( namespace + ':' + name );

				if ( next.type === 1 && ! ( settings && settings.elements ) ) {
					next.attr( 'data-wp-block-type', namespace + ':' + name );

					if ( next.name === 'p' && next.firstChild &&
						next.firstChild === next.lastChild &&
						! editor.schema.getBlockElements()[ next.firstChild ] ) {
						next.name = 'figure';
					}
				}

				comment.remove();
			} )
		)
	);
}
