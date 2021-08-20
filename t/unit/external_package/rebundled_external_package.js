import CommonInfo from "../../../src/common_info";
import { RebundledExternalPackage } from "../../../src";

it("can be converted to configuration array", () => {
	const inputDirectory = "a";
	const outputDirectory = "b";
	const outputFormat = "c";
	const globalName = "d";
	const subglobals = {};
	const file = "e.js";
	const plugins = [];
	const externals = [];
	const externalPackage = new RebundledExternalPackage(
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		globalName,
		subglobals,
		file,
		plugins,
		externals
	);

	const configurations = externalPackage.toConfigurationArray();

	expect(configurations).toStrictEqual([ {
		"input": "a/e.js",
		"output": {
			"file": "b/e.js",
			"format": "c",
			"name": "d"
		}
	} ]);
});

it("can get multiple globals", () => {
	const inputDirectory = "f";
	const outputDirectory = "g";
	const outputFormat = "h";
	const globalName = "i";
	const subglobals = {
		"j": "k",
		"l": "m"
	};
	const file = "n.js";
	const plugins = [];
	const externals = [];
	const externalPackage = new RebundledExternalPackage(
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		globalName,
		subglobals,
		file,
		plugins,
		externals
	);

	const globals = externalPackage.getGlobals();

	expect(globals).toStrictEqual({
		"j": "i.k",
		"l": "i.m"
	});
});
