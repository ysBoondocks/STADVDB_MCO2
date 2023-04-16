const mysqlConnection = require('../../mysql');
const mysqlConnection2 = require('../../mysql2');
const mysqlConnection3 = require('../../mysql3');

const helper = {
    addQueryToLog: function (req, res, connection2, connection3, node, func, id) {
        connection2.getConnection((err, result) => {
            if (err) {
                //If offline
                //console.log(err)
                console.log("NODE 2 OFFLINE")
                //Open Node 3
                connection3.getConnection((err, result) => {
                    if (err) {
                        //If offline
                        //console.log(err)     
                        console.log("NODE 3 OFFLINE")   
                    } else {
                        let query_data = '{"function":' + '"' + `${func}`+ '"' + ', "node":' + `${node}` + ', "id":' + `${id}` + ', "name":'+ '"' + `${req.body.name}`+ '"' +', "year":' + `${req.body.year}`+'}'
                        //CHECK IF IN LOGS
                        connection3.query(`SELECT * FROM logs l WHERE l.description = '${query_data}'`, (err, result) => {
                            if(err){
                            }
                            var existing = JSON.parse(JSON.stringify(result))
                            if (existing.length == 0) {
                                //SAVE TO LOG
                                console.log("ADD LOG TO NODE 3")
                                connection3.query(`INSERT INTO logs (description) VALUES ('${query_data}');`, (err, result) => {
                                    if(err){
                                        console.log(err)
                                    }
                                });
                            }
                        });
                    }
                })
                res.send(true);
            } else {
                    let query_data = '{"function":"add", "node":1, "name":'+ '"' + `${req.body.name}`+ '"' +', "year":'+`${req.body.year}`+'}'
                    //CHECK IF IN LOGS
                    connection2.query(`SELECT * FROM logs l WHERE l.description = '${query_data}'`, (err, result) => {
                        if(err){
                        }
                        var existing = JSON.parse(JSON.stringify(result))
                        if (existing.length == 0) {
                            //SAVE TO LOG
                            console.log("ADD LOG TO NODE 2")
                            connection2.query(`INSERT INTO logs (description) VALUES ('${query_data}');`, (err, result) => {
                                if(err){
                                    console.log(err)
                                }
                            });
                        }
                    });
                    res.send(true);
            }
        })
    },

    addMovieFromLogsNode1: function (name, year) {
        mysqlConnection.query(`SELECT * FROM movies m WHERE m.name = '${name}' AND m.year = '${year}'`, (err, result) => {
            if (err) {
                console.log("Add Movie Logs")
                return -1;
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
                            mysqlConnection.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${name}', '${year}')`, (err, result) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //ADD TO NODE 2
                                    if (`${year}` < 1980) {
                                        mysqlConnection2.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${name}', '${year}')`, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                                
                                            } else {
                                            }
                                        });
                                    } 
                                    //ADD TO NODE 3
                                    else {
                                        mysqlConnection3.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${name}', '${year}')`, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                                
                                            } else {
                                            }
                                        });
                                    }

                                    var result = JSON.parse(JSON.stringify(result))
                                    //console.log(data)
                                }
                            });
                        }
                    });
                }
                else {
                    //CONNECT TO FRONTEND
                    console.log("MOVIE IS ALREADY IN DATABASE")
                }
            }
        });
        return 0;
    },

    delMovieFromLogsNode1: function (year, id) {
        mysqlConnection.query(`DELETE FROM movies WHERE id=${id}`, (err, result) => {
            if (err) {
                console.log("DEL MOVIE LOGS")
                return -1;
            } else {
                var date = `${year}`
                if (date < 1980) {
                    //NODE 2
                    mysqlConnection2.query(`DELETE FROM movies WHERE id=${id}`, (err, result) => {
                        if (err) {
                            console.log(err);
                            
                        } else {
                            //res.send(true);
                        }
                    });
                }
                else {
                    //NODE 3
                    mysqlConnection3.query(`DELETE FROM movies WHERE id=${id}`, (err, result) => {
                        if (err) {
                            console.log(err);
                            
                        } else {
                            //res.send(true);
                        }
                    });
                }
                return 0;
            }
        });
    },

    editMovieFromLogsNode1: function (name, year, id) {
        if(name !== "" && name !== undefined) {
            mysqlConnection.query(`UPDATE movies SET name = "${name}" WHERE id=${id}`, (err, result) => {
                if (err) {
                    return -1;
                } else {
                    if (`${year}` < 1980) {
                        mysqlConnection2.query(`UPDATE movies SET name = "${name}" WHERE id=${id}`, (err, result) => {
                            if (err) {
                                console.log(err);
                                
                            }
                        });
                    } else {
                        mysqlConnection3.query(`UPDATE movies SET name = "${name}" WHERE id=${id}`, (err, result) => {
                            if (err) {
                                console.log(err);
                                
                            }
                        });
                    }
                }
            });
            return 0;
        }
        if(year !== "" && year !== undefined){
            mysqlConnection.query(`UPDATE movies SET year = "${year}" WHERE id=${id}`, (err, result) => {
                if (err) {
                    console.log(err);
                    return -1; 
                } else {
                    if (year < 1980) {
                        mysqlConnection2.query(`UPDATE movies SET year = "${year}" WHERE id=${id}`, (err, result) => {
                            if (err) {
                                console.log(err);
                                
                            }
                        });
                    } else {
                        mysqlConnection3.query(`UPDATE movies SET year = "${year}" WHERE id=${id}`, (err, result) => {
                            if (err) {
                                console.log(err);
                                
                            }
                        });
                    }
                }
            });
            return 0;
        }
    },

    addMovieFromLogsNode2: function (name, year) {
        mysqlConnection2.query(`SELECT * FROM movies m WHERE m.name = '${name}' AND m.year = '${year}'`, (err, result) => {
            if (err) {
                return -1; 
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
                            if(`${year}` < 1980){
                                mysqlConnection2.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${name}', '${year}')`, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        
                                    } else {
                                        //ADD TO NODE 1
                                        mysqlConnection.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${name}', '${year}')`, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                               
                                            } else {
                                            }
                                        });
                                        var result = JSON.parse(JSON.stringify(result))
                                        //console.log(data)
                                    }
                                });
                            } else {
                                //NODE 3
                                mysqlConnection3.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${name}', '${year}')`, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        
                                    } else {
                                        //ADD TO NODE 1
                                        mysqlConnection.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${name}', '${year}')`, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                               
                                            } else {
                                            }
                                        });
                                        var result = JSON.parse(JSON.stringify(result))
                                    }
                                });
                            }
                        }
                    });
                }
                else {
                    //CONNECT TO FRONTEND
                    console.log("MOVIE IS ALREADY IN DATABASE")
                }
                return 0;
            }
        });
    },

    delMovieFromLogsNode2: function (year, id) {
        mysqlConnection2.query(`DELETE FROM movies WHERE id=${id}`, (err, result) => {
            if (err) {
                return -1;
            } else {
                mysqlConnection.query(`DELETE FROM movies WHERE id=${id}`, (err, result) => {
                    if (err) {
                        console.log(err);
                       
                    } else {
                        //res.send(true);
                    }
                });
            }
            return 0;
        });
    },

    editMovieFromLogsNode2: function (name, year, id) {
        if (`${year}` < 1980) {
            //STAY ON NODE 2
            mysqlConnection2.query(`SELECT * FROM movies m WHERE m.name = '${name}' AND m.year = '${year}'`, (err, result) => {
                    if (err){
                        console.log(err)
                        return -1;
                    } else {
                        var existing = JSON.parse(JSON.stringify(result))
                        console.log(existing.length);
                        //ALLOW EDIT, NO DATA WITH NAME AND YEAR
                        if (existing.length == 0) {
                            if((name !== "" && name !== undefined) || (year !== "" && year !== undefined)) {
                                //EDIT NODE 2
                                mysqlConnection2.query(`UPDATE movies SET name = "${name}", year = "${year}" WHERE id=${id}`, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //NODE 1
                                        mysqlconnection.query(`UPDATE movies SET name = "${name}", year = "${year}" WHERE id=${id}`, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                            }
                                        });
                                    }
                                });
                            }
                        } 
                    }
                });
        } else {
            //MOVE TO NODE 3
            mysqlConnection3.query(`INSERT INTO movies (id, name, year) VALUES ('${id}', '${name}', '${year}')`, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    //EDIT TO NODE 1
                    mysqlconnection.query(`UPDATE movies SET name = "${name}", year = "${year}" WHERE id=${id}`, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //DELETE FROM NODE 2
                            mysqlConnection2.query(`DELETE FROM movies WHERE id=${id}`, (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                    });
                    var result = JSON.parse(JSON.stringify(result))
                }                
            });
        }
        return 0;
    },

    addMovieFromLogsNode3: function (name, year) {
        mysqlConnection3.query(`SELECT * FROM movies m WHERE m.name = '${name}' AND m.year = '${year}'`, (err, result) => {
            if (err) {
                console.log(err);
                return -1;
            } else {
                var existing = JSON.parse(JSON.stringify(result))
                console.log(existing.length);
                if (existing.length == 0) {
                    mysqlconnection.query(`SELECT m.id FROM movies m ORDER BY m.id DESC LIMIT 1`, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            var data = JSON.parse(JSON.stringify(result))
                            var MaxID = data[0]['id']+1;
                            mysqlconnection.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${name}', '${year}')`, (err, result) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //ADD TO NODE 2
                                    if (`${year}` < 1980) {
                                        mysqlConnection2.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${name}', '${year}')`, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                            }
                                        });
                                    } 
                                    //ADD TO NODE 3
                                    else {
                                        mysqlConnection3.query(`INSERT INTO movies (id, name, year) VALUES ('${MaxID}', '${name}', '${year}')`, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                            }
                                        });
                                    }

                                    var result = JSON.parse(JSON.stringify(result))
                                    //console.log(data)
                                   
                                }
                            });
                        }
                    });
                }
                else {
                    //CONNECT TO FRONTEND
                    console.log("MOVIE IS ALREADY IN DATABASE")
              
                }
            }
            return 0;
        });
    },

    delMovieFromLogsNode3: function (year, id) {
        mysqlConnection3.query(`DELETE FROM movies WHERE id=${id}`, (err, result) => {
            if (err) {
                return -1;
            } else {
                mysqlConnection.query(`DELETE FROM movies WHERE id=${id}`, (err, result) => {
                    if (err) {
                        console.log(err);
                       
                    } else {
                        //res.send(true);
                    }
                });
            }
            return 0;
        });
    },

    editMovieFromLogsNode3: function (name, year, id) {
        if (`${year}` >= 1980) {
            //STAY ON NODE 3
            mysqlConnection3.query(`SELECT * FROM movies m WHERE m.name = '${name}' AND m.year = '${year}'`, (err, result) => {
                    if (err){
                        console.log(err)
                        return -1;
                    } else {
                        var existing = JSON.parse(JSON.stringify(result))
                        console.log(existing.length);
                        //ALLOW EDIT, NO DATA WITH NAME AND YEAR
                        if (existing.length == 0) {
                            if((name !== "" && name !== undefined) || (year !== "" && year !== undefined)) {
                                //EDIT NODE 3
                                mysqlConnection3.query(`UPDATE movies SET name = "${name}", year = "${year}" WHERE id=${id}`, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //NODE 1
                                        mysqlconnection.query(`UPDATE movies SET name = "${name}", year = "${year}" WHERE id=${id}`, (err, result) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                        });
                                        
                                    }
                                });
                            }
                        } 
                        else {
                        }
                    }
                });
        } else {
            //MOVE TO NODE 2
            mysqlConnection2.query(`INSERT INTO movies (id, name, year) VALUES ('${id}', '${name}', '${year}')`, (err, result) => {
                if (err) {
                    console.log(err);
                    return -1; 
                } else {
                    //EDIT TO NODE 1
                    mysqlconnection.query(`UPDATE movies SET name = "${name}", year = "${year}" WHERE id=${id}`, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //DELETE FROM NODE 3
                            mysqlConnection3.query(`DELETE FROM movies WHERE id=${id}`, (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                    });
                    var result = JSON.parse(JSON.stringify(result))
                }                
            });
        }
        return 0;
    },
};

module.exports = helper;