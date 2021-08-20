import { LinkedExternalPackage, NamedSourceFile, interop } from "../../../src";
import CommonInfo from "../../../src/common_info";

it("can become into configuration array without externals and plugins", () => {
	const inputDirectory = "a";
	const outputDirectory = "b";
	const outputFormat = "c";
	const name = "d";
	const file = "e.js";
	const plugins = [];
	const externals = [];
	const sourceFile = new NamedSourceFile(
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		name,
		file,
		plugins,
		externals
	);

	const configurations = sourceFile.toConfigurationArray();

	expect(configurations).toStrictEqual([ {
		"input": "a/e.js",
		"output": {
			"file": "b/e.js",
			"format": "c",
			interop,
			"name": "d"
		}
	} ]);
});

it("can become into configuration array with plugins but without externals", () => {
	const inputDirectory = "f";
	const outputDirectory = "g";
	const outputFormat = "h";
	const name = "i";
	const file = "j.js";
	const plugins = [ jest.fn() ];
	const externals = [];
	const sourceFile = new NamedSourceFile(
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		name,
		file,
		plugins,
		externals
	);

	const configurations = sourceFile.toConfigurationArray();

	expect(configurations).toStrictEqual([ {
		"input": "f/j.js",
		"output": {
			"file": "g/j.js",
			"format": "h",
			interop,
			"name": "i"
		},
		plugins
	} ]);
});

it("can become into configuration array with plugins and linked external packages", () => {
	const inputDirectory = "k";
	const outputDirectory = "l";
	const outputFormat = "m";
	const name = "n";
	const file = "o.js";
	const plugins = [ jest.fn() ];
	const externalName = "p";
	const globalName = "q";
	const externals = [
		new LinkedExternalPackage(externalName, globalName)
	];
	const sourceFile = new NamedSourceFile(
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		name,
		file,
		plugins,
		externals
	);

	const configurations = sourceFile.toConfigurationArray();

	expect(configurations).toStrictEqual([ {
		"external": [ "p" ],
		"input": "k/o.js",
		"output": {
			"file": "l/o.js",
			"format": "m",
			"globals": {
				"p": "q"
			},
			interop,
			"name": "n"
		},
		plugins
	} ]);
});
