//@ts-ignore
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
//@ts-ignore
const { menu } = require("./launcher/menu");

const isWindows = process.platform === "win32";

// import Phaser = require("phaser");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
var mainWindow: any;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    webPreferences: {
      preload: path.join(__dirname, "launcher/preload.js")
    },
    frame: isWindows ? false : true //Remove frame to hide default menu
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  mainWindow.on("closed", function() {
    mainWindow = null;
  });

  /** TOOL DISABLED FOR NOW */
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on(`display-app-menu`, function(e: any, args: any) {
  if (isWindows && mainWindow) {
    menu.popup({
      window: mainWindow,
      x: args.x,
      y: args.y
    });
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
