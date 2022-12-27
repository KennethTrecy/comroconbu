import { expect } from "chai"

import CommonInfo from "./common_info"
import { CommonInfoBuilder, NamedSourceFile } from "./index"

describe("Common info", () => {
	it("can build source representation", () => {
		const inputDirectory = "a"
		const outputDirectory = "b"
		const outputFormat = "c"
		const builder = new CommonInfoBuilder(inputDirectory, outputDirectory, outputFormat)
		const name = "d"
		const file = "e.js"
		const plugins = []
		const externals = []

		const source = builder.configureNamedSource(name, file, plugins, externals)

		expect(source).to.deep.equal(new NamedSourceFile(
			new CommonInfo(inputDirectory, outputDirectory, outputFormat),
			name,
			file,
			plugins,
			externals
		))
	})
})
