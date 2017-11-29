var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');
var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.json());
var state = {
    pool: null
};
var PORT = 1440;
var HOST = 'localhost';
var USER = 'root';
var DB = 'ionic_crud_db';
state.pool = mysql.createPool({
    connectionLimit: 100,
    user: USER,
//   host: '127.0.0.1', //ip
    host: HOST,
    password: 'p455w0rd',
    database: DB,
    debug: true
});

var connection = state.pool;

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/find_all', function (req, res) {
    var sql = "SELECT * FROM users";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            // Validate rows, if no record show no record to user instead of [] => empty array
            if (rows.length > 0) {
                res.json({code: '00', content: rows});
            } else {
                res.json({code: '00', content: "No record"});
            }
        } else {
            // In case if error during query to mysql db
            res.json({code: '99', content: err});
        }
    });
});

app.get('/find_user_by_id', function (req, res) {
    var query = req.query;

    var sql = "SELECT * FROM users WHERE id = '" + query.id + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            // Validate rows, if no record show no record to user instead of [] => empty array
            if (rows.length > 0) {
                res.json({code: '00', content: rows});
            } else {
                res.json({code: '00', content: "No record"});
            }
        } else {
            // In case if error during query to mysql db
            res.json({code: '99', content: err});
        }
    });
});

app.post('/create', function (req, res) {
    var reqBody = req.body;

    console.log('reqBody:', reqBody);

    if (!reqBody.username)
        return res.end("Wrong username!");

    if (!reqBody.password)
        return res.end("Wrong password!");

    if (!reqBody.name)
        return res.end("Wrong name!");

    var created_date = new Date(), created_date_timestamp = (new Date()).getTime();

    var params = {username: reqBody.username, password: reqBody.password,
        name: reqBody.name, created_date: created_date, created_date_timestamp: created_date_timestamp};
    var sql = "INSERT INTO users SET ?";

    connection.query(sql, params, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: 'Success insert user'});
        } else {
            throw err;
        }
    });
});

app.post('/update', function (req, res) {
    var reqBody = req.body;

    if (!reqBody.id)
        return res.end("Wrong id!");

    if (!reqBody.name)
        return res.end("Wrong name!");

    if (!reqBody.username)
        return res.end("Wrong username!");

    var sql = "UPDATE users SET name= '" + reqBody.name + "', username = '" + reqBody.username + "' WHERE id = '" + reqBody.id + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.json({code: '00', content: 'Success update user'});
        } else {
            throw err;
        }
    });
});

app.post('/delete', function (req, res) {
    var reqBody = req.body;

    if (!reqBody.id)
        return res.end("Wrong id!");

    var sql = "DELETE FROM users WHERE id = '" + reqBody.id + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.end("Success delete user: ", reqBody.id);
        } else {
            throw err;
        }
    });
});

console.log("Server listening on port " + PORT);
app.listen(PORT);

