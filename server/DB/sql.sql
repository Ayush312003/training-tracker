CREATE table users (
	id serial primary key,
	name varchar(50),
	email varchar(50),
	password text,
	isAdmin boolean DEFAULT false
)

CREATE table trainings (
	id serial primary key,
	name text,
	description text,
	remaining_slots integer,
	total_slots integer,
	date_time_start timestamp,
	date_time_end timestamp
)

create table training_applied (
	user_id integer REFERENCES users(id),
	training_id integer REFERENCES trainings(id),
	primary key(user_id, training_id)
)


create table training_interested (
	user_id integer REFERENCES users(id),
	training_id integer REFERENCES trainings(id),
	primary key(user_id, training_id)
)


