import AbstractExternalPackage from "./abstract_external_package";
import CommonInfo from "./common_info";
import NamedSourceFile from "./source_file/named_source_file";
import SourceDirectory from "./source_file/source_directory";
import UnnamedSourceFile from "./source_file/unnamed_source_file";

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
	 * Creates a representation of named source file.
	 * @param {string} name Name of the bundle.
	 * @param {string} file The path of the source file to be bundled relative to the
	 *                 `inputDirectory` of this class.
	 * @param {any[]} plugins Plugins that will be used to bundle the source file.
	 * @param {AbstractExternalPackage[]} externals Optional. Array of external packages that will
	 *                                    not be included in the bundle.
	 * @returns {NamedSourceFile} A representation of named source file.
	 */
	configureNamedSource(name, file, plugins, externals = []) {
		return new NamedSourceFile(this._commonInfo, name, file, plugins, externals);
	}

	/**
	 * Creates a representation of unnamed source file.
	 * @param {string} file The path of the source file to be bundled relative to the
	 *                 `inputDirectory` of this class.
	 * @param {any[]} plugins Plugins that will be used to bundle the source file.
	 * @param {AbstractExternalPackage[]} externals Optional. Array of external packages that will
	 *                                    not be included in the bundle.
	 * @returns {UnnamedSourceFile} A representation of unnamed source files.
	 */
	configureUnnamedSource(file, plugins, externals = []) {
		return new UnnamedSourceFile(this._commonInfo, file, plugins, externals);
	}

	/**
	 * Creates a representation of source directory.
	 * @param {any[]} plugins Common plugins to be applied to the source files found in the input
	 *                      directory.
	 * @param {AbstractExternalPackage[]} externals Optional. Array of common external packages that
	 *                                    will not be included in the configuration of each source
	 *                                    file.
	 * @returns {SourceDirectory} A representation of source directory.
	 */
	configureSourceDirectory(plugins, externals = []) {
		return new SourceDirectory(this._commonInfo, plugins, externals);
	}
}
