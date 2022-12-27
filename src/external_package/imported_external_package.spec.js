import { expect } from "chai"

import CommonInfo from "../common_info"
import { ImportedExternalPackage, interop } from "../index"

describe("Imported external package", () => {
	it("can be converted to configuration array", () => {
		const inputDirectory = "a"
		const outputDirectory = "b"
		const outputFormat = "c"
		const externalName = "d"
		const globalName = "e"
		const file = "f.js"
		const plugins = []
		const externals = []
		const externalPackage = new ImportedExternalPackage(
			new CommonInfo(inputDirectory, outputDirectory, outputFormat),
			externalName,
			globalName,
			file,
			plugins,
			externals
		)

		const configurations = externalPackage.toConfigurationArray()

		expect(configurations).to.deep.equal([ {
			"input": "a/f.js",
			"output": {
				"file": "b/f.js",
				"format": "c",
				interop,
				"name": "e"
			}
		} ])
	})
})
