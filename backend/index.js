const express = require('express');
const bodyParser = require('body-parser');
const mysqlConnection = require('./mysql');
const routes = require('./src/routes/routes.js');
const cors = require("cors");

// CHANGE TO REACT???
//const exphbs = require('express-handlebars');

const app = express();

// CHANGE TO REACT??
//app.engine("hbs", exphbs.engine({extname: 'hbs'}));
//app.set('view engine', 'hbs');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static('public'));

// mysqlConnection.query('SELECT * FROM movies LIMIT 1', (err, result) => {
//         if (err) {
//             console.log(err);
//         } else {
//             var data = JSON.parse(JSON.stringify(result))
//             console.log(data)
//         }
// });

//create routes
app.use("/api/", routes);


// FOR REACT TRIAL
//PUT TO ROUTES AND THE COMMANDS PUT TO CONTROLLER
// app.get('/api/get',(req,res)=>{
//     //MOVE TO CONTROLLERS
//     mysqlConnection.query('SELECT * FROM movies LIMIT 10', (err, result) => {
//         if (err) {
//             console.log(err);
//         } else {
//             var data = JSON.parse(JSON.stringify(result))
//             console.log(data)
//             res.send(data)
//         }
//     });
// })


app.listen(80, () => {
	console.log('Node.js server running on port 80');
    console.log('https://localhost:80');
});