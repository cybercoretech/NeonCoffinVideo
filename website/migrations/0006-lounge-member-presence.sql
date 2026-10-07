ALTER TABLE lounge_presence ADD COLUMN member TEXT REFERENCES members(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS lounge_presence_member_expires ON lounge_presence(member, expires);
