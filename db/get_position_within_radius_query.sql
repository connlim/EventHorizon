DROP FUNCTION IF EXISTS get_position_within_radius_query;

CREATE OR REPLACE FUNCTION get_position_within_radius_query ("myLat" double precision, "myLon" double precision, "r" double precision)
RETURNS TABLE (
  id uuid, createdAt timestamptz, user_id uuid, text text, latitude numeric, longitude numeric, upvotes int8, downvotes int8, username text, media text, score int8, avatar_url text
)
AS $$
  BEGIN
    RETURN QUERY 
      SELECT posts.*, profiles.avatar_url
      FROM public.posts AS posts
      LEFT JOIN public.profiles AS profiles ON profiles.id = posts.user_id
      -- WHERE ST_DWithin(ST_MakePoint("myLat", "myLon"), ST_MakePoint(posts.longitude, posts.latitude), r)
      ORDER BY "createdAt" DESC;
  END;
$$ LANGUAGE plpgsql;

