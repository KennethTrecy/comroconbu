/**
 * Represents a source file that will be bundled.
 */
export default class Source {
	/**
	 * Creates a representation of source.
	 * @param {string} name Name of the bundle.
	 * @param {string} file The path of the source file to be bundled relative to the
	 *                 `inputDirectory` of `CommonInfoBuilder` class.
	 * @param {any} plugins Plugins that will be used to bundle the source file.
	 * @param {Source[]} externals Optional. Array of external packages that will not be included in
	 *                             the bundle.
	 */
	constructor(name, file, plugins, externals) {
		this._name = name;
		this._file = file;
		this._plugins = plugins;
		this._externals = externals;
	}
}
