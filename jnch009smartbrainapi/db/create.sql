CREATE DATABASE jnch009smartbrain;

\c jnch009smartbrain;

CREATE TABLE users (
    id serial PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email text UNIQUE NOT NULL,
    score integer NOT NULL DEFAULT 0,
    joined timestamp NOT NULL DEFAULT now()
);

CREATE TABLE login (
    id serial PRIMARY KEY,
    hash VARCHAR(100) NOT NULL,
    email text UNIQUE NOT NULL
)