import { CommonInfoBuilder } from "./src/index";

const infoBuilder = new CommonInfoBuilder("src", "dist", "es");

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
