
DROP TABLE IF EXISTS contacts;

CREATE TABLE contacts (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   email TEXT NOT NULL,
   name TEXT,
   country TEXT NOT NULL,
   subscribed BOOLEAN,
   source TEXT,
   comment TEXT,
   company_name TEXT,
   website TEXT,
   created DATETIME DEFAULT CURRENT_TIMESTAMP
);
