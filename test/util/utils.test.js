const log = require('../../src/util/log')
const {
    DEFAULT_VERSION_TEXT,
    VERSION_IN_USE_SYMBOL,
    VERSION_INSTALLED_SYMBOL,
    printVersions,
} = require('../../src/util/version')

jest.mock('../../src/util/log')

const versionInUse = '1.2.0'
const defaultVersion = '1.3.0'
const localVersions = ['1.1.0', versionInUse, defaultVersion]
const versions = [...localVersions, '1.4.0', '1.5.0']

describe('Util functions', () => {
    afterEach(() => {
        jest.resetAllMocks()
    })

    const verifyPrintedVersions = () => {
        expect(log.mock.calls).toMatchSnapshot()
        expect(log.notice.mock.calls).toMatchSnapshot()
        expect(log.success.mock.calls).toMatchSnapshot()
    }

    it('Prints all versions passed to printVersion function', () => {
        const versionsObject = printVersions({
            message: 'print all versions',
            list: versions,
            versionInUse,
        })
        expect(Object.keys(versionsObject)).toHaveLength(versions.length)
        verifyPrintedVersions()
    })

    it('Highlights the version currently in use', () => {
        const versionsObject = printVersions({
            message: 'highlight current version',
            list: versions,
            versionInUse,
        })
        expect(versionsObject[versionInUse]).toContain(versionInUse)
        expect(versionsObject[versionInUse]).toContain(VERSION_IN_USE_SYMBOL)
        verifyPrintedVersions()
    })

    it('Highlights the default version', () => {
        const versionsObject = printVersions({
            message: 'highlight default version',
            list: versions,
            versionInUse,
            defaultVersion,
        })
        expect(versionsObject[defaultVersion]).toContain(defaultVersion)
        expect(versionsObject[defaultVersion]).toContain(DEFAULT_VERSION_TEXT)
        verifyPrintedVersions()
    })

    it('Highlights all installed versions', () => {
        const versionsObject = printVersions({
            message: 'highlight installed versions',
            list: versions,
            versionInUse,
            defaultVersion,
            localVersions,
        })
        localVersions
            .filter(v => v !== versionInUse)
            .forEach(v => {
                expect(versionsObject[v]).toContain(v)
                expect(versionsObject[v]).toContain(VERSION_INSTALLED_SYMBOL)
            })
        verifyPrintedVersions()
    })
})
