const path = require('path')
const ZipFilesPlugin = require('webpack-zip-files-plugin')

const { config, constants } = require('./webpack.config.base')

module.exports = Object.assign(config, {
    plugins: [
        ...config.plugins,
        new ZipFilesPlugin({
            entries: [{ src: constants.paths.output, dist: '.' }],
            output: path.join(constants.paths.artifacts, 'yvm'),
            format: 'zip',
        }),
    ],
})
