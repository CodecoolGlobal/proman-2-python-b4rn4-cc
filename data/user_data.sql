DROP TABLE IF EXISTS public.users;
CREATE TABLE users (
    id serial NOT NULL,
    registration_time timestamp without time zone,
    user_name text,
    password text
);