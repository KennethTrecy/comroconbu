import { CommonInfoBuilder } from "./src/index"
import esbuild from "rollup-plugin-esbuild-transform"

const infoBuilder = new CommonInfoBuilder("src", "dist", "cjs")

export default [
	{
		"input": "src/index.ts",
		"output": {
			"file": "dist/index.js",
			"format": "esm",
			"interop": "auto",
			"name": "comroconbu"
		},
		"plugins": [
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
		]
	}
]
