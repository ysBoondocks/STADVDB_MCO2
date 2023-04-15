//FOR NODE 3
const mysqlConnection = require('../../mysql');    // NODE 1
const mysqlConnection2 = require('../../mysql2');
const mysqlConnection3 = require('../../mysql3');



const controller3 = {
    getMovies: function (req, res) {
        mysqlConnection3.query('SELECT * FROM movies', (err, result) => {
            if (err) {
                console.log(err);
                //IF NODE 3 FAILS, GET FROM NODE 1 >= 1980
                mysqlConnection2.query('SELECT * FROM movies m WHERE m.year >= 1980', (err, result) => {
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

    addMovie: function (req,res){
        mysqlConnection3.query(`SELECT * FROM movies m WHERE m.name = '${req.body.name}' AND m.year = '${req.body.year}'`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
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

    // deleteMovie: function (req,res){


    //     mysqlConnection.query(`DELETE FROM movies WHERE id=${req.body.id}`, (err, result) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             var data = JSON.parse(JSON.stringify(result))
    //             console.log(data)
    //             res.send(true);
    //         }
    //     });
    // },

    
    // editMovie: function (req,res){

    //     console.log("reqname",req.body.name);
    //     console.log("reqyear",req.body.year);
    //     let success = false;
    //     if(req.body.name !== "" && req.body.name !== undefined){
    //         mysqlConnection.query(`UPDATE movies SET name = "${req.body.name}" WHERE id=${req.body.id}`, (err, result) => {
    //             if (err) {
    //                 console.log(err);
    //             } else {
    //                 success = true;
    //             }
    //         });
    //     }
    //     if(req.body.year !== "" && req.body.year !== undefined){
    //         mysqlConnection.query(`UPDATE movies SET year = "${req.body.year}" WHERE id=${req.body.id}`, (err, result) => {
    //             if (err) {
    //                 console.log(err);
    //             } else {
    //                 success = true;
    //             }
    //         });
    //     }

    //     res.send(success);
        
    // },

    // searchMovie: function (req,res){

    //     mysqlConnection.query(`SELECT * FROM movies WHERE name="${req.body.name}"`, (err, result) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             var data = JSON.parse(JSON.stringify(result))
    //             console.log(data)
    //             res.send(data);
    //         }
    //     });
    // }
}

module.exports = controller3;