const os = require('os')
const fs = require('fs')
const { execSync } = require('child_process')

const log = (...args) => console.log(...args) // eslint-disable-line no-console

const dependencies = ['curl', 'unzip']

function preflightCheck(...dependencies) {
    const missing = []
    dependencies.forEach(pkg => {
        try {
            execSync(`command -v ${pkg}`)
        } catch (e) {
            missing.push(pkg)
        }
    })
    if (missing.length) {
        const prepzn = missing.length > 1 ? 'are' : 'is'
        throw new Error(
            `The install cannot proceed due missing dependencies.
"${missing.join('", "')}" ${prepzn} not installed or in your PATH.`,
        )
    }
    log('All dependencies satisfied.')
}

function getConfig() {
    const home = process.env.HOME || os.homedir()
    const useLocal = process.env.USE_LOCAL || false
    const yvmDir = process.env.YVM_INSTALL_DIR || `${home}/.yvm`
    const yvmDirVarName = 'YVM_DIR'
    const bashConfig = [
        `export ${yvmDirVarName}=${yvmDir}`,
        `[ -r $${yvmDirVarName}/yvm.sh ] && . $${yvmDirVarName}/yvm.sh`,
    ]
    const fishConfig = [
        `set -x ${yvmDirVarName} ${yvmDir}`,
        `. $${yvmDirVarName}/yvm.fish`,
    ]
    return {
        paths: {
            home,
            yvm: yvmDir,
            yvmSh: `${yvmDir}/yvm.sh`,
            zip: `${useLocal ? 'artifacts' : yvmDir}/yvm.zip`,
        },
        shConfigs: {
            [`${home}/.bashrc`]: bashConfig,
            [`${home}/.zshrc`]: bashConfig,
            [`${home}/.config/fish/config.fish`]: fishConfig,
        },
        releaseApiUrl: 'https://d236jo9e8rrdox.cloudfront.net/yvm-releases',
        releasesApiUrl: 'https://api.github.com/repos/tophat/yvm/releases',
        useLocal,
        version: {
            tagName: process.env.INSTALL_VERSION || null,
        },
    }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 * @param {string} src to be escaped
 */
function escapeRegExp(src) {
    return src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function ensureDir(dirPath) {
    if (fs.existsSync(dirPath)) return
    execSync(`mkdir -p ${dirPath}`)
}

function getTagAndUrlFromRelease(data) {
    const {
        tag_name: tagName,
        assets: [{ browser_download_url: downloadUrl }],
    } = data
    return { tagName, downloadUrl }
}

function getYvmVersion(versionTag, releasesApiUrl) {
    const data = execSync(`curl -s ${releasesApiUrl}`)
    for (const release of JSON.parse(data)) {
        const { tagName } = getTagAndUrlFromRelease(release)
        if (tagName.match(new RegExp(versionTag))) {
            return getTagAndUrlFromRelease(release)
        }
    }
    return {}
}

async function getLatestYvmVersion(releaseApiUrl) {
    const data = execSync(`curl -s ${releaseApiUrl}`)
    return getTagAndUrlFromRelease(JSON.parse(data))
}

async function downloadFile(urlPath, filePath) {
    execSync(`curl -s -L -o '${filePath}' '${urlPath}'`)
}

async function removeFile(filePath) {
    execSync(`rm -rf ${filePath}`)
}

async function cleanYvmDir(yvmPath) {
    const filesToRemove = ['yvm.sh', 'yvm.js', 'yvm.fish', 'node_modules']
    await Promise.all(
        filesToRemove.map(file => removeFile(`${yvmPath}/${file}`).catch(log)),
    )
}

async function unzipFile(filePath, yvmPath) {
    execSync(`unzip -o -q ${filePath} -d ${yvmPath}`)
}

async function saveVersion(versionTag, yvmPath) {
    const filePath = `${yvmPath}/.version`
    fs.writeFileSync(filePath, `{ "version": "${versionTag}" }`)
}

async function ensureScriptExecutable(filePath) {
    execSync(`chmod +x ${filePath}`)
}

async function ensureConfig(configFile, configLines) {
    if (!fs.existsSync(configFile)) return
    let contents = fs.readFileSync(configFile).toString()
    const linesAppended = configLines.map(string => {
        const finalString = `\n${string}`
        if (contents.includes(string)) {
            const matchString = new RegExp(`\n.*${escapeRegExp(string)}.*`)
            contents = contents.replace(matchString, finalString)
            return false
        }
        contents += finalString
        return true
    })
    if (linesAppended.some(a => a)) {
        contents += '\n'
    }
    fs.writeFileSync(configFile, contents)
}

async function run() {
    preflightCheck(...dependencies)
    const config = getConfig()
    const { version, paths, shConfigs, useLocal } = config
    await ensureDir(paths.yvm)
    if (!useLocal) {
        const { releaseApiUrl, releasesApiUrl } = config
        if (version.tagName) {
            log('Querying github release API to determine version tag')
            const result = await getYvmVersion(version.tagName, releasesApiUrl)
            if (!result.tagName) {
                throw new Error(`No release version '${version.tagName}'`)
            }
            Object.assign(version, result)
        } else {
            log('Querying github release API to determine latest version')
            Object.assign(version, await getLatestYvmVersion(releaseApiUrl))
        }
        await downloadFile(version.downloadUrl, paths.zip)
    }
    if (version.tagName) {
        log(`Installing Version: ${version.tagName}`)
    }
    await cleanYvmDir(paths.yvm)
    await unzipFile(paths.zip, paths.yvm)

    const ongoingTasks = []
    if (!useLocal) {
        ongoingTasks.push(removeFile(paths.zip))
    }
    if (version.tagName) {
        ongoingTasks.push(saveVersion(version.tagName, paths.yvm))
    }
    ongoingTasks.push(ensureScriptExecutable(paths.yvmSh))
    const updatingShellConfigs = Object.entries(shConfigs).map(
        ([configFile, configLines]) => ensureConfig(configFile, configLines),
    )
    ongoingTasks.push(...updatingShellConfigs)
    await Promise.all(ongoingTasks)

    log(`yvm successfully installed in ${paths.yvm} as ${paths.yvmSh}
Open another terminal window to start using, or type "source ${paths.yvmSh}"`)
}

if (!module.parent) {
    run().catch(error => {
        log('yvm installation failed')
        log(error.message)
    })
}

module.exports = {
    ensureConfig,
    escapeRegExp,
    getConfig,
    preflightCheck,
    run,
}
