//FOR NODE 2
const mysqlConnection2 = require('../../mysql2');
const mysqlConnection1 = require('../../mysql');    //NODE 1
const mysqlConnection3 = require('../../mysql3');    //NODE 3
const helper = require('./helper');

const controller2 = {
    getMovies: function (req, res) {
        mysqlConnection2.query('SELECT * FROM movies', (err, result) => {
            if (err) {
                console.log(err);
                    // IF NODE 2 FAILS GET PART OF NODE 1 (LESS THAN 1980)
                    mysqlConnection1.query('SELECT * FROM movies m WHERE m.year < 1980', (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            data = JSON.parse(JSON.stringify(result))
                            //console.log(data)
                            res.send(data)
                        }
                    });
            } else {
                var data = JSON.parse(JSON.stringify(result))
                //console.log(data)
                res.send(data)
            }
        });
    },

    checkLogs: function (req, res) {
    },

    addMovie: function (req,res){
        mysqlConnection2.query(`SELECT * FROM movies m WHERE m.name = '${req.body.name}' AND m.year = '${req.body.year}'`, (err, result) => {
            if (err) {
                console.log(err);
                helper.addQueryToLog (req, res, mysqlConnection1, mysqlConnection3, 2, "add", -1);  
            } else {
                var existing = JSON.parse(JSON.stringify(result))
                console.log(existing.length);
                if (existing.length == 0) {
                    mysqlConnection2.query(`SELECT m.id FROM movies m ORDER BY m.id DESC LIMIT 1`, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            var data = JSON.parse(JSON.stringify(result))
                            var MaxID = data[0]['id']+1;
                            
                            //IF NODE 2 WILL ADD < 1980
                            if(`${req.body.year}` < 1980){
                                mysqlConnection2.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${req.body.name}', '${req.body.year}')`, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //ADD TO NODE 1
                                        mysqlConnection1.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${req.body.name}', '${req.body.year}')`, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                            }
                                        });
                                        var result = JSON.parse(JSON.stringify(result))
                                        //console.log(data)
                                        res.send(true);
                                    }
                                });
                            } else {
                                //NODE 3
                                mysqlConnection3.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${req.body.name}', '${req.body.year}')`, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //ADD TO NODE 1
                                        mysqlConnection1.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${req.body.name}', '${req.body.year}')`, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                            }
                                        });
                                        var result = JSON.parse(JSON.stringify(result))
                                        //console.log(data)
                                        res.send(true);
                                    }
                                });
                            }
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
        mysqlConnection2.query(`DELETE FROM movies WHERE id=${req.body.id}`, (err, result) => {
            if (err) {
                console.log(err);
                helper.addQueryToLog (req, res, mysqlConnection1, mysqlConnection3, 2, "del", `${req.body.id}`);  
            } else {
                mysqlConnection1.query(`DELETE FROM movies WHERE id=${req.body.id}`, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        //res.send(true);
                    }
                });

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

        if (`${req.body.year}` < 1980) {
            //STAY ON NODE 2
            mysqlConnection2.query(`SELECT * FROM movies m WHERE m.name = '${req.body.name}' AND m.year = '${req.body.year}'`, (err, result) => {
                    if (err){
                        console.log(err)
                        helper.addQueryToLog (req, res, mysqlConnection1, mysqlConnection3, 2, "edit", `${req.body.id}`);  
                    } else {
                        var existing = JSON.parse(JSON.stringify(result))
                        console.log(existing.length);
                        //ALLOW EDIT, NO DATA WITH NAME AND YEAR
                        if (existing.length == 0) {
                            if((req.body.name !== "" && req.body.name !== undefined) || (req.body.year !== "" && req.body.year !== undefined)) {
                                //EDIT NODE 2
                                mysqlConnection2.query(`UPDATE movies SET name = "${req.body.name}", year = "${req.body.year}" WHERE id=${req.body.id}`, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //NODE 1
                                        mysqlConnection1.query(`UPDATE movies SET name = "${req.body.name}", year = "${req.body.year}" WHERE id=${req.body.id}`, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                            }
                                        });
                                        success = true;
                                    }
                                });
                            }
                        } 
                        else {
                        }
                    }
                    res.send(success)
                });
        } else {
            //MOVE TO NODE 3
            mysqlConnection3.query(`INSERT INTO movies (id, name, year) VALUES ('${req.body.id}', '${req.body.name}', '${req.body.year}')`, (err, result) => {
                if (err) {
                    console.log(err);
                    helper.addQueryToLog (req, res, mysqlConnection1, mysqlConnection2, 3, "edit", `${req.body.id}`);  
                } else {
                    //EDIT TO NODE 1
                    mysqlConnection1.query(`UPDATE movies SET name = "${req.body.name}", year = "${req.body.year}" WHERE id=${req.body.id}`, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //DELETE FROM NODE 2
                            mysqlConnection2.query(`DELETE FROM movies WHERE id=${req.body.id}`, (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                    });
                    var result = JSON.parse(JSON.stringify(result))
                    //console.log(data)
                    success = true;
                }                
                res.send(success)
            });
        }
    },

    searchMovie: function (req,res){
        mysqlConnection2.query(`SELECT * FROM movies WHERE name="${req.body.name}"`, (err, result) => {
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

module.exports = controller2;