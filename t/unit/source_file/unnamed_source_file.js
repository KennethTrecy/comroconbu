import { LinkedExternalPackage, UnnamedSourceFile } from "../../../src";
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
			"format": "c"
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
			"format": "g"
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
			}
		},
		plugins
	} ]);
});
