import { expect } from "chai"

import { LinkedExternalPackage } from "../index"

describe("Linked external package", () => {
	it("can be converted to configuration array", () => {
		const externalPackage = new LinkedExternalPackage("a", "b")

		const configurations = externalPackage.toConfigurationArray()

		expect(configurations).to.deep.equal([])
	})
})
