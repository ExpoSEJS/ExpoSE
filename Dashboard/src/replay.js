/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

const electron = require("electron");
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");

let replays = [];

function createReplay(file, input) {
	let i = replays.length;

	let replay = new BrowserWindow({
		width: 500,
		height: 600
	});

	replay.replayFile = file;
	replay.replayInput = input;

	// and load the index.html of the app.
	replay.loadURL(url.format({
		pathname: path.join(__dirname, "../content/replay.html"),
		protocol: "file:",
		slashes: true
	}));

	replay.on("closed", function () {
		replays[i] = null;
	});

	replays[i] = replay;

	replay.webContents.on("did-finish-load", function() {
		replay.webContents.executeJavaScript("");
	});
}

module.exports = createReplay;
