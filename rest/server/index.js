const fs = require("fs");
const Joi = require("joi");
const cors = require("cors");
const express = require("express");
const app = express();
app.use(express.json());
app.use(cors());

const movies = require("./movies.json");

/* Request: použití metody GET, URL adresy /:
   Response: HTML stránka  */
app.get("/", (req, res) => {
  res.send("<h1>Úvodní stránka - REST API</h1>");
});

/* Request: použití metody GET, URL adresy /api/movies:
   Response: výpis všech filmů ve formátu JSON  */
app.get("/api/movies", (req, res) => {
  res.send(movies);
});

/* Request: použití metody GET, URL adresy /api/movies, parametr id
   Response: výpis konkrétního filmu podle zadaného id ve formátu JSON  */
app.get("/api/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find(movie => movie.id === id);
  if (movie) {
    res.send(movie);
  } else {
    res.status(404).send("Film nebyl nalezen.");
  }
});

/* Request: použití metody POST, URL adresy /api/movies
   Response: výpis nového filmu   */
app.post("/api/movies", (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) {
    res.status(400).send(error);
  } else {
    const movie = {
      id: movies.length !== 0 ? movies[movies.length - 1].id + 1 : 1,
      name: req.body.name,
      year: req.body.year,
      point: req.body.point,
      state: req.body.state,
      position: req.body.position,
      content: req.body.content,
    };
    movies.push(movie);
    res.send(movie);
    writeJSON(movies, "movies.json");
  }
});

app.put("/api/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find(movie => movie.id === id);
  if (!movie) {
    res.status(404).send("Film nebyl nalezen.");
    return;
  }
  const { error } = validateMovie(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    movie.name = req.body.name;
    movie.year = req.body.year;
    movie.point = req.body.point;
    movie.state = req.body.state;
    movie.position = req.body.position;
    movie.content = req.body.content;
    res.send(movie);
    writeJSON(movies, "movies.json");
  }
});

app.delete("/api/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find(movie => movie.id === id);
  if (!movie) {
    res.status(404).send("Film nebyl nalezen.");
  } else {
    const index = movies.indexOf(movie);
    movies.splice(index, 1);
    res.send(movie);
    writeJSON(movies, "movies.json");
  }
});

app.listen(3000, () => console.log("Listening on port 3000..."));

function validateMovie(movie) {
  const schema = {
    name: Joi.string()
      .min(2)
      .required(),
    year: Joi.number(),
    point: Joi.number(),
    state: Joi.string(),
    position: Joi.string(),
    content: Joi.string()
  };
  return Joi.validate(movie, schema);
}

function writeJSON(jsonData, pathToFile) {
  let data = JSON.stringify(jsonData, null, 2);
  fs.writeFile(pathToFile, data, err => {
    if (err) {
      throw err;
    } else {
      console.log("Data written to file");
    }
  });
}
