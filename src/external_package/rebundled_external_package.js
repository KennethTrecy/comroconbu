import AbstractExternalPackage from "../abstract_external_package";
import CommonInfo from "../common_info";
import SourceFile from "../source_file/source_file";

/**
 * Represents an external package that rebundles other packages into one file.
 */
export default class RebundledExternalPackage extends AbstractExternalPackage {
	/**
	 * Creates a representation of rebundled external package.
	 * @param {string} globalName The global identifier that will represent the rebundled package.
	 * @param {Object} subglobals Pairs of external name (key) and global variable (value) of every
	 *                            external package that will be rebundled.
	 * @param {CommonInfo} commonInfo Common information from common info builder.
	 * @param {string} file The path to the source file which imports the external packages to be
	 *                      rebundled.
	 * @param {any} plugins Plugins that will be used to bundle the source file.
	 * @param {AbstractExternalPackage[]} [externals=[]] Array of external packages that will not be
	 *                                                   included in the bundle.
	 */
	constructor(globalName, subglobals, commonInfo, file, plugins, externals = []) {
		super("", globalName);
		this._subglobals = subglobals;
		this._sourceFile = new SourceFile(commonInfo, globalName, file, plugins, externals);
	}

	toConfigurationArray() {
		return this._sourceFile.toConfigurationArray();
	}

	getGlobals() {
		const globals = {};
		for (const [ packageName, globalIdentifier ] of Object.entries(this._subglobals)) {
			globals[packageName] = `${this._globalName}.${globalIdentifier}`;
		}
		return globals;
	}
}
