import { join } from "path"

// eslint-disable-next-line no-unused-vars
import CommonInfo from "../common_info"

/**
 * Represents a pair of path to input and output file for compilation relative to the common
 * directory info.
 */
export default class RelativePathPair {
	/**
	 * Creates a representation of path pair.
	 * @param {CommonInfo} commonInfo Common information needed to bundle the files were input and
	 *                                output path are based.
	 * @param {string} inputPath Path to source file.
	 * @param {string} outputPath Path to bundled file.
	 */
	constructor(commonInfo, inputPath, outputPath) {
		this._commonInfo = commonInfo
		this._inputPath = inputPath
		this._outputPath = outputPath
	}

	/**
	 * Gets the original input path that was passed.
	 *
	 * Implementors should not override this method.
	 */
	get originalRelativeInputPath() {
		return this._inputPath
	}

	/**
	 * Gets the original input path joined with input directory.
	 *
	 * Implementors should not override this method.
	 */
	get originalCompleteInputPath() {
		return join(this._commonInfo.inputDirectory, this.originalRelativeInputPath)
	}

	/**
	 * Gets the input path joined with input directory.
	 */
	get completeInputPath() {
		return this.originalCompleteInputPath
	}

	/**
	 * Gets the original output path that was passed.
	 *
	 * Implementors should not override this method.
	 */
	get originalRelativeOutputPath() {
		return this._outputPath
	}

	/**
	 * Gets the output path joined with output directory.
	 *
	 * Implementors should not override this method.
	 */
	get originalCompleteOutputPath() {
		return join(this._commonInfo.outputDirectory, this.originalRelativeOutputPath)
	}

	/**
	 * Gets the output path joined with output directory.
	 */
	get completeOutputPath() {
		return this.originalCompleteOutputPath
	}
}
