import React from 'react';
import { connect } from 'react-redux';
import { assign, every } from 'lodash';

import GridIcon from './gridicon';
import { getRootNode, getBlockNode } from '../editor';

import {
	isUIShown,
	getSelectedBlockIndex,
	getSelectedBlockContent
} from '../state/selectors';

import * as api from '../blocks/api';

import Switcher from './switcher'

export default connect(
	state => ( {
		isUIShown: isUIShown( state ),
		selectedIndex: getSelectedBlockIndex( state ),
		selectedContent: getSelectedBlockContent( state )
	} ),
	dispatch => ( {
		replaceBlock: ( { index, content } ) => dispatch( {
			type: 'REPLACE_BLOCK',
			index, content
		} )
	} )
)( function( {
	isUIShown,
	selectedIndex,
	selectedContent,
	controls,
	id,
	replaceBlock,
} ) {
	if ( ! isUIShown || selectedIndex === -1 ) {
		return null;
	}

	const selectedId = api.getId( selectedContent );

	if ( id !== selectedId ) {
		return null;
	}

	const selectedProps = api.getProps( id, selectedContent );

	const editorPadding = 50;

	const rootNode = getRootNode();
	const rootNodeRect = rootNode.getBoundingClientRect();
	const blockNode = getBlockNode( selectedIndex );
	const blockNodeRect = blockNode.getBoundingClientRect();

	const style = {
		left: Math.max( rootNodeRect.left + editorPadding, blockNodeRect.left ) + 'px',
		top: blockNodeRect.top + window.pageYOffset - 46 + 'px'
	};

	function onClick( newProps ) {
		replaceBlock( {
			index: selectedIndex,
			content: api.render( id, assign( {}, selectedProps, newProps ) )
		} );
	}

	return (
		<div className="editor-ui block-toolbar" style={ style }>
			{ controls.map( ( buttons, index ) =>
				<div className="button-group" key={ index }>
					{ buttons.map( ( button, index ) => {
						if ( button === 'text-switcher' ) {
							return <Switcher
								key={ index }
								selectedId={ selectedId }
								replaceBlock={ replaceBlock }
								selectedIndex={ selectedIndex }
								selectedContent={ selectedContent }
							/>;
						} else {
							return (
								<button
									key={ index }
									onClick={ () => onClick( button.props ) }
									className={ every( button.props, function( value, key ) {
										return selectedProps[ key ] === value;
									} ) ? 'is-active' : null }
								>
									<GridIcon id={ button.icon } />
									{ button.text ? <span className="level">{ button.text }</span> : null }
								</button>
							);
						}
					} ) }
				</div>
			) }
		</div>
	);
} );
