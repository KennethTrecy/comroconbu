import CommonInfo from "../../../src/common_info";
import { ImportedExternalPackage } from "../../../src";

it("can be converted to configuration array", () => {
	const inputDirectory = "a";
	const outputDirectory = "b";
	const outputFormat = "c";
	const externalName = "d";
	const globalName = "e";
	const file = "f.js";
	const plugins = [];
	const externals = [];
	const externalPackage = new ImportedExternalPackage(
		externalName,
		globalName,
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		file,
		plugins,
		externals
	);

	const configurations = externalPackage.toConfigurationArray();

	expect(configurations).toStrictEqual([ {
		"input": "a/f.js",
		"output": {
			"file": "b/f.js",
			"format": "c",
			"name": "e"
		}
	} ]);
});
