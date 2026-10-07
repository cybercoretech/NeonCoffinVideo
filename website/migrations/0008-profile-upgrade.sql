ALTER TABLE members ADD COLUMN display_name TEXT NOT NULL DEFAULT '';
ALTER TABLE members ADD COLUMN avatar_data TEXT NOT NULL DEFAULT '';
ALTER TABLE members ADD COLUMN banner_data TEXT NOT NULL DEFAULT '';
ALTER TABLE members ADD COLUMN location TEXT NOT NULL DEFAULT '';
ALTER TABLE members ADD COLUMN signature TEXT NOT NULL DEFAULT '';
ALTER TABLE members ADD COLUMN social_links TEXT NOT NULL DEFAULT '[]';
ALTER TABLE members ADD COLUMN profile_visibility TEXT NOT NULL DEFAULT 'public';
ALTER TABLE members ADD COLUMN show_online INTEGER NOT NULL DEFAULT 1;
ALTER TABLE members ADD COLUMN browser_alerts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE members ADD COLUMN last_seen INTEGER;

CREATE TABLE IF NOT EXISTS post_reactions (
  member TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  post TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created INTEGER NOT NULL,
  PRIMARY KEY(member, post)
);
CREATE INDEX IF NOT EXISTS post_reactions_post ON post_reactions(post);

CREATE TABLE IF NOT EXISTS thread_subscriptions (
  member TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  topic TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  last_seen INTEGER NOT NULL,
  PRIMARY KEY(member, topic)
);
CREATE INDEX IF NOT EXISTS thread_subscriptions_member ON thread_subscriptions(member);
