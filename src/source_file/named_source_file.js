import AbstractExternalPackage from "../abstract_external_package";
import CommonInfo from "../common_info";
import UnnamedSourceFile from "./unnamed_source_file";

/**
 * Represents a source file that will be bundled.
 */
export default class NamedSourceFile extends UnnamedSourceFile {
	/**
	 * Creates a representation of source file.
	 * @param {CommonInfo} commonInfo Common information for sources.
	 * @param {string} name Name of the bundle.
	 * @param {string} file The path of the source file to be bundled relative to the
	 *                 `inputDirectory` of `CommonInfoBuilder` class.
	 * @param {any} plugins Plugins that will be used to bundle the source file.
	 * @param {AbstractExternalPackage[]} externals Optional. Array of external packages that will
	 *                                    not be included in the bundle.
	 */
	constructor(commonInfo, name, file, plugins, externals = []) {
		super(commonInfo, file, plugins, externals);
		this._name = name;
	}

	_convertIntoBasicConfiguration() {
		const configuration = super._convertIntoBasicConfiguration();

		configuration.output.name = this._name;

		return configuration;
	}
}
