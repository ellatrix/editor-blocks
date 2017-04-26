import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { map } from 'lodash';

import store from './state/store';

import Editor from './editor';
import Debug from './ui/debug';
import Outline from './ui/outline';
import HoverOutline from './ui/hover-outline';
import BlockNavigationToolbar from './ui/block-navigation-toolbar';
import BlockToolbar from './ui/block-toolbar';
import Inserter from './ui/inserter';
import InserterMenu from './ui/inserter-menu';

import * as api from './blocks/api';

import './blocks/core';
import './blocks/my-awesome-plugin';

import './index.css';
import './ui/style.css';

render(
	<Provider store={ store }>
		<div>
			<Editor />
			<Debug />
			<Outline />
			<HoverOutline />
			<BlockNavigationToolbar />
			{ map( api.getBlocks(), ( { _id, controls }, key ) => (
				controls && controls.length ?
					<BlockToolbar key={ key } id={ key } controls={ controls } /> : null
			) ) }
			<Inserter />
			<InserterMenu blocks={ api.getBlocks() } />
		</div>
	</Provider>,
	document.getElementById( 'root' )
);

// Export API as global.

window.wp = window.wp || {};
window.wp.blocks = api;
