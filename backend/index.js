const express = require('express');
const bodyParser = require('body-parser');
//const mysqlConnection = require('./mysql');
const routes = require('./src/routes/routes.js');
const cors = require("cors");

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

//create routes
app.use("/api/", routes);


app.listen(80, () => {
	console.log('Node.js server running on port 80');
    console.log('https://localhost:80');
});