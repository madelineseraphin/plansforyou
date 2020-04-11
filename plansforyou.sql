CREATE DATABASE IF NOT EXISTS plansforyou;
USE plansforyou;

DROP TABLE IF EXISTS friend;
CREATE TABLE friend (
	friend_id int NOT NULL AUTO_INCREMENT,
    friend_photo varchar(280) DEFAULT 'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-7.png',
    first_name varchar(45) NOT NULL,
    last_name varchar(45) NOT NULL,
    phone_number varchar(10) NOT NULL,
	PRIMARY KEY (friend_id)
);

DROP TABLE IF EXISTS availability;
CREATE TABLE availability (
	availability_id int NOT NULL AUTO_INCREMENT,
    start_time datetime NOT NULL,
    end_time datetime NOT NULL,
    friend_id int NOT NULL,
    PRIMARY KEY (availability_id),
    FOREIGN KEY (friend_id) REFERENCES friend(friend_id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS plan;
CREATE TABLE plan (
	plan_id int NOT NULL AUTO_INCREMENT,
    title varchar(45) NOT NULL,
    description_text varchar(280) NOT NULL,
    plan_photo varchar(280) DEFAULT 'https://www.artconnect.com/assets/default/default_event_list-af5a65d1bb7f64798e5dd5b6e3e3d091.png',
    start_time datetime NOT NULL,
    end_time datetime NOT NULL,
    host_id int NOT NULL,
    PRIMARY KEY (plan_id),
    FOREIGN KEY (host_id) REFERENCES friend(friend_id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS rsvp;
CREATE TABLE rsvp (
	friend_id int NOT NULL,
    plan_id int NOT NULL,
    rsvp_status enum('going', 'maybe', 'not going') NOT NULL,
    CONSTRAINT rsvp_pk PRIMARY KEY (friend_id, plan_id),
    FOREIGN KEY (friend_id) REFERENCES friend(friend_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plan(plan_id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS plan_comment;
CREATE TABLE plan_comment (
	comment_id int NOT NULL AUTO_INCREMENT,
    friend_id int NOT NULL,
    plan_id int NOT NULL,
    comment_text varchar(140) NOT NULL,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (friend_id) REFERENCES friend(friend_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plan(plan_id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- SEED DATA --
INSERT INTO friend (first_name, last_name, phone_number) VALUES ('Maddie', 'Seraphin', '6789998212'), ('Ian', 'Anderson', '8779658407'), ('Frankie', 'Muniz', '8005882300');

INSERT INTO availability (start_time, end_time, friend_id) VALUES ('2020-04-20 12:00:00', '2020-04-20 22:00:00', 1), ('2020-04-21 12:00:00', '2020-04-21 22:00:00', 1), ('2020-04-22 12:00:00', '2020-04-22 22:00:00', 1), ('2020-04-23 12:00:00', '2020-04-23 22:00:00', 1), ('2020-04-24 12:00:00', '2020-04-24 22:00:00', 1);
INSERT INTO availability (start_time, end_time, friend_id) VALUES ('2020-04-20 12:00:00', '2020-04-20 16:00:00', 2), ('2020-04-21 12:00:00', '2020-04-21 20:00:00', 2), ('2020-04-22 11:00:00', '2020-04-22 19:00:00', 2), ('2020-04-24 12:00:00', '2020-04-24 22:00:00', 2);
INSERT INTO availability (start_time, end_time, friend_id) VALUES ('2020-04-20 01:00:00', '2020-04-20 23:00:00', 3), ('2020-04-21 01:00:00', '2020-04-21 23:00:00', 3), ('2020-04-22 01:00:00', '2020-04-22 12:00:00', 3), ('2020-04-23 12:00:00', '2020-04-23 23:59:00', 3), ('2020-04-24 12:00:00', '2020-04-24 23:59:00', 3);

INSERT INTO plan (title, description_text, start_time, end_time, host_id) VALUES('Watch Big Fat Liar', 'This is the greatest movie of all time! We should watch on Netflix Party', '2020-04-20 14:00:00', '2020-04-20 16:00:00', 3),
	('Dance Party', 'Time to dance!!!', '2020-04-24 20:00:00', '2020-04-24 23:00:00', 1);
    
INSERT INTO rsvp VALUES(1, 1, 'maybe'), (2, 1, 'maybe'), (3, 1, 'going'), (1, 2, 'going'), (2, 2, 'going'), (3, 2, 'going');

INSERT INTO plan_comment (friend_id, plan_id, comment_text) VALUES(1, 1, 'Not sure if I can join, I have a final the next day :/'), (2, 1, 'I also have a final :/'), (3, 2, 'Oh man, I love dancing!!');


-- FRIEND PROCEDURES --

-- Create friend (friend values)
DROP PROCEDURE IF EXISTS create_friend;
DELIMITER //
CREATE PROCEDURE create_friend(first_name varchar(45), last_name varchar(45), phone_number varchar(10), friend_photo varchar(280))
	BEGIN
		IF friend_photo is NULL
        THEN
			INSERT INTO friend (first_name, last_name, phone_number) VALUES(first_name, last_name, phone_number);
		ELSE 
			INSERT INTO friend (first_name, last_name, phone_number, friend_photo) VALUES(first_name, last_name, phone_number, friend_photo);
		END IF;
    END //
    
DELIMITER ;
CALL create_friend('Billie', 'Weisiger', '8003278937', NULL);

-- Get friend (friend_id)
DROP PROCEDURE IF EXISTS get_friend;
DELIMITER //
CREATE PROCEDURE get_friend(friend_id_param int)
	BEGIN
		SELECT JSON_ARRAYAGG(JSON_OBJECT("friend_id", friend_id, "friend_photo", friend_photo, "first_name", first_name, 
			"last_name", last_name, "phone_number", phone_number)) FROM friend WHERE friend_id = friend_id_param;
	END //
    
DELIMITER ;
CALL get_friend(4);

-- Get all friends
DROP PROCEDURE IF EXISTS get_friends;
DELIMITER //
CREATE PROCEDURE get_friends()
	BEGIN
		SELECT JSON_ARRAYAGG(JSON_OBJECT("friend_id", friend_id, "friend_photo", friend_photo, "first_name", first_name, 
			"last_name", last_name, "phone_number", phone_number)) FROM friend;
	END //
    
DELIMITER ;
CALL get_friends();

-- Update friend (friend_id, new values)
DROP PROCEDURE IF EXISTS update_friend;
DELIMITER //
CREATE PROCEDURE update_friend(friend_id_param int, first_name varchar(45), last_name varchar(45), phone_number varchar(10), friend_photo varchar(280))
	BEGIN
		UPDATE friend
			SET first_name = first_name, last_name = last_name, phone_number = phone_number, friend_photo = friend_photo
			WHERE friend_id = friend_id_param;
    END //
    
DELIMITER ;
CALL update_friend(3, 'Frankie', 'Muniz', '8005882300', 'https://m.media-amazon.com/images/M/MV5BMTkxNTU1Njk5MV5BMl5BanBnXkFtZTcwODUzNjQ0Nw@@._V1_.jpg');

-- Delete friend (friend_id)
DROP PROCEDURE IF EXISTS delete_friend;
DELIMITER //
CREATE PROCEDURE delete_friend(friend_id_param int)
	BEGIN
		DELETE FROM friend WHERE friend_id = friend_id_param;
	END //

DELIMITER ;


-- PLAN PROCEDURES --

-- Create plan (plan values)
DROP PROCEDURE IF EXISTS create_plan;
DELIMITER //
CREATE PROCEDURE create_plan(title varchar(45), description_text varchar(280), plan_photo varchar(280), start_time datetime, end_time datetime, host_id int)
	BEGIN
		IF plan_photo is NULL
        THEN
			INSERT INTO plan (title, description_text, start_time, end_time, host_id) VALUES(title, description_text, start_time, end_time, host_id);
		ELSE
			INSERT INTO plan (title, description_text, plan_photo, start_time, end_time, host_id) VALUES(title, description_text, plan_photo, start_time, end_time, host_id);
		END IF;
	END //
DELIMITER ;
CALL create_plan('Club Penguin Hangout', 'We should all go onto Club Penguin and hang out', NULL, '2020-04-25 18:00:00', '2020-04-25 20:00:00', 4);

-- Get plan (plan_id)
DROP PROCEDURE IF EXISTS get_plan;
DELIMITER //
CREATE PROCEDURE get_plan(plan_id_param int)
	BEGIN
		SELECT JSON_ARRAYAGG(JSON_OBJECT("plan_id", plan_id, "title", title, "plan_photo", plan_photo, "start_time", start_time, 
			"end_time", end_time, "host_id", host_id, "friend_photo", friend_photo, "first_name", first_name, "last_name", last_name)) 
            FROM plan JOIN friend ON host_id = friend_id
            WHERE plan_id = plan_id_param;
    END //
    
DELIMITER ;
CALL get_plan(1);

-- Get all plans
DROP PROCEDURE IF EXISTS get_plans;
DELIMITER //
CREATE PROCEDURE get_plans()
	BEGIN
		SELECT JSON_ARRAYAGG(JSON_OBJECT("plan_id", plan_id, "title", title, "plan_photo", plan_photo, "start_time", start_time, 
			"end_time", end_time, "host_id", host_id, "friend_photo", friend_photo, "first_name", first_name)) FROM plan JOIN friend ON host_id = friend_id;
	END //
DELIMITER ;
CALL get_plans();

-- Get all plans a friend is going to to may be going to (friend_id)
DROP PROCEDURE IF EXISTS friend_rsvps;
DELIMITER //
CREATE PROCEDURE friend_rsvps(friend_id_param int)
	BEGIN
		SELECT JSON_ARRAYAGG(JSON_OBJECT("rsvp_status", rsvp_status, "title", title, "plan_photo", plan_photo, "start_time", start_time, 
        "end_time", end_time)) FROM rsvp JOIN plan USING(plan_id) WHERE friend_id = friend_id_param AND NOT rsvp_status = 'not going';
	END //
    
DELIMITER ;
CALL friend_rsvps(1);

-- Update plan (plan_id, new plan values)
DROP PROCEDURE IF EXISTS update_plan;
DELIMITER //
CREATE PROCEDURE update_plan(plan_id_param int, title varchar(45), description_text varchar(280), plan_photo varchar(280), start_time datetime, end_time datetime, host_id int)
	BEGIN
		UPDATE plan
			SET title = title, description_text = description_text, plan_photo = plan_photo, start_time = start_time, end_time = end_time, host_id = host_id
			WHERE plan_id = plan_id_param;
	END //
    
DELIMITER ;
CALL update_plan(4, 'Club Penguin', 'We should all log onto Club Penguin and hang out', 'https://www.artconnect.com/assets/default/default_event_list-af5a65d1bb7f64798e5dd5b6e3e3d091.png', '2020-04-25 18:00:00', '2020-04-25 20:00:00', 4);

-- Delete plan (plan_id)
DROP PROCEDURE IF EXISTS delete_plan;
DELIMITER //
CREATE PROCEDURE delete_plan(plan_id_param int)
	BEGIN
		DELETE FROM plan WHERE plan_id = plan_id_param;
    END //
    
DELIMITER ;


-- RSVP PROCEDURES --

-- Create or Update RSVP to a plan (friend_id, plan_id, rsvp_status)
DROP PROCEDURE IF EXISTS update_rsvp;
DELIMITER //
CREATE PROCEDURE update_rsvp(friend_id_param int, plan_id_param int, rsvp_status_param enum('going', 'maybe', 'not going'))
	BEGIN
		IF EXISTS (SELECT * FROM rsvp WHERE friend_id = friend_id_param AND plan_id = plan_id_param)
        THEN
			UPDATE rsvp
				SET rsvp_status = rsvp_status_param
                WHERE friend_id = friend_id_param AND plan_id = plan_id_param;
		ELSE
			INSERT INTO rsvp VALUES (friend_id_param, plan_id_param, rsvp_status_param);
		END IF;
    END //
    
DELIMITER ;
CALL update_rsvp(1, 1, 'maybe'); 

-- Automatically make host RSVP 'going' to plan
 DROP TRIGGER IF EXISTS host_rsvp;
 DELIMITER //
 CREATE TRIGGER host_rsvp AFTER INSERT ON plan FOR EACH ROW
	BEGIN
		CALL update_rsvp(NEW.host_id, NEW.plan_id, 'going');
    END //

DELIMITER ;

-- Get RSVPs for a plan (plan id)
DROP PROCEDURE IF EXISTS plan_rsvps;
DELIMITER //
CREATE PROCEDURE plan_rsvps(plan_id_param int)
	BEGIN
		SELECT JSON_ARRAYAGG(JSON_OBJECT("friend_id", friend_id, "first_name", first_name, "friend_photo", friend_photo, "rsvp_status", rsvp_status))
			FROM rsvp JOIN friend USING(friend_id) WHERE plan_id = plan_id_param;
	END //
    
DELIMITER ;
CALL plan_rsvps(4);


-- COMMENT PROCEDURES -- 

-- Create comment (comment values)
DROP PROCEDURE IF EXISTS create_comment;
DELIMITER //
CREATE PROCEDURE create_comment(friend_id_param int, plan_id_param int, comment_text varchar(140))
	BEGIN
		INSERT INTO plan_comment (friend_id, plan_id, comment_text) VALUES(friend_id_param, plan_id_param, comment_text);
	END //

DELIMITER ;
CALL create_comment(2, 4, 'I hope I still have an account lol');

-- Get comments for a plan (plan_id)
DROP PROCEDURE IF EXISTS plan_comments;
DELIMITER //
CREATE PROCEDURE plan_comments(plan_id_param int)
	BEGIN
		SELECT JSON_ARRAYAGG(JSON_OBJECT("comment_id", comment_id, "friend_id", friend_id, "friend_photo", friend_photo, "first_name", first_name,
			"last_name", last_name, "plan_id", plan_id, "comment_text", comment_text))
			FROM plan_comment JOIN friend USING(friend_id) WHERE plan_id = plan_id_param;
	END //
    
DELIMITER ;
CALL plan_comments(1);

-- Update comment (comment_id, new comment values)
DROP PROCEDURE IF EXISTS update_comment;
DELIMITER //
CREATE PROCEDURE update_comment(comment_id_param int, comment_text varchar(140))
	BEGIN
		UPDATE plan_comment
			SET comment_text = comment_text
            WHERE comment_id = comment_id_param;
	END //

DELIMITER ;
CALL update_comment(4, 'Thank god I still have my account');

-- Delete comment (comment_id)
DROP PROCEDURE IF EXISTS delete_comment;
DELIMITER //
CREATE PROCEDURE delete_comment(comment_id_param int)
	BEGIN
		DELETE FROM plan_comment WHERE commend_id = comment_id_param;
	END //

DELIMITER ;


-- AVAILABILITY PROCEDURES --

-- Create availability (availability values)
DROP PROCEDURE IF EXISTS create_availability;
DELIMITER //
CREATE PROCEDURE create_availability(start_time datetime, end_time datetime, friend_id int)
	BEGIN
		INSERT INTO availability (start_time, end_time, friend_id) VALUES(start_time, end_time, friend_id);
	END //
    
DELIMITER ;
CALL create_availability('2020-04-25 18:00:00', '2020-04-25 23:59:00', 4);

-- Get availability for user (friend_id)
DROP PROCEDURE IF EXISTS get_availability;
DELIMITER //
CREATE PROCEDURE get_availability(friend_id_param int)
	BEGIN
		SELECT JSON_ARRAYAGG(JSON_OBJECT("availability_id", availability_id, "start_time", start_time, "end_time", end_time,
			"friend_id", friend_id, "first_name", first_name, "friend_photo", friend_photo))
            FROM availability JOIN friend USING(friend_id) WHERE friend_id = friend_id_param;
	END //
    
DELIMITER ;
CALL get_availability(4);

-- Get all availabilities
DROP PROCEDURE IF EXISTS get_availabilities;
DELIMITER //
CREATE PROCEDURE get_availabilities()
	BEGIN
		SELECT JSON_ARRAYAGG(JSON_OBJECT("availability_id", availability_id, "start_time", start_time, "end_time", end_time,
			"friend_id", friend_id, "first_name", first_name, "friend_photo", friend_photo)) FROM availability JOIN friend USING(friend_id);
	END //
    
DELIMITER ;
CALL get_availabilities();

-- Update availability (availability_id, new availability values)
DROP PROCEDURE IF EXISTS update_availability;
DELIMITER //
CREATE PROCEDURE update_availability(availability_id_param int, start_time datetime, end_time datetime)
	BEGIN
		UPDATE availability
			SET start_time = start_time, end_time = end_time
            WHERE availability_id = availability_id_param;
	END //

DELIMITER ;
CALL update_availability(15, '2020-04-25 17:00:00', '2020-04-25 23:59:00');

-- Delete availability (availability_id)
DROP PROCEDURE IF EXISTS delete_availability;
DELIMITER //
CREATE PROCEDURE delete_availability(availability_id_param int)
	BEGIN
		DELETE FROM availability WHERE availability_id = availability_id_param;
    END //
    
DELIMITER ;
