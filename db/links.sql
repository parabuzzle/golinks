/*
  schema:
  id: uuid -> id of the link
  name: string -> the link name
  destination: string -> the url to go to
  regex_destination: string -> the url to go based on multiple / after the link name
  visits: integer -> number of times this link has been used
  owner: string -> username that owns the link
  creator: string -> username that created the link
  created_at: datetime
  modified_at: datetime
*/


CREATE TABLE IF NOT EXISTS links (
   id uuid DEFAULT uuid_generate_v4 (),
   name VARCHAR(255) PRIMARY KEY,
   destination TEXT NOT NULL,
   regex_destination TEXT,
   visits INT DEFAULT 0 NOT NULL,
   owner VARCHAR(50) NOT NULL,
   creator VARCHAR(50) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   modified_at TIMESTAMP
);

CREATE INDEX owner_idx
ON links (owner);

CREATE INDEX creator_idx
ON links (creator);

CREATE INDEX visits_idx
ON links (visits);
