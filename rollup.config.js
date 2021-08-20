import { CommonInfoBuilder } from "./src/index";

const infoBuilder = new CommonInfoBuilder("src", "dist", "cjs");

export default [
	infoBuilder.configureNamedSource(
		"comcoronbu",
		"index.js",
		[],
		[
			infoBuilder.linkExternalPackage("fs", "fs"),
			infoBuilder.linkExternalPackage("path", "path")
		]
	).toOwnConfiguration()
];
