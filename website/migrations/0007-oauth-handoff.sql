CREATE TABLE IF NOT EXISTS oauth_handoffs (
  ticket_hash TEXT PRIMARY KEY,
  member TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  expires INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS oauth_handoffs_expires ON oauth_handoffs(expires);
