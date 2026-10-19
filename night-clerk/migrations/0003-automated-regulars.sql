ALTER TABLE jobs RENAME TO jobs_before_regulars;
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK(kind IN ('prompt','announcement','reply')),
  payload TEXT NOT NULL,
  topic TEXT,
  created INTEGER NOT NULL,
  delivered INTEGER
);
INSERT INTO jobs(id,kind,payload,topic,created,delivered)
  SELECT id,kind,payload,topic,created,delivered FROM jobs_before_regulars;
DROP TABLE jobs_before_regulars;
CREATE TABLE regular_replies (
  topic TEXT PRIMARY KEY,
  reply_key TEXT NOT NULL UNIQUE REFERENCES jobs(id),
  created INTEGER NOT NULL
);
