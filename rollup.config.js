import { CommonInfoBuilder } from "./src/index";

const infoBuilder = new CommonInfoBuilder("src", "dist", "cjs");

export default [
	infoBuilder.configureNamedSource(
		"comcoronbu",
		"index.js",
		[],
		[
			infoBuilder.linkExternalPackage("node:fs", "node:fs"),
			infoBuilder.linkExternalPackage("node:path", "node:path")
		]
	).toOwnConfiguration()
];
