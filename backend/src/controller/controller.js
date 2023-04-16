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
                var data = JSON.parse(JSON.stringify(result))
                //console.log(data)
                res.send(data)
            }
        });
    },

    checkLogs: function (req, res) {
        mysqlConnection.query('SELECT * FROM logs', (err, result) => {
            if (err){
                console.log("NODE 1 IS STILL DOWN");
            }
            let data;
            if (result)
                data = JSON.parse(JSON.stringify(result))

            let deleteLogs = []

            console.log(data.length)

            //Loop through logs in the node
            for (let i = 0; i < data.length; i++) {
                JSONdata = JSON.parse(data[i].description)
                console.log(JSONdata)

                let func = JSONdata.function;
                let node = JSONdata.node;
                let name = JSONdata.name;
                let year = JSONdata.year;
                let id   = JSONdata.id
                let Incomplete = -1;

                if (node == 1) {
                    if (func === 'add')
                        Incomplete = helper.addMovieFromLogsNode1(name, year)
                    else if (func === 'del')
                        Incomplete = helper.delMovieFromLogsNode1(year, id);
                    else if (func === 'edit')
                        Incomplete = helper.editMovieFromLogsNode1(name, year, id);
                }
                else if (node == 2) {
                    if (func === 'add')
                        Incomplete = helper.addMovieFromLogsNode2(name, year)
                    else if (func === 'del')
                        Incomplete = helper.delMovieFromLogsNode2(year, id);
                    else if (func === 'edit')
                        Incomplete = helper.editMovieFromLogsNode2(name, year, id);
                }
                else if (node == 3) {
                    if (func === 'add')
                        Incomplete = helper.addMovieFromLogsNode3(name, year)
                    else if (func === 'del')
                        Incomplete = helper.delMovieFromLogsNode3(year, id);
                    else if (func === 'edit')
                        Incomplete = helper.editMovieFromLogsNode3(name, year, id);
                }

                if (Incomplete == 0) {
                    //DELETE LOG
                    deleteLogs.push(data[i])
                }
                //Incomplete -1 = NODE STILL CLOSED
            }

            if (deleteLogs.length > 0) {
                for(let i = 0; i < deleteLogs.length; i++) {
                    let JSONLog = JSON.parse(deleteLogs[i].description)
                    let func = JSONLog.function;
                    let node = JSONLog.node;
                    let name = JSONLog.name;
                    let year = JSONLog.year;
                    let id   = JSONLog.id
    
                    let query_data ='{"function":' + '"' + `${func}`+ '"' + ', "node":' + `${node}` + ', "id":' + `${id}` + ', "name":'+ '"' + `${name}`+ '"' +', "year":' + `${year}`+'}'
                    
                    console.log("TEST")
                    console.log(query_data)
                    mysqlConnection.query(`DELETE FROM logs l WHERE l.description = '${query_data}'`, (err, result) => {
                        if (err) {
                        }
                        console.log("DELETED")
                    })
                }
            }

            res.send(data);
        })
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
                helper.addQueryToLog (req, res, mysqlConnection2, mysqlConnection3, 1, "del", `${req.body.id}`);   
            } else {
                var year = `${req.body.year}`
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
                    helper.addQueryToLog (req, res, mysqlConnection2, mysqlConnection3, 1, "edit", `${req.body.id}`);   
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
                    helper.addQueryToLog (req, res, mysqlConnection2, mysqlConnection3, 1, "edit", `${req.body.id}`);  
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