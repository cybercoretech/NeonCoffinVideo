CREATE TABLE IF NOT EXISTS trioxin_ballots (
  member TEXT PRIMARY KEY REFERENCES members(id) ON DELETE CASCADE,
  picks TEXT NOT NULL CHECK (json_valid(picks)),
  review TEXT NOT NULL,
  created INTEGER NOT NULL,
  updated INTEGER NOT NULL
);
