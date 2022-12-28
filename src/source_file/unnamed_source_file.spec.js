/* eslint-disable max-lines-per-function */
import { sep } from "path"

import { expect } from "chai"

import CommonInfo from "../common_info"
import {
	ImportedExternalPackage,
	LinkedExternalPackage,
	UnnamedSourceFile,
	interop
} from "../index"

describe("Unnamed source file", () => {
	describe("Path specified using raw string", () => {
		it("can become into configuration array without externals and plugins", () => {
			const inputDirectory = "a"
			const outputDirectory = "b"
			const outputFormat = "c"
			const file = "d.js"
			const plugins = []
			const externals = []
			const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat)
			const sourceFile = new UnnamedSourceFile(
				commonInfo,
				file,
				plugins,
				externals
			)

			const configurations = sourceFile.toConfigurationArray()

			expect(configurations).to.deep.equal([ {
				"input": `a${sep}d.js`,
				"output": {
					"file": `b${sep}d.js`,
					"format": "c",
					interop
				}
			} ])
		})

		it("can become into configuration array with plugins but without externals", () => {
			const inputDirectory = "e"
			const outputDirectory = "f"
			const outputFormat = "g"
			const file = "h.js"
			const plugins = [ () => {} ]
			const externals = []
			const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat)
			const sourceFile = new UnnamedSourceFile(
				commonInfo,
				file,
				plugins,
				externals
			)

			const configurations = sourceFile.toConfigurationArray()

			expect(configurations).to.deep.equal([ {
				"input": `e${sep}h.js`,
				"output": {
					"file": `f${sep}h.js`,
					"format": "g",
					interop
				},
				plugins
			} ])
		})

		it("can become into configuration array with plugins and linked external packages", () => {
			const inputDirectory = "i"
			const outputDirectory = "j"
			const outputFormat = "k"
			const file = "l.js"
			const plugins = [ () => {} ]
			const externalName = "m"
			const globalName = "n"
			const externals = [
				new LinkedExternalPackage(externalName, globalName)
			]
			const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat)
			const sourceFile = new UnnamedSourceFile(
				commonInfo,
				file,
				plugins,
				externals
			)

			const configurations = sourceFile.toConfigurationArray()

			expect(configurations).to.deep.equal([ {
				"external": [ "m" ],
				"input": `i${sep}l.js`,
				"output": {
					"file": `j${sep}l.js`,
					"format": "k",
					"globals": {
						"m": "n"
					},
					interop
				},
				plugins
			} ])
		})

		it("can become into own configuration", () => {
			const inputDirectory = "o"
			const outputDirectory = "p"
			const outputFormat = "q"
			const file = "r.js"
			const plugins = []
			const externals = []
			const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat)
			const sourceFile = new UnnamedSourceFile(
				commonInfo,
				file,
				plugins,
				externals
			)

			const configurations = sourceFile.toConfigurationArray()

			expect(configurations).to.deep.equal([ {
				"input": `o${sep}r.js`,
				"output": {
					"file": `p${sep}r.js`,
					"format": "q",
					interop
				}
			} ])
		})

		it("can include external packages in configuration array", () => {
			const inputDirectory = "s"
			const outputDirectory = "t"
			const outputFormat = "u"
			const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat)
			const file = "v.js"
			const plugins = []
			const externalName = "w"
			const globalName = "x"
			const externalFile = "y.js"
			const externals = [
				new ImportedExternalPackage(commonInfo, externalName, globalName, externalFile, [], [])
			]
			const sourceFile = new UnnamedSourceFile(
				commonInfo,
				file,
				plugins,
				externals
			)

			const configurations = sourceFile.toConfigurationArray()

			expect(configurations).to.deep.equal([
				{
					"external": [ "w" ],
					"input": `s${sep}v.js`,
					"output": {
						"file": `t${sep}v.js`,
						"format": "u",
						"globals": {
							"w": "x"
						},
						interop
					}
				}, {
					"input": `s${sep}y.js`,
					"output": {
						"file": `t${sep}y.js`,
						"format": "u",
						interop,
						"name": "x"
					}
				}
			])
		})

		it("may not append slash", () => {
			const inputDirectory = ""
			const outputDirectory = "z"
			const outputFormat = "aa"
			const file = "ab.js"
			const plugins = []
			const externals = []
			const commonInfo = new CommonInfo(inputDirectory, outputDirectory, outputFormat)
			const sourceFile = new UnnamedSourceFile(
				commonInfo,
				file,
				plugins,
				externals
			)

			const configurations = sourceFile.toConfigurationArray()

			expect(configurations).to.deep.equal([ {
				"input": "ab.js",
				"output": {
					"file": `z${sep}ab.js`,
					"format": "aa",
					interop
				}
			} ])
		})
	})
})
