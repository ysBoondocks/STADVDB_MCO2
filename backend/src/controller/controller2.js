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
                            var data = JSON.parse(JSON.stringify(result))
                            //console.log(data)
                            data = data.concat({flag: false});
                            res.send(data);
                            console.log(data[data.length-1].flag);
                        }
                    });
            } else {
                var data = JSON.parse(JSON.stringify(result))
                //console.log(data)
                data = data.concat({flag: true});
                res.send(data);
                console.log("node2 working",data[data.length-1].flag);
            }
        });
    },

    checkLogs: function (req, res) {
        mysqlConnection2.query('SELECT * FROM logs', (err, result) => {
            if (err){
               console.log("NODE 2 IS STILL DOWN");
            } else {
                var hasLogs = JSON.parse(JSON.stringify(result))
                if (hasLogs.length != 0) {
                    let JSONlog = JSON.parse(hasLogs[0].description)
                    if (JSONlog.down === 'yes') {
                        console.log(JSONlog)

                        switch (JSONlog.node) {
                            //Node 1 was down
                            case 1:
                                mysqlConnection1.getConnection((err, connection) => {
                                    if (err) {
                                    } else {
                                        helper.node1DOWN(req, res, mysqlConnection2);
                                    }
                                }); 
                            break;
                            //Node 2 was down
                            case 2:
                                mysqlConnection2.getConnection((err, connection) => {
                                    if (err) {
                                    } else {
                                        helper.node2DOWN(req, res, mysqlConnection2);
                                    }
                                });
                            break;
                            //Node 3 was down
                            case 3:
                                mysqlConnection3.getConnection((err, connection) => {
                                    if (err) {
                                    } else {
                                        helper.node3DOWN(req, res, mysqlConnection2);
                                    }
                                });
                            break;
                        }
                    }
                }
            }
        });
    },

    addMovie: function (req,res){
        mysqlConnection2.query(`SELECT * FROM movies m WHERE m.name = '${req.body.name}' AND m.year = '${req.body.year}'`, (err, result) => {
            if (err) {
                console.log(err);
                helper.addQueryToLog (req, res, mysqlConnection1, mysqlConnection3, 2, "add", -1);  
                addMovieServerDown(req, res)
            } else {
                var existing = JSON.parse(JSON.stringify(result))
                console.log(existing.length);
                if (existing.length == 0) {
                    mysqlConnection1.query(`SELECT m.id FROM movies m ORDER BY m.id DESC LIMIT 1`, (err, result) => {
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
                delMovieServerDown(req, res)
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
                        success = editMovieServerDown(req, res)
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
                    success = editMovieServerDown(req, res) 
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

function addMovieServerDown (req, res) {
        //Add to Node 1
        mysqlConnection1.query(`SELECT * FROM movies m WHERE m.name = '${req.body.name}' AND m.year = ${req.body.year}`, (err, result) => {
            if (err){
                console.log(err)
            } else {
                var existing = JSON.parse(JSON.stringify(result))
                if (existing.length == 0) {
                    //Does not exist in Database
                    //Get last ID of node 1
                    mysqlConnection1.query(`SELECT m.id FROM movies m ORDER BY m.id DESC LIMIT 1`, (err, result) => {
                        if (err){
                            console.log("error in add server down function in node 2")
                        }
                        else {
                            var data = JSON.parse(JSON.stringify(result))
                            var MaxID = data[0]['id']+1;

                            mysqlConnection1.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${req.body.name}', '${req.body.year}')`, (err, result) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    var result = JSON.parse(JSON.stringify(result))
                                    //console.log(data)
                                    res.send(true);
                                }
                            });
                        }
                    })
                }
                else {
                    console.log("MOVIE IS ALREADY IN DATABASE")
                    res.send(false)
                }
            }
        })
}

function delMovieServerDown (req, res) {
    //Delete From Node 1
    mysqlConnection1.query(`DELETE FROM movies WHERE id=${req.body.id}`, (err, result) => {
        if (err) {
            console.log(err); 
        } else {
            var data = JSON.parse(JSON.stringify(result))
            console.log(data)
            res.send(true);
        }
    });
}

function editMovieServerDown (req, res) {
    //Node 2 down so edit Node 1
    mysqlConnection1.query(`UPDATE movies SET name = "${req.body.name}", year = "${req.body.year}" WHERE id=${req.body.id}`, (err, result) => {
        if (err){
            console.log("ERROR IN EDIT NODE 2 WHEN SERVER IS DOWN")
        }
        else {
            return true;
        }
    });
}

module.exports = controller2;