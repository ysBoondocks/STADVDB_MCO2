const mysqlConnection = require('../../mysql');
const mysqlConnection2 = require('../../mysql2');
const mysqlConnection3 = require('../../mysql3');
const helper = require('./helper');

const controller = {
    getMovies: function (req, res) {
	//Verify Node 1,2, and 3 are all the same
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
        mysqlConnection.query(`SELECT * FROM movies m WHERE m.name = '${req.body.name}' AND m.year = '${req.body.year}'`, (err, result) => {
            if (err) {
                //console.log(err);
                //If Offline save to DB that is alive
                //Make sure its not in DB
                //Check Node 2
                console.log("ADD NODE 1 OFFLINE")
                helper.addQueryToLog (req, res, mysqlConnection2, mysqlConnection3, 1, "add");    
            } 
            //NODE 1 IS ONLINE
            else {
                var existing = JSON.parse(JSON.stringify(result))
                console.log(existing.length);
                if (existing.length == 0) {
                    mysqlConnection.query(`SELECT m.id FROM movies m ORDER BY m.id DESC LIMIT 1`, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            var data = JSON.parse(JSON.stringify(result))
                            var MaxID = data[0]['id']+1;
                            mysqlConnection.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${req.body.name}', '${req.body.year}')`, (err, result) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //ADD TO NODE 2
                                    if (`${req.body.year}` < 1980) {
                                        mysqlConnection2.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${req.body.name}', '${req.body.year}')`, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                            }
                                        });
                                    } 
                                    //ADD TO NODE 3
                                    else {
                                        mysqlConnection3.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${req.body.name}', '${req.body.year}')`, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                            }
                                        });
                                    }

                                    var result = JSON.parse(JSON.stringify(result))
                                    //console.log(data)
                                    res.send(true);
                                }
                            });
                        }
                    });
                }
                else {
                    //CONNECT TO FRONTEND
                    console.log("MOVIE IS ALREADY IN DATABASE")
                    res.send(false)
                }
            }
        });
    },

    deleteMovie: function (req,res){
        mysqlConnection.query(`DELETE FROM movies WHERE id=${req.body.id}`, (err, result) => {
            if (err) {
                console.log(err);
                console.log("DEL NODE 1 OFFLINE")
                helper.addQueryToLog (req, res, mysqlConnection2, mysqlConnection3, 1, "del");   
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
                    console.log("EDIT NODE 1 OFFLINE")
                    helper.addQueryToLog (req, res, mysqlConnection2, mysqlConnection3, 1, "edit");   
                } else {
                    if (req.body.year < 1980) {
                        mysqlConnection2.query(`UPDATE movies SET name = "${req.body.name}" WHERE id=${req.body.id}`, (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    } else {
                        mysqlConnection3.query(`UPDATE movies SET name = "${req.body.name}" WHERE id=${req.body.id}`, (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                    success = true;
                }
            });
        }
        if(req.body.year !== "" && req.body.year !== undefined){
            mysqlConnection.query(`UPDATE movies SET year = "${req.body.year}" WHERE id=${req.body.id}`, (err, result) => {
                if (err) {
                    console.log(err);
                    helper.addQueryToLog (req, res, mysqlConnection2, mysqlConnection3, 1, "edit");  
                } else {
                    if (req.body.year < 1980) {
                        mysqlConnection2.query(`UPDATE movies SET year = "${req.body.year}" WHERE id=${req.body.id}`, (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    } else {
                        mysqlConnection3.query(`UPDATE movies SET year = "${req.body.year}" WHERE id=${req.body.id}`, (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
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