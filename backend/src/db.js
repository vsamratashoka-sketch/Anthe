import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(":memory");

//SQL statements
db.exec(`PRAGMA foregin_keys = ON`)
db.exec(
  `
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT ,
    username TEXT UNIQUE NOT NULL,
    password INTEGER NOT NULL
)
    `,
);
db.exec(
  ` CREATE TABLE IF NOT EXISTS todo(
       id INTEGER PRIMARY KEY AUTOINCREMENT ,
       user_id INTEGER NOT NULL,
       task TEXT  NOT NULL,
       complete BOOLEAN DEFAULT 0,
       FOREIGN KEY(user_id) REFERENCES users(id)
       )
       `,
);

export default db