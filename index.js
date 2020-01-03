const express = require("express");

const server = express();

server.use(express.json());

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Metodo ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd("Request");
});

function checkUserExists(req, res, next) {
  if (!req.body.user) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}
const users = ["Diego", "Claudio", "Marcelo"];

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  req.user = user;
  return next();
}

server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(users);
});

server.get("/users", checkUserInArray, (req, res) => {
  return res.json(users);
});

server.post("/users", (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

server.put("/users/:index", checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
  return res.json(users);
});

server.delete("/users/:index", (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.json(users);
});

server.listen(3000);
