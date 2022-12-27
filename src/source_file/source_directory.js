import { join } from "path"
import { lstatSync, readdirSync } from "fs"

// eslint-disable-next-line no-unused-vars
import AbstractExternalPackage from "../abstract_external_package"
import AbstractSourceFile from "../abstract_source_file"
// eslint-disable-next-line no-unused-vars
import CommonInfo from "../common_info"
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
	 * @param {any[]|((input, output) => any[])} plugins Array of common plugins to bundle the
	 *                                                   source.
	 * @param {AbstractExternalPackage[]} externals Array of common external packages.
	 * @param {{(relativePath: string) => string}} renamer Function that accepts a relative path and
	 *                                                     rename the output file necessarily.
	 */
	constructor(commonInfo, plugins, externals, renamer) {
		super()
		this._sourceFiles = []
		this._externals = externals

		const { inputDirectory } = commonInfo
		const directories = [ inputDirectory ]
		while (directories.length > 0) {
			const currentDirectory = directories.shift()

			readdirSync(currentDirectory).forEach(relativePath => {
				const completePath = join(currentDirectory, relativePath)
				if (lstatSync(completePath).isFile()) {
					const pathRelativeToCommonInputDirectory = completePath.slice(inputDirectory.length)
					// Remove leading separator
					const cleanPath = pathRelativeToCommonInputDirectory.slice(1)
					const renamedPath = renamer(cleanPath)
					const sourceFile = new UnnamedSourceFile(
						commonInfo,
						renamedPath,
						typeof plugins === "function"
							? plugins(commonInfo.inputDirectory, commonInfo.outputDirectory)
							: plugins,
						externals)
					this._sourceFiles.push(sourceFile)
				} else {
					directories.push(completePath)
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
