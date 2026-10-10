ALTER TABLE settings ADD COLUMN ai_paused INTEGER NOT NULL DEFAULT 0 CHECK(ai_paused IN (0,1));
-- Only counters and a daily pseudonymous client digest. Never prompts or replies.
CREATE TABLE ai_usage (
  id TEXT PRIMARY KEY,
  day TEXT NOT NULL,
  client TEXT NOT NULL,
  reserved INTEGER NOT NULL CHECK(reserved > 0)
);
CREATE INDEX ai_usage_day ON ai_usage(day);
CREATE INDEX ai_usage_client ON ai_usage(day,client);
