CREATE TABLE settings (
  id INTEGER PRIMARY KEY CHECK(id=1),
  paused INTEGER NOT NULL DEFAULT 0 CHECK(paused IN (0,1))
);
INSERT INTO settings(id,paused) VALUES(1,0);
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK(kind IN ('prompt','announcement')),
  payload TEXT NOT NULL,
  topic TEXT,
  created INTEGER NOT NULL,
  delivered INTEGER
);
CREATE TABLE catalog_state (
  id INTEGER PRIMARY KEY CHECK(id=1),
  seen TEXT NOT NULL,
  checked INTEGER NOT NULL
);
