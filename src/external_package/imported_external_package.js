import AbstractExternalPackage from "../abstract_external_package";
import CommonInfo from "../common_info";
import NamedSourceFile from "../source_file/named_source_file";

/**
 * Represents a package linked by importing it.
 */
export default class ImportedExternalPackage extends AbstractExternalPackage {
	/**
	 * Creates a representation of imported external package.
	 * @param {CommonInfo} commonInfo Common information from common info builder.
	 * @param {string} externalName The name of the linked package.
	 * @param {string} globalName The global variable that identifies the linked package.
	 * @param {string} file The path to the source file which imports the external package.
	 * @param {any[]} plugins Plugins that will be used to bundle the source file.
	 * @param {AbstractExternalPackage[]} [externals=[]] Array of external packages that will not be
	 *                                                   included in the bundle.
	 */
	constructor(commonInfo, externalName, globalName, file, plugins, externals = []) {
		super(externalName, globalName);
		this._sourceFile = new NamedSourceFile(commonInfo, globalName, file, plugins, externals);
	}

	toConfigurationArray() {
		return this._sourceFile.toConfigurationArray();
	}
}
