import { join } from "node:path"
import { readdirSync } from "node:fs"

// eslint-disable-next-line no-unused-vars
import AbstractExternalPackage from "../abstract_external_package"
import AbstractSourceFile from "../abstract_source_file"
// eslint-disable-next-line no-unused-vars
import CommonInfo from "../common_info"
// eslint-disable-next-line no-unused-vars
import RelativePathPairBuilder from "./relative_path_pair_builder"
import UnnamedSourceFile from "./unnamed_source_file"

/**
 * Represent a collection source files within the directory.
 *
 * It will search the files using the input directory from common information.
 */
export default class SourceDirectory extends AbstractSourceFile {
	/**
	 * Creates a representation of collection of files.
	 * @param {CommonInfo} commonInfo Common information needed to bundle the files.
	 * @param {any[]|((RelativePathPair) => any[])} plugins Array of common plugins to bundle the
	 *                                                      source or function that receives the
	 *                                                      relative path pair from builder.
	 * @param {AbstractExternalPackage[]} externals Array of common external packages.
	 * @param {RelativePathPairBuilder} pathPairBuilder Class to create relative paths.
	 */
	constructor(commonInfo, plugins, externals, pathPairBuilder) {
		super()
		this._sourceFiles = []
		this._externals = externals

		const { inputDirectory } = commonInfo
		const directories = [ inputDirectory ]
		while (directories.length > 0) {
			const currentDirectory = directories.shift()

			readdirSync(currentDirectory, { "withFileTypes": true }).forEach(relativePath => {
				const relativePathToInput = join(
					currentDirectory.slice(inputDirectory.length === 0 ? 0 : inputDirectory.length + 1),
					relativePath.name
				)
				const pathPair = pathPairBuilder.build(relativePathToInput, relativePathToInput)
				if (relativePath.isFile()) {
					const sourceFile = new UnnamedSourceFile(
						commonInfo,
						pathPair,
						typeof plugins === "function"
							? plugins(pathPair)
							: plugins,
						externals
					)
					this._sourceFiles.push(sourceFile)
				} else {
					directories.push(join(currentDirectory, relativePath.name))
				}
			})
		}
	}

	toConfigurationArray() {
		const configurations = []

		for (const sourceFile of this._sourceFiles) {
			const configuration = sourceFile.toOwnConfiguration()
			configurations.push(configuration)
		}

		for (const externalPackage of this._externals) {
			configurations.push(...externalPackage.toConfigurationArray())
		}

		return configurations
	}
}
