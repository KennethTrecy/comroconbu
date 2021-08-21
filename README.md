# Comroconbu
Builds configuration that can be used by [Rollup](https://rollupjs.org/). It will be based from
common patterns of configuration in my personal projects.

## Installation
Run the following on your command line:
```
npm install git+http://repo.local/KennethTrecy/comroconbu#v0.1.0
```

## Usage Example

### Basic Configuration (without external packages)
Example of `rollup.config.js` that imports `comcoronbu`:
```
import { CommonInfoBuilder } from "comcoronbu";
import pluginA from "example-package-a";

const commonInfoBuilder = new CommonInfoBuilder(
   "src",   // Input directory
   "dist",  // Output directory
   "iife"   // Output format
);

export default [
   ...infoBuilder.configureNamedSource(
      "index",    // Name of the source (Acts as the global identifier)
      "index.js", // Where to find the file relative to the input directory
      [
         // Put the plugins here
         pluginA()
      ]
   ).toConfigurationArray()
];
```

The above example is the same as writing the configuration below:
```
import pluginA from "example-package-a";

export default [
   {
      "input": "src/index.js",
      "output": {
         "file": "dist/index.js",
         "format": "iife",
         "interop": "esModule",
         "name", "index"
      },
      "plugins": [
         pluginA()
      ]
   }
];
```

## Author
Created by Kenneth Trecy Tobias.
