CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    fullname VARCHAR(255) NOT NULL ,
    avatar TEXT NOT NULL,
    datajoin TEXT NOT NULL,
    lastseen TEXT NOT NULL
);

CREATE TABLE ids(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    key TEXT NOT NULL,
    state TEXT NOT NULL
);
