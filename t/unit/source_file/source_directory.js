/* eslint-disable max-lines-per-function */
import { ImportedExternalPackage, SourceDirectory, UnnamedSourceFile } from "../../../src";
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

it("can include external packages in configuration array", () => {
	const inputDirectoryA = "t/dummy/b";
	const outputDirectoryA = "e";
	const outputFormatA = "f";
	const inputDirectoryB = "g";
	const outputDirectoryB = "h";
	const outputFormatB = "i";
	const plugins = [];
	const externalName = "j";
	const globalName = "k";
	const externalFile = "l.js";
	const externals = [
		new ImportedExternalPackage(
			new CommonInfo(inputDirectoryB, outputDirectoryB, outputFormatB),
			externalName,
			globalName,
			externalFile,
			[],
			[]
		)
	];
	const sourceDirectory = new SourceDirectory(
		new CommonInfo(inputDirectoryA, outputDirectoryA, outputFormatA),
		plugins,
		externals
	);

	const configurationArray = sourceDirectory.toConfigurationArray();

	expect(configurationArray).toStrictEqual([
		{
			"external": [ "j" ],
			"input": "t/dummy/b/c.js",
			"output": {
				"file": "e/c.js",
				"format": "f",
				"globals": {
					"j": "k"
				}
			}
		}, {
			"input": "g/l.js",
			"output": {
				"file": "h/l.js",
				"format": "i",
				"name": "k"
			}
		}
	]);
});
