CREATE TABLE users (
   id             uuid           PRIMARY KEY DEFAULT uuid_generate_v4(),
   spotify_email  varchar(256)   UNIQUE NOT NULL                       ,
   username       varchar(256)   NOT NULL
);

CREATE TABLE locations (
   id             varchar(256)   PRIMARY KEY DEFAULT uuid_generate_v4(),
   city           varchar(256)   NOT NULL                              ,
   country        varchar(2)     NOT NULL
);

CREATE TABLE favorites (
   user_id        uuid           NOT NULL,
   location_id    varchar(256)   NOT NULL,

   UNIQUE(user_id, location_id)
);
