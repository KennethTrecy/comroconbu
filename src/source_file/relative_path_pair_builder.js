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
	 * @param {string} outputPath Path to bundled file.
	 */
	build(inputPath, outputPath) {
		return new RelativePathPair(this._commonInfo, inputPath, outputPath)
	}
}
