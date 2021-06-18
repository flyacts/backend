# How to do a new release of the backend

This project uses [lerna](https://github.com/lerna/lerna) for managing all the
components of the backend, so we are also using this for our releases.

Make sure every commit that should be on the master-branch is there.

Now we are using lerna to update all the `package.json`-files and create a new
release:

```bash
npm run lerna -- version <version-type> # one of major, minor or patch
```
Lerna will now do the following things:

* Update all the `package.json` files if you used major or minor version type.
  If you used patch, only the packages where code had been changed will get
  updated.
* Generate a [CHANGELOG.md](../CHANGELOG.md) with all the changes, that happened
  since the last release.
* Create a git tag with the new version.
* Pushes the changes to the remote git repository.
