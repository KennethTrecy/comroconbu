/**
 * An abstraction of source file.
 */
export default class AbstractSourceFile {
	/**
	 * Converts the representation into an array of configurations.
	 *
	 * The array of configurations contains the configuration for the source itself and also the
	 * external source(s) that must be bundled.
	 *
	 * @return {{
	 *    "external": string[]
	 *    "input": string,
	 *    "output": {
	 *       "file": string,
	 *       "format": string,
	 *       "globals": Object,
	 *       "interop": string,
	 *       "name": string
	 *    },
	 *    "plugins": any[]
	 * }[]} An array of configurations. Note that `output.globals` and `external` are optional.
	 */
	// eslint-disable-next-line class-methods-use-this
	toConfigurationArray() {
		throw new TypeError("Cannot convert an abstract source to array of configurations.")
	}
}
