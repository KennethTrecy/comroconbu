import AbstractExternalPackage from "../abstract_external_package";

/**
 * Represents an external package linked by using CDN or others.
 */
export default class LinkedExternalPackage extends AbstractExternalPackage {
	/**
	 * Creates a representation of linked external package.
	 * @param {string} externalName The name of the linked package.
	 * @param {string} globalName The global variable that identifies the linked package.
	 */
	constructor(externalName, globalName) {
		super(externalName, globalName);
	}

	toConfigurationArray() {
		return [];
	}
}
