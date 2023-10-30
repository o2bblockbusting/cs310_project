
"use strict";

const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const DB_PATH = "jp_verbs.db";
const PORT = process.env.PORT || 8000;
app.listen(PORT);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API for javascript
app.post('/verbs', async function (req, res) {
    let ret = await getVerbs(req.query.type ? req.query.type : 'all');
    res.json(ret);
});

app.get("*", (req, res) => {
    res.status(404).send("<h2>Error: resource not found</h2>");
});

/**
 * Establishes a database connection to the database and returns the database object.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
async function getDBConnection() {
    const db = await sqlite.open({
        filename: DB_PATH,
        driver: sqlite3.Database
    });

    return db;
}

/**
 * Retrieves all verb data from the database
 * @returns {object} - The questions records stored in the database.
 */
async function getVerbs(queryType) {
    const db = await getDBConnection();
    let query;

    // Choose and return 1 random verb if the queryType is random
    if(queryType == 'random') {
        query = "SELECT * FROM verbs ORDER BY RANDOM() LIMIT 1;";
    }
    else {
        query = "SELECT * FROM verbs;";
    }
    
    const rows = await db.all(query);
    await db.close(); // close the database connection

    return rows;
}