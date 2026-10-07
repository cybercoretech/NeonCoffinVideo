ALTER TABLE members ADD COLUMN age_confirmed_at INTEGER;
ALTER TABLE oauth_states ADD COLUMN age_attested INTEGER NOT NULL DEFAULT 0 CHECK (age_attested IN (0, 1));
