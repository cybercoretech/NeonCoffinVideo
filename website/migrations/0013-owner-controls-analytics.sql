ALTER TABLE members ADD COLUMN role TEXT NOT NULL DEFAULT 'member';
ALTER TABLE members ADD COLUMN suspended_until INTEGER NOT NULL DEFAULT 0;
ALTER TABLE members ADD COLUMN suspension_reason TEXT NOT NULL DEFAULT '';
CREATE TABLE site_page_views (
  day TEXT NOT NULL,
  path TEXT NOT NULL,
  source TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(day,path,source)
);
CREATE INDEX site_page_views_day_idx ON site_page_views(day);
