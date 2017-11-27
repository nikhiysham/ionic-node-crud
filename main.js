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

app.get('/find_all', function (req, res) {
    var sql = "SELECT * FROM users";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            console.log('rows: ', rows);
        } else {
            throw err;
        }
    });
});

app.get('/find_user_by_id', function (req, res) {
    var query = req.query;

    var sql = "SELECT * FROM users WHERE id = '" + query.id + "'";

    connection.query(sql, function (err, rows, field) {
        if (!err) {
            res.end("Success: ", rows);
        } else {
            throw err;
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
            res.end("Success insert into users");
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
            res.end("Success update user : ", reqBody.id);
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

