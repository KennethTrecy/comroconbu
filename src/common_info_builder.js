/**
 * Creates a builder which contains common information for subsequent configuration to be created.
 */
export default class CommonInfoBuilder {
	/**
	 * Creates the builder.
	 * @param {string} inputDirectory Directory of source files.
	 * @param {string} outputDirectory Directory of bundled files.
	 * @param {string} outputFormat Output format for bundled files.
	 */
	constructor(inputDirectory, outputDirectory, outputFormat) {
		this._inputDirectory = inputDirectory;
		this._outputDirectory = outputDirectory;
		this._outputFormat = outputFormat;
	}
}
