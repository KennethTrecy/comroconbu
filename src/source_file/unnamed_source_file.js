import AbstractExternalPackage from "../abstract_external_package";
import AbstractSourceFile from "../abstract_source_file";
import CommonInfo from "../common_info";
import interop from "../interop";

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

	/**
	 * Converts the representation into configuration object.
	 *
	 * It does not include the configuration of external packages.
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
	 * }} An object configuration. Note that `output.globals` and `external` are optional.
	 */
	toOwnConfiguration() {
		const configuration = this._convertIntoFullConfiguration();

		return configuration;
	}

	toConfigurationArray() {
		const configurations = [];

		const configuration = this._convertIntoFullConfiguration(externalPackage => {
			configurations.push(...externalPackage.toConfigurationArray());
		});

		configurations.unshift(configuration);

		return configurations;
	}

	_convertIntoBasicConfiguration() {
		const input = `${this._commonInfo.inputDirectory}/${this._file}`;
		const file = `${this._commonInfo.outputDirectory}/${this._file}`;
		const format = this._commonInfo.outputFormat;

		const configuration = {
			input,
			"output": {
				file,
				format,
				interop
			}
		};

		return configuration;
	}

	_convertIntoFullConfiguration(externalPackageProcessor = null) {
		const configuration = this._convertIntoBasicConfiguration();

		const plugins = this._plugins;

		if (plugins.length > 0) {
			configuration.plugins = plugins;
		}

		const external = [];
		const globals = {};

		for (const externalPackage of this._externals) {
			const exposedGlobals = externalPackage.getGlobals();

			for (const [ packageName, globalIdentifier ] of Object.entries(exposedGlobals)) {
				external.push(packageName);
				globals[packageName] = globalIdentifier;
			}

			if (externalPackageProcessor !== null) externalPackageProcessor(externalPackage);
		}

		if (external.length > 0) configuration.external = external;
		if (Object.values(globals).length > 0) configuration.output.globals = globals;

		return configuration;
	}
}
