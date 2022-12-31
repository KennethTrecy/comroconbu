[![Web Front-end Tests](https://img.shields.io/github/actions/workflow/status/KennethTrecy/comroconbu/front-end.yml?style=for-the-badge)](https://github.com/KennethTrecy/comroconbu/actions/workflows/front-end.yml)
![GitHub lines](https://img.shields.io/github/license/KennethTrecy/comroconbu?style=for-the-badge)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/KennethTrecy/comroconbu?style=for-the-badge&display_name=tag&sort=semver)
![GitHub closed issues count](https://img.shields.io/github/issues-closed/KennethTrecy/comroconbu?style=for-the-badge)
![GitHub pull request count](https://img.shields.io/github/issues-pr-closed/KennethTrecy/comroconbu?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/KennethTrecy/comroconbu?style=for-the-badge)
![Lines of code](https://img.shields.io/tokei/lines/github/KennethTrecy/comroconbu?style=for-the-badge)
![GitHub code size in bytes](https://img.shields.io/github/repo-size/KennethTrecy/comroconbu?style=for-the-badge)

# Comroconbu
> Builds configuration that can be used by [Rollup]. It will be based from
common patterns of configuration in my personal projects.

## Installation
Run the following on your command line:
```
npm install --save-dev git+https://github.com/KennethTrecy/comroconbu#v0.3.0
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
Above examples showed how to use [`CommonInfoBuilder`] and its methods `toConfigurationArray`,
`linkExternalPackage`, `importExternalPackage`, and `rebundleExternalPackage`. There are also other
methods namely:
- `configureUnnamedSource`. Suitable when specifying unnamed source.
- `configureSourceDirectory`. Suitable when specifying a collection of unnamed source files which
  may have common plugin(s) and/or external package(s).
- `getCommonInfo`. Returns common information used to create configurations of others.

Some of those methods may create an instance of one of the following classes:
- [`NamedSourceFile`]. Created by `configureNamedSource` method.
- [`UnnamedSourceFile`]. Created by `configureUnamedSource` method.
- [`SourceDirectory`]. Created by `configureSourceDirectory` method.
- [`LinkedExternalPackage`]. Created by `linkExternalPackage` method.
- [`ImportedExternalPackage`]. Created by `importExternalPackage` method.
- [`RebundledExternalPackage`]. Created by `rebundleExternalPackage` method.

## Origin
Some parts of the repository was based from [`docker_js-mocha`] branch of [Web Template].

The template is specialized for front-end development.

## Development
These are the following instructions to start contributing in the project.

### Initialization
This repository should be initialized to adhere in [Conventional Commits specification] for organize
commits and automated generation of change log.

#### Prerequisites
- [Node.js and NPM]
- [pnpm] (optional)

#### Instructions
By running the command below, all your commits will be linted to follow the [Conventional Commits
specification].
```
$ npm install
```

Or if you have installed [pnpm], run the following command:
```
$ pnpm install
```

To generate the change log automatically, run the command below:
```
$ npx changelogen --from=[tag name or branch name or commit itself] --to=master
```

## Assumptions
There are following assumptions considered while building this library:
- The path of input files and output files have almost the same path. The only difference is their
  root directory.
- Some modules may be linked to other separately-bundled modules.
- Some external packages will be rebundled into one file.
- The value of [`output.interop`] of every configuration is `esModule`.

## Notes

### Want to contribute?
Read the [contributing guide] for different ways to contribute in the project.

### Author
Coded by Kenneth Trecy Tobias. Licensed under [MIT].

[`docker_js-mocha`]: https://github.com/KennethTrecy/web_template/tree/docker_js-mocha
[Web Template]: https://github.com/KennethTrecy/web_template/
[Rollup]: https://rollupjs.org/
[MIT]: https://github.com/KennethTrecy/comroconbu/blob/master/LICENSE
[Node.js and NPM]: https://nodejs.org/en/
[pnpm]: https://pnpm.io/installation
[Conventional Commits specification]: https://www.conventionalcommits.org/en/v1.0.0/
[contributing guide]: ./CONTRIBUTING.md
[`output.interop`]: https://rollupjs.org/guide/en/#outputinterop
[`CommonInfoBuilder`]: src/common_info_builder.js
[`NamedSourceFile`]: src/source_file/named_source_file.js
[`UnnamedSourceFile`]: src/source_file/unnamed_source_file.js
[`SourceDirectory`]: src/source_file/source_directory.js
[`LinkedExternalPackage`]: src/external_package/linked_external_package.js
[`ImportedExternalPackage`]: src/external_package/imported_external_package.js
[`RebundledExternalPackage`]: src/external_package/rebundled_external_package.js
