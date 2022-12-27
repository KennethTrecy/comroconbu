import AbstractSourceFile from "./abstract_source_file";

/**
 * An abstraction of external package.
 */
export default class AbstractExternalPackage extends AbstractSourceFile {
	/**
	 * Creates a representation of external package.
	 * @param {string} externalName The name of the linked package.
	 * @param {string} globalName The identifier for the linked package.
	 */
	constructor(externalName, globalName) {
		super();
		this._externalName = externalName;
		this._globalName = globalName;
	}

	/**
	 * Returns the global identifiers exposed by this external package.
	 * @returns {Object} An object containing the name of the external package as key with
	 *                   corresponding global identifier as value.
	 */
	getGlobals() {
		return {
			[this._externalName]: this._globalName
		};
	}
}
