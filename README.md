[![Node.js CI](https://github.com/Meir017/node-tgz-downloader/actions/workflows/test.yml/badge.svg)](https://github.com/Meir017/node-tgz-downloader/actions/workflows/test.yml)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

# node-tgz-extractor
Based on node-tgz-downloader

Extracts all of the tarballs in local npm-cache based on  `package-lock.json` file

## without install

```bash
npx @drianoa/node-tgz-extractor path/to/package-lock.json
```

## usage

### From Code:

```js
const downloader = require('@drianoa/node-tgz-downloader');

downloader.extractFromPackageLock('path/to/package-lock');
```

### From Command Line:

#### package-lock.json

from local file:

```bash
extract-tgz package-lock path/to/package-lock.json
```



[npm-image]: https://img.shields.io/npm/v/node-tgz-downloader.svg
[npm-url]: https://npmjs.org/package/node-tgz-downloader
[downloads-image]: https://img.shields.io/npm/dm/node-tgz-downloader.svg
[downloads-url]: https://npmjs.org/package/node-tgz-downloader
