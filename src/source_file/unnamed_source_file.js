import AbstractExternalPackage from "../abstract_external_package";
import AbstractSourceFile from "../abstract_source_file";
import CommonInfo from "../common_info";

/**
 * Represents an module file.
 */
export default class UnnamedSourceFile extends AbstractSourceFile {
	/**
	 * Creates a representation of source file.
	 * @param {CommonInfo} commonInfo Common information for sources.
	 * @param {string} file The path of the source file to be bundled relative to the
	 *                      `inputDirectory` of `CommonInfoBuilder` class.
	 * @param {any} plugins Plugins that will be used to bundle the source file.
	 * @param {AbstractExternalPackage[]} externals Optional. Array of external packages that will
	 *                                    not be included in the bundle.
	 */
	constructor(commonInfo, file, plugins, externals = []) {
		super();
		this._commonInfo = commonInfo;
		this._file = file;
		this._plugins = plugins;
		this._externals = externals;
	}

	toConfigurationArray() {
		const input = `${this._commonInfo.inputDirectory}/${this._file}`;
		const file = `${this._commonInfo.outputDirectory}/${this._file}`;
		const format = this._commonInfo.outputFormat;

		const configuration = {
			input,
			"output": {
				file,
				format
			}
		};

		const plugins = this._plugins;

		if (plugins.length > 0) {
			configuration.plugins = plugins;
		}

		const configurations = [ configuration ];

		const external = [];
		const globals = {};

		for (const externalPackage of this._externals) {
			const exposedGlobals = externalPackage.getGlobals();

			for (const [ packageName, globalIdentifier ] of Object.entries(exposedGlobals)) {
				external.push(packageName);
				globals[packageName] = globalIdentifier;
			}

			configurations.push(...externalPackage.toConfigurationArray());
		}

		if (external.length > 0) configuration.external = external;
		if (Object.values(globals).length > 0) configuration.output.globals = globals;

		return configurations;
	}
}
