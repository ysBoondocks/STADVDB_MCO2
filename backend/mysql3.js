const dotenv = require('dotenv');
const mysql = require('mysql2');
dotenv.config();

const connection3 = mysql.createPool({
	host: process.env.HOST,
	port: process.env.PORT3,
	user: process.env.USER3,
	password: process.env.PASSWORD3,
	database: process.env.DATABASE3
});

connection3.getConnection((err, connection3) => {
	if (err) {
		console.error('Error connecting to MySQL server: ' + err.stack);
		return;
	}

	console.log('Connected to MySQL server with id ' + connection3.threadId);
});

module.exports = connection3;