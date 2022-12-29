// eslint-disable-next-line no-unused-vars
import AbstractExternalPackage from "../abstract_external_package"
// eslint-disable-next-line no-unused-vars
import CommonInfo from "../common_info"
import UnnamedSourceFile from "./unnamed_source_file"

/**
 * Represents a source file that will be bundled.
 */
export default class NamedSourceFile extends UnnamedSourceFile {
	/**
	 * Creates a representation of source file.
	 * @param {CommonInfo} commonInfo Common information for sources.
	 * @param {string} name Name of the bundle.
	 * @param {string|RelativePathPair} file The relative path of the source and bundled file which
	 *                                       are both relative to the `inputDirectory` and
	 *                                       `outputDirectory` of `CommonInfoBuilder` class. It can
	 *                                       be also a relative path pair which may have two
	 *                                       different directories.
	 * @param {any} plugins Plugins that will be used to bundle the source file.
	 * @param {AbstractExternalPackage[]} externals Optional. Array of external packages that will
	 *                                    not be included in the bundle.
	 */
	constructor(commonInfo, name, file, plugins, externals = []) {
		super(commonInfo, file, plugins, externals)
		this._name = name
	}

	_convertIntoBasicConfiguration() {
		const configuration = super._convertIntoBasicConfiguration()

		configuration.output.name = this._name

		return configuration
	}
}
