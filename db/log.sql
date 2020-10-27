/*
  schema:
  id: uuid -> id of the log entry
  link_id: uuid -> id of the link this action was done
  user_id: string -> username of the user that made the change
  action: string -> modified, deleted, created
  old_destination_value: string
  new_destination_value: string
  old_regex_value: string
  new_regex_value: string
  old_owner: string
  new_owner: string
  created_at: datetime -> when the action happened
*/

CREATE TABLE IF NOT EXISTS logs (
   id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
   link_id uuid NOT NULL,
   link_name VARCHAR(255) NOT NULL,
   user_id VARCHAR(50) NOT NULL,
   action VARCHAR(50) NOT NULL,
   old_destination_value TEXT,
   new_destination_value TEXT,
   old_regex_value TEXT,
   new_regex_value TEXT,
   old_owner VARCHAR(50),
   new_owner VARCHAR(50),
   created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX link_id_idx
ON logs (link_id);

CREATE INDEX link_name_idx
ON logs (link_name);

CREATE INDEX user_id_idx
ON logs (link_id);
