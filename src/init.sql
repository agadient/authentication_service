CREATE TABLE userInfo (userID serial PRIMARY KEY, username text UNIQUE , passwordHash text, salt text);