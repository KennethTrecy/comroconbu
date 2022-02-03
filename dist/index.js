'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var path = require('path');

/**
 * An abstraction of source file.
 */
class AbstractSourceFile {
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
	toConfigurationArray() {
		throw new TypeError("Cannot convert an abstract source to array of configurations.");
	}
}

/**
 * An abstraction of external package.
 */
class AbstractExternalPackage extends AbstractSourceFile {
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

/**
 * Represents a container for common info.
 */
class CommonInfo {
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

/**
 * This is the assumed value of interop for all configurations that will be created.
 * See: https://rollupjs.org/guide/en/#outputinterop
 */
const interop = "esModule";

/**
 * Represents an module file.
 */
class UnnamedSourceFile extends AbstractSourceFile {
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
		function appendSlashNecessarily(string) {
			if (string === "") return string;
			return `${string}/`;
		}
		const input = `${appendSlashNecessarily(this._commonInfo.inputDirectory)}${this._file}`;
		const file = `${appendSlashNecessarily(this._commonInfo.outputDirectory)}${this._file}`;
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

/**
 * Represents a source file that will be bundled.
 */
class NamedSourceFile extends UnnamedSourceFile {
	/**
	 * Creates a representation of source file.
	 * @param {CommonInfo} commonInfo Common information for sources.
	 * @param {string} name Name of the bundle.
	 * @param {string} file The path of the source file to be bundled relative to the
	 *                 `inputDirectory` of `CommonInfoBuilder` class.
	 * @param {any} plugins Plugins that will be used to bundle the source file.
	 * @param {AbstractExternalPackage[]} externals Optional. Array of external packages that will
	 *                                    not be included in the bundle.
	 */
	constructor(commonInfo, name, file, plugins, externals = []) {
		super(commonInfo, file, plugins, externals);
		this._name = name;
	}

	_convertIntoBasicConfiguration() {
		const configuration = super._convertIntoBasicConfiguration();

		configuration.output.name = this._name;

		return configuration;
	}
}

/**
 * Represents a package linked by importing it.
 */
class ImportedExternalPackage extends AbstractExternalPackage {
	/**
	 * Creates a representation of imported external package.
	 * @param {CommonInfo} commonInfo Common information from common info builder.
	 * @param {string} externalName The name of the linked package.
	 * @param {string} globalName The global variable that identifies the linked package.
	 * @param {string} file The path to the source file which imports the external package.
	 * @param {any[]} plugins Plugins that will be used to bundle the source file.
	 * @param {AbstractExternalPackage[]} [externals=[]] Array of external packages that will not be
	 *                                                   included in the bundle.
	 */
	constructor(commonInfo, externalName, globalName, file, plugins, externals = []) {
		super(externalName, globalName);
		this._sourceFile = new NamedSourceFile(commonInfo, globalName, file, plugins, externals);
	}

