-- The house host is now the Night Manager, matching the Late Returns shorts.
-- The display name always changes; the handle changes only if no member already uses it.
UPDATE members SET display_name='The Night Manager'
  WHERE id='b1111111-1111-4111-8111-111111111111';
UPDATE members SET handle='NightManager'
  WHERE id='b1111111-1111-4111-8111-111111111111'
    AND NOT EXISTS (SELECT 1 FROM members WHERE lower(handle)='nightmanager' AND id<>'b1111111-1111-4111-8111-111111111111');
