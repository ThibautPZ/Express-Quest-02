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
const usersHandlers = require("./usersHandlers");
const { validateMovie, validateUser } = require("./validators.js");
const {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyTokenWithUserId,
} = require("./auth.js");
// const isDwight = require("./isDwight");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", usersHandlers.getUsers);
app.get("/api/users/:id", usersHandlers.getUserById);
app.post("/api/users/", hashPassword, validateUser, usersHandlers.addUser);
app.post(
  "/api/login",
  usersHandlers.getUserByEmailWithPasswordAndPassToNextWithFriesAndALargeSodaPlease,
  verifyPassword
);

app.use(verifyToken);

app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.changeMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.put(
  "/api/users/:id",
  hashPassword,
  validateUser,
  verifyTokenWithUserId,
  usersHandlers.changeUser
);
app.delete("/api/users/:id", verifyTokenWithUserId, usersHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
