const { Promise } = window;

export default function filePicker( multiple, accept ) {
	return new Promise( ( resolve ) => {
		let input = document.createElement( 'input' );

		input.type = 'file';
		input.accept = accept;
		input.multiple = multiple;
		input.style.position = 'fixed';
		input.style.left = 0;
		input.style.top = 0;
		input.style.opacity = 0.001;

		input.onchange = event => {
			resolve( event.target.files );
			input.parentNode.removeChild( input );
		}

		document.body.appendChild( input );

		input.click();
	} );
}
