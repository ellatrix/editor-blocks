const _blocks = {};
const _elementMap = {};

import * as h from '../vdom/selectors';

export function registerBlock( settings ) {
	var namespace = settings.namespace;
	var id = namespace + ':' + settings.name;

	_blocks[ id ] = settings;
	_blocks[ id ]._id = id;

	if ( settings.elements ) {
		settings.elements.forEach( function( element ) {
			_elementMap[ element ] = id;
		} );
	}
}

export function getType( name ) {
	var settings = [];
	var key;

	for ( key in _blocks ) {
		if ( _blocks[ key ].type === name ) {
			settings.push( _blocks[ key ] );
		}
	}

	return settings;
}

export function getBlockSettings( name ) {
	return _blocks[ name ];
}

export function getBlocks() {
	return _blocks;
}

export function extendBlock() {}

export function getId( vNode ) {
	const id = h.getAttribute( vNode, 'data-wp-block-type' );
	const name = h.getName( vNode );

	if ( _blocks[ id ] ) {
		return id;
	}

	if ( _elementMap[ name ] ) {
		return _elementMap[ name ];
	}
}

export function getProps( id, vNode ) {
	return _blocks[ id ].getProps( vNode, h );
}

export function render( id, props ) {
	let vNode = _blocks[ id ].render( props );

	if ( ! _blocks[ id ].elements ) {
		vNode = h.setAttributes( vNode, {
			'data-wp-block-type': id
		} );
	}

	return vNode;
}

export function save( id, props ) {
	let vNode

	if ( _blocks[ id ].save ) {
		vNode = _blocks[ id ].save( props );
	} else {
		vNode = _blocks[ id ].render( props );
	}

	if ( ! _blocks[ id ].elements ) {
		vNode = h.setAttributes( vNode, {
			'data-wp-block-type': id
		} );
	}

	return vNode;
}

export function transform( fromID, toID, vNode ) {
	var settings = getBlockSettings( fromID );
	var nextSettings = getBlockSettings( toID );
	var vNodeList = settings.toBaseState( vNode, h );

	// `fromBaseState` always receives list.
	if ( h.isElement( vNodeList ) ) {
		vNodeList = [ vNodeList ];
	}

	return nextSettings.fromBaseState( vNodeList, h );
}
