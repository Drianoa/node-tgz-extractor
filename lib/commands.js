
const { retrieveFile } = require('./uri-retriever');
const extractor = require('./extractor');

/**
 * @param {string} uri
 * @param {{ directory: string, registry?: string }} options
 */
async function packageLockCommandExtract(uri, options = {}) {
  const packageLock = await retrieveFile(uri);
  extractor.extractFromPackageLock(packageLock, options);
}

module.exports = {
  packageLockCommandExtract
};
