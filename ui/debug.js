import React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';

import { toHTML } from '../vdom/converters';

import * as api from '../blocks/api';

function save( json ) {
	return map( json, function( element ) {
		const id = api.getId( element );
		return api.save( id, api.getProps( id, element ) );
	} );
}

function Debug( { content, selection } ) {
	return (
		<pre className="debug">
			selection: { JSON.stringify( selection ) + '\n---\n\n' }
			{ toHTML( save( content ), '\n\n' ) }
		</pre>
	);
}

export default connect(
	state => ( {
		content: state.content,
		selection: state.selection
	} )
)( Debug );
