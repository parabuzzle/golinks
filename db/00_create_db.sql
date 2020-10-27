create database golinks;
create user golinks with encrypted password 'golinks';
grant all privileges on database golinks to golinks;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
