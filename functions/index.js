const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();

// Automatisk CORS-håndtering
app.use(cors({ origin: true }));

// Mock-database (vi legger til en ekte database senere)
const tasks = [];

// GET Endpoint som kun sier hei
app.get("/hello", (req, res) => {
	return res.send("Hei fra Firebase!");
});

// POST Endpoint for å legge til en ny oppgave
app.post("/addTask", (req, res) => {
	const { description, deadline } = req.body;

	if (!description || !deadline) {
		return res.status(400).send({ error: "Ugyldig input" });
	}

	const newTask = {
		id: tasks.length + 1,
		description,
		deadline,
		status: "not_done",
	};

	tasks.push(newTask);

	return res.status(201).send(newTask);
});

// GET Endpoint for å hente alle oppgaver
app.get("/getAllTasks", (req, res) => {
	return res.status(200).send(tasks);
});


// Eksporterer vår Express-oppsett til Firebase
exports.api = functions.https.onRequest(app);
