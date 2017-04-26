import React from 'react';
import { connect } from 'react-redux';

import GridIcon from './gridicon';
import { getRootNode, getBlockNode } from '../editor';

import {
	getSelectedBlockIndex,
	isSelectedBlockEmptySlot
} from '../state/selectors';

function BlockNavigationToolbar( {
	index,
	isEmptySlot,
	showMenu
} ) {
	if ( ! isEmptySlot ) {
		return null;
	}

	const rootNode = getRootNode();
	const rootNodeRect = rootNode.getBoundingClientRect();
	const blockNode = getBlockNode( index );
	const blockNodeRect = blockNode.getBoundingClientRect();

	const style = {
		left: rootNodeRect.left + 'px',
		top: blockNodeRect.top + window.pageYOffset + 'px'
	};

	return (
		<div className="editor-ui toolbar insert-toolbar" style={ style }>
			<button onClick={ showMenu }>
				<GridIcon id="add-outline" />
			</button>
		</div>
	);
}

export default connect(
	state => ( {
		index: getSelectedBlockIndex( state ),
		isEmptySlot: isSelectedBlockEmptySlot( state )
	} ),
	dispatch => ( {
		showMenu: () => dispatch( {
			type: 'SHOW_INSERTER_MENU',
		} )
	} )
)( BlockNavigationToolbar );
