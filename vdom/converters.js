import {
	drop,
	forEach,
	forOwn,
	indexOf,
	isEmpty,
	isPlainObject,
	isString
} from 'lodash';

import * as h from './selectors';

const blockMap = [
	'div', 'p', 'blockquote', 'figure', 'figcaption', 'footer', 'td', 'pre', 'li',
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
];

function isBlock( name ) {
	return indexOf( blockMap, name ) !== -1;
}

export function fromNode( node, inner ) {
	var name = node.nodeName.toLowerCase();

	if ( name === '#comment' ) {
		return null;
	} else if ( name === '#text' ) {
		return node.nodeValue;
	} else {
		var json = [];
		var jsonAttributes = {};
		var attributes = node.attributes;
		var attributesLength = attributes.length;
		var childNodes = node.childNodes;
		var childNodesLength = childNodes.length;
		var i;

		if ( ! inner ) {
			json.push( name );

			if ( attributesLength ) {
				for ( i = 0; i < attributesLength; i++ ) {
					if ( attributes[ i ].name === 'data-mce-bogus' ) {
						return null;
					}

					if ( [
						'contenteditable',
						'data-mce-selected',
						'data-wp-block-selected',
						'data-wp-block-dragging',
						'data-wp-is-empty',
					].indexOf( attributes[ i ].name ) === -1 &&
					attributes[ i ].name.indexOf( 'data-mce-' ) !== 0 ) {
						jsonAttributes[ attributes[ i ].name ] = attributes[ i ].value;
					}
				}

				if ( ! isEmpty( jsonAttributes ) ) {
					json.push( jsonAttributes );
				}
			}
		}

		if ( childNodesLength ) {
			// Just a BR means it's empty.
			// if ( childNodesLength !== 1 || childNodes[ 0 ].nodeName !== 'BR' ) {
				var child;

				for ( i = 0; i < childNodesLength; i++ ) {
					child = fromNode( childNodes[ i ] );

					if ( child ) {
						json.push( child );
					}
				}
			// }
		}

		return json;
	}
}

export function toNode( json, eventHandler ) {
	if ( ! json.length ) {
		return;
	}

	if ( h.isText( json ) ) {
		return document.createTextNode( json.replace( '\u0086', '' ) );
	}

	if ( isString( json[ 0 ] ) ) {
		var name = json[ 0 ];

		// Temporary fix for namespace issue.
		if ( name === 'svg' ) {
			var temp = document.createElement( 'div' );

			temp.innerHTML = toHTML( [ json ] );

			return temp.firstChild;
		} else {
			var node = document.createElement( name.toUpperCase() );
		}

		var attributes = {};
		var children;

		if ( isPlainObject( json[ 1 ] ) ) {
			attributes = json[ 1 ];
			children = drop( json, 2 );
		} else {
			children = drop( json );
		}

		forOwn( attributes, function( value, key ) {
			if ( value != null ) {
				if ( key.indexOf( 'on' ) === 0 ) {
					key = key.toLowerCase();
					node[ key ] = eventHandler( key, value );
				} else {
					node.setAttribute( key, value );
				}

				if ( key === 'data-editable' && value === false ) {
					node.setAttribute( 'contenteditable', 'false' );
				}
			}
		} );

		if ( children.length ) {
			forEach( children, function( child ) {
				node.appendChild( toNode( child, eventHandler ) );
			} );
		} else if ( isBlock( json[ 0 ] ) ) {
			node.setAttribute( 'data-wp-is-empty', 'true' );
			node.appendChild( document.createElement( 'BR' ) );
		}

		return node;
	}

	var node = document.createDocumentFragment();

	forEach( json, function( child ) {
		node.appendChild( toNode( child, eventHandler ) );
	} );

	return node;
}

export function toHTML( content, space, _recusive ) {
	var string = '';

	forEach( content, function( child, index ) {
		if ( h.isText( child ) ) {
			string += child.replace( '\u0086', '' );
		} else if ( child ) {
			var id = h.getAttribute( child, 'data-wp-block-type' );
			var name = h.getName( child );
			var attributes = h.getAttributes( child );
			var children = h.getChildren( child );

			if ( id ) {
				string += '<!-- ' + id + ' -->';
			}

			string += '<' + name;

			forOwn( attributes, function( value, key ) {
				if ( value != null && key !== 'data-wp-block-type' ) {
					string += ' ' + key + '="' + value + '"';
				}
			} );

			string += '>';

			if ( ! h.isEmptyNode( child ) ) {
				string += toHTML( children, space, true );
			}

			string += '</' + name + '>';

			if ( id ) {
				string += '<!-- /wp -->';
			}

			if ( space && ! _recusive && index < content.length ) {
				string += space;
			}
		}
	} );

	return string;
}
