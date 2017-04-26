/**
 * Connects the TinyMCE instance to the Redux store.
 * This is the only module that should listen to TinyMCE events.
 */

import { assign, debounce, defer, each, isEqual, last, map, pick } from 'lodash';

import store from '../state/store';
import observe from '../state/observer';

import {
	isUIShown,
	isDragging,
	getHoverIndex,
	isInserterShown,
	getSelectedBlockIndex,
	getSelectedBlockContent,
	getDragData,
	getContent
} from '../state/selectors';

import {
	getParentBlock,
	getChildIndex,
	createSelectionPath,
	findNodeWithPath
} from './helpers';

import { fromNode } from '../vdom/converters';
import diff from '../vdom/diff';
import * as h from '../vdom/selectors';

import { getBlockNode } from '.';

import * as api from '../blocks/api';

const { DOM } = window.tinymce;
const { VK } = window.tinymce.util;

export default function( editor ) {

	editor.on( 'keydown blur focus', event => {
		if ( VK.metaKeyPressed( event ) ) {
			return;
		}

		if ( isUIShown( store.getState() ) ) {
			store.dispatch( { type: 'HIDE_UI' } );
		}
	} );

	editor.on( 'mousedown touchstart setSelectionRange', function( event ) {
		var state = store.getState();

		if ( isDragging( state ) ) {
			return;
		}

		// Show UI on setSelectionRange for non editable blocks.
		if ( event.range ) {
			if ( editor.selection.getNode().isContentEditable ) {
				return;
			}
		}

		if ( ! isUIShown( state ) ) {
			store.dispatch( { type: 'SHOW_UI' } );
		}
	} );

	editor.on( 'mouseover', debounce( function( event ) {
		var target = getParentBlock( event.target, editor.getBody() );
		var state = store.getState();
		var index = -1;

		if ( target ) {
			index = getChildIndex( target );
		}

		if ( index !== getHoverIndex( state ) ) {
			store.dispatch( { type: 'UPDATE_HOVER_INDEX', index: index } );
		}
	}, 100 ) );

	editor.on( 'preinit', function() {
		editor.serializer.addTempAttr( 'data-wp-block-selected' );
		editor.serializer.addTempAttr( 'data-wp-is-empty' );
		editor.serializer.addTempAttr( 'data-wp-block-dragging' );
		editor.serializer.addTempAttr( 'contenteditable' );
	} );

	editor.on( 'init', () => {

		store.dispatch( {
			type: 'SET_CONTENT',
			content: map( fromNode( editor.getBody(), true ), function( element ) {
				const id = api.getId( element );
				return api.render( id, api.getProps( id, element ) );
			} )
		} );

		/**
		 * selectionChange: Fires when the selection changes, but also on input.
		 * nodeChange: Fires when the UI needs to be updated (after a content change).
		 */
		editor.on( 'selectionChange nodeChange', function() {
			var rootNode = editor.getBody();
			var startNode = editor.selection.getStart();

			if ( ! rootNode.contains( startNode ) ) {
				return;
			}

			if ( startNode.id === 'mcepastebin' ) {
				return;
			}

			var state = store.getState();

			if ( isDragging( state ) ) {
				return;
			}

			var endNode = editor.selection.getEnd();
			var range = editor.selection.getRng();
			var isCollapsed = editor.selection.isCollapsed();
			var selection = createSelectionPath( range, startNode, endNode, isCollapsed, rootNode );

			if ( ! isEqual( selection, state.selection ) ) {
				store.dispatch( {
					type: 'SET_SELECTION',
					selection: selection
				} );
			}

			if ( isInserterShown( state ) ) {
				store.dispatch( {
					type: 'HIDE_INSERTER_MENU'
				} );
			}

			// A block has been deleted.
			// Quick check.
			if ( state.content.length !== rootNode.children.length ) {
				var newContent = fromNode( rootNode, true );

				// Actual check.
				if ( state.content.length !== newContent.length ) {
					store.dispatch( {
						type: 'SET_CONTENT',
						content: newContent
					} );

					return;
				}
			}

			var index = getSelectedBlockIndex( state );

			if ( index !== -1 ) {
				var currentContent = getSelectedBlockContent( state );
				var blockNode = getBlockNode( index, rootNode );
				var blockContent = fromNode( blockNode );

				// A block has been updated.
				if ( blockContent && ! isEqual( currentContent, blockContent ) ) {
					store.dispatch( {
						type: 'REPLACE_BLOCK',
						index,
						content: blockContent
					} );
				}
			}
		} );

		editor.on( 'newBlock', function( event ) {
			editor.$( event.newBlock )
				.attr( 'data-wp-placeholder', null )
				.attr( 'data-wp-block-selected', null );

			store.dispatch( {
				type: 'SET_CONTENT',
				content: fromNode( editor.getBody(), true )
			} );
		} );

		{
			let metaCount = 0;

			editor.on( 'keydown', event => {
				if ( VK.metaKeyPressed( event ) ) {
					metaCount++;
				} else {
					metaCount = 0;
				}
			} );

			editor.on( 'keyup', () => {
				if ( metaCount === 1 ) {
					store.dispatch( { type: 'SHOW_UI' } );
				}

				metaCount = 0;
			} );
		}

		{
			let dragTarget;

			observe( store, [
				getDragData
			], function( data ) {
				if ( data ) {
					dragTarget = getBlockNode( getSelectedBlockIndex( store.getState() ) );
					dragTarget.setAttribute( 'contenteditable', 'false' );

					editor.fire( 'mousedown', assign( {}, data, {
						target: dragTarget
					} ) );
				}
			} );

			editor.on( 'dragstart', function( event ) {
				// Target not set by us. Abort.
				if ( ! dragTarget ) {
					event.preventDefault();
					return;
				}

				dragTarget.setAttribute( 'data-wp-block-dragging', 'true' );
				dragTarget = null;

				store.dispatch( { type: 'HIDE_UI' } );

				DOM.bind( editor.getDoc(), 'mouseup', end );

				function end() {
					DOM.unbind( editor.getDoc(), 'mouseup', end );

					defer( function() {
						var $draggedNode = editor.$( '*[data-wp-block-dragging]' );

						if ( $draggedNode.length ) {
							$draggedNode[0].removeAttribute( 'data-wp-block-dragging' );

							if ( $draggedNode[0].getAttribute( 'data-editable' ) !== 'false' ) {
								$draggedNode[0].removeAttribute( 'contenteditable' );
							}

							store.dispatch( { type: 'STOP_DRAGGING_BLOCKS' } );

							store.dispatch( {
								type: 'SET_CONTENT',
								content: fromNode( editor.getBody(), true )
							} );

							editor.nodeChanged();
						}
					} );
				}
			} );
		}

		observe( store, [
			getContent,
			getSelectedBlockIndex
		], function( content, index ) {
			const rootNode = editor.getBody();

			each( content, function( vNode, i ) {
				diff(
					rootNode.childNodes[ i ],
					h.setAttributes( vNode, { 'data-wp-block-selected': i === index ? true : null } ),
					createEventHandler( editor )
				);
			} );

			defer( function() {
				setSelection( rootNode, store.getState().selection );
			} );
		} );

		function setSelection( node, { start, end } ) {
			let startNode = findNodeWithPath( start, node );
			let endNode = findNodeWithPath( end, node );
			let startOffset = 0;
			let endOffset = 0;
			const range = editor.dom.createRng();
			const currentRange = editor.selection.getRng();

			if ( startNode.nodeType === 3 ) {
				startOffset = last( start );
			} else {
				startOffset = getChildIndex( startNode );
				startNode = startNode.parentNode;
			}

			if ( endNode.nodeType === 3 ) {
				endOffset = last( end );
			} else {
				endOffset = getChildIndex( endNode ) + 1;
				endNode = endNode.parentNode;
			}

			range.setStart( startNode, startOffset );
			range.setEnd( endNode, endOffset );

			const propsToCompare = [
				'startOffset', 'endOffset',
				'startContainer', 'endContainer'
			];

			if ( ! isEqual( pick( currentRange, propsToCompare ), pick( range, propsToCompare ) ) ) {
				console.log( 'vdiff: set range' );
				editor.selection.lastFocusBookmark = null;
				editor.selection.setRng( range );
			} else if ( document.activeElement !== node ) {
				console.log( 'vdiff: set focus' );
				editor.focus();
			}
		}

		function createEventHandler( editor ) {
			return ( type, callback ) => ( { target } ) => {
				const node = getParentBlock( target, editor.getBody() );
				const index = getChildIndex( node );
				const vNode = getContent( store.getState(), index );
				const id = api.getId( vNode );
				const props = api.getProps( id, vNode );

				callback( props, function( newProps ) {
					store.dispatch( {
						type: 'REPLACE_BLOCK',
						index: index,
						content: api.render( id, assign( {}, props, newProps ) )
					} );
				} );
			};
		}

		editor.on( 'pastePreProcess', function( event ) {
			const index = getSelectedBlockIndex( store.getState() );
			const vNode = getSelectedBlockContent( store.getState() );
			const id = api.getId( vNode );
			const settings = api.getBlockSettings( id );

			if ( settings && settings.onPaste ) {
				const selectedProps = api.getProps( id, vNode );
				const newProps = settings.onPaste( event.content );

				if ( newProps ) {
					event.preventDefault();

					store.dispatch( {
						type: 'REPLACE_BLOCK',
						index: index,
						content: api.render( id, assign( {}, selectedProps, newProps ) )
					} );
				}
			}
		} );

	} );

}
