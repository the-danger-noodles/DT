-- Information on structure of database

-- 'users' table:

-- spotify_email must be unique
-- username can be the same, but cannot be null

/*
id | spotify_email | username
___|_______________|__________
   |               |
   |               |
*/

CREATE TABLE users (
   id             uuid           PRIMARY KEY DEFAULT uuid_generate_v4(),
   spotify_email  varchar(256)   UNIQUE NOT NULL                       ,
   username       varchar(256)   NOT NULL
);

-- 'countries' table:

-- country_name and alpha_2_code must be unique, not null
-- alternate_name can be null

/*
id | country_name | alpha_2_code | alternate_name
___|______________|______________|________________
   |              |              |
   |              |              |
*/

CREATE TABLE countries (
   id             uuid           PRIMARY KEY DEFAULT uuid_generate_v4(),
   alpha_2_code   varchar(2)     UNIQUE NOT NULL                       ,
   country_name   varchar(64)    UNIQUE NOT NULL                       ,
   alternate_name varchar(64)    
);


-- 'cities' table:

-- city_name and country_id can don't need to be unique, but cannot be null
/*
id | city_name | country_id
___|___________|______________
   |           |
   |           |
*/
CREATE TABLE cities (
   id          uuid           PRIMARY KEY DEFAULT uuid_generate_v4(),
   city_name   varchar(256)   NOT NULL                              ,
   country_id  uuid           NOT NULL
);


-- 'countries_cities_users' table:

-- table to join user, countries, and cities 
-- all columns don't need to be unique, but cannot be null

/*
id | user_id |  city_id  | country_id
___|_________|___________|________________
   |         |           |
   |         |           |
*/
CREATE TABLE countries_cities_users (
   id          uuid  PRIMARY KEY DEFAULT uuid_generate_v4(),
   user_id     uuid  NOT NULL                              ,
   city_id     uuid  NOT NULL                              ,
   country_id  uuid  NOT NULL
);
