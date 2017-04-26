import React from 'react';
import { connect } from 'react-redux';

import GridIcon from './gridicon';
import { getRootNode, getBlockNode } from '../editor';

import {
	isUIShown,
	hasNextBlock,
	hasPreviousBlock,
	getSelectedBlockIndices
} from '../state/selectors';

function BlockNavigationToolbar( {
	isUIShown,
	hasPreviousBlock,
	hasNextBlock,
	indices,
	moveUp,
	moveDown
} ) {
	if ( ! isUIShown || ! indices.length ) {
		return null;
	}

	const rootNode = getRootNode();
	const rootNodeRect = rootNode.getBoundingClientRect();
	const blockNode = getBlockNode( indices[0] );
	const blockNodeRect = blockNode.getBoundingClientRect();

	const style = {
		left: rootNodeRect.left + 'px',
		top: blockNodeRect.top + window.pageYOffset + 'px'
	};

	return (
		<div className="editor-ui toolbar" style={ style }>
			<button
				className="move-up"
				disabled={ ! hasPreviousBlock }
				onClick={ () => moveUp( indices ) }
			>
				<GridIcon id="chevron-up" />
			</button>
			<button
				className="move-down"
				disabled={ ! hasNextBlock }
				onClick={ () => moveDown( indices ) }
			>
				<GridIcon id="chevron-down" />
			</button>
		</div>
	);
}

export default connect(
	state => ( {
		isUIShown: isUIShown( state ),
		hasPreviousBlock: hasPreviousBlock( state ),
		hasNextBlock: hasNextBlock( state ),
		indices: getSelectedBlockIndices( state )
	} ),
	dispatch => ( {
		moveUp: indices => dispatch( {
			type: 'MOVE_BLOCKS_UP',
			indices
		} ),
		moveDown: indices => dispatch( {
			type: 'MOVE_BLOCKS_DOWN',
			indices
		} )
	} )
)( BlockNavigationToolbar );
