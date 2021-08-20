import AbstractExternalPackage from "../../src/abstract_external_package";

it("cannot be converted to configuration array", () => {
	const externalPackage = new AbstractExternalPackage("a", "b");

	expect(() => {
		externalPackage.toConfigurationArray();
	}).toThrow(TypeError);
});

it("can get globals", () => {
	const externalPackage = new AbstractExternalPackage("c", "d");

	const globals = externalPackage.getGlobals();

	expect(globals).toStrictEqual({ "c": "d" });
});
