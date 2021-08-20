import { SourceDirectory, UnnamedSourceFile } from "../../../src";
import CommonInfo from "../../../src/common_info";
import { sep } from "path";

it("can scan directory", () => {
	const inputDirectory = "t/dummy";
	const outputDirectory = "a";
	const outputFormat = "b";
	const plugins = [];
	const externals = [];
	const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat);

	const sourceDirectory = new SourceDirectory(
		commonInfo,
		plugins,
		externals
	);

	expect(sourceDirectory._sourceFiles).toStrictEqual([
		new UnnamedSourceFile(commonInfo, "a.js", [], []),
		new UnnamedSourceFile(commonInfo, "README.md", [], []),
		new UnnamedSourceFile(commonInfo, `b${sep}c.js`, [], [])
	]);
});

it("can become into configuration array without externals and plugins", () => {
	const inputDirectory = "t/dummy";
	const outputDirectory = "c";
	const outputFormat = "d";
	const plugins = [];
	const externals = [];
	const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat);
	const sourceDirectory = new SourceDirectory(
		commonInfo,
		plugins,
		externals
	);

	const configurationArray = sourceDirectory.toConfigurationArray();

	expect(configurationArray).toStrictEqual([
		{
			"input": "t/dummy/a.js",
			"output": {
				"file": "c/a.js",
				"format": "d"
			}
		}, {
			"input": "t/dummy/README.md",
			"output": {
				"file": "c/README.md",
				"format": "d"
			}
		}, {
			"input": `t/dummy/b${sep}c.js`,
			"output": {
				"file": `c/b${sep}c.js`,
				"format": "d"
			}
		}
	]);
});
