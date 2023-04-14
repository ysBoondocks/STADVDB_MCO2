const express = require('express');
const bodyParser = require('body-parser');
const mysqlConnection = require('./mysql');

// CHANGE TO REACT???
const exphbs = require('express-handlebars');

const app = express();

// CHANGE TO REACT??
app.engine("hbs", exphbs.engine({extname: 'hbs'}));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static('public'));

mysqlConnection.query('SELECT * FROM movies LIMIT 1', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            var data = JSON.parse(JSON.stringify(result))
            console.log(data)
        }
});

app.get('/', (req, res) => {
    res.send("YOUR MOM SUCKS");
	res.redirect("/");
});

app.listen(80, () => {
	console.log('Node.js server running on port 80');
    console.log('https://localhost:80');
});