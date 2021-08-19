import CommonInfo from "../../src/common_info";
import { SourceFile } from "../../src";

it("can become into configuration array without externals and plugins", () => {
	const inputDirectory = "a";
	const outputDirectory = "b";
	const outputFormat = "c";
	const name = "d";
	const file = "e.js";
	const plugins = [];
	const externals = [];
	const sourceFile = new SourceFile(
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		name,
		file,
		plugins,
		externals
	);

	const configurations = sourceFile.toConfigurationArray();

	expect(configurations).toStrictEqual({
		"input": "a/e.js",
		"output": {
			"file": "b/e.js",
			"format": "c",
			"name": "d"
		}
	});
});

it("can become into configuration array with plugins but without externals", () => {
	const inputDirectory = "f";
	const outputDirectory = "g";
	const outputFormat = "h";
	const name = "i";
	const file = "j.js";
	const plugins = [ jest.fn() ];
	const externals = [];
	const sourceFile = new SourceFile(
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		name,
		file,
		plugins,
		externals
	);

	const configurations = sourceFile.toConfigurationArray();

	expect(configurations).toStrictEqual({
		"input": "f/j.js",
		"output": {
			"file": "g/j.js",
			"format": "h",
			"name": "i"
		},
		plugins
	});
});
