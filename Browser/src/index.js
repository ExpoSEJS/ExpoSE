const { app, BrowserWindow } = require('electron');

console.log('Args: ' + JSON.stringify(process.argv));
app.commandLine.appendSwitch('proxy-server', '127.0.0.1:8080');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.webContents.session.setProxy({proxyRules:"http://localhost:8080"}, function () {
    mainWindow.loadURL(process.argv[process.argv.length - 2]);
    //mainWindow.webContents.openDevTools();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    console.log('Main window closed');
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    console.log('Window all closed');
    app.quit();
});
