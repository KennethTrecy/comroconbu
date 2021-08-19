import AbstractExternalPackage from "../../src/abstract_external_package";


it("cannot be converted to configuration array", () => {
	const externalPackage = new AbstractExternalPackage("a", "b");

	expect(() => {
		externalPackage.toConfigurationArray();
	}).toThrow(TypeError);
});
