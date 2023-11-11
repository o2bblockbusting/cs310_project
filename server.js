
"use strict";

const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const multer = require('multer');

const DB_PATH = "jp_verbs.db";
const PORT = process.env.PORT || 8080;
app.listen(PORT);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().none());

// API for javascript
app.get('/verbs', async function (req, res) {
    try {
        let ret = await getVerbs(req.query.type ? req.query.type : 'all');
        res.json(ret);
    }
    catch(e) {
        res.status(500).send("Internal server error");
    }
});

app.post('/irregulars', async function (req, res) {
    try {
        // verb_id cannot be omitted but conjugation_name can be omitted to fetch all irregulars for one verb
        if(req.body.verb_id) {
            let ret = await findIrregular(req.body.verb_id, req.body.conjugation_name);
            res.json(ret);
        }
        else {
            res.status(400).send("Error: Must specify verb_id to get irregulars list");
        }
    }
    catch(e) {
        res.status(500).send("Internal server error");
    }
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
 * However, if queryType is random, returns just 1 random verb
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

    return queryType == 'random' ? rows[0] : rows;
}

/**
 * Queries the database and returns data regarding an irregular form if found
 * If the conjugation_name is omitted, all irregulars for that verb are returned in an array
 * @param {Number} verbId 
 * @param {string} conjugationName - optional
 */
async function findIrregular(verbId, conjugationName) {
    const db = await getDBConnection();
    
    if(conjugationName) {
        let query = "SELECT * FROM irregulars WHERE verb_id=@0 AND conjugation_name=@1 LIMIT 1";
        const data = await db.get(query, [verbId, conjugationName]);
        await db.close();
        
        return data ? data : {};
    }

    let query = "SELECT * FROM irregulars WHERE verb_id=@0;";
    const data = await db.all(query, [verbId]);
    await db.close();

    if(!data)
        data = {};
    
    let reformattedData = {};
    for(const item of data) {
        reformattedData[item.conjugation_name] = item;
    }
    return reformattedData;
}