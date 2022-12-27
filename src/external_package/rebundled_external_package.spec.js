import { expect } from "chai"

import CommonInfo from "../common_info"
import { RebundledExternalPackage, interop } from "../index"

it("can be converted to configuration array", () => {
	const inputDirectory = "a"
	const outputDirectory = "b"
	const outputFormat = "c"
	const globalName = "d"
	const subglobals = {}
	const file = "e.js"
	const plugins = []
	const externals = []
	const externalPackage = new RebundledExternalPackage(
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		globalName,
		subglobals,
		file,
		plugins,
		externals
	)

	const configurations = externalPackage.toConfigurationArray()

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

it("can get multiple globals", () => {
	const inputDirectory = "f"
	const outputDirectory = "g"
	const outputFormat = "h"
	const globalName = "i"
	const subglobals = {
		"j": "k",
		"l": "m"
	}
	const file = "n.js"
	const plugins = []
	const externals = []
	const externalPackage = new RebundledExternalPackage(
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		globalName,
		subglobals,
		file,
		plugins,
		externals
	)

	const globals = externalPackage.getGlobals()

	expect(globals).to.deep.equal({
		"j": "i.k",
		"l": "i.m"
	})
})
