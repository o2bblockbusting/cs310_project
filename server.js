
"use strict";

const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const PORT = process.env.PORT || 8000;
app.listen(PORT);

app.use(express.static('public'));

app.get('/states/:state/cities/:city', function (req, res) {
    res.type("text");
    res.send("You sent a request for " + req.params.city + ", " + req.params.state);
});

app.get("*", (req, res) => {
    res.status(404).send("<h2>Error: resource not found</h2>");
});

app.listen(8080);