#!/usr/bin/env node

// server.js
const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();
const exec = require('child_process').exec;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var tasks = require('./tasks.json');

const port = 8000;
app.listen(port, () => {
  console.log('Server running on port ' + port);
});

app.post('/GitHubAutoDeploy', (req, res) => {
	res.sendStatus(200);
	console.log(req);
	console.log("New event from GitHub");
	/*if(req.headers.x-github-event !== "push"){
		console.log("Event was not a push, aborting...");
		return;
	}*/
	
	if(req === undefined || req === null)
		return;
	if(req.body === undefined || req.body === null)
		return;

	if(req.body.ref !== "refs/heads/master"){
		console.log("Push was not to master branch, aborting...");
		return;
	}

	let repoName;
	if(req.body.repository === undefined)
		return;
	repoName = req.body.repository.name;
	
	if(tasks[repoName] === undefined){
		console.log("No task was configured for this repo, aborting...");
		return;
	}
	
	let commands = tasks[repoName].commands;
	executeCommands(commands);
	
});

function executeCommands(commands){
	executeCommand(commands, 0);
}

function executeCommand(commands, index){
	exec("PATH=/bin:" + process.env.PATH + " " + commands[index], (error, stdout, stderr) => {
		console.log('> ' + commands[index]);
		if (error) {
			console.error('exec error: ' + error);
			return;
		}
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		console.log();
		if(index != commands.length-1)
			executeCommand(commands, index+1);
	});
}
