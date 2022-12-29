/* eslint-disable max-lines-per-function */
import { expect } from "chai"

import CommonInfo from "../common_info"
import LinkedExternalPackage from "../external_package/linked_external_package"
import NamedSourceFile from "./named_source_file"
import RelativePathPair from "./relative_path_pair"
import interop from "../interop"

describe("Named source file", () => {
	describe("Paths specified using raw string", () => {
		it("can become into configuration array without externals and plugins", () => {
			const inputDirectory = "a"
			const outputDirectory = "b"
			const outputFormat = "c"
			const name = "d"
			const file = "e.js"
			const plugins = []
			const externals = []
			const sourceFile = new NamedSourceFile(
				new CommonInfo(inputDirectory, outputDirectory, outputFormat),
				name,
				file,
				plugins,
				externals
			)

			const configurations = sourceFile.toConfigurationArray()

			expect(configurations).to.deep.equal([ {
				"input": "a/e.js",
				"output": {
					"file": "b/e.js",
					"format": "c",
					interop,
					"name": "d"
				}
			} ])
		})

		it("can become into configuration array with plugins but without externals", () => {
			const inputDirectory = "f"
			const outputDirectory = "g"
			const outputFormat = "h"
			const name = "i"
			const file = "j.js"
			const plugins = [ () => {} ]
			const externals = []
			const sourceFile = new NamedSourceFile(
				new CommonInfo(inputDirectory, outputDirectory, outputFormat),
				name,
				file,
				plugins,
				externals
			)

			const configurations = sourceFile.toConfigurationArray()

			expect(configurations).to.deep.equal([ {
				"input": "f/j.js",
				"output": {
					"file": "g/j.js",
					"format": "h",
					interop,
					"name": "i"
				},
				plugins
			} ])
		})

		it("can become into configuration array with plugins and linked external packages", () => {
			const inputDirectory = "k"
			const outputDirectory = "l"
			const outputFormat = "m"
			const name = "n"
			const file = "o.js"
			const plugins = [ () => {} ]
			const externalName = "p"
			const globalName = "q"
			const externals = [
				new LinkedExternalPackage(externalName, globalName)
			]
			const sourceFile = new NamedSourceFile(
				new CommonInfo(inputDirectory, outputDirectory, outputFormat),
				name,
				file,
				plugins,
				externals
			)

			const configurations = sourceFile.toConfigurationArray()

			expect(configurations).to.deep.equal([ {
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
			} ])
		})
	})

	describe("Paths specified using relative path pair", () => {
		it("can become into configuration array without externals and plugins", () => {
			const inputDirectory = "a"
			const outputDirectory = "b"
			const outputFormat = "c"
			const name = "d"
			const file = "e.js"
			const plugins = []
			const externals = []
			const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat)
			const pathPair = new RelativePathPair(commonInfo, file, file)
			const sourceFile = new NamedSourceFile(
				commonInfo,
				name,
				pathPair,
				plugins,
				externals
			)

			const configurations = sourceFile.toConfigurationArray()

			expect(configurations).to.deep.equal([ {
				"input": "a/e.js",
				"output": {
					"file": "b/e.js",
					"format": "c",
					interop,
					"name": "d"
				}
			} ])
		})

		it("can become into configuration array with plugins but without externals", () => {
			const inputDirectory = "f"
			const outputDirectory = "g"
			const outputFormat = "h"
			const name = "i"
			const file = "j.js"
			const plugins = [ () => {} ]
			const externals = []
			const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat)
			const pathPair = new RelativePathPair(commonInfo, file, file)
			const sourceFile = new NamedSourceFile(
				commonInfo,
				name,
				pathPair,
				plugins,
				externals
			)

			const configurations = sourceFile.toConfigurationArray()

			expect(configurations).to.deep.equal([ {
				"input": "f/j.js",
				"output": {
					"file": "g/j.js",
					"format": "h",
					interop,
					"name": "i"
				},
				plugins
			} ])
		})

		it("can become into configuration array with plugins and linked external packages", () => {
			const inputDirectory = "k"
			const outputDirectory = "l"
			const outputFormat = "m"
			const name = "n"
			const file = "o.js"
			const plugins = [ () => {} ]
			const externalName = "p"
			const globalName = "q"
			const externals = [
				new LinkedExternalPackage(externalName, globalName)
			]
			const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat)
			const pathPair = new RelativePathPair(commonInfo, file, file)
			const sourceFile = new NamedSourceFile(
				commonInfo,
				name,
				pathPair,
				plugins,
				externals
			)

			const configurations = sourceFile.toConfigurationArray()

			expect(configurations).to.deep.equal([ {
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
			} ])
		})
	})
})
