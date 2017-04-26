/**
 * This module makes sure attributes are stripped on external paste.
 */
export default function( editor ) {
	editor.on( 'BeforePastePreProcess', event => {
		if ( event.internal ) {
			return;
		}

		[ 'id', 'class', 'style' ].forEach( attribute => {
			event.content = event.content.replace(
				new RegExp( '(<[^>]+) ' + attribute + '="[^"]*"([^>]*>)', 'gi' ),
				'$1$2'
			);
		} );
	} );
}
