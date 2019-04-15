# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.15.3](https://github.com/flyacts/backend-media-management/compare/v0.15.2...v0.15.3) (2019-04-15)

**Note:** Version bump only for package @flyacts/backend-media-management





## [0.15.2](https://github.com/flyacts/backend-media-management/compare/v0.15.1...v0.15.2) (2019-03-25)


### Bug Fixes

* no files are available return undefined ([ccb8c99](https://github.com/flyacts/backend-media-management/commit/ccb8c99))





# [0.15.0](https://github.com/flyacts/backend-media-management/compare/v0.14.0...v0.15.0) (2019-03-20)

**Note:** Version bump only for package @flyacts/backend-media-management





# [0.14.0](https://github.com/flyacts/backend-media-management/compare/v0.13.3...v0.14.0) (2019-03-19)


### Features

* use flyacts routing controller ([f678c92](https://github.com/flyacts/backend-media-management/commit/f678c92))





## [0.13.2](https://github.com/flyacts/backend-media-management/compare/v0.13.1...v0.13.2) (2019-03-09)

**Note:** Version bump only for package @flyacts/backend-media-management





## [0.13.1](https://github.com/flyacts/backend-media-management/compare/v0.13.0...v0.13.1) (2019-03-09)


### Features

* update typeorm to 0.2.14 ([7b8ae8c](https://github.com/flyacts/backend-media-management/commit/7b8ae8c))





# 0.13.0 (2019-03-08)


### Bug Fixes

* better stream handling ([2ac55a3](https://github.com/flyacts/backend-media-management/commit/2ac55a3))
* inherit file entity from base entity ([cdebdb4](https://github.com/flyacts/backend-media-management/commit/cdebdb4))
* linting and build issues ([3dd96ff](https://github.com/flyacts/backend-media-management/commit/3dd96ff))
* make the sortorder optional ([aa89fa1](https://github.com/flyacts/backend-media-management/commit/aa89fa1))
* release query runner after finishing its work ([86df0ff](https://github.com/flyacts/backend-media-management/commit/86df0ff))
* remove unnecessary async declaration ([3e5ee1c](https://github.com/flyacts/backend-media-management/commit/3e5ee1c))
* use a postgresql compatible type ([e7431ef](https://github.com/flyacts/backend-media-management/commit/e7431ef))
* use a postgresql compatible type ([1b4ed46](https://github.com/flyacts/backend-media-management/commit/1b4ed46))
* use constant ([dcf4879](https://github.com/flyacts/backend-media-management/commit/dcf4879))
* use postgresql data types ([4c0644e](https://github.com/flyacts/backend-media-management/commit/4c0644e))


### Features

* add a getter for the raw file ([34ca79f](https://github.com/flyacts/backend-media-management/commit/34ca79f))
* add a method for deleting media ([5312f71](https://github.com/flyacts/backend-media-management/commit/5312f71))
* add a method to get a file from the store ([1b29a89](https://github.com/flyacts/backend-media-management/commit/1b29a89))
* add a sortorder ([d0a2b85](https://github.com/flyacts/backend-media-management/commit/d0a2b85))
* allow to pass mimetype when attaching new media ([ed8f1a5](https://github.com/flyacts/backend-media-management/commit/ed8f1a5))
* allow transaction reuse ([4528877](https://github.com/flyacts/backend-media-management/commit/4528877))
* create a configurable tempDir ([084bb9c](https://github.com/flyacts/backend-media-management/commit/084bb9c))
* replace mmmagic with file-type ([cff65b2](https://github.com/flyacts/backend-media-management/commit/cff65b2))





### 0.8.0 (2019-02-26)

##### New Features

*  replace mmmagic with file-type ([3c4dfb8a](https://github.com/flyacts/backend-media-management/commit/3c4dfb8ab86abbf59ef916240ca8d4a6b6cda30f))

### 0.7.0 (2019-02-22)

##### New Features

*  allow to pass mimetype when attaching new media ([04d4e1d2](https://github.com/flyacts/backend-media-management/commit/04d4e1d27f96d9a4cfca5e5e03cff2fd190a549e))

### 0.6.0 (2019-02-22)

##### Bug Fixes

*  release query runner after finishing its work ([9d248824](https://github.com/flyacts/backend-media-management/commit/9d2488249e0e8ea6552492ce187816baa3dffe81))

### 0.5.0 (2019-02-18)

##### New Features

*  create a configurable tempDir ([022c0e1d](https://github.com/flyacts/backend-media-management/commit/022c0e1d2faf385596540d37ba7f330e250950a1))

### 0.4.0 (2019-02-14)

##### Bug Fixes

*  add transaction manager to removeMedia method ([889a452b](https://github.com/flyacts/backend-media-management/commit/889a452ba86c93887af4790229afa3e4a55d4274))

#### 0.3.2 (2019-02-08)

##### New Features

*  add a getter for the raw file ([b176ea3b](https://github.com/flyacts/backend-media-management/commit/b176ea3bcc89e7943754f094b44561b0c1f59c96))

##### Bug Fixes

*  use constant ([6a709f2b](https://github.com/flyacts/backend-media-management/commit/6a709f2b362c8b3368e58d6520afaff63d5ba01b))

#### 0.3.2 (2019-02-08)

##### New Features

*  add a getter for the raw file ([b176ea3b](https://github.com/flyacts/backend-media-management/commit/b176ea3bcc89e7943754f094b44561b0c1f59c96))

#### 0.3.1 (2019-02-08)

##### Bug Fixes

*  make the sortorder optional ([fb48c351](https://github.com/flyacts/backend-media-management/commit/fb48c3513e17b596b96623c3633ee13b7c55098d))

### 0.3.0 (2019-02-08)

##### Chores

*  update the user management ([c36df2cd](https://github.com/flyacts/backend-media-management/commit/c36df2cd1c3feb2b3aa12b519ea7253917137471))

##### New Features

*  add a sortorder ([c248f49e](https://github.com/flyacts/backend-media-management/commit/c248f49eaf87001d3ade3ef944279713e735a763))
*  add a method for deleting media ([51578ed6](https://github.com/flyacts/backend-media-management/commit/51578ed6331dc7f5286b2d89ae3be027efc8017e))

#### 0.2.2 (2019-02-05)

##### Chores

*  add some documentation ([2a19c2d0](https://github.com/flyacts/backend-media-management/commit/2a19c2d097e07557221e3da951b261401c3eecff))

##### Bug Fixes

*  remove unnecessary async declaration ([4a06a5c9](https://github.com/flyacts/backend-media-management/commit/4a06a5c980a69c226cb25f1e79d3317651bb1bd2))

#### 0.2.1 (2019-02-05)

##### Chores

*  add missing express dep ([811addf8](https://github.com/flyacts/backend-media-management/commit/811addf8d7e313266237a787de72b7e0ff5219a1))

### 0.2.0 (2019-02-05)

##### Chores

*  disable newline-per-chained-call linting rule ([fcaebd5b](https://github.com/flyacts/backend-media-management/commit/fcaebd5b4c4f46eb4c4ffc26ebd1a2ba36fece89))

##### New Features

*  add a method to get a file from the store ([012537aa](https://github.com/flyacts/backend-media-management/commit/012537aac94a47ff8135e8787d63bbf47d016adf))
