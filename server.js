const express = require('express');
var mysqlx = require('@mysql/xdevapi');
require('dotenv').config();
const port = process.env.PORT || 8000;
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

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

// Create friend
app.route('/friend').post(function(req, res, next) {
    let friend = req.body;
    try {
        return Promise.all([
            connection.sql('SET @first_name = ?;').bind(friend.first_name).execute(),
            connection.sql('SET @last_name = ?;').bind(friend.last_name).execute(),
            connection.sql('SET @phone_number = ?;').bind(friend.phone_number).execute(),
            connection.sql('SET @friend_photo = ?;').bind(friend.friend_photo).execute(),
            connection.sql('CALL create_friend(@first_name, @last_name, @phone_number, @friend_photo);').execute(function(result) {
                res.json(result[0][0]);
            })
        ]);
    } catch (err) {
        console.error(err);
    }
});

// Update friend
app.route('/friend/:friendId').put(function(req, res, next) {
    let friend = req.body;
    let friendId = req.params.friendId;
    try {
        return Promise.all([
            connection.sql('SET @friend_id = ?;').bind(friendId).execute(),
            connection.sql('SET @first_name = ?;').bind(friend.first_name).execute(),
            connection.sql('SET @last_name = ?;').bind(friend.last_name).execute(),
            connection.sql('SET @phone_number = ?;').bind(friend.phone_number).execute(),
            connection.sql('SET @friend_photo = ?;').bind(friend.friend_photo).execute(),
            connection.sql('CALL update_friend(@friend_id, @first_name, @last_name, @phone_number, @friend_photo);').execute(function(result) {
                res.json(result[0][0]);
            })
        ]);
    } catch (err) {
        console.error(err);
    }
});

