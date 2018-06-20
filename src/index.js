/* eslint-disable global-require,prettier/prettier */
const argParser = require('commander')

module.exports = function dispatch(args) {
    argParser
        .command('install <version>')
        .action(version => {
            console.log(`Installing yarn v${version}`)
            const install = require('./commands/install')
            install(version)
        })

    argParser
        .command('remove <version>')
        .action(version => {
            console.log(`Removing yarn v${version}`)
            const remove = require('./commands/remove')
            remove(version)
        })

    argParser
        .command('exec <version> [extraArgs...]')
        .action((version, extraArgs) => {
            console.log(`Executing yarn command with version ${version}`)
            const exec = require('./commands/exec')
            exec(version, extraArgs)
        })

    argParser
        .command('which')
        .action(() => {
            console.log(`Checking yarn version`)
            const which = require('./commands/which')
            which()
        })

    argParser.parse(args)
}
