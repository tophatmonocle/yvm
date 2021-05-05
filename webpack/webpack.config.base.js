const path = require('path')

const rootPath = path.resolve(__dirname, '..')
const artifactsPath = path.resolve(rootPath, 'artifacts')
const outputPath = path.resolve(artifactsPath, 'webpack_build')

const constants = {
    paths: {
        artifacts: artifactsPath,
        output: outputPath,
        root: rootPath,
    },
}

const config = {
    mode: 'production',
    entry: {
        yvm: ['./src/yvm.js'],
    },
    output: {
        filename: '[name].js',
        path: outputPath,
    },
    target: 'node',
    plugins: [],
    resolve: {
        modules: [
            path.resolve(rootPath, 'src'),
            path.resolve(rootPath, 'node_modules'),
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        plugins: ['dynamic-import-node', 'lodash'],
                        presets: [
                            [
                                '@babel/preset-env',
                                { targets: { node: '12.0' } },
                            ],
                        ],
                    },
                },
            },
        ],
    },
}

module.exports = { config, constants }
