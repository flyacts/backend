# Backend Media Management

This package provides functionality for storing files and processing them.

## Usage

First install it via npm or your favorite package manager:

``` shell
$ npm install --save @flyacts/backend-media-management
```

Then you need to create a configuration and register it via your dependency
injection:

``` typescript
import {
    MediaConfiguration,
} from '@flyacts/backend-media-management';
import * as config from 'config';
import * as fs from 'fs-extra';
import Container from 'typedi';


const mediaLocation = config.get<string>('media.location');
if (!(await fs.pathExists(mediaLocation))) {
    throw new Error('Media Location does not exists');
}

const mediaConfig = new MediaConfiguration(mediaLocation);

Container.set(MediaConfiguration, mediaConfig);
```

After that you can inject the `FileUploadProvider` into your service or
controller and can use the method `attachFile` to save a media to an entity or
use `getFilestream` to get a stream and pass it down to express.
