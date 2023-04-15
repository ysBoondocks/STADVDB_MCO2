const mysqlConnection = require('../../mysql');
const mysqlConnection2 = require('../../mysql2');
const mysqlConnection3 = require('../../mysql3');

const controller = {

    getMovies: function (req, res) {
        var data;
         mysqlConnection.query('SELECT * FROM movies', (err, result) => {
            if (err) {
                console.log(err);
                    // IF NODE 1 FAILS CONCAT NODE 2 AND NODE 3
                    mysqlConnection2.query('SELECT * FROM movies', (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            data = JSON.parse(JSON.stringify(result))
                            //console.log(data)
                            mysqlConnection3.query('SELECT * FROM movies', (err, result) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    data2 = JSON.parse(JSON.stringify(result))
                                    data = data.concat(data2);
                                    //console.log(data)
                                    res.send(data)
                                }
                            });
                        }
                    });
            } else {
                data = JSON.parse(JSON.stringify(result))
                //console.log(data)
                res.send(data)
            }
        });
    },

    addMovie: function (req,res){
        mysqlConnection.query(`SELECT COUNT(*) FROM movies`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                var data = JSON.parse(JSON.stringify(result))
                console.log(data)
                var dataCount = data[0]['COUNT(*)']+1;
                mysqlConnection.query(`INSERT INTO movies (id, name, year) VALUES ('${dataCount}', '${req.body.name}', '${req.body.year}')`, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        var data = JSON.parse(JSON.stringify(result))
                        console.log(data)
                        res.send(true);
                    }
                });
                
            }
        });
    },

    deleteMovie: function (req,res){
        mysqlConnection.query(`DELETE FROM movies WHERE id=${req.body.id}`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                var year = `${req.body.id}`
                if (year < 1980) {
                    //NODE 2
                    mysqlConnection2.query(`DELETE FROM movies WHERE id=${req.body.id}`, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //res.send(true);
                        }
                    });
                }
                else {
                    //NODE 3
                    mysqlConnection3.query(`DELETE FROM movies WHERE id=${req.body.id}`, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //res.send(true);
                        }
                    });
                }
                var data = JSON.parse(JSON.stringify(result))
                console.log(data)
                res.send(true);
            }
        });
    },

    
    editMovie: function (req,res){
        console.log("reqname",req.body.name);
        console.log("reqyear",req.body.year);
        let success = false;
        if(req.body.name !== "" && req.body.name !== undefined){
            mysqlConnection.query(`UPDATE movies SET name = "${req.body.name}" WHERE id=${req.body.id}`, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    success = true;
                }
            });
        }
        if(req.body.year !== "" && req.body.year !== undefined){
            mysqlConnection.query(`UPDATE movies SET year = "${req.body.year}" WHERE id=${req.body.id}`, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    success = true;
                }
            });
        }

        res.send(success);
        
    },

    searchMovie: function (req,res){

        console.log(req.params.name)
        mysqlConnection.query(`SELECT * FROM movies WHERE name="${req.params.name}"`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                var data = JSON.parse(JSON.stringify(result))
                console.log(data)
                res.send(data);
            }
        });
    }
}

module.exports = controller;