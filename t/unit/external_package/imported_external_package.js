import { ImportedExternalPackage, interop } from "../../../src";
import CommonInfo from "../../../src/common_info";

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
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		externalName,
		globalName,
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
			interop,
			"name": "e"
		}
	} ]);
});
