# cs310_project

Project for CS310 Web Development. A website that helps a user practice their Japanese conjugation skills.

### Tools Used

* Bootstrap 5.3.2
* JQuery 3.7.1
* [coolors.co](https://coolors.co/)
* Node JS

### Required Node Packages

* Express
* Sqlite
* Sqlite3
* Nodemon

### Setup

* Install Node JS on system
* Clone this repository to your computer
* Open command prompt to the folder of the cloned repository and install the required node packages by running "npm install X" for each package, where X is the package name
* To start the server, type "npx nodemon" in the open cmd prompt terminal
* Open your browser to [http://localhost:8080/home.html]([http://localhost:8080/home.html]()) to see the working site

### Database Design

* The database has 2 tables that are both used by the node server to provide the data for the server-side API
* The verbs table contains all the necessary components to fill in the practice page with information, and also has extra metadata required for conjugations
* The irregulars table has irregular conjugations of verbs in the verbs table, and the two are linked by the verb_id
* See the "database_sql.sql" file for more information

### Server-Side API

* Making a POST request to http://localhost:8080/verbs will return JSON containing all verbs from the database
* Making a POST request to http://localhost:8080/verbs?verb_id=X will only return the data of the one verb with the id of X
* Making a POST request to http://localhost:8080/irregulars will return an error because parameters are required
* Making a POST request to http://localhost:8080/irregulars?verb_id=X will return all irregulars for that verb
* Making a POST request to http://localhost:8080/irregulars?verb_id=X&conjugation_name=Y will return the irregular for verb X when conjugated to form Y
* The irregulars API will often return blank JSON because most verbs do not have irregular conjugations

![Website page layout](media/CS310%20Site%20Layout.png "Website page layout")
