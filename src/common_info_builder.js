import AbstractExternalPackage from "./abstract_external_package";
import CommonInfo from "./common_info";
import Source from "./source_file";

/**
 * Represents a builder which contains common information for configurations that will be created.
 */
export default class CommonInfoBuilder {
	/**
	 * Creates the builder.
	 * @param {string} inputDirectory Directory of source files.
	 * @param {string} outputDirectory Directory of bundled files.
	 * @param {string} outputFormat Output format for bundled files.
	 */
	constructor(inputDirectory, outputDirectory, outputFormat) {
		this._commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat);
	}

	/**
	 * Creates a representation of source.
	 * @param {string} name Name of the bundle.
	 * @param {string} file The path of the source file to be bundled relative to the
	 *                 `inputDirectory` of this class.
	 * @param {any} plugins Plugins that will be used to bundle the source file.
	 * @param {AbstractExternalPackage[]} externals Optional. Array of external packages that will
	 *                                    not be included in the bundle.
	 * @returns {Source} A representation of source.
	 */
	configure(name, file, plugins, externals = []) {
		return new Source(this._commonInfo, name, file, plugins, externals);
	}
}
