import { expect } from "chai"

import AbstractExternalPackage from "./abstract_external_package"

describe("Abstract external package", () => {
	it("cannot be converted to configuration array", () => {
		const externalPackage = new AbstractExternalPackage("a", "b")

		expect(() => {
			externalPackage.toConfigurationArray()
		}).to.throw(TypeError)
	})

	it("can get globals", () => {
		const externalPackage = new AbstractExternalPackage("c", "d")

		const globals = externalPackage.getGlobals()

		expect(globals).to.deep.equal({ "c": "d" })
	})
})
