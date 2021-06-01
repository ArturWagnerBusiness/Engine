const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { menu } = require("./launcher/menu");
const isWindows = process.platform === "win32";
if (require('electron-squirrel-startup')) {
    app.quit();
}
var mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        webPreferences: {
            preload: path.join(__dirname, "launcher/preload.js")
        },
        frame: isWindows ? false : true
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
};
app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
ipcMain.on(`display-app-menu`, function (e, args) {
    if (isWindows && mainWindow) {
        menu.popup({
            window: mainWindow,
            x: args.x,
            y: args.y
        });
    }
});
