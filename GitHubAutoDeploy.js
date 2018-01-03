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
	exec(commands[index], (error, stdout, stderr) => {
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

/*
// app.get('/', function(req, res) {
	// get all the flowers
	// res.render('index.html', {root: __dirname});
// });

app.get('/api/flowers', function(req, res) {
	// get all the flowers
	db.all("SELECT COMNAME FROM FLOWERS", function(err, rows){
		res.json(rows);
	});
});

app.get('/api/flowers/:flowerCOMNAME', (req, res) => {
	console.log(req.params.flowerCOMNAME);
	db.all("SELECT * FROM SIGHTINGS WHERE ? = SIGHTINGS.NAME ORDER BY SIGHTED DESC", req.params.flowerCOMNAME, function(err, rows){
		res.json(rows);
	});
});

// Update a flower with the passed information
app.post('/api/flowers/update', (req, res) => {
	var oldComname = req.body.oldComname;
	var genus = req.body.genus;
	var species = req.body.species;
	var comname = req.body.comname;

	console.log("Updating old " + oldComname + " with genus " + genus + ", species " + species + ", and common name " + comname);

	db.all("UPDATE FLOWERS SET genus = ?, species = ?, comname = ? WHERE comname = ?", genus, species, comname, oldComname, function(err, info){
		if (err === null){
			console.log("Update success");
			res.end("Success");
		} else {
			console.log("Update failure");	
			res.end(err);
		}
	});
	
});

// Insert a new sighting with the passed information
app.post('/api/flowers/insert', (req, res) => {
	var name = req.body.name;
	var person = req.body.person;
	var location = req.body.location;
	var sighted = req.body.sighted;

	console.log("Adding sighted " + name + " found by " + person + " at " + location + " on " + sighted);

	db.all("INSERT INTO Sightings (name, person, location, sighted) VALUES (?, ?, ?, ?)", name, person, location, sighted, function(err, info){
		if (err === null){
			console.log("Insert success");			
			res.end("Success");
		} else {
			console.log("Insert failure");				
			res.end(err);
		}
	});

});

*/
