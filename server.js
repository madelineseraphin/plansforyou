const express = require('express');
var mysqlx = require('@mysql/xdevapi');
require('dotenv').config();
const port = process.env.PORT || 3000;
const app = express();
const bodyParser = require('body-parser');
let connection;

mysqlx.getSession({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
})
.then(function(c) {
    connection = c;
    connection.sql('USE plansforyou;').execute();
})
.catch(function(err) {
    console.error("Error connecting: " + err.stack);
});

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.get('/', (req, res) => res.send('Hello World!'));

// Friends endpoints //

// Get all friends
app.route('/friends').get(function(req, res, next) {
    const q = 'CALL get_friends();';
    return connection.sql(q).execute().then(result => {
        res.json(result.fetchAll()[0][0]);
    });
});

// Get friend
app.route('/friend/:friendId').get(function(req, res, next) {
    const q = 'CALL get_friend(' + req.params.friendId + ');';
    return connection.sql(q).execute().then(result => {
        res.json(result.fetchAll()[0][0]);
    });
});

// Plans endpoints //

// Get all plans
app.route('/plans').get(function(req, res, next) {
    const q = 'CALL get_plans();';
    return connection.sql(q).execute().then(result => {
        res.json(result.fetchAll()[0][0]);
    });
});

// Get plan
app.route('/plan/:planId').get(function(req, res, next) {
    const q1 = 'CALL get_plan(' + req.params.planId + ');';
    const q2 = 'CALL plan_rsvps(' + req.params.planId + ');';
    const q3 = 'CALL plan_comments(' + req.params.planId + ');';
    return connection.sql(q1).execute().then(result1 => {
        connection.sql(q2).execute().then(result2 => {
            connection.sql(q3).execute().then(result3 => {
                res.json({
                    'plan': result1.fetchAll()[0][0],
                    'rsvps': result2.fetchAll()[0][0],
                    'comments': result3.fetchAll()[0][0]
                });
            });
        });
    });
});

// Get plans friend is attending
app.route('plan/:friendId').get(function(req, res, next) {
    const q = 'CALL friend_rsvps(' + req.params.friendId + ');';
    return connection.sql(q).execute().then(result => {
        res.json(result.fetchAll()[0][0]);
    });
})

// Availability endpoints //

// Get all availabilities
app.route('/availabilities').get(function(req, res, next) {
    const q = 'CALL get_availabilities();';
    return connection.sql(q).execute().then(result => {
        res.json(result.fetchAll()[0][0]);
    });
})

// Get friend availability
app.route('/availability/:friendId').get(function(req, res, next) {
    const q = 'CALL get_availability(' + req.params.friendId + ');';
    return connection.sql(q).execute().then(result => {
        res.json(result.fetchAll()[0][0]);
    });
})

app.get('/status', (req, res) => res.send('Working!'));

app.listen(port, () => console.log("Example app listening on port 3000!"));