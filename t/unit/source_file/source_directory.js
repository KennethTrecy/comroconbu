/* eslint-disable max-lines-per-function */
import { ImportedExternalPackage, SourceDirectory, UnnamedSourceFile, interop } from "../../../src";
import CommonInfo from "../../../src/common_info";
import { sep } from "path";

it("can scan directory", () => {
	const inputDirectory = "t/dummy";
	const outputDirectory = "a";
	const outputFormat = "b";
	const plugins = [];
	const externals = [];
	const renamer = path => path;
	const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat);

	const sourceDirectory = new SourceDirectory(
		commonInfo,
		plugins,
		externals,
		renamer
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
	const renamer = path => path;
	const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat);
	const sourceDirectory = new SourceDirectory(
		commonInfo,
		plugins,
		externals,
		renamer
	);

	const configurationArray = sourceDirectory.toConfigurationArray();

	expect(configurationArray).toStrictEqual([
		{
			"input": "t/dummy/a.js",
			"output": {
				"file": "c/a.js",
				"format": "d",
				interop
			}
		}, {
			"input": "t/dummy/README.md",
			"output": {
				"file": "c/README.md",
				"format": "d",
				interop
			}
		}, {
			"input": `t/dummy/b${sep}c.js`,
			"output": {
				"file": `c/b${sep}c.js`,
				"format": "d",
				interop
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
	const renamer = path => path;
	const sourceDirectory = new SourceDirectory(
		new CommonInfo(inputDirectoryA, outputDirectoryA, outputFormatA),
		plugins,
		externals,
		renamer
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
				},
				interop
			}
		}, {
			"input": "g/l.js",
			"output": {
				"file": "h/l.js",
				"format": "i",
				interop,
				"name": "k"
			}
		}
	]);
});

it("can rename path", () => {
	const inputDirectory = "t/dummy";
	const outputDirectory = "m";
	const outputFormat = "n";
	const plugins = [];
	const externals = [];
	const renamer = path => `${path}.sample`;
	const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat);

	const sourceDirectory = new SourceDirectory(
		commonInfo,
		plugins,
		externals,
		renamer
	);

	expect(sourceDirectory._sourceFiles).toStrictEqual([
		new UnnamedSourceFile(commonInfo, "a.js.sample", [], []),
		new UnnamedSourceFile(commonInfo, "README.md.sample", [], []),
		new UnnamedSourceFile(commonInfo, `b${sep}c.js.sample`, [], [])
	]);
});
