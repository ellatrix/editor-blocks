/**
 * This module manages `contenteditable` attributes.
 */

const { ENTER, BACKSPACE } = window.tinymce.util.VK;

const editableAttribute = 'data-editable';
const enterAttribute = 'data-enter';

function getEditableField( node, rootNode ) {
	while ( node !== rootNode ) {
		if ( node.getAttribute && node.getAttribute( editableAttribute ) === 'true' ) {
			return node;
		}

		node = node.parentNode;
	}
}

export default function( editor ) {
	editor.on( 'mousedown touchstart', ( { target } ) => {
		const rootNode = editor.getBody();
		const editable = getEditableField( target, rootNode );

		editor.$( '*[' + editableAttribute +']' ).attr( 'contenteditable', null );

		if ( editable ) {
			rootNode.contentEditable = 'inherit';
			editable.contentEditable = 'true';
		} else {
			rootNode.contentEditable = 'true';
			editor.$( '*[' + editableAttribute +'=false]' ).attr( 'contenteditable', 'false' );
		}
	} );

	editor.on( 'keydown', ( { keyCode, target, preventDefault, stopImmediatePropagation } ) => {
		if ( keyCode === ENTER ) {
			if ( target.getAttribute( enterAttribute ) === 'false' ) {
				preventDefault();
				stopImmediatePropagation();
			}
		}

		if ( keyCode === BACKSPACE ) {
			if ( target.getAttribute( editableAttribute ) === 'true' ) {
				if ( editor.dom.isEmpty( target ) ) {
					preventDefault();
					stopImmediatePropagation();
				}
			}
		}
	}, true );
}
