const mysql = require('mysql');

const { DBHOST, DBUSER, DBPASSWORD } = process.env;

const config = {
    host: DBHOST,
    user: DBUSER,
    password: DBPASSWORD
}

let connection;

module.exports = function sqlConnection(sql, values, next) {
    if (!connection) {
        connection = mysql.createConnection(config);

        connection.connect(function (err) {
            if (err !== null) {
                console.log("[MYSQL] Error connecting to mysql:" + err + '\n');
                throw err;
            }

            connection.query(sql, values, function (err) {

                //connection.end(); //close the connection

                if (err) {
                    throw err;
                }

                // Execute the callback
                next.apply(this, arguments);
            });
        });
    }

    else connection.query(sql, values, function (err) {

        // connection.end(); close the connection

        if (err) {
            throw err;
        }

        // Execute the callback
        next.apply(this, arguments);
    });
}
