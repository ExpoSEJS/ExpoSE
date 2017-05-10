/* Copyright (c) Royal Holloway, University of London | Contact Blake Loring (blake_l@parsed.uk), Duncan Mitchell (Duncan.Mitchell.2015@rhul.ac.uk), or Johannes Kinder (johannes.kinder@rhul.ac.uk) for details or support | LICENSE.md for license details */

"use strict";

const output = require('./output');
const remote = require('electron').remote;
const {dialog} = remote.require('electron');
const tmp = remote.require('tmp');

let current;

function Graph(summary) {
	current = summary;
	Graph.png(summary, tmp.fileSync().name);
}

Graph.png = function(summary, pngFile) {
	Graph.out(summary, 'png size 1024,600', pngFile);
}

Graph.tex = function(summary, texFile) {
	Graph.out(summary, 'epslatex', texFile);
}

Graph.findFile = function(type) {
	return dialog.showSaveDialog({properties: ['saveFile'], filters: type});
}

Graph.savePng = function() {

	if (!current) {
		return;
	}

	let file = Graph.findFile([{name: 'PNG', extensions: ['png']}]);
	
	if (!file) {
		return;
	}

	Graph.png(current, '' + file);
}

Graph.saveTex = function() {

	if (!current) {
		return;
	}

	let file = Graph.findFile([{name: 'LaTex', extensions: ['tex']}]);
	
	if (!file) {
		return;
	}

	Graph.tex(current, '' + file);
}

Graph.out = function(summary, mode, pngFile) {
	let remote = require('electron').remote;
	let GraphDataWriter = remote.require('../src/graph_data');
	let GraphBuilder = remote.require('../src/graph_builder');
	let covTmp = tmp.fileSync();
	let rateTmp = tmp.fileSync();
	let files = GraphDataWriter(summary, covTmp.name, rateTmp.name);

	GraphBuilder(pngFile, mode, files.coverage, files.rate, function() {
		covTmp.removeCallback();
		rateTmp.removeCallback();
		$('#graph_content').html('<img style="width: 100%;" src="' + pngFile + '?' + new Date().getTime() + '"/>');
	});
}

module.exports = Graph;
