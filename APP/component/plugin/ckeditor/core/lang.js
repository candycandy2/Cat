/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	/**
	 * Stores language-related functions.
	 *
	 * @class
	 * @singleton
	 */
	CKEDITOR.lang = {
		/**
		 * The list of languages available in the editor core.
		 *
		 *		alert( CKEDITOR.lang.languages.en ); // 1
		 */
		languages: {
			en: 1
		},

		/**
		 * The list of languages that are written Right-To-Left (RTL) and are supported by the editor.
		 */
		rtl: { ar: 1, fa: 1, he: 1, ku: 1, ug: 1 },

		/**
		 * Loads a specific language file, or auto detects it. A callback is
		 * then called when the file gets loaded.
		 *
		 * @param {String} languageCode The code of the language file to be
		 * loaded. If null or empty, autodetection will be performed. The
		 * same happens if the language is not supported.
		 * @param {String} defaultLanguage The language to be used if
		 * `languageCode` is not supported or if the autodetection fails.
		 * @param {Function} callback A function to be called once the
		 * language file is loaded. Two parameters are passed to this
		 * function: the language code and the loaded language entries.
		 */
		load: function( languageCode, defaultLanguage, callback ) {
			// If no languageCode - fallback to browser or default.
			// If languageCode - fallback to no-localized version or default.
			if ( !languageCode || !CKEDITOR.lang.languages[ languageCode ] )
				languageCode = this.detect( defaultLanguage, languageCode );

			var that = this,
				loadedCallback = function() {
					that[ languageCode ].dir = that.rtl[ languageCode ] ? 'rtl' : 'ltr';
					callback( languageCode, that[ languageCode ] );
				};

			if ( !this[ languageCode ] )
				CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( 'lang/' + languageCode + '.js' ), loadedCallback, this );
			else
				loadedCallback();
		},

		/**
		 * Returns the language that best fits the user language. For example,
		 * suppose that the user language is "pt-br". If this language is
		 * supported by the editor, it is returned. Otherwise, if only "pt" is
		 * supported, it is returned instead. If none of the previous are
		 * supported, a default language is then returned.
		 *
		 *		alert( CKEDITOR.lang.detect( 'en' ) ); // e.g., in a German browser: 'de'
		 *
		 * @param {String} defaultLanguage The default language to be returned
		 * if the user language is not supported.
		 * @param {String} [probeLanguage] A language code to try to use,
		 * instead of the browser-based autodetection.
		 * @returns {String} The detected language code.
		 */
		detect: function( defaultLanguage, probeLanguage ) {
			var languages = this.languages;
			probeLanguage = probeLanguage || navigator.userLanguage || navigator.language || defaultLanguage;

			var parts = probeLanguage.toLowerCase().match( /([a-z]+)(?:-([a-z]+))?/ ),
				lang = parts[ 1 ],
				locale = parts[ 2 ];

			if ( languages[ lang + '-' + locale ] )
				lang = lang + '-' + locale;
			else if ( !languages[ lang ] )
				lang = null;

			CKEDITOR.lang.detect = lang ?
			function() {
				return lang;
			} : function( defaultLanguage ) {
				return defaultLanguage;
			};

			return lang || defaultLanguage;
		}
	};

} )();
