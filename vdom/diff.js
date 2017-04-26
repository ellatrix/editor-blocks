import { forEach, forOwn } from 'lodash';

import { toNode } from './converters';
import * as h from './selectors';

function log() {
	window.console.log( ...arguments );
}

const ignoredAttributes = [ 'contenteditable' ];

/**
 * Given a Node and a VNode, the node is updated with some basic diffing to avoid a full replacement if possible.
 *
 * @param  {Node}     node         The node to update.
 * @param  {vNode}    vNode        The vNode to update from.
 * @param  {Function} eventHandler Function to handle event attributes.
 */
export default function diff( node, vNode, eventHandler ) {
	if ( h.isText( vNode ) && node.nodeType === 3 ) {
		if ( vNode !== node.nodeValue ) {
			node.nodeValue = vNode;
			log( 'diff: set text node', vNode );
		}
	} else {
		var name = h.getName( vNode );
		var attributes = h.getAttributes( vNode );
		var children = h.getChildren( vNode );

		if ( name !== node.nodeName.toLowerCase() || children.length !== node.childNodes.length ) {
			if ( ! children.length && node.childNodes[0].nodeName === 'BR' ) {
				return;
			}

			const newNode = toNode( vNode, eventHandler );
			node.parentNode.replaceChild( newNode, node );
			log( 'diff: replaced node', newNode );
		} else {
			if ( h.isEmptyNode( vNode ) ) {
				attributes[ 'data-wp-is-empty' ] = 'true';
			}

			// node.attributes is live, so copy.
			forEach( [ ...node.attributes ], ( { name } ) => {
				if ( ignoredAttributes.indexOf( name ) !== -1 ) {
					return;
				}

				if ( attributes[ name ] == null ) {
					node.removeAttribute( name );
					log( 'diff: removed attribute', name );
				}
			} );

			forOwn( attributes, function( value, key ) {
				const currentValue = node.getAttribute( key );

				if ( value == null ) {
					if ( currentValue ) {
						node.removeAttribute( key );
						log( 'diff: removed attribute', key );
					}
				} else if ( String( value ) !== currentValue ) {
					node.setAttribute( key, value );
					log( 'diff: set attribute', key, value )
				}
			} );

			forEach( node.childNodes, ( childNode, index ) => {
				diff( childNode, h.getChild( vNode, index ), eventHandler );
			} );
		}
	}
}
