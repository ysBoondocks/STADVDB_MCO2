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
                console.log("NODE 1 IS STILL DOWN");
            } else {
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
                        mysqlConnection2.query(`DELETE FROM logs l WHERE l.description = '${query_data}'`, (err, result) => {
                            if (err) {
                            }
                            console.log("DELETED")
                        })
                    }
                }
    
                res.send(data);
            }

        })
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