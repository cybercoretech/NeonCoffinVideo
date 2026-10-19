CREATE TABLE site_presence (
  visitor_hash TEXT PRIMARY KEY,
  expires INTEGER NOT NULL,
  path TEXT NOT NULL DEFAULT '/'
);
CREATE INDEX site_presence_expires ON site_presence(expires);
