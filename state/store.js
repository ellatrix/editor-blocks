import { applyMiddleware, createStore } from 'redux';
import { assign, concat, first, last, map } from 'lodash';

import scrollMiddleware from '../ui/scroll';

import * as h from '../vdom/selectors';

const initialState = {
	content: [],
	selection: {
		start: [ 0 ],
		end: [ 0 ],
		isCollapsed: true
	},
	showUI: false,
	showInserter: false,
	dragData: false,
	hoverIndex: -1
};

export default createStore( function( state, action ) {
	if ( action.type === 'SET_CONTENT' ) {
		state = assign( {}, state, {
			content: concat( action.content )
		} );
	}

	if ( action.type === 'SET_SELECTION' ) {
		state = assign( {}, state, {
			selection: assign( {}, action.selection )
		} );
	}

	if ( action.type === 'SHOW_UI' ) {
		state = assign( {}, state, { showUI: true } );
	}

	if ( action.type === 'HIDE_UI' ) {
		state = assign( {}, state, { showUI: false } );
	}

	if ( action.type === 'SHOW_INSERTER_MENU' ) {
		state = assign( {}, state, { showInserter: true } );
	}

	if ( action.type === 'HIDE_INSERTER_MENU' ) {
		state = assign( {}, state, { showInserter: false } );
	}

	if ( action.type === 'START_DRAGGING_BLOCKS' ) {
		state = assign( {}, state, {
			dragData: action.data,
			showUI: false
		} );
	}

	if ( action.type === 'STOP_DRAGGING_BLOCKS' ) {
		state = assign( {}, state, {
			dragData: false,
			showUI: true
		} );
	}

	if ( action.type === 'UPDATE_HOVER_INDEX' ) {
		state = assign( {}, state, {
			hoverIndex: action.index
		} );
	}

	if ( action.type === 'MOVE_BLOCKS_UP' ) {
		state = assign( {}, state, {
			content: map( state.content, function( content, i ) {
				var indices = action.indices;
				var prevIndex = first( indices ) - 1;

				if ( prevIndex >= 0 ) {
					if ( last( indices ) === i ) {
						return state.content[ prevIndex ];
					}

					if ( prevIndex === i || indices.indexOf( i ) !== -1 ) {
						return state.content[ i + 1 ];
					}
				}

				return state.content[ i ];
			} ),
			selection: assign( {}, state.selection, {
				start: map( state.selection.start, function( index, i ) {
					return i ? index : index - 1;
				} ),
				end: map( state.selection.end, function( index, i ) {
					return i ? index : index - 1;
				} )
			} )
		} );
	}

	if ( action.type === 'MOVE_BLOCKS_DOWN' ) {
		state = assign( {}, state, {
			content: map( state.content, function( content, i ) {
				var indices = action.indices;
				var nextIndex = last( indices ) + 1;

				if ( nextIndex <= state.content.length ) {
					if ( first( indices ) === i ) {
						return state.content[ nextIndex ];
					}

					if ( nextIndex === i || indices.indexOf( i ) !== -1 ) {
						return state.content[ i - 1 ];
					}
				}

				return state.content[ i ];
			} ),
			selection: assign( {}, state.selection, {
				start: map( state.selection.start, function( index, i ) {
					return i ? index : index + 1;
				} ),
				end: map( state.selection.end, function( index, i ) {
					return i ? index : index + 1;
				} )
			} )
		} );
	}

	if ( action.type === 'REPLACE_BLOCK' ) {
		state = assign( {}, state, {
			content: map( state.content, function( content, i ) {
				var newContent = action.content;

				if ( ! h.isElement( action.content ) ) {
					newContent = newContent[0];
				}

				return i === action.index ? newContent : content;
			} )
		} );
	}

	return state;
}, initialState, applyMiddleware( scrollMiddleware ) );
