module.exports = {
    'plugins': [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        ["@semantic-release/github", {
            "assets": [
                {"path": "artifacts/yvm.js", "name": "yvm.js"},
                {"path": "artifacts/yvm.zip", "name": "yvm.zip"}
            ]
        }]
    ]
}
