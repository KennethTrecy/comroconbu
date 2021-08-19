/**
 * An abstraction of external package.
 */
export default class AbstractExternalPackage {
	/**
	 * Creates a representation of external package.
	 * @param {string} externalName The name of the linked package.
	 * @param {string} globalName The identifier for the linked package.
	 */
	constructor(externalName, globalName) {
		this._externalName = externalName;
		this._globalName = globalName;
	}

	getExternalName() { return this._externalName; }

	getGlobalName() { return this._globalName; }
}
