/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

const { app, BrowserWindow, session } = require("electron");

const TestCaseParameters = JSON.parse(process.argv[process.argv.length - 1]);

app.commandLine.appendSwitch("ignore-certificate-errors");
app.commandLine.appendSwitch("disable-web-security");

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

	mainWindow.on("page-title-updated", (e) => {
		e.preventDefault();
	});

	mainWindow.webContents.session.clearCache(function() {
		mainWindow.webContents.session.setProxy({proxyRules:"http://localhost:8080"}, function () {
			mainWindow.loadURL(process.argv[process.argv.length - 2]);
		});
	});

  mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, cb) => {

	  function rif(offset, o2) {
		  if (TestCaseParameters[offset]) { details.requestHeaders[o2] = TestCaseParameters[offset]; }
	  }

	  rif("userAgent", "User-Agent");
	  rif("cookie", "Cookie");

	  cb({ cancel: false, requestHeaders: details.requestHeaders });
  });

	// Emitted when the window is closed.
	mainWindow.on("closed", () => {
		mainWindow = null;
	});
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	console.log("Window all closed");
	app.quit();
});
