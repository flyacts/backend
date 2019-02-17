# Backend user management

This package provides functionality for user management

## Useage

### Preperations

It is recommended to create a `UserExtensionEntity` in your project, if you want
to attach additional data to your user. This extension should have a `user`
property, so that it works with this package.

### Install

You can install it via npm:

``` shell
$ npm install --save @flyacts/backend-user-management
```

### Configuration

If you defined a user extension entity, you need to tell the this package that,
by adding this line in your server.ts:

``` typescript
import {
    UserManagementMetadata,
} from '@flyacts/backend-user-management';

UserManagementMetadata.instance.userClass = UserExtensionEntity;
```

