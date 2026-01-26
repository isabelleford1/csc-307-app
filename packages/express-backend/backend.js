// backend.js
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};



// helper functions
const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const deleteUserById = (id) => {
  const index = users["users_list"].findIndex((user) => user.id === id);
  if (index === -1) return false;
  users["users_list"].splice(index, 1);
  return true;
};

const findUsers = (name, job) => {
  return users["users_list"].filter((user) => {
    const matchesName = name ? user.name === name : true;
    const matchesJob = job ? user.job === job : true;
    return matchesName && matchesJob;
  });
};



app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.get("/users", (req, res) => {
  const { name, job } = req.query;

  if (name !== undefined || job !== undefined) {
    const result = findUsers(name, job);
    res.send({ users_list: result });
  } else {
    res.send(users);
  }
});


app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.send();
});


app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  let result = findUserById(id);

  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  const deleted = deleteUserById(id);

  if (!deleted) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).send(); // 204 = success, no content
  }
});




app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});