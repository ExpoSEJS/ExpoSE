const { app, BrowserWindow } = require('electron');

app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('disable-web-security');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: `ExpoSE ${process.argv[process.argv.length - 2]} ${process.argv[process.argv.length - 1]}`,
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false
    }
  });

  mainWindow.webContents.session.setProxy({proxyRules:"http://localhost:8080"}, function () {
    mainWindow.loadURL(process.argv[process.argv.length - 2]);
    mainWindow.webContents.openDevTools();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
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
