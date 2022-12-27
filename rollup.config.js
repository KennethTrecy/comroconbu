import { CommonInfoBuilder } from "./src/index"
import esbuild from "rollup-plugin-esbuild-transform"

const infoBuilder = new CommonInfoBuilder("src", "dist", "cjs")

export default [
	infoBuilder.configureNamedSource(
		"comcoronbu",
		"index.js",
		[
			esbuild([
				{
					"loader": "ts",
					"tsconfig": "tsconfig.json"
				},
				{
					"loader": "js",
					"output": true
				}
			])
		],
		[
			infoBuilder.linkExternalPackage("fs", "fs"),
			infoBuilder.linkExternalPackage("path", "path")
		]
	).toOwnConfiguration()
]
