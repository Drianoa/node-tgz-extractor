const commands = require('../lib/commands');
const {execSync} = require('child_process');

const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');

const tarballsDirectory = './test-tarballs';

require('../lib/logger').ignore = true;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 150000;
const cwd = __dirname



describe('the (package-lock.json) command', () => {
    afterEach(() => {
        cleanup(tarballsDirectory);
        // cleanup(path.join(cwd,'/test-data/current/node_modules'));
        // cleanup(path.join(cwd,'/test-data/simple/node_modules'));
    });

    it('should work for a simple package', async () => {

        await execSync('npm i', {
            cwd: path.join(cwd,'/test-data/simple')
        })
        await commands.packageLockCommandExtract(getFilePath('./test-data/simple/package-lock.json'), {
            directory: tarballsDirectory
        });
        expect(fs.existsSync(path.join(tarballsDirectory), 'express')).toBeTruthy();
        expect(fs.existsSync(path.join(tarballsDirectory), 'express', 'express-4.16.4.tgz')).toBeTruthy();
    });

    it('should work for the current package', async () => {

        await commands.packageLockCommandExtract(getFilePath('./test-data/current/package-lock.json'), {
            directory: tarballsDirectory
        });
        const paths = [
            ['colors'], ['colors', 'colors-1.3.0.tgz'],
            ['commander'], ['commander', 'commander-2.16.0.tgz'],
            ['mkdirp'], ['mkdirp', 'mkdirp-0.5.1-tgz'],
            ['request'], ['request', 'request-2.87.0.tgz'],
            ['request-promise'], ['request-promise', 'request-promise-4.2.2.tgz'],
            ['semver'], ['semver', 'semver-5.5.0.tgz'],
            ['tar'], ['tar', 'tar-4.4.6.tgz'],
            ['@types', 'jasmine'], ['@types', 'jasmine', 'jasmine-2.8.9.tgz'],
            ['jasmine'], ['jasmine', 'jasmine-3.2.0.tgz'],
            ['rimraf'], ['rimraf', 'rimraf-2.6.2.tgz']
        ];
        for (const directoryPath of paths) {
            expect(fs.existsSync(path.join(tarballsDirectory), ...directoryPath)).toBeTruthy();
        }
    });


});


function cleanup(directory) {
    try {
        if (fs.existsSync(directory))
            rimraf.sync(directory);
    } catch (error) {
        cleanup(directory);
    }
}

function getFilePath(file) {
    return path.join(__dirname, file);
}