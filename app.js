const express = require("express");

require("dotenv").config();

const port = process.env.APP_PORT ?? 5000;

const app = express();

app.use(express.json());

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const { validateMovie, validateUser } = require("./validators.js");
const { hashPassword } = require("./auth.js");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.changeMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

const usersHandler = require("./usersHandlers");

app.get("/api/users", usersHandler.getUsers);
app.get("/api/users/:id", usersHandler.getUserById);
app.post("/api/users/", hashPassword, validateUser, usersHandler.addUser);
app.put("/api/users/:id", hashPassword, validateUser, usersHandler.changeUser);
app.delete("/api/users/:id", usersHandler.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
