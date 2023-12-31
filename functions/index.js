const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();

// Automatisk CORS-håndtering
app.use(cors({origin: true}));

// Mock-database (vi legger til en ekte database senere)
const tasks = [];

// GET Endpoint som kun sier hei
app.get("/hello", (req, res) => {
  return res.status(200).send("{ status: 200,message: 'Hello World!' }");
});

// POST Endpoint for å legge til en ny oppgave
app.post("/addTask", (req, res) => {
  const {description, deadline} = req.body;

  if (!description) {
    return res.status(400).send({error: "Ugyldig input"});
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

// GET Endpoint for å hente en oppgave med en spesifikk ID
app.get("/getTaskById/:id", (req, res) => {
  const {id} = req.params;
  const task = tasks.find((t) => t.id === parseInt(id, 10));

  if (!task) {
    return res.status(404).send({error: "Oppgave ikke funnet"});
  }

  return res.status(200).send(task);
});

// POST Endpoint for å markere en oppgave som "done" eller "not done" via URL-parameter
app.post("/setTaskDone/:id", (req, res) => {
  const { id } = req.params;
  const { done } = req.query; // Få "done" fra query parameter

  const taskIndex = tasks.findIndex((t) => t.id === parseInt(id, 10));

  if (taskIndex === -1) {
    return res.status(404).send({ error: "Oppgave ikke funnet" });
  }

  // Konverter "done" til boolean. Dette er litt triksy siden query-parametere er alltid strings.
  const isDone = done === 'true';
  
  tasks[taskIndex].done = isDone;
  return res.status(200).send(tasks[taskIndex]);
});

// Eksporterer vår Express-oppsett til Firebase
exports.api = functions.https.onRequest(app);
