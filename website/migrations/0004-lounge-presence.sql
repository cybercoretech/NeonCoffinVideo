CREATE TABLE IF NOT EXISTS lounge_presence (
  visitor_hash TEXT PRIMARY KEY,
  expires INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS lounge_presence_expires ON lounge_presence(expires);
