import CommonInfo from "./common_info";

/**
 * Represents a source file that will be bundled.
 */
export default class SourceFile {
	/**
	 * Creates a representation of source file.
	 * @param {CommonInfo} commonInfo Common information for sources.
	 * @param {string} name Name of the bundle.
	 * @param {string} file The path of the source file to be bundled relative to the
	 *                 `inputDirectory` of `CommonInfoBuilder` class.
	 * @param {any} plugins Plugins that will be used to bundle the source file.
	 * @param {SourceFile[]} externals Optional. Array of external packages that will not be included
	 *                                 in the bundle.
	 */
	constructor(commonInfo, name, file, plugins, externals = []) {
		this._commonInfo = commonInfo;
		this._name = name;
		this._file = file;
		this._plugins = plugins;
		this._externals = externals;
	}
}
