const helper = {
    addQueryToLog: function (req, res, connection2, connection3, node, func) {
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
                        let query_data = '{"function":' + '"' + `${func}`+ '"' + ', "node":' + '"' + `${node}`+ '"' + ', "name":'+ '"' + `${req.body.name}`+ '"' +', "year":' + `${req.body.year}`+'}'
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
};

module.exports = helper;