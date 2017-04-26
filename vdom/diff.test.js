import { describe, it } from 'mocha';
import { equal } from 'assert';
import { jsdom } from 'jsdom';

import diff from './diff';

global.document = jsdom();
global.window = document.defaultView;

describe( 'vdom/diff', () => {

	[
		{
			description: 'should update text node',
			source: '-',
			vNode: 'test',
			result: 'test',
			nodeChange: false
		},
		{
			description: 'should replace text node with element',
			source: '-',
			vNode: [ 'div', {}, 'test' ],
			result: '<div>test</div>',
			nodeChange: true
		},
		{
			description: 'should replace element with text node',
			source: '<div>test</div>',
			vNode: 'test',
			result: 'test',
			nodeChange: true
		},
		{
			description: 'should add attribute',
			source: '<div>test</div>',
			vNode: [ 'div', { 'data-test': 'true' }, 'test' ],
			result: '<div data-test="true">test</div>',
			nodeChange: false
		},
		{
			description: 'should remove attribute',
			source: '<div data-test="true">test</div>',
			vNode: [ 'div', {}, 'test' ],
			result: '<div>test</div>',
			nodeChange: false
		},
		{
			// NamedNodeMap must be copied.
			description: 'should remove attributes',
			source: '<div data-test="true" data-test-2="true">test</div>',
			vNode: [ 'div', {}, 'test' ],
			result: '<div>test</div>',
			nodeChange: false
		},
		{
			description: 'should not remove ignored attribute',
			source: '<div contenteditable="true">test</div>',
			vNode: [ 'div', {}, 'test' ],
			result: '<div contenteditable="true">test</div>',
			nodeChange: false
		},
		{
			description: 'should replace attribute',
			source: '<div data-test="true">test</div>',
			vNode: [ 'div', { 'data-test': 'false' }, 'test' ],
			result: '<div data-test="false">test</div>',
			nodeChange: false
		},
		{
			description: 'should replace element with name',
			source: '<div>test</div>',
			vNode: [ 'span', {}, 'test' ],
			result: '<span>test</span>',
			nodeChange: true
		},
		{
			description: 'should update child',
			source: '<div>-</div>',
			vNode: [ 'div', {}, 'test' ],
			result: '<div>test</div>',
			nodeChange: false
		},
		{
			description: 'should add child',
			source: '<div>test</div>',
			vNode: [ 'div', {}, 'test', [ 'span', {}, 'test' ] ],
			result: '<div>test<span>test</span></div>',
			nodeChange: true
		},
		{
			description: 'should remove child',
			source: '<div>test<span>test</span></div>',
			vNode: [ 'div', {}, 'test' ],
			result: '<div>test</div>',
			nodeChange: true
		}
	].forEach( ( { description, source, vNode, result, nodeChange } ) => {
		it( description, () => {
			document.body.innerHTML = source;
			const firstChild = document.body.firstChild;
			diff( firstChild, vNode );
			equal( document.body.innerHTML, result );
			equal( nodeChange, firstChild !== document.body.firstChild );
		} );
	} );

} );
