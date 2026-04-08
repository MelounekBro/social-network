const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'mysqlstudenti.litv.sssvt.cz',
    user: 'petricekmartin',     
    password: '123456',    
    database: '4a1_petricekmartin_db1'  
});

db.connect(function(err) {
    if (err) {
        console.error('Chyba připojení k DB:', err);
        return;
    }

});

module.exports = db;