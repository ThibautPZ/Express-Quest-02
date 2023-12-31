const express = require("express");

require("dotenv").config();

const port = process.env.APP_PORT ?? 5000;

const app = express();

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

const usersHandler = require("./usersHandlers");

app.get("/api/users", usersHandler.getUsers);
app.get("/api/users/:id", usersHandler.getUserById);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
