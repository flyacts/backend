#### 0.9.2 (2018-11-12)

##### New Features

*  add `Ownable`-mixin ([66046f5c](https://github.com/flyacts/backend-user-management/commit/66046f5c37eca593c3cdb219dfb998119b153ea2))

#### 0.9.1 (2018-11-12)

##### Bug Fixes

*  use correct variable ([f428b24b](https://github.com/flyacts/backend-user-management/commit/f428b24b2e31b1deec37ee6a712a27ae6bc7c869))

### 0.9.0 (2018-11-12)

##### New Features

*  add a payload attribute to the tokenentity ([2ceadd47](https://github.com/flyacts/backend-user-management/commit/2ceadd47ab7d9f8021d035c19acc1d74dffc7257))

#### 0.8.4 (2018-11-01)

##### Bug Fixes

*  use correct variable ([f428b24b](https://github.com/flyacts/backend-user-management/commit/f428b24b2e31b1deec37ee6a712a27ae6bc7c869))

#### 0.8.4 (2018-11-01)

##### Bug Fixes

*  use correct variable ([f428b24b](https://github.com/flyacts/backend-user-management/commit/f428b24b2e31b1deec37ee6a712a27ae6bc7c869))

#### 0.8.3 (2018-11-01)

##### Bug Fixes

*  repair the currentUserChecker ([d7d5d10e](https://github.com/flyacts/backend-user-management/commit/d7d5d10ec25f6f284d0130a5999f92d727d9ede5))

#### 0.8.2 (2018-11-01)

##### Bug Fixes

*  only add a service if it is not known ([21dd7641](https://github.com/flyacts/backend-user-management/commit/21dd76416c6443c6ce2a98be0ff14ea8d6f26dcf))

#### 0.8.1 (2018-11-01)

##### Bug Fixes

*  allow other containers to be imported ([fd9154e6](https://github.com/flyacts/backend-user-management/commit/fd9154e6c47c18f3bdeb5618f1191315ef3cf0f4))

### 0.8.0 (2018-10-30)

##### Chores

*  update dependencies ([7b761149](https://github.com/flyacts/backend-user-management/commit/7b76114974637f8efce3ebd3eda77e005c7ee618))

##### New Features

* **tokens:**  add a check for the token scopes ([449ca640](https://github.com/flyacts/backend-user-management/commit/449ca640d0144b5fc814a060cda2b96ddbee0679))

#### 0.7.8 (2018-10-29)

##### New Features

* **user:**  add `hasRole` method to user entity ([84c0ef2c](https://github.com/flyacts/backend-user-management/commit/84c0ef2cefcdec7f55db35d43036ecdc818dc5a0))

#### 0.7.7 (2018-10-29)

##### Bug Fixes

*  use cross platform varchar ([d9ef2314](https://github.com/flyacts/backend-user-management/commit/d9ef2314d720be44e2b8787ffbc2fe448e3f4de6))

#### 0.7.6 (2018-10-29)

##### Bug Fixes

*  override type for password ([d9953f5e](https://github.com/flyacts/backend-user-management/commit/d9953f5e879d9ba0bef937c5d0f93b9f7490cf90))

#### 0.7.5 (2018-10-29)

##### Bug Fixes

*  make password nullable ([93dd76bc](https://github.com/flyacts/backend-user-management/commit/93dd76bc832fae4160196df46c95b62bd7ea8b5d))

#### 0.7.4 (2018-10-29)

##### Documentation Changes

*  update uml diagrams ([07da371d](https://github.com/flyacts/backend-user-management/commit/07da371d60e779a69017a0d54b3528d49f6ec203))

#### 0.7.3 (2018-10-29)

##### Bug Fixes

*  the password is not required ([a94bf115](https://github.com/flyacts/backend-user-management/commit/a94bf11517d55078d460c6c8dd3d7dc17fa732c3))

#### 0.7.2 (2018-10-29)

##### Bug Fixes

*  give the uniqe constraints names so a user can match them ([14a70bb1](https://github.com/flyacts/backend-user-management/commit/14a70bb10bf086a84fa6e2a48bede94bac877e7f))

#### 0.7.1 (2018-10-26)

##### Bug Fixes

*  disable empty strings for username and email ([b05fc3cc](https://github.com/flyacts/backend-user-management/commit/b05fc3ccc2825de46346967ebafb391263867f41))

### 0.7.0 (2018-10-26)

##### New Features

*  allow the password to be `NULL` ([c205265d](https://github.com/flyacts/backend-user-management/commit/c205265da8cd66430f56c2c16bbb6aa24863d80e))

#### 0.6.2 (2018-10-26)

##### Bug Fixes

*  apply the unique constraint int the migrations ([e8535f50](https://github.com/flyacts/backend-user-management/commit/e8535f50b2a415da570832121e1bf036ec84a2d0))

#### 0.6.1 (2018-10-26)

##### New Features

*  add more validation ([afa89427](https://github.com/flyacts/backend-user-management/commit/afa8942795dba0f71c0b7305df0d3884f5e8ed22))

### 0.6.0 (2018-10-26)

##### Chores

*  limit length to 60 characters ([b4201073](https://github.com/flyacts/backend-user-management/commit/b4201073ae3cf57d8ae2c20dac20a6940a24caa1))

#### 0.5.1 (2018-10-26)

##### Bug Fixes

* **current user:**  don't throw exceptions on failure ([4d0cb57f](https://github.com/flyacts/backend-user-management/commit/4d0cb57f0154601fe479f6d1e1993ce6067f6cca))

### 0.5.0 (2018-10-25)

##### Bug Fixes

* **provider:**   disable login for disabled users ([158ff9e9](https://github.com/flyacts/backend-user-management/commit/158ff9e905852f4303d853c751a4353217197c07))

### 0.4.0 (2018-10-25)

##### Bug Fixes

* **provider:**   disable login for disabled users ([158ff9e9](https://github.com/flyacts/backend-user-management/commit/158ff9e905852f4303d853c751a4353217197c07))

#### 0.3.5 (2018-10-17)

##### Bug Fixes

*  enlargen the field of the token ([01e082bd](https://github.com/flyacts/backend-user-management/commit/01e082bd3d1bdaa8fc40940fcc8bab9b2f2ee4bd))

#### 0.3.4 (2018-10-17)

##### Bug Fixes

*  replace string-type by varchar to be cross db ([6eec48b3](https://github.com/flyacts/backend-user-management/commit/6eec48b30438c720fc804e82b5b0bf17f6543b84))

#### 0.3.3 (2018-10-17)

##### Bug Fixes

*  use cross platform timestamp type ([70bff160](https://github.com/flyacts/backend-user-management/commit/70bff1605c5cfcb6b36c06797edb587690d24d02))

#### 0.3.2 (2018-10-17)

##### Bug Fixes

*  use cross platform default values ([656b85ca](https://github.com/flyacts/backend-user-management/commit/656b85ca8d549fc8029ce2c939d0a3c86023764a))

#### 0.3.1 (2018-10-15)

##### Bug Fixes

*  repair migrations ([e7eb5fb9](https://github.com/flyacts/backend-user-management/commit/e7eb5fb90bfdcdc9cb05bf77c9f2ed8e855c9d2a))

### 0.3.0 (2018-10-15)

##### Bug Fixes

* **user:**  exclude the password from transformation ([cfeecd5a](https://github.com/flyacts/backend-user-management/commit/cfeecd5adf1c208ef3a16be6d0afbac047e4a62e))
*  migrate the external links from rawgit to jsdelivr ([f26f86dd](https://github.com/flyacts/backend-user-management/commit/f26f86dd31303535cede1eba2fa17e3b7492b750))

##### Other Changes

*  rename the token field to token ([53512a00](https://github.com/flyacts/backend-user-management/commit/53512a008f292a177b88f4197c35de7dc886e1b9))

### 0.2.0 (2018-10-08)

##### Documentation Changes

*  add uml class diagram ([f0101284](https://github.com/flyacts/backend-user-management/commit/f0101284790ac6a3ad515904fbea63a9ae25de26))

### 0.1.0 (2018-10-05)

##### New Features

*  initial commit ([001aadfd](https://github.com/flyacts/backend-user-management/commit/001aadfd31f01a359fb4bbd8388926d229b9abc9))

