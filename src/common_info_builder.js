import AbstractExternalPackage from "./abstract_external_package";
import CommonInfo from "./common_info";
import ImportedExternalPackage from "./external_package/imported_external_package";
import LinkedExternalPackage from "./external_package/linked_external_package";
import NamedSourceFile from "./source_file/named_source_file";
import RebundledExternalPackage from "./external_package/rebundled_external_package";
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

	/**
	 * Creates a representation of imported external package.
	 * @param {string} externalName The name of the imported external package.
	 * @param {string} globalName The global variable that identifies the imported external package.
	 * @param {string} file The path of the source file which imports the external package.
	 * @param {any[]} plugins Plugins that will be used to bundle the external package.
	 * @param {AbstractExternalPackage[]} [externals=[]] Optional. Array of external packages that
	 *                                    will not be included in the bundle.
	 * @returns {ImportedExternalPackage} A representation of imported external package.
	 */
	importExternalPackage(externalName, globalName, file, plugins, externals = []) {
		return new ImportedExternalPackage(
			this._commonInfo,
			externalName,
			globalName,
			file,
			plugins,
			externals
		);
	}

	/**
	 * Creates a representation of linked external package.
	 * @param {string} externalName The name of the external package linked by CDN or others.
	 * @param {string} globalName The global variable that identifies the linked external package.
	 * @returns {LinkedExternalPackage} A representation of linked external package.
	 */
	linkExternalPackage(externalName, globalName) {
		return new LinkedExternalPackage(externalName, globalName);
	}

	/**
	 * Creates a representation of rebundled external packages.
	 * @param {string} globalName The global identifier representing the rebundled external packages.
	 * @param {Object} subglobals Pairs of external name (key) and global variable (value) of
	 *                            external packages.
	 * @param {string} file The path of the source file which imports the external packages to be
	 *                      rebundled.
	 * @param {any[]} plugins Plugins that will be used to rebundle the external packages.
	 * @param {AbstractExternalPackage[]} [externals=[]] Optional. Array of external packages that
	 *                                    will not be included in the rebundling process.
	 * @returns {RebundledExternalPackage} A representation of imported external package.
	 */
	rebundleExternalPackages(globalName, subglobals, file, plugins, externals = []) {
		return new RebundledExternalPackage(
			this._commonInfo,
			globalName,
			subglobals,
			file,
			plugins,
			externals
		);
	}
}
