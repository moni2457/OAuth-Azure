const mysql = require('mysql');

// Credentials for Azure MySQL DB
var db_config = {
    host: 'mshah.mysql.database.azure.com',
    port: '3306',
    user: 'mshah@mshah',
    password: 'Moni@3886',
    database: 'moni'
};

var mySQLconnection;

function connectDB() {
    // creating and connecting to MySQL 
    mySQLconnection = mysql.createConnection(db_config);
    mySQLconnection.connect(function (err) {              
        if (err) {                                     
            console.log('error connecting to database:', err);
            setTimeout(connectDB, 5000); // delay before attempting to reconnect
        }                                     
    });                                     
    mySQLconnection.on('error', function (err) {
        // handling application protocol errors
        if (err.code === 'PROTOCOL_CONNECTION_LOST'
            || err.code === 'ECONNRESET') { 
            connectDB();                         
        } else {                                      
            throw err;                                  
        }
    });
}

connectDB();
module.exports = mySQLconnection;