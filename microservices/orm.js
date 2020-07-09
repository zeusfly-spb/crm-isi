const mysql = require('mysql')
const CONFIG = require('./config')
const connection = mysql.createConnection({
    host: CONFIG.db_host,
    user: CONFIG.db_user,
    password: CONFIG.db_password,
    database: CONFIG.db_name
})

const query = querystring => {
    return new Promise((resolve, reject) => {
        connection.query(querystring, (error, results, fields) => {
            if (error) {
                reject(error)
            }
            resolve(results)
        })
    })
}

exports.query = query
