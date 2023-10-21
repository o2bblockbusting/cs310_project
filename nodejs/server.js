
"use strict";

const express = require('express');
const app = express();

app.get('/states/:state/cities/:city', function (req, res) {
    res.type("text");
    res.send("You sent a request for " + req.params.city + ", " + req.params.state);
});

app.get("*", (req, res) => {
    res.status(404).send("Error: resource not found");
});

app.listen(8080);