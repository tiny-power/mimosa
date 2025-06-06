import { app, protocol, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'
import path from 'path'
const os = require('os')
const { exec, execSync } = require('child_process')

protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true, supportFetchAPI: true } }
])

let mainWindow = null
let ghostscriptFlag = false
async function createMainWindow() {
    if (!app.requestSingleInstanceLock()) {
        app.quit()
        return
    }

    mainWindow = new BrowserWindow({
        title: 'Mimosa',
        center: true,
        width: 1004,
        height: 500,
        resizable: false,
        maximizable: true,
        autoHideMenuBar: true,
        useContentSize: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
    } else {
        createProtocol('app')
        mainWindow.loadURL('app://./index.html')
    }

    ipcMain.handle('dialog:openDirectory', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory']
        })
        if (!canceled) {
            return filePaths[0]
        }
    })

    ipcMain.handle('dialog:openFile', async () => {
        if (process.platform == 'darwin') {
            const { canceled, filePaths } = await dialog.showOpenDialog({
                properties: ['openDirectory', 'openFile', 'multiSelections']
            })
            if (!canceled) {
                return filePaths
            }
        } else {
            const { canceled, filePaths } = await dialog.showOpenDialog({
                properties: ['openFile', 'multiSelections']
            })
            if (!canceled) {
                return filePaths
            }
        }
    })

    ipcMain.handle('openPath', async (event, args) => {
        shell.openPath(args)
    })

    ipcMain.handle('getDesktopPath', async () => {
        return app.getPath('desktop')
    })

    ipcMain.handle('getFfmpegPath', async () => {
        let platform = process.platform
        let arch = os.arch()
        let resourcesPath = process.resourcesPath
        if (process.platform == 'darwin') {
            arch = ''
            resourcesPath = resourcesPath.replace(
                'node_modules/electron/dist/Electron.app/Contents/Resources',
                'public'
            )
        } else if (process.platform == 'win32') {
            arch = ''
            resourcesPath = resourcesPath.replace('node_modules\\electron\\dist\\resources', 'public')
        } else {
            resourcesPath = resourcesPath.replace(
                'node_modules/electron/dist/Electron.app/Contents/Resources',
                'public'
            )
        }
        let ffmpegPath = path.join(
            resourcesPath,
            process.env.WEBPACK_DEV_SERVER_URL ? '' : 'app.asar.unpacked',
            'bin',
            platform,
            arch,
            'ffmpeg'
        )
        let ffprobePath = path.join(
            resourcesPath,
            process.env.WEBPACK_DEV_SERVER_URL ? '' : 'app.asar.unpacked',
            'bin',
            platform,
            arch,
            'ffprobe'
        )
        return {
            ffmpegPath: ffmpegPath,
            ffprobePath: ffprobePath,
            desktopPath: app.getPath('desktop'),
            ghostscriptFlag: ghostscriptFlag
        }
    })

    ipcMain.handle('compressPdf', async (event, inputPath, outputPath, pdfQuality, pdfFormat) => {
        let command = ''
        let gsPlatform = ''
        if (process.platform === 'win32') {
            if (os.arch() === 'x64') {
                gsPlatform = 'gswin64c'
            } else {
                gsPlatform = 'gswin32c'
            }
        } else {
            gsPlatform = 'gs'
        }
        if (pdfFormat === 'same') {
            command =
                gsPlatform +
                ' -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/' +
                pdfQuality +
                ' -dNOPAUSE -dQUIET -dBATCH -sOutputFile=' +
                outputPath +
                ' ' +
                inputPath
        } else {
            command = gsPlatform + ' -q -sDEVICE=' + pdfFormat + ' -r300 -o ' + outputPath + ' ' + inputPath
        }
        let result = execSync(command)
        if (result.toString()) {
            console.log(result.toString())
            return false
        } else {
            return true
        }
    })

    ipcMain.handle('pdfToImage', async (event, inputPath, outputPath) => {
        let gsPlatform = ''
        if (process.platform === 'win32') {
            if (os.arch() === 'x64') {
                gsPlatform = 'gswin64c'
            } else {
                gsPlatform = 'gswin32c'
            }
        } else {
            gsPlatform = 'gs'
        }
        let command =
            gsPlatform +
            ' -sDEVICE=png16m -r300 -dFirstPage=1 -dLastPage=1 -o ' +
            outputPath +
            ' -dNOPAUSE -dQUIET -dBATCH ' +
            inputPath
        let result = execSync(command)
        if (result.toString()) {
            console.log(result.toString())
            return false
        } else {
            return true
        }
    })

    let gsPlatform = ''
    if (process.platform === 'win32') {
        if (os.arch() === 'x64') {
            gsPlatform = 'gswin64c'
        } else {
            gsPlatform = 'gswin32c'
        }
    } else {
        gsPlatform = 'gs'
    }
    exec(gsPlatform + ' --version', error => {
        if (error) {
            return
        } else {
            ghostscriptFlag = true
        }
    })
}

app.on('second-instance', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        if (mainWindow.isVisible()) {
            mainWindow.focus()
        } else {
            mainWindow.show()
            mainWindow.setSkipTaskbar(false)
        }
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
    } else {
        mainWindow.show()
    }
})

app.on('ready', async () => {
    await createMainWindow()
})

if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
