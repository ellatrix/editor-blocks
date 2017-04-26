import React from 'react';

import connect from './connect';
import contentEditable from './contenteditable';
import parse from './parse';
import pasteExternal from './paste-external';

import content from '../post-content';

const { tinymce } = window;

const plugins = [
	connect,
	contentEditable,
	parse,
	pasteExternal
];

let rootNode;

export default class Editor extends React.Component {

	componentDidMount() {
		tinymce.init( {
			target: rootNode,
			browser_spellcheck: true,
			custom_ui_selector: '.editor-ui',
			inline: true,
			// Enter creates a fresh paragraph.
			keep_styles: false,
			menubar: false,
			object_resizing: false,
			plugins: [
				'lists',
				'paste',
				'table',
				// 'wplink',
				'wptextpattern'
			],
			schema: 'html5-strict',
			theme: false,
			toolbar: false,
			formats: {
				strikethrough: { inline: 'del' }
			},
			setup: editor => {
				editor.on( 'loadContent', () => editor.setContent( content ) );
				plugins.forEach( plugin => plugin( editor ) );
			}
		} );
	}

	render() {
		return <div id="editor" ref={ node => { rootNode = node } }></div>
	}

}

export function getRootNode() {
	return rootNode;
}

export function getBlockNode( index ) {
	if ( index !== -1 ) {
		return rootNode.childNodes[ index ];
	}
}

export function getBlockNodes( indices ) {
	return indices.map( index => rootNode.childNodes[ index ] )
}
