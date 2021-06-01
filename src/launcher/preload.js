const { remote } = require("electron");
const { getCurrentWindow, openMenu, minimizeWindow, unmaximizeWindow, maxUnmaxWindow, isWindowMaximized, closeWindow, } = require("./frame");
window.addEventListener("DOMContentLoaded", () => {
    window.getCurrentWindow = getCurrentWindow;
    window.minimizeWindow = minimizeWindow;
    window.unmaximizeWindow = unmaximizeWindow;
    window.maxUnmaxWindow = maxUnmaxWindow;
    window.isWindowMaximized = isWindowMaximized;
    window.closeWindow = closeWindow;
});
