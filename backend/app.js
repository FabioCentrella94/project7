const express = require('express')
const bodyParser = require('body-parser')
var sql = require("mssql");

const app = express()

var config = {
    user: 'sa',
    password: '13Agosto94',
    server: 'localhost',
    database: 'connect_e',
    options: {
        enableArithAbort: true
    }
};

sql.connect(config)
    .then(() => {
        console.log('Successfully connected to SQL Server!')
    })
    .catch(error => {
        console.log('Unable to connect to SQL Server!')
        console.error(error)
    })

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    )
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    )
    next()
})

app.use(bodyParser.json())

module.exports = app