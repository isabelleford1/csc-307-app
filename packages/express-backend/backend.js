// backend.js
import express from "express";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// GET /users?name=...&job=...
// Returns { users_list: [...] }
app.get("/users", (req, res) => {
  const { name, job } = req.query;

  userService
    .getUsers(name, job)
    .then((users) => {
      res.status(200).send({ users_list: users });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: "Server error" });
    });
});

// POST /users
// Body: { name: "...", job: "..." }
// Returns 201 + created user
app.post("/users", (req, res) => {
  const userToAdd = req.body;

  userService
    .addUser(userToAdd)
    .then((createdUser) => {
      res.status(201).send(createdUser);
    })
    .catch((err) => {
      console.error(err);
      // schema validation errors should be treated as 400
      res.status(400).send({ error: err.message });
    });
});

// GET /users/:id
app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  userService
    .findUserById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send("Resource not found.");
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      console.error(err);
      // invalid ObjectId or other errors
      res.status(400).send("Resource not found.");
    });
});

// DELETE /users/:id
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  userService
    .deleteUserById(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        res.status(404).send("Resource not found.");
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => res.status(500).send(error));
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
