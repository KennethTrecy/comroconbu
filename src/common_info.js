/**
 * Represents a container for common info.
 */
export default class CommonInfo {
	/**
	 * Creates a simple container for common info.
	 * @param {string} inputDirectory Directory of source files.
	 * @param {string} outputDirectory Directory of bundled files.
	 * @param {string} outputFormat Output format for bundled files.
	 */
	constructor(inputDirectory, outputDirectory, outputFormat) {
		this.inputDirectory = inputDirectory;
		this.outputDirectory = outputDirectory;
		this.outputFormat = outputFormat;
	}
}
