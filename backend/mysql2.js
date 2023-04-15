const dotenv = require('dotenv');
const mysql = require('mysql2');
dotenv.config();

const connection2 = mysql.createPool({
	host: process.env.HOST,
	port: process.env.PORT2,
	user: process.env.USER2,
	password: process.env.PASSWORD2,
	database: process.env.DATABASE2
});

connection2.getConnection((err, connection2) => {
	if (err) {
		console.error('Error connecting to MySQL server: ' + err.stack);
		return;
	}

	console.log('Connected to MySQL server with id ' + connection2.threadId);
});

module.exports = connection2;