import fs from 'fs-extra'
import path from 'path'
import os from 'os'

import log from '../../src/util/log'
import { configureShell, ensureConfig } from '../../src/commands/configureShell'

const mockProp = (obj, prop, mockValue) => {
    const original = obj[prop]
    const setValue = value => {
        if (value === undefined) {
            delete obj[prop]
        } else {
            obj[prop] = value
        }
    }
    setValue(mockValue)
    return {
        mockValue: setValue,
        reset: () => setValue(mockValue),
        restore: () => setValue(original),
    }
}

describe('configureShell', () => {
    const mockHomeValue = 'mock-home'
    const envHomeMock = mockProp(process.env, 'HOME')
    const mockInstallDir = 'mock-install-dir/.yvm'
    const envYvmInstallDir = mockProp(process.env, 'YVM_INSTALL_DIR')
    jest.spyOn(os, 'homedir')
    jest.spyOn(log, 'default')
    jest.spyOn(log, 'info')

    const fileToPath = ([file]) => path.join(mockHomeValue, file)
    const rcFiles = {
        bashrc: fileToPath`.bashrc`,
        bashpro: fileToPath`.bash_profile`,
        zshrc: fileToPath`.zshrc`,
        fishconf: fileToPath`.config/fish/config.fish`,
    }
    const rcFilePaths = Object.values(rcFiles)
    const confirmShellConfig = () => {
        const configs = rcFilePaths.reduce((configs, file) => {
            const content = fs.existsSync(file) && fs.readFileSync(file)
            return Object.assign(configs, { [file]: String(content || null) })
        }, {})
        expect(configs).toMatchSnapshot()
    }

    beforeEach(() => {
        jest.clearAllMocks()
        fs.removeSync(mockHomeValue)
        fs.mkdirSync(mockHomeValue)
        rcFilePaths.forEach(filePath => fs.outputFileSync(filePath, 'dummy'))
    })

    afterEach(() => {
        envHomeMock.reset()
        envYvmInstallDir.reset()
    })

    afterAll(() => {
        jest.restoreAllMocks()
        envHomeMock.restore()
        envYvmInstallDir.restore()
        fs.removeSync(mockHomeValue)
    })

    it('configures only bashrc', async () => {
        envYvmInstallDir.mockValue('some-install-dir')
        expect(
            await configureShell({ home: mockHomeValue, shell: 'bash' }),
        ).toBe(0)
        confirmShellConfig()
        expect(log.info).toHaveBeenCalledWith(
            expect.stringContaining('Configured'),
        )
        expect(log.info).toHaveBeenCalledWith(
            expect.stringContaining(rcFiles.bashrc),
        )
    })

    it('configures only bash_profile when no bashrc', async () => {
        envYvmInstallDir.mockValue(mockInstallDir)
        fs.removeSync(rcFiles.bashrc)
        expect(
            await configureShell({ home: mockHomeValue, shell: 'bash' }),
        ).toBe(0)
        confirmShellConfig()
        expect(log.info).toHaveBeenCalledWith(
            expect.stringContaining('Configured'),
        )
        expect(log.info).toHaveBeenCalledWith(
            expect.stringContaining(rcFiles.bashpro),
        )
    })

    it('configures only fish', async () => {
        envHomeMock.mockValue(mockHomeValue)
        expect(await configureShell({ shell: 'fish' })).toBe(0)
        confirmShellConfig()
        expect(log.info).toHaveBeenCalledWith(
            expect.stringContaining('Configured'),
        )
        expect(log.info).toHaveBeenCalledWith(
            expect.stringContaining(rcFiles.fishconf),
        )
    })

    it('configures only zsh', async () => {
        envHomeMock.mockValue()
        os.homedir.mockReturnValueOnce(mockHomeValue)
        expect(await configureShell({ shell: 'zsh' })).toBe(0)
        confirmShellConfig()
        expect(log.info).toHaveBeenCalledWith(
            expect.stringContaining('Configured'),
        )
        expect(log.info).toHaveBeenCalledWith(
            expect.stringContaining(rcFiles.zshrc),
        )
    })

    it('configures all', async () => {
        expect(await configureShell({ home: mockHomeValue })).toBe(0)
        confirmShellConfig()
        expect(log.info).toHaveBeenCalledWith(
            expect.stringContaining('Configured'),
        )
        expect(log.info).toHaveBeenCalledWith(
            expect.stringContaining(rcFiles.bashrc),
        )
        expect(log.info).toHaveBeenCalledWith(
            expect.stringContaining(rcFiles.fishconf),
        )
        expect(log.info).toHaveBeenCalledWith(
            expect.stringContaining(rcFiles.zshrc),
        )
    })

    it('configures none', async () => {
        fs.emptyDirSync(mockHomeValue)
        expect(await configureShell({ home: mockHomeValue })).toBe(1)
        rcFilePaths.forEach(file => expect(fs.existsSync(file)).toBe(false))
        confirmShellConfig()
        expect(log.default.mock.calls).toMatchSnapshot()
    })

    it('handle error', async () => {
        const mockError = new Error('mock error')
        os.homedir.mockImplementationOnce(() => {
            throw mockError
        })
        envHomeMock.mockValue()
        expect(await configureShell()).toBe(2)
        expect(log.default).toHaveBeenCalledWith(mockError.message)
        expect(log.info).toHaveBeenCalledWith(mockError.stack)
    })

    describe('ensureConfig', () => {
        it('updates exiting lines', async () => {
            const fileName = 'some-random-rc'
            const initial = `with
# -- specific existing line --
that should be replaced`
            const expected = `with
specific existing line
that should be replaced`
            fs.outputFileSync(fileName, initial)
            await ensureConfig(fileName, ['specific existing line'])
            expect(fs.readFileSync(fileName, 'utf8')).toEqual(expected)
            fs.unlinkSync(fileName)
        })
    })
})