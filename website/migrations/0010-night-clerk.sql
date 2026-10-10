ALTER TABLE members ADD COLUMN is_bot INTEGER NOT NULL DEFAULT 0 CHECK(is_bot IN (0,1));
CREATE TABLE bot_deliveries (
  key TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK(kind IN ('prompt','announcement')),
  topic TEXT NOT NULL REFERENCES topics(id),
  created INTEGER NOT NULL
);
