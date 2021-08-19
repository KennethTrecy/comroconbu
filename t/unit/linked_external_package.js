import { LinkedExternalPackage } from "../../src";

it("cannot be converted to configuration array", () => {
	const externalPackage = new LinkedExternalPackage("a", "b");

	const configurations = externalPackage.toConfigurationArray();

	expect(configurations).toEqual([]);
});
