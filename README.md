# Web Template
This is a web template repository of Kenneth Trecy Tobias. Its purpose is to be used for other
templates/projects either by forking this repository, copying its files, or merging its history to
other existing templates/projects.

This template has multiple branches that are named after the main package(s)/purpose they contain.
For example, [`vue` branch] contains [`vue` package]. If branch has multiple packages/purpose, they
are concatenated using `-` character. By default, most branches contain [`rollup` package] as
default JavaScript module bundler.

You can check the packages and/or purpose of the branch by reading the [notes] section.

<!--
The `origin` section may be used to indicate where the project (that is using this template) came
from or based from.

## Origin
Some parts of the repository was based from [`docker_js-mocha`] branch of [Web Template].

The template is specialize for front-end development.

-->

## Usage
You can modify this repository's files' content or names as much as you want.

### Initialization
This template should be initialized to adhere in [Conventional Commits specification] for organize
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

### Syncing template
You can merge this repository's history with your current project to synchronized your files from the
template. Steps below indicate how you can synchronize the changes.
1. Run `git remote add template [URL of this repository]`.
2. Run `git fetch template [branch you want to use from the template]`.
3. Run `git checkout template/[branch you want to use from the template]`.
4. Run `git checkout -b template--[branch you want to use from the template]`.
5. Run `git checkout -b merged_template`. Creates a branch where `master` branch will be merged with
   your chosen branch from template.
6. Run `git merge master --allow-unrelated-histories`. Fix merged conflicts if you encounter them
   then commit.

After step 6, it is ready. Just run the command below to sync the changes from template.
```
./merge_from_template.ps1 [branch you want to use from the template]
```

### License
The repository is licensed under [MIT]. Since this is a template repository, you can remove
license file if you want to use other license, or you can use the template repository for a private
template/project. You can run one of the following commands below:
- Run `./revert_commits_to.ps1 strict` to revert the license back to MIT license.
- Run `./revert_commits_to.ps1 remove` to remove the license completely.
- Run `./revert_commits_to.ps1 retain` does nothing aside from informing you that license will be
  retained.

After that, *revert_commits_to.ps1* will be removed.

## Notes
It is optional to attribute this repository in other template/projects.

### Branch
This branch can be used to other branches, templates, or projects.

Testing framework and other necessary packages were already installed in this branch.

### Want to contribute?
Read the [contributing guide] for different ways to contribute in the project.

### Author
Coded by Kenneth Trecy Tobias.

<!--

[`docker_js-mocha`]: https://github.com/KennethTrecy/web_template/tree/docker_js-mocha
[Web Template]: https://github.com/KennethTrecy/web_template/

-->

[notes]: #notes
[`vue` branch]: https://github.com/KennethTrecy/web_template/tree/vue
[`vue` package]: https://www.npmjs.com/package/vue
[`rollup` package]: https://www.npmjs.com/package/rollup
[MIT]: https://github.com/KennethTrecy/web_template/blob/master/LICENSE
[Node.js and NPM]: https://nodejs.org/en/
[pnpm]: https://pnpm.io/installation
[Conventional Commits specification]: https://www.conventionalcommits.org/en/v1.0.0/
[contributing guide]: ./CONTRIBUTING.md
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
