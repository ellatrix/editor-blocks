import React from 'react';
import { connect } from 'react-redux';
import { pick } from 'lodash';

import { getBlockNodes } from '../editor';

import {
	isUIShown,
	getSelectedBlockIndices,
} from '../state/selectors';

function Outline( {
	isUIShown,
	indices,
	startDrag
} ) {
	if ( ! isUIShown || ! indices.length ) {
		return null;
	}

	const blocksNodes = getBlockNodes( indices );
	const startRect = blocksNodes[0].getBoundingClientRect();
	const endRect = blocksNodes[ blocksNodes.length - 1 ].getBoundingClientRect();

	const style = {
		left: Math.min( startRect.left, endRect.left ) + 'px',
		top: startRect.top + window.pageYOffset + 'px',
		height: endRect.bottom - startRect.top + 'px',
		width: Math.max( startRect.width, endRect.width ) + 'px'
	};

	return (
		<div
			className="editor-ui block-outline"
			style={ style }
			onMouseDown={ event => startDrag( pick( event, [
				'button', 'pageX', 'pageY', 'screenX', 'screenY'
			] ) ) }
		>
			<div className="block-outline-handle block-outline-handle-left" />
			<div className="block-outline-handle block-outline-handle-right" />
		</div>
	);
}

export default connect(
	state => ( {
		isUIShown: isUIShown( state ),
		indices: getSelectedBlockIndices( state )
	} ),
	dispatch => ( {
		startDrag: data => dispatch( {
			type: 'START_DRAGGING_BLOCKS',
			data
		} )
	} )
)( Outline );
