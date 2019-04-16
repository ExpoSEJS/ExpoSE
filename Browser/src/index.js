/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

const { app, BrowserWindow } = require("electron");

const TestCaseParameters = JSON.parse(process.argv[process.argv.length - 1]);

app.commandLine.appendSwitch("ignore-certificate-errors");
app.commandLine.appendSwitch("disable-web-security");

const MITM_PORT = process.env["MITM_PORT"];

if (!MITM_PORT) {
	throw "No MITM port set";
}

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
		mainWindow.webContents.session.setProxy({ proxyRules: "http://localhost:" + MITM_PORT}, function () {
			mainWindow.loadURL(process.argv[process.argv.length - 2]);
		});
	});

	mainWindow.webContents.session.webRequest.onBeforeRequest((details, callback) => {
		mainWindow.webContents.executeJavaScript("(function(){ try { return S$.sandbox.state.finalPC(); } catch (e) { return '' + e; } })()").then(pc => {
			console.log(`CONCRETE_LOAD_EVENT !!!${pc}!!! !!!${details.url}!!!`);
		});
		callback({ cancel: false });
	});

	if (process.env["PROPOGATE_ON_NETWORK"]) {
		mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, cb) => {

			function rif(offset, o2) {
				if (TestCaseParameters[offset]) {
					details.requestHeaders[o2] = TestCaseParameters[offset];
					details.requestHeaders[o2.toLowerCase()] = TestCaseParameters[offset];
				}
			}

			rif("userAgent", "User-Agent");
			rif("cookie", "Cookie");
			rif("lastModified", "Last-Modified");
			rif("referer", "Referer");
			rif("origin", "Origin");
			rif("host", "Host");
			cb({ cancel: false, requestHeaders: details.requestHeaders });
		});
	}

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
