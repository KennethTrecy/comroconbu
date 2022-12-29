/* eslint-disable max-lines-per-function */
import { sep } from "node:path"

import { expect } from "chai"

import CommonInfo from "../common_info"
import ImportedExternalPackage from "../external_package/imported_external_package"
import RelativePathPairBuilder from "./relative_path_pair_builder"
import SourceDirectory from "./source_directory"
import UnnamedSourceFile from "./unnamed_source_file"
import interop from "../interop"

describe("Source directory", () => {
	it("can scan directory", () => {
		const inputDirectory = `t${sep}dummy`
		const outputDirectory = "a"
		const outputFormat = "b"
		const plugins = []
		const externals = []
		const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat)
		const pathPairBuilder = new RelativePathPairBuilder(commonInfo)

		const sourceDirectory = new SourceDirectory(
			commonInfo,
			plugins,
			externals,
			pathPairBuilder
		)

		expect(sourceDirectory._sourceFiles).to.deep.equal([
			new UnnamedSourceFile(commonInfo, pathPairBuilder.build("README.md"), [], []),
			new UnnamedSourceFile(commonInfo, pathPairBuilder.build("a.js"), [], []),
			new UnnamedSourceFile(commonInfo, pathPairBuilder.build(`b${sep}c.js`), [], [])
		])
	})


	it("can become into configuration array without externals and plugins", () => {
		const inputDirectory = `t${sep}dummy`
		const outputDirectory = "c"
		const outputFormat = "d"
		const plugins = []
		const externals = []
		const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat)
		const pathPairBuilder = new RelativePathPairBuilder(commonInfo)
		const sourceDirectory = new SourceDirectory(
			commonInfo,
			plugins,
			externals,
			pathPairBuilder
		)

		const configurationArray = sourceDirectory.toConfigurationArray()

		expect(configurationArray).to.deep.equal([
			{
				"input": `t${sep}dummy${sep}README.md`,
				"output": {
					"file": `c${sep}README.md`,
					"format": "d",
					interop
				}
			}, {
				"input": `t${sep}dummy${sep}a.js`,
				"output": {
					"file": `c${sep}a.js`,
					"format": "d",
					interop
				}
			}, {
				"input": `t${sep}dummy${sep}b${sep}c.js`,
				"output": {
					"file": `c${sep}b${sep}c.js`,
					"format": "d",
					interop
				}
			}
		])
	})

	it("can include external packages in configuration array", () => {
		const inputDirectoryA = `t${sep}dummy${sep}b`
		const outputDirectoryA = "e"
		const outputFormatA = "f"
		const inputDirectoryB = "g"
		const outputDirectoryB = "h"
		const outputFormatB = "i"
		const plugins = []
		const externalName = "j"
		const globalName = "k"
		const externalFile = "l.js"
		const externals = [
			new ImportedExternalPackage(
				new CommonInfo(inputDirectoryB, outputDirectoryB, outputFormatB),
				externalName,
				globalName,
				externalFile,
				[],
				[]
			)
		]
		const commonInfo = new CommonInfo(inputDirectoryA, outputDirectoryA, outputFormatA)
		const pathPairBuilder = new RelativePathPairBuilder(commonInfo)
		const sourceDirectory = new SourceDirectory(
			commonInfo,
			plugins,
			externals,
			pathPairBuilder
		)

		const configurationArray = sourceDirectory.toConfigurationArray()

		expect(configurationArray).to.deep.equal([
			{
				"external": [ "j" ],
				"input": `t${sep}dummy${sep}b${sep}c.js`,
				"output": {
					"file": `e${sep}c.js`,
					"format": "f",
					"globals": {
						"j": "k"
					},
					interop
				}
			}, {
				"input": `g${sep}l.js`,
				"output": {
					"file": `h${sep}l.js`,
					"format": "i",
					interop,
					"name": "k"
				}
			}
		])
	})

	it("can rename path", () => {
		const inputDirectory = `t${sep}dummy`
		const outputDirectory = "m"
		const outputFormat = "n"
		const plugins = []
		const externals = []
		const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat)
		const pathPairBuilder = new class extends RelativePathPairBuilder {
			get completeOutputPath() {
				return `${super.completeOutputPath}.sample`
			}
		}(commonInfo)

		const sourceDirectory = new SourceDirectory(
			commonInfo,
			plugins,
			externals,
			pathPairBuilder
		)

		expect(sourceDirectory._sourceFiles).to.deep.equal([
			new UnnamedSourceFile(commonInfo, pathPairBuilder.build("README.md.sample"), [], []),
			new UnnamedSourceFile(commonInfo, pathPairBuilder.build("a.js.sample"), [], []),
			new UnnamedSourceFile(commonInfo, pathPairBuilder.build(`b${sep}c.js.sample`), [], [])
		])
	})
})
