import { ImportedExternalPackage, LinkedExternalPackage, UnnamedSourceFile, interop }
	from "../../../src";
import CommonInfo from "../../../src/common_info";

it("can become into configuration array without externals and plugins", () => {
	const inputDirectory = "a";
	const outputDirectory = "b";
	const outputFormat = "c";
	const file = "d.js";
	const plugins = [];
	const externals = [];
	const sourceFile = new UnnamedSourceFile(
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		file,
		plugins,
		externals
	);

	const configurations = sourceFile.toConfigurationArray();

	expect(configurations).toStrictEqual([ {
		"input": "a/d.js",
		"output": {
			"file": "b/d.js",
			"format": "c",
			interop
		}
	} ]);
});

it("can become into configuration array with plugins but without externals", () => {
	const inputDirectory = "e";
	const outputDirectory = "f";
	const outputFormat = "g";
	const file = "h.js";
	const plugins = [ jest.fn() ];
	const externals = [];
	const sourceFile = new UnnamedSourceFile(
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		file,
		plugins,
		externals
	);

	const configurations = sourceFile.toConfigurationArray();

	expect(configurations).toStrictEqual([ {
		"input": "e/h.js",
		"output": {
			"file": "f/h.js",
			"format": "g",
			interop
		},
		plugins
	} ]);
});

it("can become into configuration array with plugins and linked external packages", () => {
	const inputDirectory = "i";
	const outputDirectory = "j";
	const outputFormat = "k";
	const file = "l.js";
	const plugins = [ jest.fn() ];
	const externalName = "m";
	const globalName = "n";
	const externals = [
		new LinkedExternalPackage(externalName, globalName)
	];
	const sourceFile = new UnnamedSourceFile(
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		file,
		plugins,
		externals
	);

	const configurations = sourceFile.toConfigurationArray();

	expect(configurations).toStrictEqual([ {
		"external": [ "m" ],
		"input": "i/l.js",
		"output": {
			"file": "j/l.js",
			"format": "k",
			"globals": {
				"m": "n"
			},
			interop
		},
		plugins
	} ]);
});

it("can become into own configuration", () => {
	const inputDirectory = "o";
	const outputDirectory = "p";
	const outputFormat = "q";
	const file = "r.js";
	const plugins = [];
	const externals = [];
	const sourceFile = new UnnamedSourceFile(
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		file,
		plugins,
		externals
	);

	const configurations = sourceFile.toConfigurationArray();

	expect(configurations).toStrictEqual([ {
		"input": "o/r.js",
		"output": {
			"file": "p/r.js",
			"format": "q",
			interop
		}
	} ]);
});

it("can include external packages in configuration array", () => {
	const inputDirectory = "s";
	const outputDirectory = "t";
	const outputFormat = "u";
	const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat);
	const file = "v.js";
	const plugins = [];
	const externalName = "w";
	const globalName = "x";
	const externalFile = "y.js";
	const externals = [
		new ImportedExternalPackage(commonInfo, externalName, globalName, externalFile, [], [])
	];
	const sourceFile = new UnnamedSourceFile(
		commonInfo,
		file,
		plugins,
		externals
	);

	const configurations = sourceFile.toConfigurationArray();

	expect(configurations).toStrictEqual([
		{
			"external": [ "w" ],
			"input": "s/v.js",
			"output": {
				"file": "t/v.js",
				"format": "u",
				"globals": {
					"w": "x"
				},
				interop
			}
		}, {
			"input": "s/y.js",
			"output": {
				"file": "t/y.js",
				"format": "u",
				interop,
				"name": "x"
			}
		}
	]);
});
