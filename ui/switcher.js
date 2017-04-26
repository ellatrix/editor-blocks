import React from 'react';

import GridIcon from './gridicon';

import * as api from '../blocks/api';

export default class Switcher extends React.Component {

	constructor() {
		super( ...arguments );

		this.toggle = this.toggle.bind( this );
		this.replaceBlock = this.replaceBlock.bind( this );

		this.state = {
			open: false
		};
	}

	toggle() {
		this.setState( {
			open: ! this.state.open
		} );
	}

	replaceBlock( id ) {
		this.props.replaceBlock( {
			index: this.props.selectedIndex,
			content: api.transform( this.props.selectedId, id, this.props.selectedContent )
		} );
	}

	render() {
		const { selectedId } = this.props;
		const button = api.getBlockSettings( selectedId );

		return (
			<button onClick={ this.toggle }>
				<GridIcon id={ button.icon } />
				<GridIcon id="dropdown" />
				{ this.state.open ?
					<div className="select-panel">
						{ api.getType( 'text' ).map( ( block, index ) =>
							<button key={index} onClick={ () => this.replaceBlock( block._id ) }>
								<GridIcon id={ block.icon } />
								<span>{ block.displayName }</span>
							</button>
						) }
					</div> : null
				}
			</button>
		);
	}
}