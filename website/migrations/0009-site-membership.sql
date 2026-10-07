ALTER TABLE members ADD COLUMN email TEXT;
ALTER TABLE members ADD COLUMN password_salt TEXT;
ALTER TABLE members ADD COLUMN password_hash TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS members_email_unique ON members(email) WHERE email IS NOT NULL;
ALTER TABLE oauth_states ADD COLUMN return_to TEXT NOT NULL DEFAULT '/community';
ALTER TABLE oauth_handoffs ADD COLUMN return_to TEXT NOT NULL DEFAULT '/community';
CREATE TABLE IF NOT EXISTS auth_limits(bucket TEXT PRIMARY KEY,window INTEGER NOT NULL,count INTEGER NOT NULL);
