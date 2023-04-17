const mysqlConnection1 = require('../../mysql');
const mysqlConnection2 = require('../../mysql2');
const mysqlConnection3 = require('../../mysql3');

const helper = {
    addQueryToLog: function (req, res, connection2, connection3, node, func, id) {
        connection2.getConnection((err, result) => {
            if (err) {
                //If offline
                //console.log(err)
                console.log("NODE OFFLINE")
                //Open Node 3
                connection3.getConnection((err, result) => {
                    if (err) {
                        //If offline
                        //console.log(err)     
                        console.log("NODE 3 OFFLINE")   
                    } else {

                        let query_data = '{"node":' + `${node}` + ', "down":"yes"}'
                        //CHECK IF IN LOGS
                        connection3.query(`SELECT * FROM logs l WHERE l.description = '${query_data}'`, (err, result) => {
                            if(err){
                            }
                            var existing = JSON.parse(JSON.stringify(result))
                            if (existing.length == 0) {
                                //SAVE TO LOG
                                console.log("ADD LOG TO NODE " + `${node}`)
                                connection3.query(`INSERT INTO logs (description) VALUES ('${query_data}');`, (err, result) => {
                                    if(err){
                                        console.log(err)
                                    }
                                });
                            }
                        });
                    }
                })
            } else {
                    let query_data = '{"node":' + `${node}` + ', "down":"yes"}'
                    //CHECK IF IN LOGS
                    connection2.query(`SELECT * FROM logs l WHERE l.description = '${query_data}'`, (err, result) => {
                        if(err){
                        }
                        var existing = JSON.parse(JSON.stringify(result))
                        if (existing.length == 0) {
                            //SAVE TO LOG
                            console.log("ADD LOG TO NODE " + `${node}`)
                            connection2.query(`INSERT INTO logs (description) VALUES ('${query_data}');`, (err, result) => {
                                if(err){
                                    console.log(err)
                                }
                            });
                        }
                    });
            }
        })
    },

    node1DOWN: function (req, res, logsourceConnection) {
        //Copy Node 2 and 3 to Node 1
        mysqlConnection2.query(`SELECT * FROM movies`, (err, result) => {
            if (err){
                console.log("NODE LOG ERROR CASE 1");
            } else {
                let data = JSON.parse(JSON.stringify(result))
                //GET NODE 3
                mysqlConnection3.query(`SELECT * FROM movies`, (err, result) => {
                    if (err){
                        console.log("NODE 3 LOG ERROR CASE 1");
                    } else {
                        let data2 = JSON.parse(JSON.stringify(result))
                        data = data.concat(data2);
    
                        data = data.sort((a, b) => {
                            if (a.id < b.id) {
                                return -1;
                            }
                        });
    
                        let query_values
                        let count = 0;
                        data.forEach((movie) => {
                            let id = movie.id
                            let name = movie.name
                            let year = movie.year
    
                            if (count == 0 ) {
                                query_values = "(" + id + ", " + '"' + name + '"' + ", " + year +  "), "
                                count++;
                            } else {
                                query_values = query_values.concat("(" + id + ", " + '"' + name + '"' + ", " + year +  "), ")
                            }
                        })
    
                        query_values = query_values.slice(0, query_values.length-2)
                        
                        mysqlConnection1.query(`TRUNCATE TABLE movies`, (err, result) => {
                            if (err) {
                                console.log("ERROR TRUNCATING")
                            } else {
                                console.log("CHECK")
                                mysqlConnection1.query(`INSERT INTO movies (id, name, year) VALUES ` + query_values, (err, result) => {
                                    if (err){
                                        console.log("ERROR COPYING NODES")
                                        console.log(err)
                                    } else {
                                        logsourceConnection.query(`TRUNCATE TABLE logs`, (err, results) => {
                                            if (err){
                                                console.log("ERROR TRUNCATING LOGS")
                                            }
                                        })
                                        res.send(false)
                                    }
                                });
                            }
    
                        });
                    }
                });
            }
        });
    },

    node2DOWN: function (req, res, logsourceConnection) {        
        //Copy Node 1 to Node 2
        mysqlConnection1.query(`SELECT * FROM movies m WHERE m.year < 1980`, (err, result) => {
            if (err){
                console.log("NODE 1 LOG ERROR CASE 2");
            } else {
                let data = JSON.parse(JSON.stringify(result))
                let query_values
                let count = 0;
                data.forEach((movie) => {
                    let id = movie.id
                    let name = movie.name
                    let year = movie.year

                    if (count == 0 ) {
                        query_values = "(" + id + ", " + '"' + name + '"' + ", " + year +  "), "
                        count++;
                    } else {
                        query_values = query_values.concat("(" + id + ", " + '"' + name + '"' + ", " + year +  "), ")
                    }
                })

                query_values = query_values.slice(0, query_values.length-2)
                
                mysqlConnection2.query(`TRUNCATE TABLE movies`, (err, result) => {
                    if (err) {
                        console.log("ERROR TRUNCATING")
                    } else {
                        console.log("CHECK")
                        mysqlConnection2.query(`INSERT INTO movies (id, name, year) VALUES ` + query_values, (err, result) => {
                            if (err){
                                console.log("ERROR COPYING NODES")
                                console.log(err)
                            } else {
                                logsourceConnection.query(`TRUNCATE TABLE logs`, (err, results) => {
                                    if (err){
                                        console.log("ERROR TRUNCATING LOGS")
                                    }
                                })
                                res.send(false)
                            }
                        });
                    }

                });
            }
        });
    },

    node3DOWN: function (req, res, logsourceConnection) {
        //Copy Node 1 to Node 3
        mysqlConnection1.query(`SELECT * FROM movies m WHERE m.year >= 1980`, (err, result) => {
            if (err){
                console.log("NODE 1 LOG ERROR CASE 3");
            } else {
                let data = JSON.parse(JSON.stringify(result))
                let query_values
                let count = 0;
                data.forEach((movie) => {
                    let id = movie.id
                    let name = movie.name
                    let year = movie.year

                    if (count == 0 ) {
                        query_values = "(" + id + ", " + '"' + name + '"' + ", " + year +  "), "
                        count++;
                    } else {
                        query_values = query_values.concat("(" + id + ", " + '"' + name + '"' + ", " + year +  "), ")
                    }
                })

                query_values = query_values.slice(0, query_values.length-2)
                
                mysqlConnection3.query(`TRUNCATE TABLE movies`, (err, result) => {
                    if (err) {
                        console.log("ERROR TRUNCATING")
                    } else {
                        console.log("CHECK")
                        mysqlConnection3.query(`INSERT INTO movies (id, name, year) VALUES ` + query_values, (err, result) => {
                            if (err){
                                console.log("ERROR COPYING NODES")
                                console.log(err)
                            } else {
                                logsourceConnection.query(`TRUNCATE TABLE logs`, (err, results) => {
                                    if (err){
                                        console.log("ERROR TRUNCATING LOGS")
                                    }
                                })
                                res.send(false)
                            }
                        });
                    }

                });
            }
        });
    },
};

module.exports = helper;