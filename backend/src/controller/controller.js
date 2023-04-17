const { query } = require('express');
const mysqlConnection = require('../../mysql');
const mysqlConnection2 = require('../../mysql2');
const mysqlConnection3 = require('../../mysql3');
const helper = require('./helper');

const controller = {

    setIsolationLevel: function(req,res){
        switch(req.params.isolation){
            case '1':
                mysqlConnection.query(`SET GLOBAL TRANSACTION ISOLATION LEVEL READ UNCOMMITTED`);
                mysqlConnection2.query(`SET GLOBAL TRANSACTION ISOLATION LEVEL READ UNCOMMITTED`);
                mysqlConnection3.query(`SET GLOBAL TRANSACTION ISOLATION LEVEL READ UNCOMMITTED`);
                break;

            case '2':
                mysqlConnection.query(`SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED`);
                mysqlConnection2.query(`SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED`);
                mysqlConnection3.query(`SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED`);
                break;

            case '3':
                mysqlConnection.query(`SET GLOBAL TRANSACTION ISOLATION LEVEL REPEATABLE READ`);
                mysqlConnection2.query(`SET GLOBAL TRANSACTION ISOLATION LEVEL REPEATABLE READ`);
                mysqlConnection3.query(`SET GLOBAL TRANSACTION ISOLATION LEVEL REPEATABLE READ`);
                break;

            case '4':
                mysqlConnection.query(`SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE`);
                mysqlConnection2.query(`SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE`);
                mysqlConnection3.query(`SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE`);
                break;
            default: break;
        }
        // console.log("hello",req.params.isolation);
        res.send(req.params.isolation);
        // res.send("hello");
    },

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

                                    data = data.sort((a, b) => {
                                        if (a.id < b.id) {
                                          return -1;
                                        }
                                    });
                                    
                                    data = data.concat({flag: false});
                                    res.send(data);
                                    console.log(data[data.length-1].flag);
                                }
                            });
                        }
                    });
            } else {
                var data = JSON.parse(JSON.stringify(result))
                //console.log(data)
                data = data.concat({flag: true});
                res.send(data);
                console.log(data[data.length-1].flag);
            }
        });
    },

    checkLogs: function (req, res) {
        mysqlConnection.query('SELECT * FROM logs', (err, result) => {
            if (err){
               console.log("NODE 1 IS STILL DOWN");
            } else {
                var hasLogs = JSON.parse(JSON.stringify(result))
                if (hasLogs.length != 0) {
                    let JSONlog = JSON.parse(hasLogs[0].description)
                    if (JSONlog.down === 'yes') {
                        console.log(JSONlog)

                        switch (JSONlog.node) {
                            //Node 1 was down
                            case 1:
                                mysqlConnection.getConnection((err, connection) => {
                                    if (err) {
                                    } else {
                                        helper.node1DOWN(req, res, mysqlConnection);
                                    }
                                }); 
                            break;
                            //Node 2 was down
                            case 2:
                                mysqlConnection2.getConnection((err, connection) => {
                                    if (err) {
                                    } else {
                                        helper.node2DOWN(req, res, mysqlConnection);
                                    }
                                });
                            break;
                            //Node 3 was down
                            case 3:
                                mysqlConnection3.getConnection((err, connection) => {
                                    if (err) {
                                    } else {
                                        helper.node3DOWN(req, res, mysqlConnection);
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
        mysqlConnection.query(`SELECT * FROM movies m WHERE m.name = '${req.body.name}' AND m.year = '${req.body.year}'`, (err, result) => {
            if (err) {
                //console.log(err);
                //If Offline save to DB that is alive
                //Make sure its not in DB
                //Check Node 2
                console.log("ADD NODE 1 OFFLINE")
                helper.addQueryToLog (req, res, mysqlConnection2, mysqlConnection3, 1, "add", -1); 
                addMovieServerDown(req, res);   
            } 
            //NODE 1 IS ONLINE
            else {
                var existing = JSON.parse(JSON.stringify(result))
                console.log(existing.length);
                if (existing.length == 0) {
                    addMovieServerUp(req, res);
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
                console.log("!!DEL NODE 1 OFFLINE!!")
                helper.addQueryToLog (req, res, mysqlConnection2, mysqlConnection3, 1, "del", `${req.body.id}`);  
                delMovieServerDown(req, res) 
            } else {
                var year = `${req.body.year}`
                if (year < 1980) {
                    //NODE 2
                    mysqlConnection2.query(`DELETE FROM movies WHERE id=${req.body.id}`, (err, result) => {
                        if (err) {
                            console.log(err);
                            helper.addQueryToLog (req, res, mysqlConnection, mysqlConnection3, 2, "add", -1); 
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
                            helper.addQueryToLog (req, res, mysqlConnection, mysqlConnection2, 3, "add", -1); 
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

        let name = req.body.name;
        let year = req.body.year;
        let id = req.body.id

        let success = false;
        if(name !== "" && name !== undefined) {
            mysqlConnection.query(`UPDATE movies SET name = "${name}", year = "${year}" WHERE id=${id}`, (err, result) => {
                if (err) {
                    console.log("!!EDIT NODE 1 OFFLINE!!")
                    helper.addQueryToLog(req, res, mysqlConnection2, mysqlConnection3, 1, "edit", `${id}`)
                    success = editMovieServerDown(req, res);
                } else {
                    if (`${year}` < 1980) {
                        console.log("CHECK THIS!!")
                        //CHECK IF ORIGINALLY IN NODE 2
                        mysqlConnection2.query(`SELECT * FROM movies m WHERE m.id = ${id}`, (err, result) => {
                            if (err) { console.log (err)
                            } else {
                                var existing = JSON.parse(JSON.stringify(result))
                                console.log("existing in node 2: " + existing)
                                if (existing.length != 0) {
                                    //UPDATE NODE 2
                                    mysqlConnection2.query(`UPDATE movies SET name = "${name}", year = "${year}" WHERE id=${id}`, (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            helper.addQueryToLog (req, res, mysqlConnection, mysqlConnection3, 2, "add", -1); 
                                        }
                                    });
                                    console.log("CHECK THIS!! AGAIN")
                                }
                                else {
                                    //ADD TO NODE 2 DELETE FROM NODE 3
                                    mysqlConnection2.query(`INSERT INTO movies (id, name, year) VALUES ('${id}', '${name}', '${year}')`, (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            helper.addQueryToLog (req, res, mysqlConnection, mysqlConnection3, 2, "add", -1); 
                                        }
                                    });
                                    mysqlConnection3.query(`DELETE FROM movies WHERE id=${id}`, (err, result) => {
                                        if (err) {
                                            console.log(err)
                                            helper.addQueryToLog (req, res, mysqlConnection, mysqlConnection2, 3, "add", -1); 
                                        }
                                    })
                                    console.log("CHECK THIS!! NOT")
                                }
                            }
                        });
                    } else {
                        //CHECK IF ORIGINALLY IN NODE 3
                        mysqlConnection3.query(`SELECT * FROM movies m WHERE m.id = ${id}`, (err, result) => {
                            if (err) { console.log (err)
                            } else {
                                var existing = JSON.parse(JSON.stringify(result))
                                console.log(result)
                                console.log(existing)
                                //IF IN NODE 3
                                console.log("PLEASE WORK LOL")
                                console.log("existing in node 3: " + existing.length)
                                if (existing.length != 0) {
                                    console.log("test")
                                    //UPDATE NODE 3
                                    mysqlConnection3.query(`UPDATE movies SET name = "${name}", year = "${year}" WHERE id=${id}`, (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            helper.addQueryToLog (req, res, mysqlConnection, mysqlConnection2, 3, "add", -1); 
                                        }
                                    });
                                    console.log("CHECK THIS!! OUT")
                                }
                                else {
                                    //IF NOT
                                    //ADD TO NODE 3, DELETE IN NODE 2
                                    mysqlConnection3.query(`INSERT INTO movies (id, name, year) VALUES ('${id}', '${name}', '${year}')`, (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            helper.addQueryToLog (req, res, mysqlConnection, mysqlConnection2, 3, "add", -1); 
                                        }
                                    });
                                    mysqlConnection2.query(`DELETE FROM movies WHERE id=${id}`, (err, result) => {
                                        if (err) {
                                            console.log(err)
                                            helper.addQueryToLog (req, res, mysqlConnection, mysqlConnection3, 2, "add", -1); 
                                        }
                                    })
                                    console.log("CHECK THIS!! OUT NOT")
                                }
                            }
                        });
                    }
                    success = true
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

function addMovieServerUp (req, res) {
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
                                helper.addQueryToLog (req, res, mysqlConnection, mysqlConnection3, 2, "add", -1); 
                            } else {
                            }
                        });
                    } 
                    //ADD TO NODE 3
                    else {
                        mysqlConnection3.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${req.body.name}', '${req.body.year}')`, (err, result) => {
                            if (err) {
                                console.log(err);
                                helper.addQueryToLog (req, res, mysqlConnection, mysqlConnection2, 3, "add", -1); 
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

function addMovieServerDown (req, res) {
    console.log("DOWN CHECK")
    mysqlConnection2.query(`SELECT m.id FROM movies m ORDER BY m.id DESC LIMIT 1`, (err, result) => {
        if (err){
        }
        else {
            var data = JSON.parse(JSON.stringify(result))
            var Node_2_MaxID = data[0]['id']+1;
            mysqlConnection3.query(`SELECT m.id FROM movies m ORDER BY m.id DESC LIMIT 1`, (err, result) => {
                if (err){
                }
                else {
                    var data2 = JSON.parse(JSON.stringify(result))
                    var Node_3_MaxID = data2[0]['id']+1;
                    var MaxID;
                    if (Node_2_MaxID < Node_3_MaxID)
                        MaxID = Node_3_MaxID
                    else
                        MaxID = Node_2_MaxID
                    
                        if (req.body.year < 1980){
                            mysqlConnection2.query(`SELECT * FROM movies m WHERE m.name = '${req.body.name}' AND m.year = '${req.body.year}'`, (err, result) => {
                                if (err) {
                                    console.log("NODE 1 AND 2 ARE DOWN. OH NO....")
                                }
                                else {
                                    var existing = JSON.parse(JSON.stringify(result))
                                    if (existing.length == 0) {
                                        mysqlConnection2.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${req.body.name}', '${req.body.year}')`, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                            res.send(true)
                                        })
                                    }
                                    else {
                                        console.log("MOVIE IS ALREADY IN NODE 2")
                                        res.send(false)
                                    }
                                }
                            });
                        } else {
                            mysqlConnection3.query(`SELECT * FROM movies m WHERE m.name = '${req.body.name}' AND m.year = '${req.body.year}'`, (err, result) => {
                                if (err) {
                                    console.log("NODE 1 AND 3 ARE DOWN. OH NO....")
                                }
                                else {
                                    var existing = JSON.parse(JSON.stringify(result))
                                    if (existing.length == 0) {
                                        mysqlConnection3.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${req.body.name}', '${req.body.year}')`, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                            res.send(true)
                                        })
                                    }
                                    else {
                                        console.log("MOVIE IS ALREADY IN NODE 3")
                                        res.send(false)
                                    }
                                }
                            });
                        }
                    
                }
            })
        }
    })
}

function delMovieServerDown (req, res) {
    if (req.body.year < 1980) {
        mysqlConnection2.query(`DELETE FROM movies WHERE id=${req.body.id}`, (err, result) => {
            if (err) {
                console.log("NODE 1 AND 2 ARE DOWN...")
            }
            res.send(true)
        })
    }
    else {
        mysqlConnection3.query(`DELETE FROM movies WHERE id=${req.body.id}`, (err, result) => {
            if (err) {
                console.log("NODE 1 AND 3 ARE DOWN...")
            }
            res.send(true)
        })
    }

}

function editMovieServerDown (req, res) {
    if (`${req.body.year}` < 1980) {
        //CHECK IF ORIGINALLY IN NODE 2
        mysqlConnection2.query(`SELECT * FROM movies m WHERE m.id = ${req.body.id}`, (err, result) => {
            if (err) { console.log (err)
            } else {
                var existing = JSON.parse(JSON.stringify(result))
                if (existing.length != 0) {
                    //UPDATE NODE 2
                    mysqlConnection2.query(`UPDATE movies SET name = "${req.body.name}", year = "${req.body.year}" WHERE id=${req.body.id}`, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        return true;
                    });
                }
                else {
                    //ADD TO NODE 2 DELETE FROM NODE 3
                    mysqlConnection2.query(`INSERT INTO movies (id, name, year) VALUES ('${req.body.id}', '${req.body.name}', '${req.body.year}')`, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    mysqlConnection3.query(`DELETE FROM movies WHERE id=${req.body.id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        return true;
                    })
                }
            }
        });
    } else {
        //CHECK IF ORIGINALLY IN NODE 3
        mysqlConnection3.query(`SELECT * FROM movies m WHERE m.id = ${req.body.id}`, (err, result) => {
            if (err) { console.log (err)
            } else {
                var existing = JSON.parse(JSON.stringify(result))
                console.log(result)
                console.log(existing)
                //IF IN NODE 3
                if (existing.length != 0) {
                    //UPDATE NODE 3
                    mysqlConnection3.query(`UPDATE movies SET name = "${req.body.name}", year = "${req.body.year}" WHERE id=${req.body.id}`, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        return true;
                    });
                }
                else {
                    //IF NOT
                    //ADD TO NODE 3, DELETE IN NODE 2
                    mysqlConnection3.query(`INSERT INTO movies (id, name, year) VALUES ('${req.body.id}', '${req.body.name}', '${req.body.year}')`, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    mysqlConnection2.query(`DELETE FROM movies WHERE id=${req.body.id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        return true;
                    })
                }
            }
        });
    }
}

module.exports = controller;