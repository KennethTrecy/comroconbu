/**
 * An abstraction of source file.
 */
export default class AbstractSourceFile {
	/**
	 * Converts the representation into a configuration.
	 */
	toConfigurationArray() {
		throw new TypeError("Cannot convert an abstract source to array of configurations.");
	}
}
