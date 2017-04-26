import { castArray, isEqual, map } from 'lodash';

export default function( store, select, onChange ) {
	let currentState = [];

	function handleChange() {
		const nextState = map( castArray( select ), function( callback ) {
			return callback( store.getState() );
		} );

		if ( ! isEqual( nextState, currentState ) ) {
			currentState = nextState;
			onChange.apply( null, currentState );
		}
	}

	const unsubscribe = store.subscribe( handleChange );

	handleChange();

	return unsubscribe;
}
