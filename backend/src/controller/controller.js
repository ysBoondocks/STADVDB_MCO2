const mysqlConnection = require('../../mysql');

const controller = {
    getMovies: function (req, res) {
        mysqlConnection.query('SELECT * FROM movies LIMIT 1000', (err, result) => {
            if (err) {
                console.log(err);
            } else {
                var data = JSON.parse(JSON.stringify(result))
                console.log(data)
                res.send(data)
            }
        });
    },

    addMovie: function (req,res){


        mysqlConnection.query(`INSERT INTO movies (name, year) VALUES ('${req.body.name}', '${req.body.year}')`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                var data = JSON.parse(JSON.stringify(result))
                console.log(data)
                res.send(data)
            }
        });
    }
}

module.exports = controller;