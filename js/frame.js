( function( window, $, ajaxURL, Scrivener, undefined ) {

	var document = window.document;
	var cache = {};

	function init() {
		cacheUI();
		createOverlay();
		registerCKEditorHandlers();
	}

	function cacheUI() {
		cache.$body = $( document.body );
	}

	function createOverlay() {
		var overlay = document.createElement( 'div' );
		overlay.className = 'scrivener-frame-preview-overlay';
		document.body.appendChild( overlay );
		cache.$overlay = $( overlay );
	}

	function registerCKEditorHandlers() {
		cache.$body.on( 'ckSave', onCKEditorSave );
	}

	function onCKEditorSave( event ) {
		var ajaxData = {
			action : 'scrivener',
			scrivener_action : 'save_field',
			post_id : Scrivener_Data.post_id,
			_ajax_nonce : Scrivener_Data.ajaxNonce,
			data : event.text,
			field : event.container.$.getAttribute( 'data-wp-field' )
		};

		cache.XHR = $.ajax( {
			url : ajaxURL,
			type : 'post',
			data : ajaxData,
			success : onCKEditorSaveSuccess
		} );
	}

	function onCKEditorSaveSuccess( data ) {
		if( data.changed === undefined ) {
			return;
		}

		var customizer = Scrivener.Instance.coreModel.getCustomizerModelObject();

		if( data.changed === 'post_title' ) {
			customizer.changePostTitle( data.value );
		}
	}

	$( document ).ready( init );

} )( window, jQuery, parent.ajaxurl, parent.Scrivener );