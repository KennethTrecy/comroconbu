import { CommonInfoBuilder, Source } from "../../src";
import CommonInfo from "../../src/common_info";

it("can build source representation", () => {
	const inputDirectory = "a";
	const outputDirectory = "b";
	const outputFormat = "c";
	const builder = new CommonInfoBuilder(inputDirectory, outputDirectory, outputFormat);
	const name = "d";
	const file = "e.js";
	const plugins = [];
	const externals = [];

	const source = builder.configure(name, file, plugins, externals);

	expect(source).toStrictEqual(new Source(
		new CommonInfo(inputDirectory, outputDirectory, outputFormat),
		name,
		file,
		plugins,
		externals
	));
});
