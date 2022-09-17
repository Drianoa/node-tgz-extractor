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

    // filter uniq url
    const tarballsFiltered = tarballs.filter((value, index, self) =>
            index === self.findIndex(e => (
                e.url === value.url
            ))
    )

    return _extractTarballs(tarballsFiltered, options.directory, options.concurrency);
}

/**
 * @param tarballs
 * @param dependencies
 * @param {{directory: string, registry?: string}} options
 */
function _enumerateDependencies(tarballs, dependencies, options) {
    for (const [dependencyName, dependency] of Object.entries(dependencies)) {
        if (dependency.resolved) {
            tarballs.push({url: dependency.resolved, directory: dependencyName});
        }

        if (dependency.dependencies) {
            _enumerateDependencies(tarballs, dependency.dependencies, options);
        }
    }
}


async function _extractTarballs(tarballs, baseDirectory = './tarballs') {
    return await tarballs.map(async ({url, directory}) => {
        await _ectractTarball(url, join(baseDirectory, directory))
    })
}


const preKey = 'make-fetch-happen:request-cache:'
const isWindows = process.platform === 'win32'
const cacheRoot = (isWindows && process.env.LOCALAPPDATA) || '~'
const cacheExtra = isWindows ? 'npm-cache' : '.npm'
const cache = `${cacheRoot}/${cacheExtra}`
const cachePath = join(cache, '_cacache')

/**
 *
 * @param url url of the file on the registry
 * @param destinationDirectory storage directory of the file
 * @returns {Promise<any>}
 * @private
 */
async function _ectractTarball(url, destinationDirectory) {


    const uri = url.split('/');
    const tgzFilename = uri[uri.length - 1];

    const tgzFilepath = join(destinationDirectory, tgzFilename)
    if (!fs.existsSync(tgzFilepath)) {
        return mkdirP(destinationDirectory).then(() => {
            return cacache.get(cachePath, preKey + url)
                .then(({data}) => {
                    fs.writeFileSync(tgzFilepath, data)
                    if (fs.readFileSync(tgzFilepath).length === 0) {
                        fs.rmSync(tgzFilepath)
                        logger(['extract failed'.red], tgzFilepath);
                        throw new Error('extract failed')
                    } else {
                        logger(['extract done'.green], tgzFilepath);
                    }
                }, _ => {
                    logger(['extract failed'.red], tgzFilepath);
                    throw new Error('extract failed')
                })
        })

    }

}

module.exports = {
    extractFromPackageLock,
};
