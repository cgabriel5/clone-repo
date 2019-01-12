# clone-repo

##### Table of Contents

- [Overview](#overview)
- [Install](#install)
- [How To Use](#how-to-use)
- [API](#api)
- [Examples](#examples)
- [Options](#options)
- [OS Support](#os-support)
- [Contributing](#contributing)
- [License](#license)

<a name="overview"></a>

### Overview

Clones a public GitHub, GitLab, or BitBucket repo from the CLI using a simple, unified API.

<a name="install"></a>

### Install

```shell
# npm
$ npm install -g clone-repo

# yarn
$ yarn global add clone-repo
```

<a name="how-to-use"></a>

### How To Use

```shell
$ clone-repo myusername/mycoolrepo
```

<a name="api"></a>

### API

Single line representation:

```
<protocol?><host?>@<username>/<repo><#branch?>
```

<details>
  <summary>See verbose representation</summary>

```
<protocol:DEF(https);ALLOWED(https|ssh)>
<host:DEF(github);ALLOWED(github|gitlab|bitbucket|gh|gl|bb)>
@
<username:REQUIRED>
/
<repo:REQUIRED>
<#branch:OPTIONAL>
```

</details>

<a name="examples"></a>

### Examples

Things to note:

- Protocol defaults to `https`.
- Host defaults to `github`.

<details>
  <summary>See examples</summary>

##### Basic Use Case

```shell
$ clone-repo myusername/mycoolrepo # github + https
```

##### Hosts, Shortcuts

The following shortcuts exist:

- `gh` → `github`
- `gl` → `gitlab`
- `bb` → `bitbucket`

```shell
$ clone-repo gh@myusername/mycoolrepo # github + https
$ clone-repo gl@myusername/mycoolrepo # gitlab + https
$ clone-repo bb@myusername/mycoolrepo # bitbucket + https
```

##### Using SSH

**Note**: When using `ssh` to clone, you must ensure your public key is properly setup with the host you are trying to clone from or else it won't work.

```shell
$ clone-repo ssh:@myusername/mycoolrepo # github + ssh
$ clone-repo ssh:gh@myusername/mycoolrepo # github + ssh
$ clone-repo ssh:github@myusername/mycoolrepo # github + ssh

$ clone-repo ssh:gitlab@myusername/mycoolrepo # gitlab + ssh
$ clone-repo ssh:bitbucket@myusername/mycoolrepo # bitbucket + ssh
```

##### Cloning Branch

```shell
$ clone-repo myusername/mycoolrepo#my-feature # github + https + branch
$ clone-repo gl@myusername/mycoolrepo#my-feature # gitlab + https + branch
$ clone-repo ssh:bb@myusername/mycoolrepo#my-feature # bitbucket + ssh + branch
```

##### Renaming Repo

```shell
$ clone-repo myusername/mycoolrepo --name anothercoolname # github + https + rename
```

##### Specify Repo Destination

```shell
$ clone-repo myusername/mycoolrepo --dest ~/Desktop # github + https + dest
```

##### Renaming + Destination

```shell
$ clone-repo myusername/mycoolrepo --name anothercoolname --dest ~/Desktop # github + https + rename + dest
```

</details>

<a name="options"></a>

### Options

Available parameters (_supplied via CLI - see examples_):

- `--name` (`optional`)
  - Rename repo to provided name.
  - By default uses original repo name.
- `--dest path/to/destination` (`optional`)
  - The path where repo should be cloned to.
  - Uses `process.cwd()` if no destination provided.

<a name="os-support"></a>

### OS Support

- Made using Node.js `v8.14.0` on a Linux machine running `Ubuntu 16.04.5 LTS`.

<a name="contributing"></a>

### Contributing

Contributions are welcome! Found a bug, feel like documentation is lacking/confusing and needs an update, have performance/feature suggestions or simply found a typo? Let me know! :)

See how to contribute [here](/CONTRIBUTING.md).

<a name="attribution"></a>

### License

This project uses the [MIT License](/LICENSE.txt).
