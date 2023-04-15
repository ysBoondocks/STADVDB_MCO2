//FOR NODE 3
const mysqlConnection = require('../../mysql3');

const controller3 = {
    getMovies: function (req, res) {
        mysqlConnection.query('SELECT * FROM movies LIMIT 1000', (err, result) => {
            if (err) {
                console.log(err);
            } else {
                var data = JSON.parse(JSON.stringify(result))
                console.log(data)
                res.send(data)
            }
        });
    },

    // addMovie: function (req,res){
    //     mysqlConnection.query(`INSERT INTO movies (name, year) VALUES ('${req.body.name}', '${req.body.year}')`, (err, result) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             var data = JSON.parse(JSON.stringify(result))
    //             console.log(data)
    //             res.send(true);
    //         }
    //     });
    // },

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