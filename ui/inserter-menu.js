import React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';

import GridIcon from './gridicon';
import { getRootNode, getBlockNode } from '../editor';

import {
	isInserterShown,
	getSelectedBlockIndex
} from '../state/selectors';

import * as api from '../blocks/api';

export default connect(
	state => ( {
		isInserterShown: isInserterShown( state ),
		selectedIndex: getSelectedBlockIndex( state )
	} ),
	dispatch => ( {
		replaceBlock: ( { index, content } ) => dispatch( {
			type: 'REPLACE_BLOCK',
			index, content
		} )
	} )
)( function( {
	isInserterShown,
	selectedIndex,
	blocks,
	replaceBlock
} ) {
	if ( ! isInserterShown || selectedIndex === -1 ) {
		return null;
	}

	const editorPadding = 50;

	const rootNode = getRootNode();
	const rootNodeRect = rootNode.getBoundingClientRect();
	const blockNode = getBlockNode( selectedIndex );
	const blockNodeRect = blockNode.getBoundingClientRect();

	const style = {
		left: rootNodeRect.left + editorPadding + 'px',
		top: blockNodeRect.top + window.pageYOffset + 'px'
	};

	function onClick( id ) {
		replaceBlock( {
			index: selectedIndex,
			content: api.render( id, {} )
		} );
	}

	return (
		<div className="editor-ui block-toolbar insert-menu" style={ style }>
			{ [ 'text', 'media', 'data visualisation', 'separator' ].map( ( type, index ) =>
				<div key={ index }>
					<div className="insert-separator">{ type }</div>
					{ map( blocks, ( settings, key ) => {
						if ( settings.type === type ) {
							return (
								<button key={ key } onClick={ () => onClick( key ) }>
									<GridIcon id={ settings.icon } />
									{ settings.displayName ? <span>{ settings.displayName }</span> : null }
								</button>
							);
						}
					} ) }
				</div>
			) }
		</div>
	);
} );
