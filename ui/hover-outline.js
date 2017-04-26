import React from 'react';
import { connect } from 'react-redux';
import { pick } from 'lodash';

import { getBlockNode } from '../editor';

import {
	isUIShown,
	getHoverIndex,
	getSelectedBlockIndex,
} from '../state/selectors';

function HoverOutline( {
	isUIShown,
	index,
	selectedIndex,
	startDrag
} ) {
	if ( ! isUIShown || index === -1 || index === selectedIndex ) {
		return null;
	}

	const blockNode = getBlockNode( index );
	const blockNodeRect = blockNode.getBoundingClientRect();

	const style = {
		left: blockNodeRect.left + 'px',
		top: blockNodeRect.top + window.pageYOffset + 'px',
		height: blockNodeRect.height + 'px',
		width: blockNodeRect.width + 'px'
	};

	return (
		<div
			className="editor-ui block-outline block-outline-hover"
			style={ style }
			onMouseDown={ event => startDrag( pick( event, [
				'button', 'pageX', 'pageY', 'screenX', 'screenY'
			] ) ) }
		>
			<div className="block-outline-handle block-outline-handle-left" />
		</div>
	);
}

export default connect(
	state => ( {
		isUIShown: isUIShown( state ),
		index: getHoverIndex( state ),
		selectedIndex: getSelectedBlockIndex( state )
	} ),
	dispatch => ( {
		startDrag: data => dispatch( {
			type: 'START_DRAGGING_BLOCKS',
			data
		} )
	} )
)( HoverOutline );