// Delete friend
app.route('/friend/:friendId').delete(function(req, res, next) {
    const q = 'CALL delete_friend(' + req.params.friendId + ');';
    return connection.sql(q).execute().then(result => {
        res.json('Successfully deleted friend ' + req.params.friendId);
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
app.route('/plan/:friendId').get(function(req, res, next) {
    const q = 'CALL friend_rsvps(' + req.params.friendId + ');';
    return connection.sql(q).execute().then(result => {
        res.json(result.fetchAll()[0][0]);
    });
});

// Create plan
app.route('/plan').post(function(req, res, next) {
    let plan = req.body;
    try {
        return Promise.all([
            connection.sql('SET @title = ?;').bind(plan.title).execute(),
            connection.sql('SET @description_text = ?;').bind(plan.description_text).execute(),
            connection.sql('SET @plan_photo = ?;').bind(plan.plan_photo).execute(),
            connection.sql('SET @start_time = ?;').bind(plan.start_time).execute(),
            connection.sql('SET @end_time = ?;').bind(plan.end_time).execute(),
            connection.sql('SET @host_id = ?;').bind(plan.host_id).execute(),
            connection.sql('CALL create_plan(@title, @description_text, @plan_photo, @start_time, @end_time, @host_id);')
                .execute(function(result) {
                    res.json(result[0][0]);
            })
        ]);
    } catch (err) {
        console.error(err);
    }
});

// Update plan
app.route('/plan/:planId').put(function(req, res, next) {
    let planId = req.params.planId;
    let plan = req.body;
    try {
        return Promise.all([
            connection.sql('SET @plan_id = ?;').bind(planId).execute(),
            connection.sql('SET @title = ?;').bind(plan.title).execute(),
            connection.sql('SET @description_text = ?;').bind(plan.description_text).execute(),
            connection.sql('SET @plan_photo = ?;').bind(plan.plan_photo).execute(),
            connection.sql('SET @start_time = ?;').bind(plan.start_time).execute(),
            connection.sql('SET @end_time = ?;').bind(plan.end_time).execute(),
            connection.sql('SET @host_id = ?;').bind(plan.host_id).execute(),
            connection.sql('CALL update_plan(@plan_id, @title, @description_text, @plan_photo, @start_time, @end_time, @host_id);')
                .execute(function(result) {
                    res.json(result[0][0]);
            })
        ]);
    } catch (err) {
        console.error(err);
    }
});

// Delete plan
app.route('/plan/:planId').delete(function(req, res, next) {
    const q = 'CALL delete_plan(' + req.params.planId + ');';
    return connection.sql(q).execute().then(result => {
        res.json('Successfully deleted plan ' + req.params.planId);
    });
});

// RSVP endpoints //

// Create (or update) RSVP
app.route('/rsvp/:friendId/:planId').post(function(req, res, next) {
    const friendId = req.params.friendId;
    const planId = req.params.planId;
    let rsvp = req.body;
    try {
        return Promise.all([
            connection.sql('SET @friend_id = ?;').bind(friendId).execute(),
            connection.sql('SET @plan_id = ?;').bind(planId).execute(),
            connection.sql('SET @rsvp_status = ?;').bind(rsvp.rsvp_status).execute(),
            connection.sql('CALL update_rsvp(@friend_id, @plan_id, @rsvp_status);')
                .execute(function(result) {
                    res.json(result[0][0]);
            })
        ]);
    } catch (err) {
        console.error(err);
    }
});

// Comment endpoints //

// Create comment
app.route('/comment').post(function(req, res, next) {
    let comment = req.body;
    try {
        return Promise.all([
            connection.sql('SET @friend_id = ?;').bind(comment.friend_id).execute(),
            connection.sql('SET @plan_id = ?;').bind(comment.plan_id).execute(),
            connection.sql('SET @comment_text = ?;').bind(comment.comment_text).execute(),
            connection.sql('CALL create_comment(@friend_id, @plan_id, @comment_text);').execute(function(result) {
                res.json(result[0][0]);
            })
        ]);
    } catch (err) {
        console.error(err);
    }
});

// Update comment
app.route('/comment/:commentId').put(function(req, res, next) {
    let comment = req.body;
    let commentId = req.params.commentId;
    try {
        return Promise.all([
            connection.sql('SET @comment_id = ?;').bind(commentId).execute(),
            connection.sql('SET @comment_text = ?;').bind(comment.comment_text).execute(),
            connection.sql('CALL update_comment(@comment_id, @comment_text);').execute(function(result) {
                res.json(result[0][0]);
            })
        ]);
    } catch (err) {
        console.error(err);
    }
});

// Delete comment
app.route('/comment/:commentId').delete(function(req, res, next) {
    const q = 'CALL delete_comment(' + req.params.commentId + ');';
    return connection.sql(q).execute().then(result => {
        res.json('Successfully deleted comment ' + req.params.commentId);
    });
});

// Availability endpoints //

// Get all availabilities
app.route('/availabilities').get(function(req, res, next) {
    const q = 'CALL get_availabilities();';
    return connection.sql(q).execute().then(result => {
        res.json(result.fetchAll()[0][0]);
    });
});

// Get friend availability
app.route('/availability/:friendId').get(function(req, res, next) {
    const q = 'CALL get_friend_availability(' + req.params.friendId + ');';
    return connection.sql(q).execute().then(result => {
        res.json(result.fetchAll()[0][0]);
    });
});

// Create availability
app.route('/availability').post(function(req, res, next) {
    let availability = req.body;
    try {
        return Promise.all([
            connection.sql('SET @start_time = ?;').bind(availability.start_time).execute(),
            connection.sql('SET @end_time = ?;').bind(availability.end_time).execute(),
            connection.sql('SET @friend_id = ?;').bind(availability.friend_id).execute(),
            connection.sql('CALL create_availability(@start_time, @end_time, @friend_id);').execute(function(result) {
                res.json(result[0][0]);
            })
        ]);
    } catch (err) {
        console.error(err);
    }
});

// Update availability
app.route('/availability/:availabilityId').put(function(req, res, next) {
    let availability = req.body;
    let availabilityId = req.params.availabilityId;
    try {
        return Promise.all([
            connection.sql('SET @availability_id = ?;').bind(availabilityId).execute(),
            connection.sql('SET @start_time = ?;').bind(availability.start_time).execute(),
            connection.sql('SET @end_time = ?;').bind(availability.end_time).execute(),
            connection.sql('CALL update_availability(@availability_id, @start_time, @end_time);').execute(function(result) {
                res.json(result[0][0]);
            })
        ]);
    } catch (err) {
        console.error(err);
    }
});

// Delete availability
app.route('/availability/:availabilityId').delete(function(req, res, next) {
    const q = 'CALL delete_availability(' + req.params.availabilityId + ');';
    return connection.sql(q).execute().then(result => {
        res.json('Successfully deleted availability ' + req.params.availabilityId);
    });
});

app.get('/status', (req, res) => res.send('Working!'));

app.listen(port, () => console.log("Example app listening on port 3000!"));