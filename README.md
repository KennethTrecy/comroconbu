# Comroconbu
Builds configuration that can be used by [Rollup](https://rollupjs.org/). It will be based from
common patterns of configuration in my personal projects.

## Installation
Run the following on your command line:
```
npm install --save-dev git+https://github.com/KennethTrecy/comroconbu#v0.2.1
```

## Usage Example

### Basic Configuration (without external packages)
Example of `rollup.config.js` that imports `comroconbu`:
```
import { CommonInfoBuilder } from "comroconbu";
import pluginA from "example-package-a";

const commonInfoBuilder = new CommonInfoBuilder(
   "src",   // Input directory
   "dist",  // Output directory
   "iife"   // Output format
);

export default [
   ...commonInfoBuilder.configureNamedSource(
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

### Advance Configuration (with plugins and external packages)
Example of `rollup.config.js` that imports `comroconbu`:
```
import { CommonInfoBuilder } from "comroconbu";
import pluginA from "example-package-a";
import pluginB from "example-package-b";

const commonInfoBuilder = new CommonInfoBuilder("src", "dist", "iife");

export default [
   ...commonInfoBuilder.configureNamedSource(
      "index",
      "index.js",
      [
         pluginA()
      ],
      [
         // Put the external packages as fourth argument.

         // Linked external packages are external packages linked by CDN in the document or by
         // other means.
         commonInfoBuilder.linkExternalPackage(
            "library-a", // Package name used to import in the named source file
            "$"         // Global identifier for the package
         ),

         // Imported external packages are external packages imported to a file yet it is not
         // included in the source.
         commonInfoBuilder.importExternalPackage(
            "library-b", // Package name
            "_",        // Global identifier for the package
            "dependencies/library-b.js",   // Path to the file relative to the input directory
            [
               // Plugins for bundling the external package
               pluginA(),
               pluginB()
            ],
            [
               // External packages for this external package
            ]
         )

         // Rebundled external package is a compilation of other external packages.
         commonInfoBuilder.rebundleExternalPackage(
            "BundleC",  // Global identifier to access all external packages
            {
               // Name (key) and global identifier (value) of external packages
               "framework-d": "frameworkD",
               "library-e": "libraryE"
            },
            "dependencies/bundle-c.js",   // Path to the file that imports all external packages
            [
               // Put plugins here
            ],
            [
               // You may put external packages that will not be included in the bundle.
               // This argument is optional.
            ]
         )
      ]
   ).toConfigurationArray()
];
```

The above configuration is the same as below:
```
import pluginA from "example-package-a";
import pluginB from "example-package-b";

export default [
   {
      "external": [ "library-a", "library-b", "framework-d", "library-e" ],
      "input": "src/index.js",
      "output": {
         "file": "dist/index.js",
         "format": "iife",
         "globals": {
            "library-a": "$",
            "library-b": "_",
            "framework-d": "BundleC.frameworkD",
            "library-e": "BundleC.libraryE",
         },
         "interop": "esModule",
         "name", "index"
      },
      "plugins": [
         pluginA()
      ]
   }, {
      "input": "src/dependencies/library-b.js",
      "output": {
         "file": "dist/dependencies/library-b.js",
         "format": "iife",
         "interop": "esModule",
         "name": "_"
      },
      "plugins": [
         pluginA(),
         pluginB()
      ]
   }, {
      "input": "src/dependencies/bundle-c.js",
      "output": {
         "file": "dist/dependencies/bundle-c.js",
         "format": "iife",
         "interop": "esModule",
         "name": "BundleC"
      }
   }
];
```

### Other methods and classes
Above examples showed how to use [`CommonInfoBuilder`](src/common_info_builder.js) and its methods
`toConfigurationArray`, `linkExternalPackage`, `importExternalPackage`, and
`rebundleExternalPackage`. There are also other methods namely:
- `configureUnnamedSource`. Suitable when specifying unnamed source.
- `configureSourceDirectory`. Suitable when specifying a collection of unnamed source files which
  may have common plugin(s) and/or external package(s).
- `getCommonInfo`. Returns common information used to create configurations of others.

Some of those methods may create an instance of one of the following classes:
- [`NamedSourceFile`](src/source_file/named_source_file.js). Created by `configureNamedSource`
  method.
- [`UnnamedSourceFile`](src/source_file/unnamed_source_file.js). Created by `configureUnamedSource`
  method.
- [`SourceDirectory`](src/source_file/source_directory.js). Created by `configureSourceDirectory`
  method.
- [`LinkedExternalPackage`](src/external_package/linked_external_package.js). Created by
  `linkExternalPackage` method.
- [`ImportedExternalPackage`](src/external_package/imported_external_package.js). Created by
  `importExternalPackage` method.
- [`RebundledExternalPackage`](src/external_package/rebundled_external_package.js). Created by
  `rebundleExternalPackage` method.

## Assumptions
There are following assumptions considered while building this library:
- The path of input files and output files have almost the same path. The only difference is their
  root directory.
- Some modules may be linked to other separately-bundled modules.
- Some external packages will be rebundled into one file.
- The value of [`output.interop`](https://rollupjs.org/guide/en/#outputinterop) of every
  configuration is `esModule`.

## Author
Created by Kenneth Trecy Tobias.
