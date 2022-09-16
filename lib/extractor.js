
const cacache = require("cacache");
const fs = require("fs");
const {join} = require("path");
const logger = require("./logger");
const mkdirP = require("mkdirp");

/**
 * @param {object} packageLock
 * @param {{directory: string, registry?: string, concurrency?: number}} options
 */
function extractFromPackageLock(packageLock, options) {
    const tarballs = [];
    _enumerateDependencies(tarballs, packageLock.dependencies, options);

    return _extractTarballs(tarballs, options.directory, options.concurrency);
}

/**
 * @param tarballs
 * @param dependencies
 * @param {{directory: string, registry?: string}} options
 */
function _enumerateDependencies(tarballs, dependencies, options) {
    for (const [dependencyName, dependency] of Object.entries(dependencies)) {
        if (dependency.resolved) {
            tarballs.push({ url: dependency.resolved,directory: dependencyName });
        }

        if (dependency.dependencies) {
            _enumerateDependencies(tarballs, dependency.dependencies, options);
        }
    }
}


function _extractTarballs(tarballs, baseDirectory = './tarballs') {
    tarballs.forEach(({url,directory }) => {
        _ectractTarball(url, join(baseDirectory, directory))
    })
}


function _ectractTarball(url, directory){
    const preKey = 'make-fetch-happen:request-cache:'
    const isWindows = process.platform === 'win32'
    const cacheRoot = (isWindows && process.env.LOCALAPPDATA) || '~'
    const cacheExtra = isWindows ? 'npm-cache' : '.npm'
    const cache = `${cacheRoot}/${cacheExtra}`
    const cachePath = join(cache, '_cacache')


    const uri = url.split('/');
    const filename = uri[uri.length - 1];

    const filepath = join(directory, filename)
    if (!fs.existsSync(filepath)) {
        mkdirP(directory, () =>{
            cacache.get.stream(
                cachePath, preKey + url
            ).pipe(
                fs.createWriteStream(filepath)
            ).on('finish', () => {
                logger(['extract done'.green], filepath);
            })
        })

    }

}

module.exports = {
    extractFromPackageLock,
};
