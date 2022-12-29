import RelativePathPair from "./relative_path_pair"

/**
 * Represents a builder for relative path pair.
 */
export default class RelativePathPairBuilder {
	/**
	 * Creates a representation of collection of files.
	 * @param {CommonInfo} commonInfo Common information needed to bundle the files.
	 */
	constructor(commonInfo) {
		this._commonInfo = commonInfo
	}

	/**
	 * Method to build a relative path. Ideally, this should be override if the developer want to
	 * return a different path pair for compilation.
	 *
	 * @param {string} inputPath Path to source file.
	 * @param {string|null} [outputPath=null] Path to bundled file. If not provided, it will the same
	 *                                        as input path.
	 */
	build(inputPath, outputPath = null) {
		return new RelativePathPair(this._commonInfo, inputPath, outputPath ?? inputPath)
	}
}
