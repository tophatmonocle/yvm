# Yarn Version Manager (yvm)

<span><img align="right" width="200" height="200" src="https://raw.githubusercontent.com/tophat/yvm/master/website/static/img/yarn.png" alt="Logo"></span>

<!-- BADGES:START -->

[![YVM Latest Version](https://img.shields.io/github/release/tophat/yvm.svg)](https://github.com/tophat/yvm/releases)
[![Minimum Node Version](https://img.shields.io/badge/node-%3E%3D%2010-brightgreen.svg)](https://nodejs.org)
[![Builds](https://github.com/tophat/yvm/workflows/Continuous%20Integration/badge.svg)](https://github.com/tophat/yvm/actions)
[![codecov](https://codecov.io/gh/tophat/yvm/branch/master/graph/badge.svg?token=idXHLksicU)](https://codecov.io/gh/tophat/yvm)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Dependencies](https://img.shields.io/librariesio/github/tophat/yvm)](https://libraries.io/github/tophat/yvm)
[![Dependabot](https://badgen.net/dependabot/tophat/yvm?icon=dependabot)](https://app.dependabot.com/accounts/tophat/repos/137530684)
[![All Contributors](https://img.shields.io/badge/all_contributors-27-orange.svg?style=flat-square)](#contributors-)
[![Discord](https://img.shields.io/discord/809577721751142410)](https://discord.gg/YhK3GFcZrk)
[![Maturity badge - level 3](https://img.shields.io/badge/Maturity-Level%203%20--%20Stable-green.svg)](https://github.com/tophat/getting-started/blob/master/scorecard.md)
[![Pull Reminders](https://pullreminders.com/badge.svg)](https://pullreminders.com?ref=badge)

<!-- BADGES:END -->

## Overview

<!-- OVERVIEW-DOCS:START -->

Pesky yarn versions got you down? Automatically and easily manage those versions.

YVM will automatically use the correct yarn version when you run any yarn commands in any folder with a `package.json`, `.yvmrc` or any other [supported configuration](https://yvm.js.org/docs/faq#declare-yvm-version-in-a-configuration-file-where-can-i-place-my-version-number) file. Otherwise, it will use you a globally set version of yarn.

## Motivation

Manually managing different yarn versions across projects is a pain. This fixes that.

## Installation

Node: >=12.0.0

### Homebrew

Installs the latest stable version.

```sh
brew install tophat/bar/yvm --without-node
```

**NOTE**: Remove the flag `--without-node` to install with the node dependency.

### Windows

[TODO: #435](https://github.com/tophat/yvm/issues/435)

### Node

Execute the following in your terminal:

```bash
curl -s https://raw.githubusercontent.com/tophat/yvm/master/scripts/install.js | node
```

Or to install a specific version:

```bash
curl -s https://raw.githubusercontent.com/tophat/yvm/v3.2.1/scripts/install.js | INSTALL_VERSION="v3.2.1" node
```

### Script

Some older versions of yvm do not have the node installer enabled. If so the shell script installer can be used.

```bash
curl -s https://raw.githubusercontent.com/tophat/yvm/v2.4.3/scripts/install.sh | INSTALL_VERSION="v2.4.3" bash
```

### Manual

Navigate to [yvm releases](https://github.com/tophat/yvm/releases) and download the `yvm.js` file for the latest release into your desired yvm install directory.

Typically `.yvm` your home directory, then run the following command to configure your shell.

```bash
node ./home/joe_user/.yvm/yvm.js configure-shell
```

You will need to reload the shell to get yvm, or source the generated `yvm.{sh,fish}` scripts.

### Upgrade

To upgrade yvm to the lastest version either install as normal, or run

```bash
yvm update-self
```

## Usage

### Automagic

Run any yarn command and watch it automagically use the correct version of yarn.

Yarn is shimmed to use the default version or the version defined your current directory [config file](#configuration-file).

```sh
yarn --version
```

### Basic

To download and install a specific version of yarn, run:

```bash
yvm install <version>
```

To get the latest version of Yarn, run:

```bash
yvm install latest
```

Execute an arbitrary command using a specific version of yarn:

```bash
yvm exec <version> <command>
```

### Additional commands

Switch the current yarn versions:

```bash
yvm use <version>
yarn --version
```

**NOTE**: The above disables [yarn shimming](#automagic) until a new shell is loaded.

Control version aliasing:

```bash
yvm alias stable
# stable → 1.13.0 (1.13.0)

yvm alias default stable
# default → stable (1.13.0)

yvm alias
# default → stable (1.13.0)
# latest → 1.14.0 (1.14.0)
# stable → 1.13.0 (1.13.0)
# system → 1.13.0 (1.13.0)

yvm alias default '^1.7'
# default → ^1.7 (1.14.0)
```

Show path to version used:

```bash
yvm which
```

List installed yarn versions:

```bash
yvm list
```

Full list of available commands:

```bash
yvm --help
```

### Configuration file

Yvm defaults to using the `yarn` version in your `package.json` `engines`. Otherwise you can create a `.yvmrc` file containing the version number of yarn in your project's root directory. Afterwards, `yvm use`, `yvm install` and `yvm exec` will use the version specified in the config file if no version number is supplied to the command.
You can also [declare the version using other configuration files](https://yvm.js.org/docs/faq#declare-yvm-version-in-a-configuration-file-where-can-i-place-my-version-number)

### Custom Bootstrapping

When using `yvm exec`, the appropriate `yarn` version is executed using the `node` available in the current context. This can be explicitly specified using the `YVM_BOOTSTRAP_EXEC_PATH` environment variable.

Example: if you are using `nvm`, you can avoid having to execute `nvm use` before using `yvm exec`:

```sh
export YVM_BOOTSTRAP_EXEC_PATH=~/.nvm/nvm-exec
yvm exec my-command
```

You can set this environment variable globally in your preferred shell's setup script (e.g. bashrc/zshrc).

The script referenced via the exec path must be executable. It receives the yarn executable as its first argument, and should forward the remaining arguments to yarn.

<!-- OVERVIEW-DOCS:END -->

### Additional reference

A full list of commands is on the [api reference page](https://yvm.js.org/docs/api)

Have questions? [List of common questions and answers](https://yvm.js.org/docs/faq)

## Removing

To remove yvm simply execute

```bash
rm -rf $YVM_DIR
```

Next, edit `$HOME/.bashrc` and `$HOME/.zshrc` and remove those lines:

```bash
export YVM_DIR=/home/joe_user/.yvm
[ -r $YVM_DIR/yvm.sh ] && . $YVM_DIR/yvm.sh
```

Remove in `$HOME/.config/fish/config.fish` for fishers:

```fish
set -x YVM_DIR /home/joe_user/.yvm
[ -r $YVM_DIR/yvm.fish ]; and source $YVM_DIR/yvm.fish
```

In case you had older version of yvm installed, there could also be a line like

```bash
source /home/joe_user/.yvm/yvm.sh
```

or those lines could be in `$HOME/.bash_profile` instead of `$HOME/.bashrc`.

## Contributing

<!-- CONTRIBUTING-DOCS:START -->

We welcome contributions from the community, Top Hatters and non-Top Hatters alike. Here are some guidelines to help you get started!

### Basic development flow

1. Ensure the problem you are solving [is an issue](https://github.com/tophat/yvm/issues) or you've created one
2. Clone the repo
3. We use make. `make help` will show you a list of development commands
4. `make install-watch` will install yvm on your shell and update when you make changes. Make sure to only run this in the root yvm directory, it will fail elsewhere.
5. `make test` and `make lint` are also commonly helpful

Make sure all changes are well documented. Our documentation can be found inside the `docs` section of this repo. Be sure to read it carefully and make modifications wherever necessary.
You can also access the documentation on our [website](https://yvm.js.org)

Please make sure to look over our [Code of Conduct](https://github.com/tophat/getting-started/blob/master/code-of-conduct.md) as well!

### Manual testing command contributions

```bash
make install
yvm <your-command-here>
```

### Technologies to Familiarize Yourself with

- [NodeJS](https://github.com/nodejs/node)
- [Yarn](https://github.com/yarnpkg/yarn)

<!-- CONTRIBUTING-DOCS:END -->

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/francoiscampbell"><img src="https://avatars3.githubusercontent.com/u/3876970?v=4" width="100px;" alt=""/><br /><sub><b>Francois Campbell</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=francoiscampbell" title="Code">💻</a></td>
    <td align="center"><a href="https://jakebolam.com"><img src="https://avatars2.githubusercontent.com/u/3534236?v=4" width="100px;" alt=""/><br /><sub><b>Jake Bolam</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=jakebolam" title="Documentation">📖</a> <a href="https://github.com/tophat/yvm/commits?author=jakebolam" title="Code">💻</a> <a href="#infra-jakebolam" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/brandonbaksh/"><img src="https://avatars1.githubusercontent.com/u/39271619?v=4" width="100px;" alt=""/><br /><sub><b>Brandon Baksh</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=brandonbaksh" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/nepodmitljivi"><img src="https://avatars3.githubusercontent.com/u/2070398?v=4" width="100px;" alt=""/><br /><sub><b>Milan Milojic</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=nepodmitljivi" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/umar-tophat"><img src="https://avatars2.githubusercontent.com/u/38886386?v=4" width="100px;" alt=""/><br /><sub><b>Umar Ahmed</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=umar-tophat" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/dat2"><img src="https://avatars0.githubusercontent.com/u/3258756?v=4" width="100px;" alt=""/><br /><sub><b>Nicholas Dujay</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=dat2" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/aeldamaty"><img src="https://avatars0.githubusercontent.com/u/3996927?v=4" width="100px;" alt=""/><br /><sub><b>Aser Eldamaty</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=aeldamaty" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://msrose.github.io"><img src="https://avatars3.githubusercontent.com/u/3495264?v=4" width="100px;" alt=""/><br /><sub><b>Michael Rose</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=msrose" title="Code">💻</a></td>
    <td align="center"><a href="http://www.sanchitgera.ca"><img src="https://avatars0.githubusercontent.com/u/8632167?v=4" width="100px;" alt=""/><br /><sub><b>Sanchit Gera</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=sanchitgera" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/sdcosta"><img src="https://avatars0.githubusercontent.com/u/6020693?v=4" width="100px;" alt=""/><br /><sub><b>sdcosta</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=sdcosta" title="Documentation">📖</a></td>
    <td align="center"><a href="https://breezio.com"><img src="https://avatars1.githubusercontent.com/u/445636?v=4" width="100px;" alt=""/><br /><sub><b>Siavash Mahmoudian</b></sub></a><br /><a href="#infra-syavash" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/apps/greenkeeper"><img src="https://avatars3.githubusercontent.com/in/505?v=4" width="100px;" alt=""/><br /><sub><b>greenkeeper[bot]</b></sub></a><br /><a href="#infra-greenkeeper[bot]" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/jcrumb"><img src="https://avatars0.githubusercontent.com/u/7827407?v=4" width="100px;" alt=""/><br /><sub><b>Jay Crumb</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=jcrumb" title="Documentation">📖</a></td>
    <td align="center"><a href="http://m.lunoe.dk"><img src="https://avatars0.githubusercontent.com/u/1097941?v=4" width="100px;" alt=""/><br /><sub><b>Michael Lunøe</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=mlunoe" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://www.yashshah.com"><img src="https://avatars3.githubusercontent.com/u/1558352?v=4" width="100px;" alt=""/><br /><sub><b>Yash Shah</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=yashshah" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/torinthiel"><img src="https://avatars0.githubusercontent.com/u/9504927?v=4" width="100px;" alt=""/><br /><sub><b>Wacław Schiller</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=torinthiel" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/yvm-bot"><img src="https://avatars0.githubusercontent.com/u/45925873?v=4" width="100px;" alt=""/><br /><sub><b>yvm-bot</b></sub></a><br /><a href="#infra-yvm-bot" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="http://emmanuel.ogbizi.com/"><img src="https://avatars0.githubusercontent.com/u/2528959?v=4" width="100px;" alt=""/><br /><sub><b>Emmanuel Ogbizi</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=iamogbz" title="Code">💻</a> <a href="https://github.com/tophat/yvm/commits?author=iamogbz" title="Tests">⚠️</a> <a href="https://github.com/tophat/yvm/commits?author=iamogbz" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/eastenluis"><img src="https://avatars3.githubusercontent.com/u/2723622?v=4" width="100px;" alt=""/><br /><sub><b>Martin Lai</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=eastenluis" title="Code">💻</a></td>
    <td align="center"><a href="https://marccataford.com"><img src="https://avatars2.githubusercontent.com/u/6210361?v=4" width="100px;" alt=""/><br /><sub><b>Marc Cataford</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=mcataford" title="Code">💻</a></td>
    <td align="center"><a href="http://www.ahmedelkady.xyz"><img src="https://avatars3.githubusercontent.com/u/6837609?v=4" width="100px;" alt=""/><br /><sub><b>Ahmed Elkady</b></sub></a><br /><a href="https://github.com/tophat/yvm/pulls?q=is%3Apr+reviewed-by%3Aaelkady" title="Reviewed Pull Requests">👀</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://noahnu.com"><img src="https://avatars0.githubusercontent.com/u/1297096?v=4" width="100px;" alt=""/><br /><sub><b>Noah</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=noahnu" title="Code">💻</a> <a href="#infra-noahnu" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/derekedelaney"><img src="https://avatars0.githubusercontent.com/u/14036573?v=4" width="100px;" alt=""/><br /><sub><b>Derek Delaney</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=derekedelaney" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/apps/dependabot"><img src="https://avatars0.githubusercontent.com/in/29110?v=4" width="100px;" alt=""/><br /><sub><b>dependabot[bot]</b></sub></a><br /><a href="#infra-dependabot[bot]" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/apps/allcontributors"><img src="https://avatars0.githubusercontent.com/in/23186?v=4" width="100px;" alt=""/><br /><sub><b>allcontributors[bot]</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=allcontributors[bot]" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/umar-ahmed"><img src="https://avatars1.githubusercontent.com/u/8302959?v=4" width="100px;" alt=""/><br /><sub><b>Umar Ahmed</b></sub></a><br /><a href="https://github.com/tophat/yvm/issues?q=author%3Aumar-ahmed" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://twitter.com/abi"><img src="https://avatars0.githubusercontent.com/u/50083?v=4" width="100px;" alt=""/><br /><sub><b>Abi Noda</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=abinoda" title="Documentation">📖</a> <a href="#projectManagement-abinoda" title="Project Management">📆</a></td>
    <td align="center"><a href="http://jdbd.nz"><img src="https://avatars2.githubusercontent.com/u/3292124?v=4" width="100px;" alt=""/><br /><sub><b>Josh Dean</b></sub></a><br /><a href="https://github.com/tophat/yvm/commits?author=jdbdnz" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/akeshk"><img src="https://avatars2.githubusercontent.com/u/16065212?v=4" width="100px;" alt=""/><br /><sub><b>akeshk</b></sub></a><br /><a href="#infra-akeshk" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#tool-akeshk" title="Tools">🔧</a> <a href="https://github.com/tophat/yvm/commits?author=akeshk" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## Credits

Thanks to [Carol Skelly](https://github.com/iatek) for donating the github organization!