	toConfigurationArray() {
		return this._sourceFile.toConfigurationArray();
	}
}

/**
 * Represents an external package linked by using CDN or others.
 */
class LinkedExternalPackage extends AbstractExternalPackage {
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

/**
 * Represents an external package that rebundles other packages into one file.
 */
class RebundledExternalPackage extends AbstractExternalPackage {
	/**
	 * Creates a representation of rebundled external package.
	 * @param {CommonInfo} commonInfo Common information from common info builder.
	 * @param {string} globalName The global identifier that will represent the rebundled package.
	 * @param {Object} subglobals Pairs of external name (key) and global variable (value) of every
	 *                            external package that will be rebundled.
	 * @param {string} file The path to the source file which imports the external packages to be
	 *                      rebundled.
	 * @param {any[]} plugins Plugins that will be used to bundle the source file.
	 * @param {AbstractExternalPackage[]} [externals=[]] Array of external packages that will not be
	 *                                                   included in the bundle.
	 */
	constructor(commonInfo, globalName, subglobals, file, plugins, externals = []) {
		super("", globalName);
		this._subglobals = subglobals;
		this._sourceFile = new NamedSourceFile(commonInfo, globalName, file, plugins, externals);
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

/**
 * Represent a collection source files within the directory.
 *
 * It will search the files using the input directory from common information.
 */
class SourceDirectory extends AbstractSourceFile {
	/**
	 * Creates a representation of collection of files.
	 * @param {CommonInfo} commonInfo Common information needed to bundle the files.
	 * @param {any[]} plugins Array of common plugins to bundle the source.
	 * @param {AbstractExternalPackage[]} externals Array of common external packages.
	 */
	constructor(commonInfo, plugins, externals) {
		super();
		this._sourceFiles = [];
		this._externals = externals;

		const { inputDirectory } = commonInfo;
		const directories = [ inputDirectory ];
		while (directories.length > 0) {
			const currentDirectory = directories.shift();

			fs.readdirSync(currentDirectory).forEach(relativePath => {
				const completePath = path.join(currentDirectory, relativePath);
				if (fs.lstatSync(completePath).isFile()) {
					const pathRelativeToCommonInputDirectory = completePath.slice(inputDirectory.length);
					// Remove leading separator
					const cleanPath = pathRelativeToCommonInputDirectory.slice(1);
					const sourceFile = new UnnamedSourceFile(commonInfo, cleanPath, plugins, externals);
					this._sourceFiles.push(sourceFile);
				} else {
					directories.push(completePath);
				}
			});
		}
	}

	toConfigurationArray() {
		const configurations = [];

		for (const sourceFile of this._sourceFiles) {
			const configuration = sourceFile.toOwnConfiguration();
			configurations.push(configuration);
		}

		for (const externalPackage of this._externals) {
			configurations.push(...externalPackage.toConfigurationArray());
		}

		return configurations;
	}
}

/**
 * Represents a builder which contains common information for configurations that will be created.
 */
class CommonInfoBuilder {
	/**
	 * Creates the builder.
	 * @param {string} inputDirectory Directory of source files.
	 * @param {string} outputDirectory Directory of bundled files.
	 * @param {string} outputFormat Output format for bundled files.
	 */
	constructor(inputDirectory, outputDirectory, outputFormat) {
		this._commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat);
	}

	/**
	 * Creates a representation of named source file.
	 * @param {string} name Name of the bundle.
	 * @param {string} file The path of the source file to be bundled relative to the
	 *                 `inputDirectory` of this class.
	 * @param {any[]} plugins Plugins that will be used to bundle the source file.
	 * @param {AbstractExternalPackage[]} [externals=[]] Optional. Array of external packages that
	 *                                    will not be included in the bundle.
	 * @returns {NamedSourceFile} A representation of named source file.
	 */
	configureNamedSource(name, file, plugins, externals = []) {
		return new NamedSourceFile(this._commonInfo, name, file, plugins, externals);
	}

	/**
	 * Creates a representation of unnamed source file.
	 * @param {string} file The path of the source file to be bundled relative to the
	 *                 `inputDirectory` of this class.
	 * @param {any[]} plugins Plugins that will be used to bundle the source file.
	 * @param {AbstractExternalPackage[]} [externals=[]] Optional. Array of external packages that
	 *                                    will not be included in the bundle.
	 * @returns {UnnamedSourceFile} A representation of unnamed source files.
	 */
	configureUnnamedSource(file, plugins, externals = []) {
		return new UnnamedSourceFile(this._commonInfo, file, plugins, externals);
	}

	/**
	 * Creates a representation of source directory.
	 * @param {any[]} plugins Common plugins to be applied to the source files found in the input
	 *                      directory.
	 * @param {AbstractExternalPackage[]} [externals=[]] Optional. Array of common external packages
	 *                                    that will not be included in the configuration of each
	 *                                    source file.
	 * @returns {SourceDirectory} A representation of source directory.
	 */
	configureSourceDirectory(plugins, externals = []) {
		return new SourceDirectory(this._commonInfo, plugins, externals);
	}

	/**
	 * Creates a representation of imported external package.
	 * @param {string} externalName The name of the imported external package.
	 * @param {string} globalName The global variable that identifies the imported external package.
	 * @param {string} file The path of the source file which imports the external package.
	 * @param {any[]} plugins Plugins that will be used to bundle the external package.
	 * @param {AbstractExternalPackage[]} [externals=[]] Optional. Array of external packages that
	 *                                    will not be included in the bundle.
	 * @returns {ImportedExternalPackage} A representation of imported external package.
	 */
	importExternalPackage(externalName, globalName, file, plugins, externals = []) {
		return new ImportedExternalPackage(
			this._commonInfo,
			externalName,
			globalName,
			file,
			plugins,
			externals
		);
	}

	/**
	 * Creates a representation of linked external package.
	 * @param {string} externalName The name of the external package linked by CDN or others.
	 * @param {string} globalName The global variable that identifies the linked external package.
	 * @returns {LinkedExternalPackage} A representation of linked external package.
	 */
	linkExternalPackage(externalName, globalName) {
		return new LinkedExternalPackage(externalName, globalName);
	}

	/**
	 * Creates a representation of rebundled external packages.
	 * @param {string} globalName The global identifier representing the rebundled external packages.
	 * @param {Object} subglobals Pairs of external name (key) and global variable (value) of
	 *                            external packages.
	 * @param {string} file The path of the source file which imports the external packages to be
	 *                      rebundled.
	 * @param {any[]} plugins Plugins that will be used to rebundle the external packages.
	 * @param {AbstractExternalPackage[]} [externals=[]] Optional. Array of external packages that
	 *                                    will not be included in the rebundling process.
	 * @returns {RebundledExternalPackage} A representation of imported external package.
	 */
	rebundleExternalPackages(globalName, subglobals, file, plugins, externals = []) {
		return new RebundledExternalPackage(
			this._commonInfo,
			globalName,
			subglobals,
			file,
			plugins,
			externals
		);
	}
}

exports.CommonInfoBuilder = CommonInfoBuilder;
exports.ImportedExternalPackage = ImportedExternalPackage;
exports.LinkedExternalPackage = LinkedExternalPackage;
exports.NamedSourceFile = NamedSourceFile;
exports.RebundledExternalPackage = RebundledExternalPackage;
exports.SourceDirectory = SourceDirectory;
exports.UnnamedSourceFile = UnnamedSourceFile;
exports.interop = interop;
