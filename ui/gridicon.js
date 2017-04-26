import React from 'react';

export default function GridIcon( props ) {
	return (
		<svg className={ 'gridicon gridicons-' + props.id } width="24" height="24">
			<use
				xmlnsXlink="http://www.w3.org/1999/xlink"
				xlinkHref={ 'vendor/gridicons.svg#gridicons-' + props.id }
			></use>
		</svg>
	);
}
